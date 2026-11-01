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

// Threshold default settings
let washCriteriaThresholds = {
    highWind: 15,
    freezing: 0
};

let washCriteria = {
    daytimeFocus: false
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
        if (key.includes('Wind')) {
            params = { val: washCriteriaThresholds.highWind };
        } else if (key.includes('Freezing')) {
            params = { val: washCriteriaThresholds.freezing, val_f: Math.round(washCriteriaThresholds.freezing * 9/5 + 32) };
        }
        el.innerText = t(key, params);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });
    const locationInputEl = document.getElementById('location-input');
    if (locationInputEl) {
        locationInputEl.placeholder = t('enterCityPlaceholder');
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

    const isRtl = lang === 'fa';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    const localeMap = {
        'en': 'en-US',
        'fa': 'fa-IR'
    };
    document.documentElement.dataset.locale = localeMap[lang];

    document.querySelectorAll('.lang-selector').forEach(el => el.value = lang);
    updateStaticTexts();
    updateAgendaDate();
    if (typeof updateOnlineStatus === 'function') updateOnlineStatus();
    if (typeof checkPwaApiSupport === 'function') checkPwaApiSupport();
    if (typeof updateNotificationUI === 'function') updateNotificationUI();

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
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && mediaQuery.matches);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    if (!initTheme.listenerAttached && mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
            if (!('theme' in localStorage)) {
                if (e.matches) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
            }
        });
        initTheme.listenerAttached = true;
    }
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
    const inputWind = document.getElementById('input-wind');
    const inputFreezing = document.getElementById('input-freezing');

    if (inputWind) inputWind.value = washCriteriaThresholds.highWind;
    if (inputFreezing) inputFreezing.value = washCriteriaThresholds.freezing;

    updateSliderBubbles();
}

function updateSliderBubbles() {
    const inputWind = document.getElementById('input-wind');
    const inputFreezing = document.getElementById('input-freezing');

    const sliderWindVal = document.getElementById('slider-wind-val');
    const sliderFreezingVal = document.getElementById('slider-freezing-val');

    if (sliderWindVal) sliderWindVal.innerText = `${inputWind ? inputWind.value : washCriteriaThresholds.highWind} km/h`;
    if (sliderFreezingVal) sliderFreezingVal.innerText = `${inputFreezing ? inputFreezing.value : washCriteriaThresholds.freezing}°C`;
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
            const parsed = JSON.parse(savedThresholds);
            if (parsed.highWind !== undefined) washCriteriaThresholds.highWind = parsed.highWind;
            if (parsed.freezing !== undefined) washCriteriaThresholds.freezing = parsed.freezing;
        } catch (e) {}
    }

    const daytimeFocusToggle = document.getElementById('toggle-daytime-focus');
    if (daytimeFocusToggle) daytimeFocusToggle.checked = !!washCriteria.daytimeFocus;

    // Wire up sliders and thresholds settings modal controls
    const criteriaSettingsModal = document.getElementById('criteria-settings-modal');
    const openCriteriaSettingsCard = document.getElementById('open-criteria-settings-card');
    const criteriaSettingsBtn = document.getElementById('criteria-settings-btn');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');

    const inputWind = document.getElementById('input-wind');
    const inputFreezing = document.getElementById('input-freezing');

    updateSlidersUI();

    if (inputWind) inputWind.addEventListener('input', updateSliderBubbles);
    if (inputFreezing) inputFreezing.addEventListener('input', updateSliderBubbles);

    const openSettingsModal = () => {
        updateSlidersUI();
        if (daytimeFocusToggle) daytimeFocusToggle.checked = !!washCriteria.daytimeFocus;
        if (criteriaSettingsModal) {
            criteriaSettingsModal.classList.remove('hidden');
        }
        history.pushState({ modalOpen: true }, '', '');
    };

    if (openCriteriaSettingsCard) {
        openCriteriaSettingsCard.addEventListener('click', openSettingsModal);
    }
    if (criteriaSettingsBtn) {
        criteriaSettingsBtn.addEventListener('click', openSettingsModal);
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
                highWind: 15,
                freezing: 0
            };
            washCriteria.daytimeFocus = false;
            if (daytimeFocusToggle) daytimeFocusToggle.checked = false;

            updateSlidersUI();
            localStorage.setItem('washCriteriaThresholds', JSON.stringify(washCriteriaThresholds));
            localStorage.setItem('washCriteria', JSON.stringify(washCriteria));
            if (criteriaSettingsModal) {
                criteriaSettingsModal.classList.add('hidden');
            }
            if (history.state && history.state.modalOpen) history.back();

            updateStaticTexts();
            saveCriteria();
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            washCriteriaThresholds.highWind = parseInt(inputWind ? inputWind.value : 15);
            washCriteriaThresholds.freezing = parseInt(inputFreezing ? inputFreezing.value : 0);
            washCriteria.daytimeFocus = !!(daytimeFocusToggle && daytimeFocusToggle.checked);

            localStorage.setItem('washCriteriaThresholds', JSON.stringify(washCriteriaThresholds));
            localStorage.setItem('washCriteria', JSON.stringify(washCriteria));
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

// Modal scroll locking and containment
function updateModalScrollLock() {
    const hasOpenModal = Array.from(document.querySelectorAll('.fixed-modal-center')).some(
        modal => !modal.classList.contains('hidden')
    );
    if (hasOpenModal) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }
}

function initModalScrollLock() {
    const modals = document.querySelectorAll('.fixed-modal-center');
    if (!modals.length) return;

    const observer = new MutationObserver(() => {
        updateModalScrollLock();
    });

    modals.forEach(modal => {
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
        modal.addEventListener('wheel', (e) => {
            if (e.target === modal) {
                e.preventDefault();
            }
        }, { passive: false });
        modal.addEventListener('touchmove', (e) => {
            if (e.target === modal) {
                e.preventDefault();
            }
        }, { passive: false });
    });

    updateModalScrollLock();
}

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
    const pwaSettingsModal = document.getElementById('pwa-settings-modal');
    if (pwaSettingsModal) pwaSettingsModal.classList.add('hidden');
    updateModalScrollLock();
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
    initModalScrollLock();

    const urlParams = new URLSearchParams(window.location.search);

    const langParam = urlParams.get('lang');
    const validLangs = ['en', 'fa'];
    const savedLang = localStorage.getItem('appLang');
    if (langParam && validLangs.includes(langParam)) {
        currentLang = langParam;
    } else if (savedLang && validLangs.includes(savedLang)) {
        currentLang = savedLang;
    } else {
        const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        currentLang = browserLang.startsWith('fa') ? 'fa' : 'en';
    }

    showSkeleton();

    loadLanguageFile(currentLang, () => {
        setLanguage(currentLang);

        const urlLat = urlParams.get('lat');
        const urlLon = urlParams.get('lon');
        const urlName = urlParams.get('locName');

        if (urlLat && urlLon && urlName) {
            let decodedName = urlName;
            try {
                decodedName = decodeURIComponent(urlName);
                if (decodedName.includes('%')) {
                    decodedName = decodeURIComponent(decodedName);
                }
            } catch (e) {
                decodedName = urlName;
            }
            saveAndFetchLocation(parseFloat(urlLat), parseFloat(urlLon), decodedName);
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

        // First-time visitors: default based on language instead of asking for geolocation
        const defaultLoc = currentLang === 'fa'
            ? { lat: 35.69439, lon: 51.42151, name: 'Tehran, Tehran' }
            : { lat: 40.71427, lon: -74.00597, name: 'New York, New York' };

        saveAndFetchLocation(defaultLoc.lat, defaultLoc.lon, defaultLoc.name);
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

    const defaultLoc = currentLang === 'fa'
        ? { lat: 35.69439, lon: 51.42151, name: 'Tehran, Tehran' }
        : { lat: 40.71427, lon: -74.00597, name: 'New York, New York' };

    locationName.innerText = defaultLoc.name;
    currentLat = defaultLoc.lat;
    currentLon = defaultLoc.lon;
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
        const dailyParams = 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max';
        const hourlyParams = 'precipitation_probability,precipitation,wind_gusts_10m,weather_code';
        const currentParams = 'temperature_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m';
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&models=ecmwf_ifs025&daily=${dailyParams}&hourly=${hourlyParams}&current=${currentParams}&timezone=auto&forecast_days=10`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Weather data request failed.");

        const data = await response.json();
        currentWeatherData = data;
        processData(currentWeatherData);

    } catch (error) {
        hideSkeleton();
        verdictCard.classList.remove('bg-brand-700', 'bg-accent-400', 'text-slate-900', 'text-white', 'verdict-recommend-bg', 'verdict-wait-bg');
        verdictCard.classList.add('verdict-error-bg', 'text-white');
        verdictTitle.innerText = t('errorConnecting');
        verdictReason.innerText = t('checkBackLater');
        targetDateText.innerText = t('pending');
        const verdictScoreBadge = document.getElementById('verdict-score-badge');
        if (verdictScoreBadge) verdictScoreBadge.classList.add('hidden');
    }
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

const POP_DISQUALIFY_THRESHOLD = 30;

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

function processData(weatherData) {
    if (!weatherData) return;
    const daily = weatherData.daily || weatherData;
    const hourly = weatherData.hourly || null;
    const current = weatherData.current || null;
    const daysData = [];
    const today = new Date();
    const localeString = document.documentElement.dataset.locale || 'en-US';
    const dailyCodes = daily.weather_code || daily.weathercode || [];
    const numDays = dailyCodes.length;

    for (let i = 0; i < numDays; i++) {
        let code = dailyCodes[i];
        let weatherInfo = weatherCodes[code] || { icon: 'help-circle', badForWash: false };

        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() + i);

        const localWeekday = dateObj.toLocaleDateString(localeString, { weekday: 'short' });
        const localDate = dateObj.toLocaleDateString(localeString, { month: 'short', day: 'numeric' });
        const dayName = i === 0 ? t('todayStr') : i === 1 ? t('tomorrowStr') : localWeekday;

        const activeWindLimit = washCriteriaThresholds.highWind;

        const metrics = extractDayMetrics(daily, hourly, i);
        let badForWash = weatherInfo.badForWash || metrics.badForWashHourly;

        if (metrics.badForWashHourly && metrics.representativeCode !== null) {
            code = metrics.representativeCode;
            weatherInfo = weatherCodes[code] || weatherInfo;
        }

        let isActiveRainToday = false;
        if (i === 0 && current) {
            const currentPrecip = current.precipitation || 0;
            const currentCode = current.weather_code !== undefined ? current.weather_code : current.weathercode;
            const currentBad = currentCode !== undefined && weatherCodes[currentCode] ? weatherCodes[currentCode].badForWash : false;

            if (currentPrecip > 0 || currentBad) {
                badForWash = true;
                isActiveRainToday = true;
                if (currentCode !== undefined && weatherCodes[currentCode]) {
                    code = currentCode;
                    weatherInfo = weatherCodes[currentCode];
                }
            }
        }

        const descriptionStr = translations[currentLang]?.weather?.[code] || translations['en']?.weather?.[code] || 'Unknown';

        const scored = calculateWashScore({
            precipProb: metrics.precipProb,
            precipSum: metrics.precipSum,
            windSpeed: metrics.windSpeed,
            windGust: metrics.windGust,
            badForWash: badForWash,
            activeRain: isActiveRainToday,
            minTemp: daily.temperature_2m_min[i],
            maxTemp: daily.temperature_2m_max[i],
            windLimit: activeWindLimit,
            freezingLimit: washCriteriaThresholds.freezing
        });

        daysData.push({
            index: i,
            dayName: dayName,
            dateFormatted: localDate,
            maxTemp: Math.round(daily.temperature_2m_max[i]),
            minTemp: Math.round(daily.temperature_2m_min[i]),
            precipProb: metrics.precipProb,
            precipSum: metrics.precipSum,
            windSpeed: metrics.windSpeed,
            windGust: metrics.windGust,
            desc: descriptionStr,
            icon: weatherInfo.icon,
            score: scored.score,
            tier: scored.tier,
            isDirty: scored.isDirty,
            dirtyReasons: scored.dirtyReasons,
            dateObj: dateObj,
            windLimit: activeWindLimit
        });
    }

    analyzeBestWashDay(daysData);
    drawTrendsChart(daysData);
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

    renderDashboard(days, bestDayIndex, streakLength);
}

function getTierBadgeClasses(tier) {
    switch (tier) {
        case 'ideal':
            return {
                badge: 'bg-emerald-500 text-white',
                icon: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
            };
        case 'good':
            return {
                badge: 'bg-teal-500 text-white',
                icon: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400'
            };
        case 'fair':
            return {
                badge: 'bg-amber-500 text-white',
                icon: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
            };
        default:
            return {
                badge: 'bg-rose-500 text-white',
                icon: 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400'
            };
    }
}

function renderDashboard(days, bestDayIndex, streakLength) {
    hideSkeleton();
    streakBadge.classList.add('hidden');

    verdictCard.classList.remove('bg-brand-700', 'bg-accent-400', 'bg-red-500', 'text-white', 'text-slate-900', 'verdict-recommend-bg', 'verdict-wait-bg', 'verdict-error-bg');

    const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
    const calendarHelpText = document.getElementById('calendar-help-text');
    const verdictScoreBadge = document.getElementById('verdict-score-badge');

    if (bestDayIndex === -1) {
        currentRecommendedDate = null;
        currentStreakLength = 0;
        if (addToCalendarBtn) addToCalendarBtn.classList.add('hidden');
        if (calendarHelpText) calendarHelpText.classList.add('hidden');

        verdictCard.classList.add('verdict-wait-bg', 'text-slate-900');
        verdictTitle.innerText = t('waitItOut');

        if (verdictScoreBadge) {
            const topScore = days[0] ? days[0].score : 0;
            const topTier = days[0] ? days[0].tier : 'poor';
            const tierStr = t('score' + topTier.charAt(0).toUpperCase() + topTier.slice(1));
            verdictScoreBadge.innerText = `${topScore}% · ${tierStr}`;
            verdictScoreBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-400/30';
            verdictScoreBadge.classList.remove('hidden');
        }

        let foundReasons = new Set();
        const checkLimit = Math.min(3, days.length);
        for (let i = 0; i < checkLimit; i++) {
            if (days[i] && days[i].dirtyReasons) {
                days[i].dirtyReasons.forEach(r => foundReasons.add(r));
            }
        }
        if (foundReasons.size === 0) {
            for (let i = 0; i < days.length; i++) {
                if (days[i] && days[i].dirtyReasons) {
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
        currentStreakLength = streakLength;
        if (addToCalendarBtn) addToCalendarBtn.classList.remove('hidden');
        if (calendarHelpText) calendarHelpText.classList.remove('hidden');

        verdictCard.classList.add('verdict-recommend-bg', 'text-white');
        targetDateText.innerText = recommendedDay.dayName + ", " + recommendedDay.dateFormatted;

        if (verdictScoreBadge) {
            const tierStr = t('score' + recommendedDay.tier.charAt(0).toUpperCase() + recommendedDay.tier.slice(1));
            verdictScoreBadge.innerText = `${recommendedDay.score}% · ${tierStr}`;
            verdictScoreBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-sm';
            verdictScoreBadge.classList.remove('hidden');
        }

        if (streakLength > 0) {
            streakBadge.classList.remove('hidden');
            streakNumber.innerText = streakLength;
            const streakDaysLabel = document.getElementById('streak-days-label');
            if (streakDaysLabel) {
                streakDaysLabel.innerText = t(streakLength === 1 ? 'day' : 'days');
            }
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
        const styles = getTierBadgeClasses(day.tier);
        const tierName = t('score' + day.tier.charAt(0).toUpperCase() + day.tier.slice(1));

        const cardClasses = isRecommended
            ? "bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-4 border-brand-500 relative flex items-center justify-between gap-3 transform hover:scale-[1.01] transition-transform"
            : "p-3 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors text-slate-500 dark:text-slate-400";

        const titleColor = isRecommended ? "text-slate-900 dark:text-white font-bold" : "font-medium text-slate-700 dark:text-slate-300";

        const badgeHtml = isRecommended
            ? `<div class="absolute -top-2.5 right-4 bg-brand-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">${t('bestDayBadge')}</div>`
            : '';

        const cardHtml = `
            <div class="${cardClasses}">
                ${badgeHtml}
                <div class="flex items-center gap-3.5">
                    <div class="relative shrink-0" title="${tierName}">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center ${styles.icon}">
                            <i data-lucide="${day.icon}" class="w-5 h-5"></i>
                        </div>
                        <span class="absolute -top-1.5 ltr:-right-1.5 rtl:-left-1.5 ${styles.badge} text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-white dark:border-slate-800 cursor-help select-none leading-none" title="${tierName}">
                            ${day.score}%
                        </span>
                    </div>
                    <div class="flex flex-col">
                        <span class="${titleColor} leading-tight">${day.dayName}</span>
                        <span class="text-[11px] font-medium opacity-80">${day.dateFormatted} &middot; ${day.desc}${day.precipSum > 0 ? ` &middot; <span class="text-blue-600 dark:text-blue-400 font-semibold">${day.precipSum}mm</span>` : ''}</span>
                    </div>
                </div>

                <div class="flex flex-col items-end shrink-0 gap-1">
                    <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1" dir="ltr">
                        ${day.maxTemp}° <span class="text-slate-400 font-medium text-xs">${day.minTemp}°</span>
                    </div>
                    <div class="flex items-center justify-end gap-2 text-[11px] font-bold w-full">
                        <span class="${(day.precipProb >= 30 || day.precipSum > 0) ? 'text-accent-500 font-bold' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="Precipitation">
                            <i data-lucide="droplets" class="w-3 h-3"></i> ${day.precipProb}%
                        </span>
                        <span class="${(day.windGust > day.windLimit) ? 'text-slate-600 dark:text-slate-300 font-bold' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="Wind Gusts">
                            <i data-lucide="wind" class="w-3 h-3"></i> ${day.windGust}<span class="text-[9px] font-medium uppercase opacity-80">km/h</span>
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
        'PRODID:-//X//CarWashPlanner//EN',
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
            pwaConnectionText.innerText = t('onlineStatus');
            pwaConnectionBadge.className = "text-[9px] font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1";
            pwaConnectionBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span> ${t('onlineStatus')}`;
        } else {
            pwaConnectionText.innerText = t('offlineStatus');
            pwaConnectionBadge.className = "text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1";
            pwaConnectionBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 inline-block"></span> ${t('offlineStatus')}`;
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
            pwaBgSyncBadge.innerText = t('supportedStatus');
            pwaBgSyncBadge.className = "font-bold text-green-600 dark:text-green-400";
        } else {
            pwaBgSyncBadge.innerText = t('notSupportedStatus');
            pwaBgSyncBadge.className = "font-bold text-slate-400 dark:text-slate-500";
        }
    }
    if (pwaPeriodicSyncBadge) {
        if (swRegistration && 'periodicSync' in swRegistration) {
            pwaPeriodicSyncBadge.innerText = t('supportedStatus');
            pwaPeriodicSyncBadge.className = "font-bold text-green-600 dark:text-green-400";
        } else {
            pwaPeriodicSyncBadge.innerText = t('notSupportedStatus');
            pwaPeriodicSyncBadge.className = "font-bold text-slate-400 dark:text-slate-500";
        }
    }
}

// Update Notification UI based on current permission status
function updateNotificationUI() {
    if (!('Notification' in window)) {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = t('notSupportedBrowser');
        if (pwaGrantBtn) pwaGrantBtn.classList.add('hidden');
        if (pwaTestBtn) pwaTestBtn.setAttribute('disabled', 'true');
        return;
    }

    if (Notification.permission === 'granted') {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = t('notificationsEnabled');
        if (pwaGrantBtn) pwaGrantBtn.classList.add('hidden');
        if (pwaTestBtn) pwaTestBtn.removeAttribute('disabled');
    } else if (Notification.permission === 'denied') {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = t('notificationsBlocked');
        if (pwaGrantBtn) {
            pwaGrantBtn.classList.remove('hidden');
            pwaGrantBtn.innerText = t('blockedBtn');
            pwaGrantBtn.disabled = true;
        }
        if (pwaTestBtn) pwaTestBtn.setAttribute('disabled', 'true');
    } else {
        if (pwaNotificationStatus) pwaNotificationStatus.innerText = t('permissionRequired');
        if (pwaGrantBtn) {
            pwaGrantBtn.classList.remove('hidden');
            pwaGrantBtn.innerText = t('enableBtn');
            pwaGrantBtn.disabled = false;
        }
        if (pwaTestBtn) pwaTestBtn.removeAttribute('disabled');
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
    pwaTestBtn.addEventListener('click', async () => {
        if (!('Notification' in window)) {
            alert(t('notSupportedBrowser'));
            return;
        }

        if (Notification.permission !== 'granted') {
            try {
                const perm = await Notification.requestPermission();
                updateNotificationUI();
                if (perm !== 'granted') {
                    return;
                }
            } catch (permErr) {
                console.warn('requestPermission error:', permErr);
                return;
            }
        }

        const title = t('notificationTestTitle');
        const options = {
            body: t('notificationTestBody'),
            icon: './icon_192.png',
            badge: './icon.svg',
            tag: 'test-notification',
            renotify: true
        };

        let sent = false;

        // Try service worker registration first
        try {
            let reg = swRegistration;
            if (!reg && 'serviceWorker' in navigator) {
                reg = await Promise.race([
                    navigator.serviceWorker.ready,
                    new Promise(resolve => setTimeout(() => resolve(null), 800))
                ]);
            }
            if (reg && reg.showNotification) {
                await reg.showNotification(title, options);
                sent = true;
            }
        } catch (swErr) {
            console.warn('SW showNotification failed, trying Window Notification fallback:', swErr);
        }

        // Window Notification API fallback (for desktop or when SW registration is unavailable)
        if (!sent) {
            try {
                new Notification(title, options);
                sent = true;
            } catch (winErr) {
                console.warn('Window Notification fallback failed:', winErr);
            }
        }

        if (sent) {
            const btnSpan = document.getElementById('pwa-test-text') || pwaTestBtn.querySelector('span');
            if (btnSpan) {
                btnSpan.innerText = t('notificationSent');
                setTimeout(() => {
                    btnSpan.innerText = t('sendTestNotification');
                }, 3000);
            }
        }
    });
}

// Register service worker for offline support / Progressive Web App capabilities
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
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

        navigator.serviceWorker.ready.then(reg => {
            swRegistration = reg;
            checkPwaApiSupport();
            updateNotificationUI();
        }).catch(() => {});
    }
}

if (document.readyState === 'complete') {
    registerServiceWorker();
} else {
    window.addEventListener('load', registerServiceWorker);
}