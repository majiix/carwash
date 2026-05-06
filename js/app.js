// app.js

const translations = {
    en: {
        appTitle: "When should I wash my car?",
        locating: "Locating...",
        recommendationTitle: "The Verdict",
        waitItOut: "Nah, hold off.",
        waitReason: "Looks like rain or snow is rolling in soon. Save your cash and wait for better weather.",
        targetDateLabel: "Target Date",
        pending: "Pending",
        forecastAnalysis: "7-Day Agenda",
        findLocation: "Find City",
        enterCityPlaceholder: "Enter a city...",
        searchBtn: "Search",
        searching: "Searching...",
        useCurrentLoc: "Use my location",
        locationNotFound: "Couldn't find it. Try again.",
        errorConnecting: "Oops, connection error.",
        typeInEnglishOnly: "Location access denied. Please type city name in English.",
        defaultLocation: "New York, USA",
        checkBackLater: "Check back later",
        washToday: "Go for it today!",
        washTodayStreak: "Weather's gorgeous today! Wash it now and enjoy spotless days.",
        washTodayNoStreak: "Today's your best shot, but heads up, it might rain pretty soon after.",
        washTomorrow: "Wait 'til tomorrow.",
        washTomorrowReason: "Hold off just one more day. Tomorrow is crystal clear and looking good after.",
        waitUntil: "Wait until {day}.",
        waitUnsettled: "Things are a bit messy out there right now. Wait for {day} when it clears up.",
        bestDayBadge: "Recommended",
        todayStr: "Today",
        tomorrowStr: "Tomorrow",
        cleanDuration: "Clean For",
        days: "Days",
        activeCriteria: "Active Criteria",
        critBadWeather: "Avoid Rain & Snow",
        critBadWeatherDesc: "Skips days with active bad weather.",
        critHighPrecip: "Precipitation > 30%",
        critHighPrecipDesc: "Skips days with high chance of rain.",
        critHighWind: "Avoid High Wind",
        critHighWindDesc: "Skips days with high wind speeds (>30km/h).",
        weather: {
            0: "Clear skies", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy",
            45: "Foggy", 48: "Freezing fog", 51: "Light drizzle", 53: "Drizzling",
            55: "Heavy drizzle", 61: "Light rain", 63: "Raining", 65: "Pouring rain",
            71: "Light snow", 73: "Snowing", 75: "Heavy snow", 77: "Snow grains",
            80: "Light showers", 81: "Showers", 82: "Heavy showers",
            85: "Snow showers", 86: "Heavy snow showers", 95: "Thunderstorms",
            96: "Thunder & hail", 99: "Heavy thunder & hail"
        }
    },
    es: {
        appTitle: "¿Cuándo debo lavar mi auto?",
        locating: "Buscando...",
        recommendationTitle: "El Veredicto",
        waitItOut: "Espera un poco.",
        waitReason: "Parece que lloverá pronto. Guarda tu dinero y espera a que mejore.",
        targetDateLabel: "Fecha Ideal",
        pending: "Pendiente",
        forecastAnalysis: "Agenda 7 Días",
        findLocation: "Buscar Ciudad",
        enterCityPlaceholder: "Ingresa ciudad...",
        searchBtn: "Buscar",
        searching: "Buscando...",
        useCurrentLoc: "Usar mi ubicación",
        locationNotFound: "No encontrada. Intenta de nuevo.",
        errorConnecting: "Error de conexión.",
        typeInEnglishOnly: "Acceso a ubicación denegado. Escribe la ciudad en inglés.",
        defaultLocation: "Nueva York, EE.UU.",
        checkBackLater: "Vuelve luego",
        washToday: "¡Hazlo hoy!",
        washTodayStreak: "¡El clima está genial! Lávalo hoy y disfruta días impecables.",
        washTodayNoStreak: "Hoy es tu mejor opción, pero ojo, podría llover pronto.",
        washTomorrow: "Espera a mañana.",
        washTomorrowReason: "Aguanta un día más. Mañana estará despejado.",
        waitUntil: "Espera hasta {day}.",
        waitUnsettled: "La cosa está fea ahora. Espera al {day} cuando se despeje.",
        bestDayBadge: "Recomendado",
        todayStr: "Hoy",
        tomorrowStr: "Mañana",
        cleanDuration: "Limpio Por",
        days: "Días",
        activeCriteria: "Criterios Activos",
        critBadWeather: "Evitar Lluvia/Nieve",
        critBadWeatherDesc: "Omite días con mal tiempo.",
        critHighPrecip: "Probabilidad > 30%",
        critHighPrecipDesc: "Omite días con alta probabilidad de lluvia.",
        critHighWind: "Evitar Viento Fuerte",
        critHighWindDesc: "Omite días con vientos fuertes (>30km/h).",
        weather: {
            0: "Despejado", 1: "Casi despejado", 2: "Nublado parcial", 3: "Nublado",
            45: "Niebla", 48: "Niebla helada", 51: "Llovizna", 53: "Llovizna",
            55: "Llovizna fuerte", 61: "Lluvia ligera", 63: "Lloviendo", 65: "Aguacero",
            71: "Nieve ligera", 73: "Nevando", 75: "Mucha nieve", 77: "Granizo",
            80: "Chubascos", 81: "Chubascos", 82: "Tormenta",
            85: "Nieve", 86: "Tormenta nieve", 95: "Tormentas",
            96: "Tormenta y granizo", 99: "Tormenta fuerte"
        }
    },
    fr: {
        appTitle: "Quand dois-je laver ma voiture ?",
        locating: "Localisation...",
        recommendationTitle: "Le Verdict",
        waitItOut: "Laisse tomber.",
        waitReason: "Il va pleuvoir ou neiger. Garde ton argent.",
        targetDateLabel: "Date Cible",
        pending: "En attente",
        forecastAnalysis: "Agenda 7 Jours",
        findLocation: "Trouver une ville",
        enterCityPlaceholder: "Ville...",
        searchBtn: "Chercher",
        searching: "Recherche...",
        useCurrentLoc: "Ma position",
        locationNotFound: "Introuvable. Essaie encore.",
        errorConnecting: "Erreur de connexion.",
        typeInEnglishOnly: "Position refusée. Veuillez taper la ville en anglais.",
        defaultLocation: "New York, USA",
        checkBackLater: "Reviens plus tard",
        washToday: "Vas-y aujourd'hui !",
        washTodayStreak: "Le temps est superbe ! Lave-la maintenant.",
        washTodayNoStreak: "Meilleure chance aujourd'hui, mais risque de pluie ensuite.",
        washTomorrow: "Attends demain.",
        washTomorrowReason: "Patiente un jour. Demain c'est grand soleil.",
        waitUntil: "Attends {day}.",
        waitUnsettled: "C'est le bazar en ce moment. Attends {day}.",
        bestDayBadge: "Recommandé",
        todayStr: "Aujourd'hui",
        tomorrowStr: "Demain",
        cleanDuration: "Propre Pour",
        days: "Jours",
        activeCriteria: "Critères Actifs",
        critBadWeather: "Éviter Pluie/Neige",
        critBadWeatherDesc: "Ignore les jours de mauvais temps.",
        critHighPrecip: "Précipitations > 30%",
        critHighPrecipDesc: "Ignore les jours avec risque de pluie.",
        critHighWind: "Éviter Vent Fort",
        critHighWindDesc: "Ignore les jours avec vent fort (>30km/h).",
        weather: {
            0: "Dégagé", 1: "Presque dégagé", 2: "Nuageux", 3: "Couvert",
            45: "Brouillard", 48: "Brouillard givrant", 51: "Petite bruine", 53: "Bruine",
            55: "Forte bruine", 61: "Petite pluie", 63: "Pluie", 65: "Forte pluie",
            71: "Neige légère", 73: "Neige", 75: "Forte neige", 77: "Grains neige",
            80: "Averses", 81: "Averses", 82: "Fortes averses",
            85: "Averses neige", 86: "Tempête neige", 95: "Orages",
            96: "Orage grêle", 99: "Gros orage"
        }
    },
    zh: {
        appTitle: "什么时候洗车最好？",
        locating: "定位中...",
        recommendationTitle: "最终建议",
        waitItOut: "还是再等等吧。",
        waitReason: "眼看着就要下雨下雪了，别白花钱。",
        targetDateLabel: "目标日期",
        pending: "待定",
        forecastAnalysis: "7天日程",
        findLocation: "找城市",
        enterCityPlaceholder: "输入城市...",
        searchBtn: "搜索",
        searching: "找着呢...",
        useCurrentLoc: "用我的位置",
        locationNotFound: "没找着啊，换个试试。",
        errorConnecting: "连不上网了。",
        typeInEnglishOnly: "定位权限被拒绝。请仅用英文搜索城市。",
        defaultLocation: "纽约，美国",
        checkBackLater: "晚点来看看",
        washToday: "今天就洗吧！",
        washTodayStreak: "今天天气完美！现在洗能帅好几天。",
        washTodayNoStreak: "今天洗最划算，不过可能很快下雨。",
        washTomorrow: "明天再洗吧。",
        washTomorrowReason: "再忍一天。明天大晴天。",
        waitUntil: "等到 {day} 吧。",
        waitUnsettled: "天气折腾，等到 {day} 放晴再洗。",
        bestDayBadge: "推荐",
        todayStr: "今天",
        tomorrowStr: "明天",
        cleanDuration: "保持干净",
        days: "天",
        activeCriteria: "启用条件",
        critBadWeather: "避开雨雪",
        critBadWeatherDesc: "避开天气恶劣的日子。",
        critHighPrecip: "降水概率 > 30%",
        critHighPrecipDesc: "避开降水概率高的日子。",
        critHighWind: "避开大风",
        critHighWindDesc: "避开风速高的日子 (>30km/h)。",
        weather: {
            0: "大晴天", 1: "多半晴天", 2: "有点云", 3: "阴天",
            45: "大雾", 48: "雾凇", 51: "毛毛雨", 53: "小雨",
            55: "密集毛毛雨", 61: "小雨", 63: "下雨啦", 65: "大雨",
            71: "小雪", 73: "下雪", 75: "大雪", 77: "米雪",
            80: "小阵雨", 81: "阵雨", 82: "大阵雨",
            85: "阵雪", 86: "暴风雪", 95: "打雷闪电",
            96: "雷暴冰雹", 99: "狂风暴雨"
        }
    },
    hi: {
        appTitle: "मुझे अपनी कार कब धोनी चाहिए?",
        locating: "ढूंढ रहा है...",
        recommendationTitle: "हमारी सलाह",
        waitItOut: "अभी रहने दो यार।",
        waitReason: "बारिश होने वाली है। पैसे बचाओ।",
        targetDateLabel: "सही तारीख",
        pending: "बाकी है",
        forecastAnalysis: "7-दिन का एजेंडा",
        findLocation: "शहर ढूंढें",
        enterCityPlaceholder: "शहर का नाम...",
        searchBtn: "ढूंढें",
        searching: "ढूंढ रहे हैं...",
        useCurrentLoc: "मेरी लोकेशन",
        locationNotFound: "मिल नहीं रहा।",
        errorConnecting: "कनेक्शन एरर।",
        typeInEnglishOnly: "लोकेशन नहीं मिली। कृपया केवल अंग्रेजी में शहर खोजें।",
        defaultLocation: "न्यूयॉर्क, यूएसए",
        checkBackLater: "बाद में आना",
        washToday: "आज ही धो डालो!",
        washTodayStreak: "आज मौसम मस्त है! कार चकाचक रहेगी।",
        washTodayNoStreak: "आज सही है, पर बारिश लौट सकती है।",
        washTomorrow: "कल धो लेना।",
        washTomorrowReason: "एक दिन रुक जाओ। कल मौसम साफ़ है।",
        waitUntil: "{day} तक रुक जाओ।",
        waitUnsettled: "मौसम खराब है। {day} को साफ़ होगा।",
        bestDayBadge: "सुझाव",
        todayStr: "आज",
        tomorrowStr: "कल",
        cleanDuration: "साफ़ रहेगी",
        days: "दिन",
        activeCriteria: "सक्रिय मानदंड",
        critBadWeather: "बारिश/बर्फ से बचें",
        critBadWeatherDesc: "खराब मौसम वाले दिनों को छोड़ें।",
        critHighPrecip: "बारिश की संभावना > 30%",
        critHighPrecipDesc: "बारिश की उच्च संभावना वाले दिनों को छोड़ें।",
        critHighWind: "तेज़ हवा से बचें",
        critHighWindDesc: "तेज़ हवा वाले दिनों को छोड़ें (>30km/h)।",
        weather: {
            0: "साफ़", 1: "ज़्यादातर साफ़", 2: "थोड़े बादल", 3: "बादल",
            45: "कोहरा", 48: "जमता कोहरा", 51: "बूंदाबांदी", 53: "बूंदाबांदी",
            55: "घनी बूंदाबांदी", 61: "हल्की बारिश", 63: "बारिश", 65: "ज़ोरदार बारिश",
            71: "हल्की बर्फ", 73: "बर्फ", 75: "भारी बर्फबारी", 77: "बर्फ दाने",
            80: "बौछारें", 81: "बौछारें", 82: "भारी बौछारें",
            85: "बर्फ बौछारें", 86: "भारी बर्फबारी", 95: "आंधी-तूफ़ान",
            96: "तूफ़ान/ओले", 99: "भारी तूफ़ान"
        }
    },
    ar: {
        appTitle: "متى يجب أن أغسل سيارتي؟",
        locating: "بندور...",
        recommendationTitle: "الخلاصة",
        waitItOut: "استنّى شوية.",
        waitReason: "هتمطر قريب. وفر فلوسك.",
        targetDateLabel: "اليوم المناسب",
        pending: "لسه",
        forecastAnalysis: "أجندة 7 أيام",
        findLocation: "مدينة",
        enterCityPlaceholder: "اسم المدينة...",
        searchBtn: "بحث",
        searching: "بندور...",
        useCurrentLoc: "مكاني",
        locationNotFound: "ملقينهاش.",
        errorConnecting: "مشكلة اتصال.",
        typeInEnglishOnly: "الموقع غير متاح. يرجى كتابة اسم المدينة باللغة الإنجليزية فقط.",
        defaultLocation: "نيويورك، أمريكا",
        checkBackLater: "شوفنا بعدين",
        washToday: "اغسلها اليوم!",
        washTodayStreak: "الجو تحفة! اغسلها وهتفضل بتلمع.",
        washTodayNoStreak: "النهاردة أحسن فرصة، بس ممكن تمطر.",
        washTomorrow: "اغسلها بكرة.",
        washTomorrowReason: "استنى يوم. بكرة الجو صافي.",
        waitUntil: "استنى ليوم {day}.",
        waitUnsettled: "الجو ملخبط. استنى ليوم {day}.",
        bestDayBadge: "مُرشح",
        todayStr: "النهاردة",
        tomorrowStr: "بكرة",
        cleanDuration: "نظيفة لـ",
        days: "أيام",
        activeCriteria: "المعايير النشطة",
        critBadWeather: "تجنب المطر والثلج",
        critBadWeatherDesc: "يتخطى الأيام ذات الطقس السيئ.",
        critHighPrecip: "احتمالية المطر > 30%",
        critHighPrecipDesc: "يتخطى الأيام ذات احتمالية المطر العالية.",
        critHighWind: "تجنب الرياح القوية",
        critHighWindDesc: "يتخطى الأيام ذات الرياح القوية (>30 كم/ساعة).",
        weather: {
            0: "صافي", 1: "صافي غالباً", 2: "مغيم", 3: "غيوم",
            45: "ضباب", 48: "ضباب بيجمد", 51: "رذاذ", 53: "رذاذ",
            55: "رذاذ تقيل", 61: "مطر خفيف", 63: "مطر", 65: "مطر شديد",
            71: "تلج خفيف", 73: "تلج", 75: "تلج شديد", 77: "حبيبات تلج",
            80: "زخات", 81: "زخات", 82: "زخات شديدة",
            85: "زخات تلج", 86: "عاصفة تلج", 95: "رعد وبرق",
            96: "رعد وبرد", 99: "عاصفة قوية"
        }
    },
    fa: {
        appTitle: "کی ماشینم رو بشورم؟",
        locating: "در حال پیدا کردن...",
        recommendationTitle: "حرف آخر",
        waitItOut: "فعلاً دست نگه دار.",
        waitReason: "بارون تو راهه. پولتو هدر نده.",
        targetDateLabel: "تاریخ مناسب",
        pending: "نامشخص",
        forecastAnalysis: "برنامه ۷ روزه",
        findLocation: "شهر",
        enterCityPlaceholder: "اسم شهر...",
        searchBtn: "بگرد",
        searching: "در حال جستجو...",
        useCurrentLoc: "مکان من",
        locationNotFound: "پیدا نشد.",
        errorConnecting: "اینترنت قطع شد.",
        typeInEnglishOnly: "دسترسی مکان داده نشد. لطفاً نام شهر را فقط به انگلیسی وارد کنید.",
        defaultLocation: "نیویورک",
        checkBackLater: "بعداً بیا",
        washToday: "همین امروز بشور!",
        washTodayStreak: "هوا عالیه! ماشینت تمیز می‌مونه.",
        washTodayNoStreak: "امروز خوبه، ولی شاید زود بارون بیاد.",
        washTomorrow: "فردا بشور.",
        washTomorrowReason: "یه روز صبر کن. فردا هوا صافه.",
        waitUntil: "تا {day} صبر کن.",
        waitUnsettled: "هوا خرابه. صبر کن تا {day}.",
        bestDayBadge: "پیشنهاد",
        todayStr: "امروز",
        tomorrowStr: "فردا",
        cleanDuration: "تمیز برای",
        days: "روز",
        activeCriteria: "معیارهای فعال",
        critBadWeather: "دوری از باران و برف",
        critBadWeatherDesc: "رد کردن روزهای با هوای بد.",
        critHighPrecip: "احتمال بارش > 30%",
        critHighPrecipDesc: "رد کردن روزهای با احتمال بارش بالا.",
        critHighWind: "دوری از باد شدید",
        critHighWindDesc: "رد کردن روزهای با باد شدید (>30km/h).",
        weather: {
            0: "صاف", 1: "بیشتر صاف", 2: "کمی ابری", 3: "ابری",
            45: "مه", 48: "مه یخ‌زده", 51: "نم‌نم", 53: "نم‌نم",
            55: "نم‌نم شدید", 61: "بارون خفیف", 63: "بارون", 65: "بارون شدید",
            71: "برف خفیف", 73: "برف", 75: "برف شدید", 77: "دانه‌های برف",
            80: "رگبار", 81: "رگبار", 82: "رگبار شدید",
            85: "رگبار برف", 86: "طوفان برف", 95: "رعد و برق",
            96: "رعد و تگرگ", 99: "طوفان شدید"
        }
    }
};

let currentLang = 'en';
let currentWeatherData = null;
let currentLat = null;
let currentLon = null;
let washCriteria = {
    badWeather: true,
    highPrecip: true,
    highWind: true
};

function t(key, params = {}) {
    let str = translations[currentLang][key] || translations['en'][key] || key;
    for (let [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, v);
    }
    return str;
}

function updateStaticTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
    document.getElementById('location-input').placeholder = t('enterCityPlaceholder');
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

function initCriteria() {
    const saved = localStorage.getItem('washCriteria');
    if (saved) {
        try {
            washCriteria = { ...washCriteria, ...JSON.parse(saved) };
        } catch (e) {}
    }

    const badWeatherToggle = document.getElementById('toggle-bad-weather');
    const highPrecipToggle = document.getElementById('toggle-high-precip');
    const highWindToggle = document.getElementById('toggle-high-wind');

    badWeatherToggle.checked = washCriteria.badWeather;
    highPrecipToggle.checked = washCriteria.highPrecip;
    highWindToggle.checked = washCriteria.highWind;

    badWeatherToggle.addEventListener('change', (e) => {
        washCriteria.badWeather = e.target.checked;
        saveCriteria();
    });

    highPrecipToggle.addEventListener('change', (e) => {
        washCriteria.highPrecip = e.target.checked;
        saveCriteria();
    });

    highWindToggle.addEventListener('change', (e) => {
        washCriteria.highWind = e.target.checked;
        saveCriteria();
    });
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
const useGpsBtn = document.getElementById('use-gps-btn');

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
    61: { icon: 'cloud-rain', badForWash: true },
    63: { icon: 'cloud-rain', badForWash: true },
    65: { icon: 'cloud-rain', badForWash: true },
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
    el.addEventListener('change', (e) => setLanguage(e.target.value));
});

document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
});

changeLocationBtn.addEventListener('click', () => {
    locationModal.classList.remove('hidden');
    locationInput.focus();
});

closeModalBtn.addEventListener('click', () => {
    locationModal.classList.add('hidden');
    locationSearchStatus.classList.add('hidden');
});

locationModal.addEventListener('click', (e) => {
    if (e.target === locationModal) {
        locationModal.classList.add('hidden');
        locationSearchStatus.classList.add('hidden');
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

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const areaName = result.admin1 ? `, ${result.admin1}` : '';
            const displayName = `${result.name}${areaName}`;

            saveAndFetchLocation(result.latitude, result.longitude, displayName);

            locationModal.classList.add('hidden');
            locationInput.value = '';
            locationSearchStatus.classList.add('hidden');
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
    getLocationViaGPS();
});

function initApp() {
    initTheme();
    initCriteria();

    const urlParams = new URLSearchParams(window.location.search);

    const langParam = urlParams.get('lang');
    if (langParam && translations[langParam]) {
        currentLang = langParam;
    } else {
        currentLang = localStorage.getItem('appLang') || 'en';
    }
    setLanguage(currentLang);

    showSkeleton();

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
}

function showLocationModalWithError() {
    locationModal.classList.remove('hidden');
    locationSearchStatus.classList.remove('hidden');
    locationSearchStatus.classList.remove('text-red-500', 'text-slate-500');
    locationSearchStatus.classList.add('text-brand-600', 'dark:text-brand-400');
    locationSearchStatus.innerText = t('typeInEnglishOnly');
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=auto`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Weather data request failed.");

        const data = await response.json();
        currentWeatherData = data.daily;
        processData(currentWeatherData);

    } catch (error) {
    }
}

function processData(daily) {
    const daysData = [];
    const today = new Date();
    const localeString = document.documentElement.dataset.locale || 'en-US';

    for (let i = 0; i < 7; i++) {
        const code = daily.weathercode[i];
        const weatherInfo = weatherCodes[code] || { icon: 'help-circle', badForWash: false };
        const descriptionStr = translations[currentLang]?.weather?.[code] || translations['en'].weather[code] || 'Unknown';
        const precipProb = daily.precipitation_probability_max[i];
        const windSpeed = daily.windspeed_10m_max[i];

        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() + i);

        const localWeekday = dateObj.toLocaleDateString(localeString, { weekday: 'short' });
        const localDate = dateObj.toLocaleDateString(localeString, { month: 'short', day: 'numeric' });

        let dayName = i === 0 ? t('todayStr') : i === 1 ? t('tomorrowStr') : localWeekday;

        const isDirtyDay =
            (washCriteria.badWeather && weatherInfo.badForWash) ||
            (washCriteria.highPrecip && precipProb > 30) ||
            (washCriteria.highWind && windSpeed > 30);

        daysData.push({
            index: i,
            dayName: dayName,
            dateFormatted: localDate,
            maxTemp: Math.round(daily.temperature_2m_max[i]),
            minTemp: Math.round(daily.temperature_2m_min[i]),
            precipProb: precipProb,
            windSpeed: Math.round(windSpeed),
            desc: descriptionStr,
            icon: weatherInfo.icon,
            isDirty: isDirtyDay
        });
    }

    analyzeBestWashDay(daysData);
}

function analyzeBestWashDay(days) {
    let bestScore = -999;
    let bestDayIndex = -1;
    let streakLength = 0;

    for (let i = 0; i < 7; i++) {
        if (days[i].isDirty) continue;

        let currentScore = 100;
        let clearStreak = 0;

        for (let j = i + 1; j < 7; j++) {
            const daysAhead = j - i;
            if (days[j].isDirty) {
                currentScore -= (60 / daysAhead);
                break;
            } else {
                currentScore += 10;
                clearStreak++;
            }
        }

        if (currentScore > bestScore) {
            bestScore = currentScore;
            bestDayIndex = i;
            streakLength = clearStreak;
        }
    }

    renderDashboard(days, bestDayIndex, streakLength);
}

function renderDashboard(days, bestDayIndex, streakLength) {
    hideSkeleton();
    streakBadge.classList.add('hidden');

    verdictCard.classList.remove('bg-brand-700', 'bg-accent-400', 'text-white', 'text-slate-900');

    if (bestDayIndex === -1) {
        verdictCard.classList.add('bg-accent-400', 'text-slate-900');
        verdictTitle.innerText = t('waitItOut');
        verdictReason.innerText = t('waitReason');
        targetDateText.innerText = t('checkBackLater');
    } else {
        verdictCard.classList.add('bg-brand-700', 'text-white');
        const recommendedDay = days[bestDayIndex];
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
        const iconContainer = isRecommended ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400";

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
                    <div class="flex items-center gap-2 text-[11px] font-bold">
                        <span class="${day.precipProb > 30 ? 'text-accent-500' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr">
                            <i data-lucide="droplets" class="w-3 h-3"></i> ${day.precipProb}%
                        </span>
                        <span class="${day.windSpeed > 30 ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr">
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

lucide.createIcons();
document.addEventListener('DOMContentLoaded', initApp);