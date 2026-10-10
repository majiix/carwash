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
    badWeather: true,
    highPrecip: true,
    highWind: true,
    freezing: true,
    extremeHeat: false,
    highUV: false,
    daytimeFocus: true
};

const washCriteriaThresholds = {
    highPrecip: 30,
    rainVolume: 0.5,
    highWind: 30,
    freezing: 0,
    extremeHeat: 32,
    highUV: 7
};

function calculateWashScore(data) {
    let score = 100;
    const dirtyReasons = [];

    if (data.activeRain) {
        score -= 50;
        dirtyReasons.push('activeRain');
    }

    if (data.precipSum > data.rainLimit) {
        const excess = data.precipSum - data.rainLimit;
        score -= Math.min(55, Math.round(15 + excess * 18));
        dirtyReasons.push('rainVolume');
    }

    if (washCriteria.highPrecip && data.precipProb > data.precipLimit) {
        const excessProb = data.precipProb - data.precipLimit;
        score -= Math.min(45, Math.round(excessProb * 0.9));
        dirtyReasons.push('highPrecip');
    }

    if (washCriteria.badWeather && data.badForWash) {
        score -= 45;
        if (!dirtyReasons.includes('badWeather') && !dirtyReasons.includes('activeRain')) {
            dirtyReasons.push('badWeather');
        }
    }

    if (washCriteria.highWind && data.windGust > data.windLimit) {
        const excessWind = data.windGust - data.windLimit;
        score -= Math.min(30, Math.round(excessWind * 0.75));
        dirtyReasons.push(data.windGust > data.windLimit + 15 ? 'highGusts' : 'highWind');
    }

    if (washCriteria.freezing && data.minTemp <= data.freezingLimit) {
        score -= 40;
        dirtyReasons.push('freezing');
    }
    if (washCriteria.extremeHeat && data.maxTemp > data.heatLimit) {
        score -= 20;
        dirtyReasons.push('extremeHeat');
    }
    if (washCriteria.highUV && data.uvIndex > data.uvLimit) {
        score -= 15;
        dirtyReasons.push('highUV');
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

function runTests() {
    console.log('Running Predictive Wash Engine unit tests...');

    // Test 1: Typical Input - Ideal clear day
    {
        const result = calculateWashScore({
            precipProb: 5,
            precipSum: 0.0,
            windSpeed: 12,
            windGust: 18,
            badForWash: false,
            minTemp: 14,
            maxTemp: 24,
            uvIndex: 4,
            precipLimit: 30,
            rainLimit: 0.5,
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

    // Test 2: Edge Case - Trace mist below rain volume limit
    {
        const result = calculateWashScore({
            precipProb: 20,
            precipSum: 0.2, // Below 0.5 mm limit
            windSpeed: 14,
            windGust: 20,
            badForWash: false,
            minTemp: 12,
            maxTemp: 20,
            uvIndex: 3,
            precipLimit: 30,
            rainLimit: 0.5,
            windLimit: 30,
            freezingLimit: 0,
            heatLimit: 32,
            uvLimit: 7
        });

        assert.ok(result.score >= 80, 'Trace mist below threshold should maintain high score');
        assert.strictEqual(result.tier, 'ideal', 'Tier should remain ideal for trace mist');
        console.log('Test 2 Passed: Trace mist below limit is tolerated without harsh penalty');
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
        assert.ok(result.dirtyReasons.includes('rainVolume'), 'Should flag rainVolume');
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
        washCriteria.daytimeFocus = true; // reset
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
        assert.strictEqual(metrics.precipSum, 0.6, 'Daytime precipitation should sum properly');

        console.log('Test 8 Passed: ECMWF IFS field names and null UV index handled gracefully');
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

        assert.ok(qomScored.score <= 30, `Qom score must be poor (got ${qomScored.score})`);
        assert.strictEqual(qomScored.tier, 'poor', 'Qom tier must be poor');
        assert.strictEqual(qomScored.isDirty, true, 'Qom must be flagged as dirty');
        assert.ok(qomScored.dirtyReasons.includes('rainVolume'), 'Must flag rainVolume');
        assert.ok(qomScored.dirtyReasons.includes('badWeather'), 'Must flag badWeather');
        assert.ok(qomScored.dirtyReasons.includes('highGusts'), 'Must flag highGusts');
        console.log('Test 9 Passed: Qom rain regression test scores Poor (<= 30) instead of Ideal');
    }

    console.log('All 9 Predictive Wash Engine tests passed successfully!');
}

runTests();
