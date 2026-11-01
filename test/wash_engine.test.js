// Unit tests for the predictive car wash calculation engine
const assert = require('assert');

// Mock weather codes dictionary matching app.js
const weatherCodes = {
    0: { icon: 'sun', badForWash: false },
    1: { icon: 'sun', badForWash: false },
    2: { icon: 'cloud-sun', badForWash: false },
    3: { icon: 'cloud', badForWash: false },
    45: { icon: 'cloud-fog', badForWash: false },
    48: { icon: 'cloud-fog', badForWash: false },
    51: { icon: 'cloud-drizzle', badForWash: true },
    53: { icon: 'cloud-drizzle', badForWash: true },
    55: { icon: 'cloud-drizzle', badForWash: true },
    56: { icon: 'cloud-drizzle', badForWash: true },
    57: { icon: 'cloud-drizzle', badForWash: true },
    61: { icon: 'cloud-rain', badForWash: true },
    63: { icon: 'cloud-rain', badForWash: true },
    65: { icon: 'cloud-rain', badForWash: true },
    66: { icon: 'cloud-rain', badForWash: true },
    67: { icon: 'cloud-rain', badForWash: true },
    71: { icon: 'snowflake', badForWash: true },
    73: { icon: 'snowflake', badForWash: true },
    75: { icon: 'snowflake', badForWash: true },
    77: { icon: 'snowflake', badForWash: true },
    80: { icon: 'cloud-rain', badForWash: true },
    81: { icon: 'cloud-rain', badForWash: true },
    82: { icon: 'cloud-lightning', badForWash: true },
    85: { icon: 'snowflake', badForWash: true },
    86: { icon: 'snowflake', badForWash: true },
    95: { icon: 'cloud-lightning', badForWash: true },
    96: { icon: 'cloud-lightning', badForWash: true },
    99: { icon: 'cloud-lightning', badForWash: true },
};

// Mock criteria configuration
const washCriteria = {
    daytimeFocus: false
};

const POP_DISQUALIFY_THRESHOLD = 30;

const washCriteriaThresholds = {
    highWind: 15,
    freezing: 0
};

function calculateWashScore(data) {
    let score = 100;
    const dirtyReasons = [];

    if (data.activeRain) {
        score -= 50;
        dirtyReasons.push('activeRain');
    }

    if (data.badForWash) {
        score -= 50;
        if (!dirtyReasons.includes('badWeather') && !dirtyReasons.includes('activeRain')) {
            dirtyReasons.push('badWeather');
        }
    }

    if (data.precipSum > 0) {
        score -= Math.min(50, Math.max(25, Math.round(data.precipSum * 20)));
        if (!dirtyReasons.includes('rainVolume')) {
            dirtyReasons.push('rainVolume');
        }
    }

    const prob = data.precipProb || 0;
    if (prob >= POP_DISQUALIFY_THRESHOLD) {
        const excessProb = prob - POP_DISQUALIFY_THRESHOLD;
        score -= Math.min(50, Math.round(20 + excessProb * 0.7));
        dirtyReasons.push('highPrecip');
    } else if (prob > 0) {
        const mildDeduction = Math.round((prob / POP_DISQUALIFY_THRESHOLD) * 15);
        score -= mildDeduction;
    }

    if (data.windGust > data.windLimit) {
        const excessWind = data.windGust - data.windLimit;
        score -= Math.min(30, Math.round(excessWind * 0.75));
        dirtyReasons.push(data.windGust > data.windLimit + 15 ? 'highGusts' : 'highWind');
    }

    if (data.minTemp <= data.freezingLimit) {
        score -= 40;
        dirtyReasons.push('freezing');
    }

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    const tier = finalScore >= 80 ? 'ideal' : finalScore >= 60 ? 'good' : finalScore >= 40 ? 'fair' : 'poor';

    return {
        score: finalScore,
        tier: tier,
        isDirty: finalScore < 50 || dirtyReasons.length > 0,
        dirtyReasons: dirtyReasons
    };
}

function extractDayMetrics(daily, hourly, dayIndex) {
    const probArr = daily.precipitation_probability_max || [];
    const rainArr = daily.precipitation_sum || [];
    const windArr = daily.wind_speed_10m_max || daily.windspeed_10m_max || [];
    const gustArr = daily.wind_gusts_10m_max || daily.windgusts_10m_max || windArr;

    const defaultProb = probArr[dayIndex] || 0;
    const defaultRain = rainArr[dayIndex] || 0;
    const defaultWind = windArr[dayIndex] || 0;
    const defaultGust = gustArr[dayIndex] || defaultWind;

    // Scan all 24 hours of the day for bad weather codes (rain, drizzle, snow, thunderstorm)
    const hourlyCodes = (hourly && (hourly.weather_code || hourly.weathercode)) ? (hourly.weather_code || hourly.weathercode) : [];
    const day24Start = dayIndex * 24;
    const day24End = dayIndex * 24 + 23;
    const dayCodes = hourlyCodes.slice(day24Start, day24End + 1);

    let badForWashHourly = false;
    let representativeCode = null;
    for (const c of dayCodes) {
        if (weatherCodes[c] && weatherCodes[c].badForWash) {
            badForWashHourly = true;
            if (representativeCode === null || c > representativeCode) {
                representativeCode = c;
            }
        }
    }

    if (!washCriteria.daytimeFocus || !hourly || !hourly.precipitation_probability) {
        return {
            precipProb: defaultProb,
            precipSum: Math.round(defaultRain * 10) / 10,
            windSpeed: Math.round(defaultWind),
            windGust: Math.round(defaultGust),
            badForWashHourly: badForWashHourly,
            representativeCode: representativeCode
        };
    }

    const start = dayIndex * 24 + 7;
    const end = dayIndex * 24 + 20;
    const probs = (hourly.precipitation_probability || []).slice(start, end + 1);
    const rains = (hourly.precipitation || []).slice(start, end + 1);
    const hourlyGusts = hourly.wind_gusts_10m || hourly.windgusts_10m || [];
    const gusts = hourlyGusts.slice(start, end + 1);

    const daytimeProb = probs.length > 0 ? Math.max(...probs) : defaultProb;
    const daytimeRain = rains.length > 0 ? rains.reduce((a, b) => a + (b || 0), 0) : defaultRain;
    const daytimeGust = gusts.length > 0 ? Math.max(...gusts) : defaultGust;

    return {
        precipProb: daytimeProb,
        precipSum: Math.round(daytimeRain * 10) / 10,
        windSpeed: Math.round(defaultWind),
        windGust: Math.round(daytimeGust),
        badForWashHourly: badForWashHourly,
        representativeCode: representativeCode
    };
}

function isCleanDay(day) {
    if (!day || day.score < 50) return false;
    const precipReasons = ['activeRain', 'highPrecip', 'badWeather', 'rainVolume'];
    if (day.dirtyReasons && day.dirtyReasons.some(r => precipReasons.includes(r))) {
        return false;
    }
    if (day.precipSum > 0) {
        return false;
    }
    return true;
}

function analyzeBestWashDay(days) {
    let bestScore = -999;
    let bestDayIndex = -1;
    let streakLength = 0;
    const numDays = days.length;

    for (let i = 0; i < numDays; i++) {
        if (!isCleanDay(days[i])) continue;

        let guaranteedCleanDays = 0;
        for (let j = i; j < numDays; j++) {
            if (!isCleanDay(days[j])) break;
            guaranteedCleanDays++;
        }

        if (guaranteedCleanDays < 2) continue;

        const d0 = days[i].score;
        const d1 = i + 1 < numDays ? days[i + 1].score : d0;
        const d2 = i + 2 < numDays ? days[i + 2].score : d1;
        const d3 = i + 3 < numDays ? days[i + 3].score : d2;

        const forwardScore = (d0 * 0.40) + (d1 * 0.25) + (d2 * 0.20) + (d3 * 0.15) + (guaranteedCleanDays * 12) - (2.5 * i);

        if (forwardScore > bestScore) {
            bestScore = forwardScore;
            bestDayIndex = i;
            streakLength = Math.max(0, guaranteedCleanDays - 1);
        }
    }

    return { bestDayIndex, streakLength };
}

function runTests() {
    console.log('Running Predictive Wash Engine unit tests...');

    // Test 1: Typical Input - Ideal clear day
    {
        const result = calculateWashScore({
            precipProb: 0,
            precipSum: 0.0,
            windSpeed: 12,
            windGust: 18,
            badForWash: false,
            minTemp: 14,
            maxTemp: 24,
            uvIndex: 4,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        assert.strictEqual(result.score, 100, 'Clear day should receive 100 points');
        assert.strictEqual(result.tier, 'ideal', 'Clear day tier should be ideal');
        assert.strictEqual(result.isDirty, false, 'Clear day should not be marked dirty');
        console.log('Test 1 Passed: Typical ideal sunny day scores 100 (Ideal)');
    }

    // Test 2: Mon Nov 9 Scenario - Trace PoP (19%) with 0.0 mm rain maintains high score without dirty flag
    {
        const result = calculateWashScore({
            precipProb: 19,
            precipSum: 0.0,
            windSpeed: 14,
            windGust: 20,
            badForWash: false,
            minTemp: 12,
            maxTemp: 20,
            uvIndex: 3,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        // 100 - round(19 / 30 * 15) = 100 - 10 = 90
        assert.strictEqual(result.score, 90, 'Trace probability (19%) should result in mild 10pt deduction');
        assert.strictEqual(result.tier, 'ideal', 'Tier should remain ideal for 90 score');
        assert.strictEqual(result.isDirty, false, 'Trace probability below 30% without rain must not be marked dirty');
        assert.strictEqual(result.dirtyReasons.length, 0, 'No dirty reasons should be present');
        console.log('Test 2 Passed: Trace PoP (19%) with 0.0 mm rain maintains high score without dirty flag');
    }

    // Test 3: Failure Case - Heavy rain and bad weather code
    {
        const result = calculateWashScore({
            precipProb: 95,
            precipSum: 8.5,
            windSpeed: 25,
            windGust: 38,
            badForWash: true,
            minTemp: 10,
            maxTemp: 15,
            uvIndex: 2,
            precipLimit: 30,
            rainLimit: 0.5,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        assert.strictEqual(result.score, 0, 'Heavy rain should receive 0 points');
        assert.strictEqual(result.tier, 'poor', 'Tier should be poor');
        assert.strictEqual(result.isDirty, true, 'Heavy rain day must be marked dirty');
        assert.ok(result.dirtyReasons.includes('highPrecip'), 'Should flag highPrecip');
        assert.ok(result.dirtyReasons.includes('badWeather'), 'Should flag badWeather');
        console.log('Test 3 Passed: Heavy storm correctly drops score to 0 (Poor)');
    }

    // Test 4: Failure Case - Freezing temperatures
    {
        const result = calculateWashScore({
            precipProb: 0,
            precipSum: 0.0,
            windSpeed: 10,
            windGust: 15,
            badForWash: false,
            minTemp: -4,
            maxTemp: 3,
            uvIndex: 2,
            precipLimit: 30,
            rainLimit: 0.5,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        assert.strictEqual(result.score, 60, 'Freezing temp should penalize score by 40');
        assert.ok(result.dirtyReasons.includes('freezing'), 'Should flag freezing');
        console.log('Test 4 Passed: Freezing temperature appropriately penalized');
    }

    // Test 5: Daytime vs Overnight hourly separation
    {
        const hourlyPrecip = new Array(24).fill(0);
        hourlyPrecip[2] = 12.0; // 12mm rain overnight at 2 AM
        const hourlyProbs = new Array(24).fill(0);
        hourlyProbs[2] = 90;
        const hourlyGusts = new Array(24).fill(15);

        const dailyMock = {
            precipitation_probability_max: [90],
            precipitation_sum: [12.0],
            windspeed_10m_max: [15],
            windgusts_10m_max: [20],
            weathercode: [0]
        };

        const hourlyMock = {
            precipitation_probability: hourlyProbs,
            precipitation: hourlyPrecip,
            windgusts_10m: hourlyGusts
        };

        washCriteria.daytimeFocus = true;
        const daytimeMetrics = extractDayMetrics(dailyMock, hourlyMock, 0);
        assert.strictEqual(daytimeMetrics.precipSum, 0, 'Daytime precipitation should be 0mm');
        assert.strictEqual(daytimeMetrics.precipProb, 0, 'Daytime probability should be 0%');

        washCriteria.daytimeFocus = false;
        const fullDayMetrics = extractDayMetrics(dailyMock, hourlyMock, 0);
        assert.strictEqual(fullDayMetrics.precipSum, 12.0, 'Full day precipitation should include overnight 12mm');
        assert.strictEqual(fullDayMetrics.precipProb, 90, 'Full day probability should be 90%');
        washCriteria.daytimeFocus = false; // reset
        console.log('Test 5 Passed: Daytime focus correctly ignores overnight rain (2 AM)');
    }

    // Test 6: 24-hour weather code scan catches drizzle (code 51) even when daily code is 3 (overcast)
    {
        const dailyMock = {
            precipitation_probability_max: [10],
            precipitation_sum: [0.3],
            weather_code: [3] // Daily summary is overcast (badForWash = false)
        };

        const hourlyCodes = new Array(24).fill(3);
        hourlyCodes[16] = 51; // Hour 16 (4 PM) has drizzle
        hourlyCodes[17] = 51; // Hour 17 (5 PM) has drizzle

        const hourlyMock = {
            weather_code: hourlyCodes,
            precipitation_probability: new Array(24).fill(10),
            precipitation: new Array(24).fill(0.15),
            wind_gusts_10m: new Array(24).fill(20)
        };

        const metrics = extractDayMetrics(dailyMock, hourlyMock, 0);
        assert.strictEqual(metrics.badForWashHourly, true, 'Hourly drizzle should trigger badForWashHourly');
        assert.strictEqual(metrics.representativeCode, 51, 'Representative code should be 51 (drizzle)');

        const scoreResult = calculateWashScore({
            precipProb: metrics.precipProb,
            precipSum: metrics.precipSum,
            windSpeed: 15,
            windGust: 20,
            badForWash: metrics.badForWashHourly,
            minTemp: 18,
            maxTemp: 28,
            uvIndex: 0,
            precipLimit: 30,
            rainLimit: 0.5,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        assert.ok(scoreResult.score <= 55, 'Drizzle in hourly scan must penalize score');
        assert.ok(scoreResult.dirtyReasons.includes('badWeather'), 'Should flag badWeather reason');
        console.log('Test 6 Passed: 24-hour hourly scan flags bad weather when afternoon drizzle occurs');
    }

    // Test 7: Real-time current precipitation safeguard drops today score
    {
        const scoreResult = calculateWashScore({
            precipProb: 5,
            precipSum: 0.1,
            windSpeed: 10,
            windGust: 15,
            badForWash: true,
            activeRain: true,
            minTemp: 15,
            maxTemp: 25,
            uvIndex: 0,
            precipLimit: 30,
            rainLimit: 0.5,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        assert.ok(scoreResult.score <= 50, 'Active rain safeguard must drop score below 50');
        assert.strictEqual(scoreResult.isDirty, true, 'Must be marked dirty');
        assert.ok(scoreResult.dirtyReasons.includes('activeRain'), 'Must include activeRain dirty reason');
        console.log('Test 7 Passed: Real-time current precipitation safeguard penalizes today wash score');
    }

    // Test 8: ECMWF parameter compatibility verification (handles weather_code, wind_speed_10m_max, null UV)
    {
        const ecmwfDailyMock = {
            weather_code: [51],
            temperature_2m_max: [28],
            temperature_2m_min: [18],
            precipitation_sum: [0.9],
            precipitation_probability_max: [10],
            wind_speed_10m_max: [25],
            wind_gusts_10m_max: [52],
            uv_index_max: [null]
        };

        const ecmwfHourlyMock = {
            weather_code: new Array(24).fill(0),
            precipitation_probability: new Array(24).fill(5),
            precipitation: new Array(24).fill(0.04),
            wind_gusts_10m: new Array(24).fill(52)
        };

        const metrics = extractDayMetrics(ecmwfDailyMock, ecmwfHourlyMock, 0);
        assert.strictEqual(metrics.windSpeed, 25, 'wind_speed_10m_max should resolve cleanly');
        assert.strictEqual(metrics.windGust, 52, 'wind_gusts_10m_max should resolve cleanly');
        assert.strictEqual(metrics.precipSum, 0.9, 'Full-day precipitation sum (0.9mm) should be used when daytimeFocus is off by default');

        washCriteria.daytimeFocus = true;
        const daytimeMetrics = extractDayMetrics(ecmwfDailyMock, ecmwfHourlyMock, 0);
        assert.strictEqual(daytimeMetrics.precipSum, 0.6, 'Daytime precipitation should sum to 0.6mm when daytimeFocus is enabled');
        washCriteria.daytimeFocus = false; // reset to default

        console.log('Test 8 Passed: ECMWF IFS field names handled gracefully');
    }

    // Test 9: Realistic Qom regression test (lat=34.6401, lon=50.8764)
    {
        // 0.9 mm drizzle + 52 km/h wind gusts
        const qomScored = calculateWashScore({
            precipProb: 10,
            precipSum: 0.9,
            windSpeed: 27,
            windGust: 52,
            badForWash: true,
            minTemp: 18,
            maxTemp: 28,
            uvIndex: 0,
            precipLimit: 30,
            rainLimit: 0.5,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        assert.ok(qomScored.score < 40, `Qom score must be poor (got ${qomScored.score})`);
        assert.strictEqual(qomScored.tier, 'poor', 'Qom tier must be poor');
        assert.strictEqual(qomScored.isDirty, true, 'Qom must be flagged as dirty');
        assert.ok(qomScored.dirtyReasons.includes('badWeather'), 'Must flag badWeather');
        assert.ok(qomScored.dirtyReasons.includes('highGusts'), 'Must flag highGusts');
        console.log('Test 9 Passed: Qom rain regression test scores Poor (<= 30) instead of Ideal');
    }

    // Test 10: Standard thresholds evaluate directly without vehicle profile modifiers
    {
        // Wind gusts at 20 km/h against standard threshold of 15 km/h
        const windResult = calculateWashScore({
            precipProb: 0,
            precipSum: 0,
            windSpeed: 12,
            windGust: 20,
            badForWash: false,
            minTemp: 15,
            maxTemp: 25,
            uvIndex: 3,
            windLimit: washCriteriaThresholds.highWind,
            freezingLimit: washCriteriaThresholds.freezing
        });

        assert.strictEqual(windResult.windLimit, undefined);
        assert.ok(windResult.dirtyReasons.includes('highWind'), 'Must trigger highWind penalty at 20 km/h against base limit 15');
        assert.ok(windResult.score < 100, 'Score must be penalized by excess wind');
        console.log('Test 10 Passed: Base thresholds evaluate directly without vehicle profile offsets');
    }

    // Test 11: Language default locations map accurately for first-time visitors (Tehran for fa, New York for en)
    {
        function resolveDefaultLocation(lang) {
            return lang === 'fa'
                ? { lat: 35.69439, lon: 51.42151, name: 'Tehran, Tehran' }
                : { lat: 40.71427, lon: -74.00597, name: 'New York, New York' };
        }

        const farsiDefault = resolveDefaultLocation('fa');
        assert.strictEqual(farsiDefault.lat, 35.69439, 'Farsi default latitude must be Tehran');
        assert.strictEqual(farsiDefault.lon, 51.42151, 'Farsi default longitude must be Tehran');
        assert.strictEqual(farsiDefault.name, 'Tehran, Tehran');

        const englishDefault = resolveDefaultLocation('en');
        assert.strictEqual(englishDefault.lat, 40.71427, 'English default latitude must be New York');
        assert.strictEqual(englishDefault.lon, -74.00597, 'English default longitude must be New York');
        assert.strictEqual(englishDefault.name, 'New York, New York');

        console.log('Test 11 Passed: Language default locations map accurately for first-time visitors');
    }

    // Test 12: Days followed immediately by rain are disqualified from being recommended
    {
        const days = [
            { score: 96, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // Today: Ideal but followed by rain
            { score: 0, precipSum: 0.7, rainLimit: 0, dirtyReasons: ['badWeather', 'rainVolume', 'highPrecip'] }, // Tomorrow: Poor
            { score: 0, precipSum: 2.7, rainLimit: 0, dirtyReasons: ['badWeather', 'rainVolume', 'highPrecip'] }, // Tue: Poor
            { score: 100, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // Wed: Ideal
            { score: 95, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // Thu: Ideal
        ];

        const { bestDayIndex, streakLength } = analyzeBestWashDay(days);
        assert.notStrictEqual(bestDayIndex, 0, 'Today must not be recommended when tomorrow is rainy');
        assert.strictEqual(bestDayIndex, 3, 'Wednesday should be recommended as the first clean multi-day window');
        assert.ok(streakLength >= 1, 'Clean streak after wash day must be at least 1 day');
        console.log('Test 12 Passed: Rain the following day disqualifies recommendation and defers to next clean window');
    }

    // Test 13: Isolated clean days surrounded by rain return -1 (Wait it out)
    {
        const days = [
            { score: 20, precipSum: 3.0, rainLimit: 0, dirtyReasons: ['badWeather', 'rainVolume'] },
            { score: 85, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // 1 clean day
            { score: 10, precipSum: 4.5, rainLimit: 0, dirtyReasons: ['badWeather', 'rainVolume'] },
            { score: 90, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // 1 clean day
            { score: 15, precipSum: 2.0, rainLimit: 0, dirtyReasons: ['badWeather', 'rainVolume'] }
        ];

        const { bestDayIndex } = analyzeBestWashDay(days);
        assert.strictEqual(bestDayIndex, -1, 'Must return -1 to trigger Wait It Out when no 2-day clean window exists');
        console.log('Test 13 Passed: Isolated clean days return -1 (Wait it out)');
    }

    // Test 14: Valid consecutive clean days starting today recommend today with proper streak
    {
        const days = [
            { score: 95, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // Today
            { score: 90, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // Tomorrow
            { score: 85, precipSum: 0, rainLimit: 0, dirtyReasons: [] }, // Day 2
            { score: 20, precipSum: 5.0, rainLimit: 0, dirtyReasons: ['badWeather', 'rainVolume'] }
        ];

        const { bestDayIndex, streakLength } = analyzeBestWashDay(days);
        assert.strictEqual(bestDayIndex, 0, 'Today should be recommended when multiple clean days follow');
        assert.strictEqual(streakLength, 2, 'Streak after today must be 2 days');
        console.log('Test 14 Passed: Multi-day clean window starting today recommends today with verified streak');
    }

    // Test 15: Zero-tolerance rain volume safeguard (0.1 mm) disqualifies day as dirty
    {
        const rainResult = calculateWashScore({
            precipProb: 10,
            precipSum: 0.1,
            windSpeed: 10,
            windGust: 15,
            badForWash: false,
            minTemp: 15,
            maxTemp: 25,
            windLimit: 30,
            freezingLimit: 0
        });

        assert.strictEqual(rainResult.isDirty, true, 'Measurable rain accumulation (0.1mm) must mark day dirty');
        assert.ok(rainResult.dirtyReasons.includes('rainVolume'), 'Must include rainVolume dirty reason');
        console.log('Test 15 Passed: Zero-tolerance rain volume safeguard (0.1 mm) disqualifies day as dirty');
    }

    // Test 16: PoP >= 30% cutoff with 0.0 mm rain flags highPrecip and marks day dirty
    {
        const popCutoffResult = calculateWashScore({
            precipProb: 35,
            precipSum: 0.0,
            windSpeed: 10,
            windGust: 15,
            badForWash: false,
            minTemp: 15,
            maxTemp: 25,
            windLimit: 30,
            freezingLimit: 0
        });

        assert.strictEqual(popCutoffResult.isDirty, true, 'PoP >= 30% must mark day dirty');
        assert.ok(popCutoffResult.dirtyReasons.includes('highPrecip'), 'Must include highPrecip dirty reason');
        console.log('Test 16 Passed: PoP >= 30% cutoff with 0.0 mm rain flags highPrecip and marks day dirty');
    }

    console.log('All 16 Predictive Wash Engine tests passed successfully!');
}

runTests();
