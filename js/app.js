// app.js

window.translations = window.translations || {};
const translations = window.translations;

function loadLanguageFile(lang, callback) {
    if (translations[lang]) {
        if (callback) callback();
        return;
    }
    const script = document.createElement('script');
    script.src = `js/lang/${lang}.js`;
    script.onload = () => {
        if (callback) callback();
    };
    script.onerror = () => {
        console.warn(`Failed to load translation file for language: ${lang}. Falling back to English.`);
        if (lang !== 'en') {
            loadLanguageFile('en', callback);
        } else {
            if (callback) callback();
        }
    };
    document.head.appendChild(script);
}

let currentLang = 'en';
let currentWeatherData = null;
let currentLat = null;
let currentLon = null;
let currentRecommendedDate = null;
let currentStreakLength = 0;
let vehicleColor = localStorage.getItem('vehicleColor') || 'light';
let vehicleCoating = localStorage.getItem('vehicleCoating') || 'regular';

// Threshold default settings
let washCriteriaThresholds = {
    highPrecip: 30,
    highWind: 30,
    freezing: 0,
    extremeHeat: 32,
    highUV: 7
};

// Extreme Heat and High UV disabled by default
let washCriteria = {
    badWeather: true,
    highPrecip: true,
    highWind: true,
    freezing: true,
    extremeHeat: false,
    highUV: false
};

function t(key, params = {}) {
    let str = (translations[currentLang] && translations[currentLang][key]) || (translations['en'] && translations['en'][key]) || key;
    for (let [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{${k}}`, v);
    }
    return str;
}

function updateStaticTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let params = {};
        if (key.includes('Precip')) {
            params = { val: washCriteriaThresholds.highPrecip };
        } else if (key.includes('Wind')) {
            params = { val: washCriteriaThresholds.highWind };
        } else if (key.includes('Freezing')) {
            params = { val: washCriteriaThresholds.freezing, val_f: Math.round(washCriteriaThresholds.freezing * 9/5 + 32) };
        } else if (key.includes('ExtremeHeat') || key.includes('critExtremeHeat') || key.includes('descHeat')) {
            params = { val: washCriteriaThresholds.extremeHeat, val_f: Math.round(washCriteriaThresholds.extremeHeat * 9/5 + 32) };
        } else if (key.includes('HighUV')) {
            params = { val: washCriteriaThresholds.highUV };
        }
        el.innerText = t(key, params);
    });
    const locationInputEl = document.getElementById('location-input');
    if (locationInputEl) {
        locationInputEl.placeholder = t('enterCityPlaceholder');
    }
    if (typeof updateVehicleProfileUI === 'function') {
        updateVehicleProfileUI(vehicleColor, vehicleCoating);
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);

    try {
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.pushState({}, '', url);
    } catch (e) {
    }

    const isRtl = ['ar', 'fa'].includes(lang);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    const localeMap = {
        'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR',
        'zh': 'zh-CN', 'hi': 'hi-IN', 'ar': 'ar-SA', 'fa': 'fa-IR'
    };
    document.documentElement.dataset.locale = localeMap[lang];

    document.querySelectorAll('.lang-selector').forEach(el => el.value = lang);
    updateStaticTexts();
    updateAgendaDate();

    if (currentWeatherData) {
        processData(currentWeatherData);
    }
}

function updateAgendaDate() {
    const localeString = document.documentElement.dataset.locale || 'en-US';
    const today = new Date();
    const dateStr = today.toLocaleDateString(localeString, { month: 'short', day: 'numeric', weekday: 'long' });
    document.getElementById('agenda-date').innerText = dateStr;
}

function initTheme() {
    const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function updateLocationUrlParams(lat, lon, name) {
    try {
        const url = new URL(window.location);
        url.searchParams.set('lat', lat);
        url.searchParams.set('lon', lon);
        url.searchParams.set('locName', encodeURIComponent(name));
        window.history.pushState({}, '', url);
    } catch (e) {
    }
}

function updateSlidersUI() {
    const inputPrecip = document.getElementById('input-precip');
    const inputWind = document.getElementById('input-wind');
    const inputFreezing = document.getElementById('input-freezing');
    const inputHeat = document.getElementById('input-heat');
    const inputUv = document.getElementById('input-uv');

    if (inputPrecip) inputPrecip.value = washCriteriaThresholds.highPrecip;
    if (inputWind) inputWind.value = washCriteriaThresholds.highWind;
    if (inputFreezing) inputFreezing.value = washCriteriaThresholds.freezing;
    if (inputHeat) inputHeat.value = washCriteriaThresholds.extremeHeat;
    if (inputUv) inputUv.value = washCriteriaThresholds.highUV;

    updateSliderBubbles();
}

function updateSliderBubbles() {
    const inputPrecip = document.getElementById('input-precip');
    const inputWind = document.getElementById('input-wind');
    const inputFreezing = document.getElementById('input-freezing');
    const inputHeat = document.getElementById('input-heat');
    const inputUv = document.getElementById('input-uv');

    const sliderPrecipVal = document.getElementById('slider-precip-val');
    const sliderWindVal = document.getElementById('slider-wind-val');
    const sliderFreezingVal = document.getElementById('slider-freezing-val');
    const sliderHeatVal = document.getElementById('slider-heat-val');
    const sliderUvVal = document.getElementById('slider-uv-val');

    if (sliderPrecipVal) sliderPrecipVal.innerText = `${inputPrecip ? inputPrecip.value : washCriteriaThresholds.highPrecip}%`;
    if (sliderWindVal) sliderWindVal.innerText = `${inputWind ? inputWind.value : washCriteriaThresholds.highWind} km/h`;
    if (sliderFreezingVal) sliderFreezingVal.innerText = `${inputFreezing ? inputFreezing.value : washCriteriaThresholds.freezing}°C`;
    if (sliderHeatVal) sliderHeatVal.innerText = `${inputHeat ? inputHeat.value : washCriteriaThresholds.extremeHeat}°C`;
    if (sliderUvVal) sliderUvVal.innerText = inputUv ? inputUv.value : washCriteriaThresholds.highUV;
}

function initCriteria() {
    const saved = localStorage.getItem('washCriteria');
    if (saved) {
        try {
            washCriteria = { ...washCriteria, ...JSON.parse(saved) };
        } catch (e) {}
    }

    const savedThresholds = localStorage.getItem('washCriteriaThresholds');
    if (savedThresholds) {
        try {
            washCriteriaThresholds = { ...washCriteriaThresholds, ...JSON.parse(savedThresholds) };
        } catch (e) {}
    }

    const badWeatherToggle = document.getElementById('toggle-bad-weather');
    const highPrecipToggle = document.getElementById('toggle-high-precip');
    const highWindToggle = document.getElementById('toggle-high-wind');
    const freezingToggle = document.getElementById('toggle-freezing');
    const extremeHeatToggle = document.getElementById('toggle-extreme-heat');
    const highUVToggle = document.getElementById('toggle-high-uv');

    if(badWeatherToggle) badWeatherToggle.checked = washCriteria.badWeather;
    if(highPrecipToggle) highPrecipToggle.checked = washCriteria.highPrecip;
    if(highWindToggle) highWindToggle.checked = washCriteria.highWind;
    if(freezingToggle) freezingToggle.checked = washCriteria.freezing;
    if(extremeHeatToggle) extremeHeatToggle.checked = washCriteria.extremeHeat;
    if(highUVToggle) highUVToggle.checked = washCriteria.highUV;

    if(badWeatherToggle) badWeatherToggle.addEventListener('change', (e) => {
        washCriteria.badWeather = e.target.checked;
        saveCriteria();
    });

    if(highPrecipToggle) highPrecipToggle.addEventListener('change', (e) => {
        washCriteria.highPrecip = e.target.checked;
        saveCriteria();
    });

    if(highWindToggle) highWindToggle.addEventListener('change', (e) => {
        washCriteria.highWind = e.target.checked;
        saveCriteria();
    });

    if(freezingToggle) freezingToggle.addEventListener('change', (e) => {
        washCriteria.freezing = e.target.checked;
        saveCriteria();
    });

    if(extremeHeatToggle) extremeHeatToggle.addEventListener('change', (e) => {
        washCriteria.extremeHeat = e.target.checked;
        saveCriteria();
    });

    if(highUVToggle) highUVToggle.addEventListener('change', (e) => {
        washCriteria.highUV = e.target.checked;
        saveCriteria();
    });

    // Wire up sliders and thresholds settings modal controls
    const criteriaSettingsModal = document.getElementById('criteria-settings-modal');
    const criteriaSettingsBtn = document.getElementById('criteria-settings-btn');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');

    const inputPrecip = document.getElementById('input-precip');
    const inputWind = document.getElementById('input-wind');
    const inputFreezing = document.getElementById('input-freezing');
    const inputHeat = document.getElementById('input-heat');
    const inputUv = document.getElementById('input-uv');

    updateSlidersUI();

    if (inputPrecip) inputPrecip.addEventListener('input', updateSliderBubbles);
    if (inputWind) inputWind.addEventListener('input', updateSliderBubbles);
    if (inputFreezing) inputFreezing.addEventListener('input', updateSliderBubbles);
    if (inputHeat) inputHeat.addEventListener('input', updateSliderBubbles);
    if (inputUv) inputUv.addEventListener('input', updateSliderBubbles);

    if (criteriaSettingsBtn) {
        criteriaSettingsBtn.addEventListener('click', () => {
            updateSlidersUI();
            if (criteriaSettingsModal) {
                criteriaSettingsModal.classList.remove('hidden');
            }
            history.pushState({ modalOpen: true }, '', '');
        });
    }

    if (closeSettingsModalBtn) {
        closeSettingsModalBtn.addEventListener('click', () => {
            if (criteriaSettingsModal) {
                criteriaSettingsModal.classList.add('hidden');
            }
            if (history.state && history.state.modalOpen) history.back();
        });
    }

    if (criteriaSettingsModal) {
        criteriaSettingsModal.addEventListener('click', (e) => {
            if (e.target === criteriaSettingsModal) {
                criteriaSettingsModal.classList.add('hidden');
                if (history.state && history.state.modalOpen) history.back();
            }
        });
    }

    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            washCriteriaThresholds = {
                highPrecip: 30,
                highWind: 30,
                freezing: 0,
                extremeHeat: 32,
                highUV: 7
            };
            updateSlidersUI();
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            washCriteriaThresholds.highPrecip = parseInt(inputPrecip ? inputPrecip.value : 30);
            washCriteriaThresholds.highWind = parseInt(inputWind ? inputWind.value : 30);
            washCriteriaThresholds.freezing = parseInt(inputFreezing ? inputFreezing.value : 0);
            washCriteriaThresholds.extremeHeat = parseInt(inputHeat ? inputHeat.value : 32);
            washCriteriaThresholds.highUV = parseInt(inputUv ? inputUv.value : 7);

            localStorage.setItem('washCriteriaThresholds', JSON.stringify(washCriteriaThresholds));
            if (criteriaSettingsModal) {
                criteriaSettingsModal.classList.add('hidden');
            }
            if (history.state && history.state.modalOpen) history.back();

            updateStaticTexts();
            saveCriteria();
        });
    }
}

function saveCriteria() {
    localStorage.setItem('washCriteria', JSON.stringify(washCriteria));
    if (currentLat && currentLon && currentWeatherData) {
        document.querySelectorAll('.recheck-btn').forEach(btn => {
            const icon = btn.querySelector('svg') || btn.querySelector('i');
            if (icon) icon.classList.add('animate-spin');
        });
        showSkeleton();

        setTimeout(() => {
            processData(currentWeatherData);

            document.querySelectorAll('.recheck-btn').forEach(btn => {
                const currentIcon = btn.querySelector('svg') || btn.querySelector('i');
                if (currentIcon) currentIcon.classList.remove('animate-spin');
            });
        }, 400);
    }
}

const dashboardSkeleton = document.getElementById('dashboard-skeleton');
const forecastSkeleton = document.getElementById('forecast-skeleton');
const dashboard = document.getElementById('dashboard');
const forecastContainer = document.getElementById('forecast-container');
const locationName = document.getElementById('location-name');

const verdictCard = document.getElementById('verdict-card');
const verdictTitle = document.getElementById('verdict-title');
const verdictReason = document.getElementById('verdict-reason');
const targetDateText = document.getElementById('target-date-text');
const streakBadge = document.getElementById('streak-badge');
const streakNumber = document.getElementById('streak-number');

const locationModal = document.getElementById('location-modal');
const changeLocationBtn = document.getElementById('change-location-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const locationForm = document.getElementById('location-form');
const locationInput = document.getElementById('location-input');
const locationSearchStatus = document.getElementById('location-search-status');
const searchResultsContainer = document.getElementById('search-results-container');
const useGpsBtn = document.getElementById('use-gps-btn');

// Criteria Modal logic
const criteriaInfoModal = document.getElementById('criteria-info-modal');
const criteriaInfoBtn = document.getElementById('criteria-info-btn');
const closeCriteriaModalBtn = document.getElementById('close-criteria-modal-btn');

// Close modals safely on hardware/browser back button
window.addEventListener('popstate', () => {
    locationModal.classList.add('hidden');
    locationSearchStatus.classList.add('hidden');
    if (searchResultsContainer) searchResultsContainer.classList.add('hidden');
    criteriaInfoModal.classList.add('hidden');
    const criteriaSettingsModal = document.getElementById('criteria-settings-modal');
    if (criteriaSettingsModal) criteriaSettingsModal.classList.add('hidden');
    const vehicleProfileModal = document.getElementById('vehicle-profile-modal');
    if (vehicleProfileModal) vehicleProfileModal.classList.add('hidden');
});

criteriaInfoBtn.addEventListener('click', () => {
    criteriaInfoModal.classList.remove('hidden');
    history.pushState({ modalOpen: true }, '', '');
});

closeCriteriaModalBtn.addEventListener('click', () => {
    criteriaInfoModal.classList.add('hidden');
    if (history.state && history.state.modalOpen) history.back();
});

criteriaInfoModal.addEventListener('click', (e) => {
    if (e.target === criteriaInfoModal) {
        criteriaInfoModal.classList.add('hidden');
        if (history.state && history.state.modalOpen) history.back();
    }
});


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

document.querySelectorAll('.lang-selector').forEach(el => {
    el.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        loadLanguageFile(selectedLang, () => {
            setLanguage(selectedLang);
        });
    });
});

document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
});

changeLocationBtn.addEventListener('click', () => {
    locationModal.classList.remove('hidden');
    locationInput.focus();
    searchResultsContainer.classList.add('hidden');
    searchResultsContainer.innerHTML = '';
    locationInput.value = '';
    history.pushState({ modalOpen: true }, '', '');
});

closeModalBtn.addEventListener('click', () => {
    locationModal.classList.add('hidden');
    locationSearchStatus.classList.add('hidden');
    searchResultsContainer.classList.add('hidden');
    if (history.state && history.state.modalOpen) history.back();
});

locationModal.addEventListener('click', (e) => {
    if (e.target === locationModal) {
        locationModal.classList.add('hidden');
        locationSearchStatus.classList.add('hidden');
        searchResultsContainer.classList.add('hidden');
        if (history.state && history.state.modalOpen) history.back();
    }
});

function showSkeleton() {
    dashboard.classList.add('hidden');
    dashboard.classList.remove('flex');
    forecastContainer.classList.add('hidden');
    forecastContainer.classList.remove('flex');

    dashboardSkeleton.classList.remove('hidden');
    dashboardSkeleton.classList.add('flex');
    forecastSkeleton.classList.remove('hidden');
    forecastSkeleton.classList.add('flex');
}

function hideSkeleton() {
    dashboardSkeleton.classList.add('hidden');
    dashboardSkeleton.classList.remove('flex');
    forecastSkeleton.classList.add('hidden');
    forecastSkeleton.classList.remove('flex');

    dashboard.classList.remove('hidden');
    dashboard.classList.add('flex');
    forecastContainer.classList.remove('hidden');
    forecastContainer.classList.add('flex');
}

document.querySelectorAll('.recheck-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentLat && currentLon) {
            document.querySelectorAll('.recheck-btn').forEach(b => {
                const icon = b.querySelector('svg') || b.querySelector('i');
                if (icon) icon.classList.add('animate-spin');
            });

            showSkeleton();
            forecastContainer.innerHTML = '';

            fetchWeatherData(currentLat, currentLon).finally(() => {
                setTimeout(() => {
                    document.querySelectorAll('.recheck-btn').forEach(b => {
                        const currentIcon = b.querySelector('svg') || b.querySelector('i');
                        if (currentIcon) currentIcon.classList.remove('animate-spin');
                    });
                }, 500);
            });
        }
    });
});

locationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = locationInput.value.trim();
    if (!query) return;

    locationSearchStatus.classList.remove('hidden');
    locationSearchStatus.classList.remove('text-brand-600', 'dark:text-brand-400');
    locationSearchStatus.classList.remove('text-red-500');
    locationSearchStatus.classList.add('text-slate-500');
    locationSearchStatus.innerText = t('searching');
    searchResultsContainer.classList.add('hidden');
    searchResultsContainer.innerHTML = '';

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            locationSearchStatus.classList.add('hidden');
            searchResultsContainer.classList.remove('hidden');

            data.results.forEach(result => {
                const areaName = result.admin1 ? `${result.admin1}` : '';
                const countryName = result.country ? `${result.country}` : '';
                const subtext = [areaName, countryName].filter(Boolean).join(', ');
                const displayName = `${result.name}${areaName ? ', ' + areaName : ''}`;

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5 outline-none focus:bg-slate-100 dark:focus:bg-slate-800/80';
                btn.innerHTML = `
                    <span class="font-bold text-slate-800 dark:text-slate-200 text-sm">${result.name}</span>
                    ${subtext ? `<span class="text-xs text-slate-500 dark:text-slate-400">${subtext}</span>` : ''}
                `;

                btn.addEventListener('click', () => {
                    saveAndFetchLocation(result.latitude, result.longitude, displayName);
                    locationModal.classList.add('hidden');
                    locationInput.value = '';
                    searchResultsContainer.classList.add('hidden');
                    if (history.state && history.state.modalOpen) history.back();
                });

                searchResultsContainer.appendChild(btn);
            });
        } else {
            locationSearchStatus.classList.remove('text-slate-500');
            locationSearchStatus.classList.add('text-red-500');
            locationSearchStatus.innerText = t('locationNotFound');
        }
    } catch (error) {
        locationSearchStatus.classList.remove('text-slate-500');
        locationSearchStatus.classList.add('text-red-500');
        locationSearchStatus.innerText = t('errorConnecting');
    }
});

useGpsBtn.addEventListener('click', () => {
    localStorage.removeItem('savedLocation');
    locationModal.classList.add('hidden');
    showSkeleton();
    currentWeatherData = null;
    if (history.state && history.state.modalOpen) history.back();
    getLocationViaGPS();
});

function initApp() {
    initTheme();
    initCriteria();
    initVehicleProfile();

    const urlParams = new URLSearchParams(window.location.search);

    const langParam = urlParams.get('lang');
    const validLangs = ['en', 'es', 'fr', 'zh', 'hi', 'ar', 'fa'];
    if (langParam && validLangs.includes(langParam)) {
        currentLang = langParam;
    } else {
        currentLang = localStorage.getItem('appLang') || 'en';
    }

    showSkeleton();

    loadLanguageFile(currentLang, () => {
        setLanguage(currentLang);

        const urlLat = urlParams.get('lat');
        const urlLon = urlParams.get('lon');
        const urlName = urlParams.get('locName');

        if (urlLat && urlLon && urlName) {
            saveAndFetchLocation(parseFloat(urlLat), parseFloat(urlLon), decodeURIComponent(urlName));
            return;
        }

        const savedData = localStorage.getItem('savedLocation');
        if (savedData) {
            try {
                const { lat, lon, name } = JSON.parse(savedData);
                updateLocationUrlParams(lat, lon, name);
                currentLat = lat;
                currentLon = lon;
                locationName.innerText = name;
                fetchWeatherData(lat, lon);
                return;
            } catch (e) {
                localStorage.removeItem('savedLocation');
            }
        }

        getLocationViaGPS();
    });
}

function showLocationModalWithError() {
    if (!history.state || !history.state.modalOpen) {
        history.pushState({ modalOpen: true }, '', '');
    }
    locationModal.classList.remove('hidden');
    locationSearchStatus.classList.remove('text-red-500', 'text-slate-500');
    locationSearchStatus.classList.add('text-brand-600', 'dark:text-brand-400');
    locationSearchStatus.innerText = t('typeInEnglishOnly');
    locationSearchStatus.classList.remove('hidden');
    locationInput.focus();

    locationName.innerText = t('defaultLocation');
    currentLat = 40.7128;
    currentLon = -74.0060;
    fetchWeatherData(currentLat, currentLon);
}

function getLocationViaGPS() {
    locationName.innerText = t('locating');

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                saveAndFetchLocation(position.coords.latitude, position.coords.longitude, t('currentLocation'));
            },
            (error) => {
                showLocationModalWithError();
            }
        );
    } else {
        showLocationModalWithError();
    }
}

function saveAndFetchLocation(lat, lon, name) {
    localStorage.setItem('savedLocation', JSON.stringify({ lat, lon, name }));
    updateLocationUrlParams(lat, lon, name);

    currentLat = lat;
    currentLon = lon;
    locationName.innerText = name;

    showSkeleton();
    currentWeatherData = null;

    fetchWeatherData(lat, lon);
}

async function fetchWeatherData(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,uv_index_max&timezone=auto&forecast_days=10`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Weather data request failed.");

        const data = await response.json();
        currentWeatherData = data.daily;
        processData(currentWeatherData);

    } catch (error) {
        hideSkeleton();
        verdictCard.classList.remove('bg-brand-700', 'bg-accent-400', 'text-slate-900', 'text-white', 'verdict-recommend-bg', 'verdict-wait-bg');
        verdictCard.classList.add('verdict-error-bg', 'text-white');
        verdictTitle.innerText = t('errorConnecting');
        verdictReason.innerText = t('checkBackLater');
        targetDateText.innerText = t('pending');
    }
}

function processData(daily) {
    const daysData = [];
    const today = new Date();
    const localeString = document.documentElement.dataset.locale || 'en-US';
    const numDays = daily.weathercode.length;

    for (let i = 0; i < numDays; i++) {
        const code = daily.weathercode[i];
        const weatherInfo = weatherCodes[code] || { icon: 'help-circle', badForWash: false };
        const descriptionStr = translations[currentLang]?.weather?.[code] || translations['en'].weather[code] || 'Unknown';
        const precipProb = daily.precipitation_probability_max[i];
        const windSpeed = daily.windspeed_10m_max[i];
        const uvIndexRaw = daily.uv_index_max && daily.uv_index_max[i] !== null ? daily.uv_index_max[i] : 0;

        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() + i);

        const localWeekday = dateObj.toLocaleDateString(localeString, { weekday: 'short' });
        const localDate = dateObj.toLocaleDateString(localeString, { month: 'short', day: 'numeric' });

        let dayName = i === 0 ? t('todayStr') : i === 1 ? t('tomorrowStr') : localWeekday;

        let activePrecipLimit = washCriteriaThresholds.highPrecip + (vehicleCoating === 'wax' ? 5 : (vehicleCoating === 'ceramic' ? 15 : 0));
        let activeWindLimit = washCriteriaThresholds.highWind + (vehicleCoating === 'ceramic' ? 10 : 0);
        let activeUvLimit = Math.max(1, washCriteriaThresholds.highUV - (vehicleColor === 'dark' ? 2 : 0));

        // Collect all reasons why this day might be flagged as dirty based on criteria
        const dirtyReasons = [];
        if (washCriteria.badWeather && weatherInfo.badForWash) dirtyReasons.push('badWeather');
        if (washCriteria.highPrecip && precipProb > activePrecipLimit) dirtyReasons.push('highPrecip');
        if (washCriteria.highWind && windSpeed > activeWindLimit) dirtyReasons.push('highWind');
        if (washCriteria.freezing && daily.temperature_2m_min[i] <= washCriteriaThresholds.freezing) dirtyReasons.push('freezing');
        if (washCriteria.extremeHeat && daily.temperature_2m_max[i] > washCriteriaThresholds.extremeHeat) dirtyReasons.push('extremeHeat');
        if (washCriteria.highUV && uvIndexRaw > activeUvLimit) dirtyReasons.push('highUV');

        const isDirtyDay = dirtyReasons.length > 0;

        daysData.push({
            index: i,
            dayName: dayName,
            dateFormatted: localDate,
            maxTemp: Math.round(daily.temperature_2m_max[i]),
            minTemp: Math.round(daily.temperature_2m_min[i]),
            precipProb: precipProb,
            windSpeed: Math.round(windSpeed),
            uvIndex: Math.round(uvIndexRaw),
            desc: descriptionStr,
            icon: weatherInfo.icon,
            isDirty: isDirtyDay,
            dirtyReasons: dirtyReasons,
            dateObj: dateObj,
            precipLimit: activePrecipLimit,
            windLimit: activeWindLimit,
            uvLimit: activeUvLimit
        });
    }

    analyzeBestWashDay(daysData);
    drawTrendsChart(daysData);
}

function analyzeBestWashDay(days) {
    let bestScore = -999;
    let bestDayIndex = -1;
    let streakLength = 0;
    const numDays = days.length;

    for (let i = 0; i < numDays; i++) {
        if (days[i].isDirty) continue;

        let guaranteedCleanDays = 0;
        for (let j = i; j < numDays; j++) {
            if (days[j].isDirty) {
                break;
            }
            guaranteedCleanDays++;
        }

        // Each guaranteed clean day adds 50 points to the score.
        // A proximity penalty of 5 points per day is subtracted based on how far in the future the day is.
        // This naturally favors closer days when streak lengths are equal, and avoids boundary-truncation advantages.
        let currentScore = (guaranteedCleanDays * 50) - (5 * i);

        if (currentScore > bestScore) {
            bestScore = currentScore;
            bestDayIndex = i;
            streakLength = guaranteedCleanDays - 1;
        }
    }

    renderDashboard(days, bestDayIndex, streakLength);
}

function renderDashboard(days, bestDayIndex, streakLength) {
    hideSkeleton();
    streakBadge.classList.add('hidden');

    verdictCard.classList.remove('bg-brand-700', 'bg-accent-400', 'bg-red-500', 'text-white', 'text-slate-900', 'verdict-recommend-bg', 'verdict-wait-bg', 'verdict-error-bg');

    const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
    const calendarHelpText = document.getElementById('calendar-help-text');

    if (bestDayIndex === -1) {
        currentRecommendedDate = null;
        currentStreakLength = 0;
        if (addToCalendarBtn) addToCalendarBtn.classList.add('hidden');
        if (calendarHelpText) calendarHelpText.classList.add('hidden');

        verdictCard.classList.add('verdict-wait-bg', 'text-slate-900');
        verdictTitle.innerText = t('waitItOut');

        // Dynamic wait reason construction
        let foundReasons = new Set();
        // Check reasons for the next 3 days to give a relevant dynamic explanation
        const checkLimit = Math.min(3, days.length);
        for(let i=0; i<checkLimit; i++) {
            if(days[i] && days[i].dirtyReasons) {
                days[i].dirtyReasons.forEach(r => foundReasons.add(r));
            }
        }

        // Fallback to checking all days if the first 3 days were somehow skipped
        if(foundReasons.size === 0) {
            for(let i=0; i<days.length; i++) {
                if(days[i] && days[i].dirtyReasons) {
                    days[i].dirtyReasons.forEach(r => foundReasons.add(r));
                }
            }
        }

        if (foundReasons.size > 0) {
            let translatedReasons = Array.from(foundReasons).map(r => t('reason_' + r));
            let reasonsString = translatedReasons.join(', ');
            verdictReason.innerText = t('dynamicWaitReason', { reasons: reasonsString });
        } else {
            verdictReason.innerText = t('waitReason');
        }

        targetDateText.innerText = t('checkBackLater');
    } else {
        const recommendedDay = days[bestDayIndex];
        currentRecommendedDate = recommendedDay.dateObj;
        currentStreakLength = streakLength + 1;
        if (addToCalendarBtn) addToCalendarBtn.classList.remove('hidden');
        if (calendarHelpText) calendarHelpText.classList.remove('hidden');

        verdictCard.classList.add('verdict-recommend-bg', 'text-white');
        targetDateText.innerText = recommendedDay.dayName + ", " + recommendedDay.dateFormatted;

        if (streakLength > 0) {
            streakBadge.classList.remove('hidden');
            streakNumber.innerText = streakLength + 1;
        }

        if (bestDayIndex === 0) {
            verdictTitle.innerText = t('washToday');
            verdictReason.innerText = streakLength > 0 ? t('washTodayStreak', { streak: streakLength }) : t('washTodayNoStreak');
        } else if (bestDayIndex === 1) {
            verdictTitle.innerText = t('washTomorrow');
            verdictReason.innerText = t('washTomorrowReason');
        } else {
            verdictTitle.innerText = t('waitUntil', { day: recommendedDay.dayName });
            verdictReason.innerText = t('waitUnsettled', { day: recommendedDay.dayName });
        }
    }

    forecastContainer.innerHTML = '';

    days.forEach((day, idx) => {
        const isRecommended = idx === bestDayIndex;

        const cardClasses = isRecommended
            ? "bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-4 border-brand-500 relative flex items-center justify-between gap-3 transform hover:scale-[1.01] transition-transform"
            : "p-3 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors text-slate-500 dark:text-slate-400";

        const titleColor = isRecommended ? "text-slate-900 dark:text-white font-bold" : "font-medium text-slate-700 dark:text-slate-300";

        let iconContainer = "";
        if (day.isDirty) {
            iconContainer = "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400";
        } else {
            iconContainer = "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400";
        }

        const badgeHtml = isRecommended
            ? `<div class="absolute -top-2.5 right-4 bg-brand-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">${t('bestDayBadge')}</div>`
            : '';

        const cardHtml = `
            <div class="${cardClasses}">
                ${badgeHtml}
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconContainer}">
                        <i data-lucide="${day.icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="${titleColor} leading-tight">${day.dayName}</span>
                        <span class="text-[11px] font-medium opacity-80">${day.dateFormatted} &middot; ${day.desc}</span>
                    </div>
                </div>

                <div class="flex flex-col items-end shrink-0 gap-1">
                    <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1" dir="ltr">
                        ${day.maxTemp}° <span class="text-slate-400 font-medium text-xs">${day.minTemp}°</span>
                    </div>
                    <div class="flex items-center justify-end gap-2 text-[11px] font-bold w-full">
                        <span class="${(washCriteria.highPrecip && day.precipProb > day.precipLimit) ? 'text-accent-500 font-bold' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="Precipitation">
                            <i data-lucide="droplets" class="w-3 h-3"></i> ${day.precipProb}%
                        </span>
                        <span class="${(washCriteria.highUV && day.uvIndex > day.uvLimit) ? 'text-purple-500 dark:text-purple-400 font-bold' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="UV Index">
                            <i data-lucide="sun-dim" class="w-3 h-3"></i> ${day.uvIndex}
                        </span>
                        <span class="${(washCriteria.highWind && day.windSpeed > day.windLimit) ? 'text-slate-600 dark:text-slate-300 font-bold' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="Wind">
                            <i data-lucide="wind" class="w-3 h-3"></i> ${day.windSpeed}<span class="text-[9px] font-medium uppercase opacity-80">km/h</span>
                        </span>
                    </div>
                </div>
            </div>
        `;

        forecastContainer.insertAdjacentHTML('beforeend', cardHtml);
    });

    lucide.createIcons({ nameAttr: 'data-lucide' });
}

function downloadIcsFile() {
    if (!currentRecommendedDate) return;

    const yyyy = currentRecommendedDate.getFullYear();
    const mm = String(currentRecommendedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentRecommendedDate.getDate()).padStart(2, '0');
    const dateStart = `${yyyy}${mm}${dd}`;

    const nextDay = new Date(currentRecommendedDate);
    nextDay.setDate(currentRecommendedDate.getDate() + 1);
    const nextYyyy = nextDay.getFullYear();
    const nextMm = String(nextDay.getMonth() + 1).padStart(2, '0');
    const nextDd = String(nextDay.getDate()).padStart(2, '0');
    const dateEnd = `${nextYyyy}${nextMm}${nextDd}`;

    const now = new Date();
    const nowYyyy = now.getUTCFullYear();
    const nowMm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const nowDd = String(now.getUTCDate()).padStart(2, '0');
    const nowHh = String(now.getUTCHours()).padStart(2, '0');
    const nowMin = String(now.getUTCMinutes()).padStart(2, '0');
    const nowSec = String(now.getUTCSeconds()).padStart(2, '0');
    const timestamp = `${nowYyyy}${nowMm}${nowDd}T${nowHh}${nowMin}${nowSec}Z`;

    const loc = locationName ? locationName.innerText : 'My Location';
    const summary = t('calendarSummary');
    const desc = t('calendarDesc', { location: loc, streak: currentStreakLength });

    const summaryEscaped = summary.replace(/[\\,;]/g, '\\$&');
    const descEscaped = desc.replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');

    const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Antigravity//CarWashPlanner//EN',
        'BEGIN:VEVENT',
        `UID:carwash-${timestamp}@carwash.planner`,
        `DTSTAMP:${timestamp}`,
        `DTSTART;VALUE=DATE:${dateStart}`,
        `DTEND;VALUE=DATE:${dateEnd}`,
        `SUMMARY:${summaryEscaped}`,
        `DESCRIPTION:${descEscaped}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ];

    const icsContent = icsLines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `car_wash_${dateStart}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function getBezierPath(points) {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

function drawTrendsChart(days) {
    const svg = document.getElementById('trends-svg');
    if (!svg) return;

    const gridGroup = document.getElementById('chart-grids');
    const fillPrecipPath = document.getElementById('chart-fill-precip');
    const pathPrecip = document.getElementById('chart-path-precip');
    const pathWind = document.getElementById('chart-path-wind');
    const pointsPrecipGroup = document.getElementById('chart-points-precip');
    const pointsWindGroup = document.getElementById('chart-points-wind');
    const labelsXGroup = document.getElementById('chart-labels-x');

    if (!gridGroup || !fillPrecipPath || !pathPrecip || !pathWind || !pointsPrecipGroup || !pointsWindGroup || !labelsXGroup) {
        return;
    }

    gridGroup.innerHTML = '';
    pointsPrecipGroup.innerHTML = '';
    pointsWindGroup.innerHTML = '';
    labelsXGroup.innerHTML = '';

    const width = 700;
    const height = 220;
    const margin = { top: 30, right: 45, bottom: 40, left: 45 };
    const effWidth = width - margin.left - margin.right;
    const effHeight = height - margin.top - margin.bottom;

    const N = days.length;
    if (N === 0) return;

    const windSpeeds = days.map(d => d.windSpeed);
    const maxWindVal = Math.max(40, ...windSpeeds);

    for (let k = 0; k <= 4; k++) {
        const pct = k / 4;
        const y = margin.top + effHeight - pct * effHeight;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', margin.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', width - margin.right);
        line.setAttribute('y2', y);
        line.setAttribute('class', 'stroke-slate-100 dark:stroke-slate-800/80');
        line.setAttribute('stroke-width', '1');
        if (k > 0 && k < 4) {
            line.setAttribute('stroke-dasharray', '4 4');
        }
        gridGroup.appendChild(line);

        const textPrecip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textPrecip.setAttribute('x', margin.left - 10);
        textPrecip.setAttribute('y', y + 3);
        textPrecip.setAttribute('text-anchor', 'end');
        textPrecip.setAttribute('class', 'fill-slate-400 dark:fill-slate-500 font-bold text-[9px]');
        textPrecip.textContent = `${Math.round(pct * 100)}%`;
        gridGroup.appendChild(textPrecip);

        const textWind = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textWind.setAttribute('x', width - margin.right + 10);
        textWind.setAttribute('y', y + 3);
        textWind.setAttribute('text-anchor', 'start');
        textWind.setAttribute('class', 'fill-slate-400 dark:fill-slate-500 font-bold text-[9px]');
        textWind.textContent = Math.round(pct * maxWindVal);
        gridGroup.appendChild(textWind);
    }

    const precipPoints = [];
    const windPoints = [];

    for (let i = 0; i < N; i++) {
        const x = margin.left + (i / (N - 1)) * effWidth;
        const yPrecip = margin.top + effHeight - (days[i].precipProb / 100) * effHeight;
        const yWind = margin.top + effHeight - (days[i].windSpeed / maxWindVal) * effHeight;

        precipPoints.push({ x, y: yPrecip, val: days[i].precipProb });
        windPoints.push({ x, y: yWind, val: days[i].windSpeed });

        const textX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textX.setAttribute('x', x);
        textX.setAttribute('y', height - 12);
        textX.setAttribute('text-anchor', 'middle');
        textX.setAttribute('class', 'fill-slate-400 dark:fill-slate-500 text-[10px] font-bold uppercase tracking-wider');
        textX.textContent = days[i].dayName;
        labelsXGroup.appendChild(textX);
    }

    const dPrecip = getBezierPath(precipPoints);
    const dWind = getBezierPath(windPoints);

    pathPrecip.setAttribute('d', dPrecip);
    pathPrecip.setAttribute('class', 'stroke-blue-500 dark:stroke-blue-400 stroke-2 fill-none');

    pathWind.setAttribute('d', dWind);
    pathWind.setAttribute('class', 'stroke-teal-500 dark:stroke-teal-400 stroke-2 fill-none');

    if (precipPoints.length > 0) {
        const dFill = dPrecip + ` L ${precipPoints[N - 1].x} ${margin.top + effHeight} L ${precipPoints[0].x} ${margin.top + effHeight} Z`;
        fillPrecipPath.setAttribute('d', dFill);
        fillPrecipPath.setAttribute('class', 'chart-fill-precip');
        fillPrecipPath.setAttribute('fill', 'url(#precip-gradient)');
        fillPrecipPath.setAttribute('stroke', 'none');
    }

    for (let i = 0; i < N; i++) {
        const pP = precipPoints[i];
        const pW = windPoints[i];

        const circP = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circP.setAttribute('cx', pP.x);
        circP.setAttribute('cy', pP.y);
        circP.setAttribute('r', '4');
        circP.setAttribute('class', 'fill-blue-500 dark:fill-blue-400 stroke-white dark:stroke-slate-900 stroke-2');
        pointsPrecipGroup.appendChild(circP);

        const textValP = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textValP.setAttribute('x', pP.x);
        let yTextP = pP.y - 8;
        if (yTextP < margin.top + 15) {
            yTextP = pP.y + 15;
        }
        textValP.setAttribute('y', yTextP);
        textValP.setAttribute('text-anchor', 'middle');
        textValP.setAttribute('class', 'fill-blue-500 dark:fill-blue-400 font-bold text-[9px]');
        textValP.textContent = `${pP.val}%`;
        pointsPrecipGroup.appendChild(textValP);

        const circW = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circW.setAttribute('cx', pW.x);
        circW.setAttribute('cy', pW.y);
        circW.setAttribute('r', '4');
        circW.setAttribute('class', 'fill-teal-500 dark:fill-teal-400 stroke-white dark:stroke-slate-900 stroke-2');
        pointsWindGroup.appendChild(circW);

        const textValW = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textValW.setAttribute('x', pW.x);
        let yTextW = pW.y - 8;
        if (Math.abs(yTextW - yTextP) < 12 && Math.abs(pW.y - pP.y) < 25) {
            yTextW = Math.max(pW.y, pP.y) + 15;
        }
        if (yTextW < margin.top + 15) {
            yTextW = pW.y + 15;
        }
        textValW.setAttribute('y', yTextW);
        textValW.setAttribute('text-anchor', 'middle');
        textValW.setAttribute('class', 'fill-teal-500 dark:fill-teal-400 font-bold text-[9px]');
        textValW.textContent = pW.val;
        pointsWindGroup.appendChild(textValW);
    }
}

function updateVehicleProfileUI(tempColor, tempCoating) {
    const colorBtns = {
        'light': document.getElementById('color-light-btn'),
        'dark': document.getElementById('color-dark-btn')
    };
    const coatBtns = {
        'regular': document.getElementById('coat-regular-btn'),
        'wax': document.getElementById('coat-wax-btn'),
        'ceramic': document.getElementById('coat-ceramic-btn')
    };

    for (let [c, btn] of Object.entries(colorBtns)) {
        if (!btn) continue;
        if (c === tempColor) {
            btn.className = "flex-1 border border-brand-500 dark:border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 rounded-xl py-2 px-3 text-xs font-bold text-brand-600 dark:text-brand-400 transition-all flex items-center justify-center gap-2 shadow-sm";
        } else {
            btn.className = "flex-1 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm";
        }
    }

    for (let [c, btn] of Object.entries(coatBtns)) {
        if (!btn) continue;
        if (c === tempCoating) {
            btn.className = "flex-1 border border-brand-500 dark:border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 rounded-xl py-2 px-3 text-xs font-bold text-brand-600 dark:text-brand-400 transition-all shadow-sm";
        } else {
            btn.className = "flex-1 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm";
        }
    }

    const explanationEl = document.getElementById('coating-explanation');
    const bonusBadgeEl = document.getElementById('coating-bonus-badge');

    const benefits = [];
    if (tempColor === 'dark') {
        benefits.push(t('benefitDark'));
    }
    if (tempCoating === 'wax') {
        benefits.push(t('benefitWax'));
    } else if (tempCoating === 'ceramic') {
        benefits.push(t('benefitCeramic'));
    }

    if (benefits.length > 0) {
        if (bonusBadgeEl) bonusBadgeEl.classList.remove('hidden');
        if (explanationEl) {
            explanationEl.innerText = t('coatingExplanationBonus', { benefits: benefits.join(' | ') });
        }
    } else {
        if (bonusBadgeEl) bonusBadgeEl.classList.add('hidden');
        if (explanationEl) {
            explanationEl.innerText = t('coatingExplanationDefault');
        }
    }
}

function initVehicleProfile() {
    const vehicleProfileBtn = document.getElementById('vehicle-profile-btn');
    const vehicleProfileModal = document.getElementById('vehicle-profile-modal');
    const closeVehicleModalBtn = document.getElementById('close-vehicle-modal-btn');
    const saveVehicleBtn = document.getElementById('save-vehicle-btn');

    let tempColor = vehicleColor;
    let tempCoating = vehicleCoating;

    if (vehicleProfileBtn) {
        vehicleProfileBtn.addEventListener('click', () => {
            tempColor = vehicleColor;
            tempCoating = vehicleCoating;
            updateVehicleProfileUI(tempColor, tempCoating);
            if (vehicleProfileModal) {
                vehicleProfileModal.classList.remove('hidden');
            }
            history.pushState({ modalOpen: true }, '', '');
        });
    }

    if (closeVehicleModalBtn) {
        closeVehicleModalBtn.addEventListener('click', () => {
            if (vehicleProfileModal) {
                vehicleProfileModal.classList.add('hidden');
            }
            if (history.state && history.state.modalOpen) history.back();
        });
    }

    if (vehicleProfileModal) {
        vehicleProfileModal.addEventListener('click', (e) => {
            if (e.target === vehicleProfileModal) {
                vehicleProfileModal.classList.add('hidden');
                if (history.state && history.state.modalOpen) history.back();
            }
        });
    }

    const colorLightBtn = document.getElementById('color-light-btn');
    const colorDarkBtn = document.getElementById('color-dark-btn');
    if (colorLightBtn) {
        colorLightBtn.addEventListener('click', () => {
            tempColor = 'light';
            updateVehicleProfileUI(tempColor, tempCoating);
        });
    }
    if (colorDarkBtn) {
        colorDarkBtn.addEventListener('click', () => {
            tempColor = 'dark';
            updateVehicleProfileUI(tempColor, tempCoating);
        });
    }

    const coatRegularBtn = document.getElementById('coat-regular-btn');
    const coatWaxBtn = document.getElementById('coat-wax-btn');
    const coatCeramicBtn = document.getElementById('coat-ceramic-btn');

    if (coatRegularBtn) {
        coatRegularBtn.addEventListener('click', () => {
            tempCoating = 'regular';
            updateVehicleProfileUI(tempColor, tempCoating);
        });
    }
    if (coatWaxBtn) {
        coatWaxBtn.addEventListener('click', () => {
            tempCoating = 'wax';
            updateVehicleProfileUI(tempColor, tempCoating);
        });
    }
    if (coatCeramicBtn) {
        coatCeramicBtn.addEventListener('click', () => {
            tempCoating = 'ceramic';
            updateVehicleProfileUI(tempColor, tempCoating);
        });
    }

    if (saveVehicleBtn) {
        saveVehicleBtn.addEventListener('click', () => {
            vehicleColor = tempColor;
            vehicleCoating = tempCoating;
            localStorage.setItem('vehicleColor', vehicleColor);
            localStorage.setItem('vehicleCoating', vehicleCoating);

            if (vehicleProfileModal) {
                vehicleProfileModal.classList.add('hidden');
            }
            if (history.state && history.state.modalOpen) history.back();

            saveCriteria();
        });
    }

    updateVehicleProfileUI(vehicleColor, vehicleCoating);
}

lucide.createIcons();
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', downloadIcsFile);
    }
});

// PWA & Notification features implementation
const pwaModal = document.getElementById('pwa-settings-modal');
const pwaBtn = document.getElementById('pwa-settings-btn');
const closePwaBtn = document.getElementById('close-pwa-modal-btn');
const pwaCloseBtnBtn = document.getElementById('pwa-close-btn');
const pwaGrantBtn = document.getElementById('pwa-grant-btn');
const pwaTestBtn = document.getElementById('pwa-test-btn');
const pwaNotificationStatus = document.getElementById('pwa-notification-status');
const pwaConnectionText = document.getElementById('pwa-connection-text');
const pwaConnectionBadge = document.getElementById('pwa-connection-badge');
const pwaBgSyncBadge = document.getElementById('pwa-bg-sync-badge');
const pwaPeriodicSyncBadge = document.getElementById('pwa-periodic-sync-badge');

let swRegistration = null;

// Track online/offline status
function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    if (pwaConnectionText && pwaConnectionBadge) {
        if (isOnline) {
            pwaConnectionText.innerText = "Online";
            pwaConnectionBadge.className = "text-[9px] font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1";
            pwaConnectionBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span> Online`;
        } else {
            pwaConnectionText.innerText = "Offline";
            pwaConnectionBadge.className = "text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1";
            pwaConnectionBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Offline`;
        }
    }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Check support for background APIs
function checkPwaApiSupport() {
    if (pwaBgSyncBadge) {
        if ('SyncManager' in window) {
            pwaBgSyncBadge.innerText = "Supported";
            pwaBgSyncBadge.className = "font-bold text-green-600 dark:text-green-400";
        } else {
            pwaBgSyncBadge.innerText = "Not Supported";
            pwaBgSyncBadge.className = "font-bold text-slate-400 dark:text-slate-500";
        }
    }
    if (pwaPeriodicSyncBadge) {
        if (swRegistration && 'periodicSync' in swRegistration) {
            pwaPeriodicSyncBadge.innerText = "Supported";
            pwaPeriodicSyncBadge.className = "font-bold text-green-600 dark:text-green-400";
        } else {
            pwaPeriodicSyncBadge.innerText = "Not Supported";
            pwaPeriodicSyncBadge.className = "font-bold text-slate-400 dark:text-slate-500";
        }
    }
}

// Update Notification UI based on current permission status
function updateNotificationUI() {
    if (!('Notification' in window)) {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = "Not supported in this browser";
        if (pwaGrantBtn) pwaGrantBtn.classList.add('hidden');
        return;
    }

    if (Notification.permission === 'granted') {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = "Notifications Enabled";
        if (pwaGrantBtn) pwaGrantBtn.classList.add('hidden');
        if (pwaTestBtn) pwaTestBtn.removeAttribute('disabled');
    } else if (Notification.permission === 'denied') {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = "Notifications Blocked";
        if (pwaGrantBtn) {
            pwaGrantBtn.classList.remove('hidden');
            pwaGrantBtn.innerText = "Blocked";
            pwaGrantBtn.disabled = true;
        }
        if (pwaTestBtn) pwaTestBtn.setAttribute('disabled', 'true');
    } else {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = "Permission required";
        if (pwaGrantBtn) {
            pwaGrantBtn.classList.remove('hidden');
            pwaGrantBtn.innerText = "Enable";
            pwaGrantBtn.disabled = false;
        }
        if (pwaTestBtn) pwaTestBtn.setAttribute('disabled', 'true');
    }
}

// Register Periodic Sync
async function registerPeriodicSync() {
    if (swRegistration && 'periodicSync' in swRegistration) {
        try {
            const status = await navigator.permissions.query({
                name: 'periodic-background-sync',
            });
            if (status.state === 'granted') {
                await swRegistration.periodicSync.register('fetch-weather', {
                    minInterval: 24 * 60 * 60 * 1000, // 24 hours
                });
                console.log('Periodic sync registered successfully');
            }
        } catch (error) {
            console.warn('Periodic sync could not be registered:', error);
        }
    }
}

// Register Background Sync
async function registerBackgroundSync() {
    if (swRegistration && 'sync' in swRegistration) {
        try {
            await swRegistration.sync.register('sync-weather');
            console.log('Background sync registered successfully');
        } catch (error) {
            console.warn('Background sync registration failed:', error);
        }
    }
}

// Listeners for PWA settings modal
if (pwaBtn) {
    pwaBtn.addEventListener('click', () => {
        if (pwaModal) {
            pwaModal.classList.remove('hidden');
        }
        updateOnlineStatus();
        updateNotificationUI();
        checkPwaApiSupport();
        history.pushState({ modalOpen: true }, '', '');
    });
}

function closePwaModal() {
    if (pwaModal) {
        pwaModal.classList.add('hidden');
    }
}

if (closePwaBtn) closePwaBtn.addEventListener('click', () => {
    closePwaModal();
    if (history.state && history.state.modalOpen) history.back();
});
if (pwaCloseBtnBtn) pwaCloseBtnBtn.addEventListener('click', () => {
    closePwaModal();
    if (history.state && history.state.modalOpen) history.back();
});
if (pwaModal) {
    pwaModal.addEventListener('click', (e) => {
        if (e.target === pwaModal) {
            closePwaModal();
            if (history.state && history.state.modalOpen) history.back();
        }
    });
}
window.addEventListener('popstate', () => {
    if (pwaModal) pwaModal.classList.add('hidden');
});

// Grant Permission Handler
if (pwaGrantBtn) {
    pwaGrantBtn.addEventListener('click', () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                updateNotificationUI();
                if (permission === 'granted') {
                    registerPeriodicSync();
                }
            });
        }
    });
}

// Test Notification button
if (pwaTestBtn) {
    pwaTestBtn.addEventListener('click', () => {
        if (swRegistration && Notification.permission === 'granted') {
            swRegistration.showNotification('Car Wash Planner', {
                body: 'This is a test notification from your app. Service Workers are working perfectly!',
                icon: './icon_192.png',
                badge: './icon.svg',
                tag: 'test-notification'
            });
        }
    });
}

// Register service worker for offline support / Progressive Web App capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Service Worker registered successfully on scope:', reg.scope);
                swRegistration = reg;
                
                // Check API support and notify UI
                checkPwaApiSupport();
                updateNotificationUI();
                
                // Attempt to register periodic background sync
                registerPeriodicSync();
                
                // Register background sync on connection changes
                window.addEventListener('online', () => {
                    registerBackgroundSync();
                });
            })
            .catch(err => {
                console.error('Service Worker registration failed:', err);
            });
    });
}