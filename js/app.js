// app.js

const translations = {
    en: {
        appTitle: "When should I wash my car?",
        locating: "Locating...",
        recommendationTitle: "The Verdict",
        waitItOut: "Nah, hold off.",
        waitReason: "Looks like rain or snow is rolling in soon. Save your cash and wait for better weather.",
        dynamicWaitReason: "Hold off. The forecast shows {reasons} coming up. Save your cash for better weather.",
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
        currentLocation: "Current Location",
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
        criteriaInfoTitle: "Criteria Details",
        critBadWeather: "Avoid Rain & Snow",
        critBadWeatherDesc: "Skips days with active bad weather.",
        critBadWeatherInfo: "This ignores days where the weather forecast indicates active precipitation like rain, sleet, or snow.",
        critHighPrecip: "Precipitation > {val}%",
        critHighPrecipDesc: "Skips days with high chance of rain.",
        critHighPrecipInfo: "This ignores days where the chance of rain is higher than {val}%, even if it is not actively raining.",
        critHighWind: "Avoid High Wind",
        critHighWindDesc: "Skips days with high wind speeds (>{val}km/h).",
        critHighWindInfo: "This ignores days with wind speeds over {val}km/h, which can blow dust and dirt onto your wet car before it dries.",
        critFreezing: "Avoid Freezing",
        critFreezingDesc: "Skips days below {val}°C.",
        critFreezingInfo: "This ignores days where the temperature drops below {val}°C ({val_f}°F) to prevent water from freezing on your car doors and locks.",
        critExtremeHeat: "Avoid Extreme Heat",
        critExtremeHeatDesc: "Skips days above {val}°C.",
        critExtremeHeatInfo: "This ignores days where temperatures exceed {val}°C ({val_f}°F), which causes soap and water to dry too quickly and leave stubborn spots.",
        critHighUV: "Avoid High UV",
        critHighUVDesc: "Skips days with UV Index > {val}.",
        critHighUVInfo: "This ignores days with a UV index higher than {val}, which can bake washing chemicals directly into your paint.",
        reason_badWeather: "rain or snow",
        reason_highPrecip: "high chances of rain",
        reason_highWind: "strong winds",
        reason_freezing: "freezing temperatures",
        reason_extremeHeat: "extreme heat",
        reason_highUV: "high UV levels",
        adjustThresholds: "Adjust Thresholds",
        labelPrecip: "Precipitation Limit",
        labelWind: "Wind Speed Limit",
        labelFreezing: "Freezing Point",
        labelHeat: "Extreme Heat Limit",
        labelUV: "UV Index Limit",
        descPrecip: "Maximum allowed probability of precipitation.",
        descWind: "Maximum wind speed limit before washing is discouraged.",
        descFreezing: "Avoid washing if temperature drops below this value.",
        descHeat: "Avoid washing if temperature exceeds this value.",
        descUV: "Avoid washing if UV index exceeds this value.",
        resetDefaults: "Defaults",
        saveBtn: "Save & Apply",
        dataProvided: "Data by Open-Meteo",
        weather: {
            0: "Clear skies", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy",
            45: "Foggy", 48: "Freezing fog", 51: "Light drizzle", 53: "Drizzling",
            55: "Heavy drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
            61: "Light rain", 63: "Raining", 65: "Pouring rain", 66: "Light freezing rain",
            67: "Heavy freezing rain",
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
        dynamicWaitReason: "Espera un poco. El pronóstico indica {reasons} en los próximos días. Guarda tu dinero para un mejor clima.",
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
        currentLocation: "Ubicación actual",
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
        criteriaInfoTitle: "Detalles de Criterios",
        critBadWeather: "Evitar Lluvia/Nieve",
        critBadWeatherDesc: "Omite días con mal tiempo.",
        critBadWeatherInfo: "Ignora los días en los que el pronóstico indica precipitaciones activas como lluvia, aguanieve o nieve.",
        critHighPrecip: "Probabilidad > {val}%",
        critHighPrecipDesc: "Omite días con alta probabilidad de lluvia.",
        critHighPrecipInfo: "Ignora los días en los que la probabilidad de lluvia es superior al {val}%, incluso si no llueve activamente.",
        critHighWind: "Evitar Viento Fuerte",
        critHighWindDesc: "Omite días con vientos fuertes (>{val}km/h).",
        critHighWindInfo: "Ignora los días con vientos superiores a {val} km/h, que pueden soplar polvo y suciedad sobre tu auto.",
        critFreezing: "Evitar Heladas",
        critFreezingDesc: "Omite días bajo {val}°C.",
        critFreezingInfo: "Ignora los días en que la temperatura desciende por debajo de {val}°C ({val_f}°F) para evitar congelaciones.",
        critExtremeHeat: "Evitar Calor Extremo",
        critExtremeHeatDesc: "Omite días sobre {val}°C.",
        critExtremeHeatInfo: "Ignora los días en los que la temperatura supera los {val}°C ({val_f}°F), lo que seca el jabón demasiado rápido.",
        critHighUV: "Evitar UV Alto",
        critHighUVDesc: "Omite días con Índice UV > {val}.",
        critHighUVInfo: "Ignora los días con un índice UV superior a {val}, que puede hornear los productos químicos en la pintura.",
        reason_badWeather: "lluvia o nieve",
        reason_highPrecip: "alta probabilidad de lluvia",
        reason_highWind: "fuertes vientos",
        reason_freezing: "temperaturas bajo cero",
        reason_extremeHeat: "calor extremo",
        reason_highUV: "altos niveles de UV",
        adjustThresholds: "Ajustar Límites",
        labelPrecip: "Límite de Precipitación",
        labelWind: "Límite de Viento",
        labelFreezing: "Punto de Congelación",
        labelHeat: "Límite de Calor Extremo",
        labelUV: "Límite de Índice UV",
        descPrecip: "Probabilidad máxima permitida de precipitación.",
        descWind: "Velocidad máxima del viento permitida antes de desaconsejar el lavado.",
        descFreezing: "Evita lavar si la temperatura baja de este valor.",
        descHeat: "Evita lavar si la temperatura supera este valor.",
        descUV: "Evita lavar si el índice UV supera este valor.",
        resetDefaults: "Por Defecto",
        saveBtn: "Guardar y Aplicar",
        dataProvided: "Datos de Open-Meteo",
        weather: {
            0: "Despejado", 1: "Casi despejado", 2: "Nublado parcial", 3: "Nublado",
            45: "Niebla", 48: "Niebla helada", 51: "Llovizna", 53: "Llovizna",
            55: "Llovizna fuerte", 56: "Llovizna helada ligera", 57: "Llovizna helada densa",
            61: "Lluvia ligera", 63: "Lloviendo", 65: "Aguacero", 66: "Lluvia helada ligera",
            67: "Lluvia helada fuerte",
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
        dynamicWaitReason: "Laisse tomber pour l'instant. On prévoit {reasons} dans les prochains jours.",
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
        currentLocation: "Position actuelle",
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
        criteriaInfoTitle: "Détails des Critères",
        critBadWeather: "Éviter Pluie/Neige",
        critBadWeatherDesc: "Ignore les jours de mauvais temps.",
        critBadWeatherInfo: "Ignore les jours où les prévisions météorologiques indiquent des précipitations actives comme la pluie ou la neige.",
        critHighPrecip: "Précipitations > {val}%",
        critHighPrecipDesc: "Ignore les jours avec risque de pluie.",
        critHighPrecipInfo: "Ignore les jours où les risques de pluie dépassent {val}%, même s'il ne pleut pas activement.",
        critHighWind: "Éviter Vent Fort",
        critHighWindDesc: "Ignore les jours avec vent fort (>{val}km/h).",
        critHighWindInfo: "Ignore les jours avec des vents de plus de {val} km/h, qui peuvent souffler de la poussière.",
        critFreezing: "Éviter le Gel",
        critFreezingDesc: "Ignore les jours sous {val}°C.",
        critFreezingInfo: "Ignore les jours où la température descend en dessous de {val}°C ({val_f}°F) pour éviter le gel.",
        critExtremeHeat: "Éviter la Chaleur",
        critExtremeHeatDesc: "Ignore les jours au-dessus de {val}°C.",
        critExtremeHeatInfo: "Ignore les jours où la température dépasse {val}°C ({val_f}°F), faisant sécher le savon trop vite.",
        critHighUV: "Éviter UV Élevé",
        critHighUVDesc: "Ignore les jours avec un Indice UV > {val}.",
        critHighUVInfo: "Ignore les jours avec un indice UV supérieur à {val}, ce qui cuit les produits sur la peinture.",
        reason_badWeather: "pluie ou neige",
        reason_highPrecip: "forts risques de pluie",
        reason_highWind: "vents violents",
        reason_freezing: "températures glaciales",
        reason_extremeHeat: "chaleur extrême",
        reason_highUV: "niveaux UV élevés",
        adjustThresholds: "Ajuster les Seuils",
        labelPrecip: "Limite de Précipitations",
        labelWind: "Limite de Vitesse du Vent",
        labelFreezing: "Point de Gel",
        labelHeat: "Limite de Chaleur Extrême",
        labelUV: "Limite d'Indice UV",
        descPrecip: "Probabilité maximale de précipitations autorisée.",
        descWind: "Vitesse maximale du vent autorisée avant de déconseiller le lavage.",
        descFreezing: "Éviter le lavage si la température descend en dessous de cette valeur.",
        descHeat: "Éviter le lavage si la température dépasse cette valeur.",
        descUV: "Éviter le lavage si l'indice UV dépasse cette valeur.",
        resetDefaults: "Par Défaut",
        saveBtn: "Enregistrer & Appliquer",
        dataProvided: "Données par Open-Meteo",
        weather: {
            0: "Dégagé", 1: "Presque dégagé", 2: "Nuageux", 3: "Couvert",
            45: "Brouillard", 48: "Brouillard givrant", 51: "Petite bruine", 53: "Bruine",
            55: "Forte bruine", 56: "Bruine verglaçante légère", 57: "Bruine verglaçante forte",
            61: "Petite pluie", 63: "Pluie", 65: "Forte pluie", 66: "Pluie verglaçante légère",
            67: "Pluie verglaçante forte",
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
        dynamicWaitReason: "先等等。预报显示接下来会有{reasons}。等天气好点再洗吧。",
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
        currentLocation: "当前位置",
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
        criteriaInfoTitle: "洗车条件详情",
        critBadWeather: "避开雨雪",
        critBadWeatherDesc: "避开天气恶劣的日子。",
        critBadWeatherInfo: "忽略天气预报显示有雨、雨夹雪或雪的日子。",
        critHighPrecip: "降水概率 > {val}%",
        critHighPrecipDesc: "避开降水概率高的日子。",
        critHighPrecipInfo: "忽略降水概率高于 {val}% 的日子，即使当前没有下雨。",
        critHighWind: "避开大风",
        critHighWindDesc: "避开风速高的日子 (>{val}km/h)。",
        critHighWindInfo: "忽略风速超过 {val} 公里/小时的日子，大风会把灰尘吹到湿漉漉的车上。",
        critFreezing: "避开结冰",
        critFreezingDesc: "避开低于 {val}°C 的日子。",
        critFreezingInfo: "忽略气温低于 {val}°C ({val_f}°F) 的日子，防止水在车门上结冰。",
        critExtremeHeat: "避开极热",
        critExtremeHeatDesc: "避开高于 {val}°C 的日子。",
        critExtremeHeatInfo: "忽略气温超过 {val}°C ({val_f}°F) 的日子，高温会让洗车液干得太快并留下水渍。",
        critHighUV: "避开高紫外线",
        critHighUVDesc: "避开紫外线指数 > {val} 的日子。",
        critHighUVInfo: "忽略紫外线指数高于 {val} 的日子，强紫外线会把化学物质烤入车漆。",
        reason_badWeather: "雨雪天气",
        reason_highPrecip: "高降水概率",
        reason_highWind: "强风",
        reason_freezing: "冰冻气温",
        reason_extremeHeat: "极端高温",
        reason_highUV: "高紫外线",
        adjustThresholds: "调整阈值",
        labelPrecip: "降水概率限制",
        labelWind: "风速限制",
        labelFreezing: "冰点限制",
        labelHeat: "极端高温限制",
        labelUV: "紫外线指数限制",
        descPrecip: "允许的最大降水概率。",
        descWind: "洗车前允许的最大风速限制。",
        descFreezing: "如果温度低于此值，请避免洗车。",
        descHeat: "如果温度超过此值，请避免洗车。",
        descUV: "如果紫外线指数超过此值，请避免洗车。",
        resetDefaults: "恢复默认",
        saveBtn: "保存并应用",
        dataProvided: "数据源自 Open-Meteo",
        weather: {
            0: "大晴天", 1: "多半晴天", 2: "有点云", 3: "阴天",
            45: "大雾", 48: "雾凇", 51: "毛毛雨", 53: "小雨",
            55: "密集毛毛雨", 56: "轻度冻毛毛雨", 57: "重度冻毛毛雨",
            61: "小雨", 63: "下雨啦", 65: "大雨", 66: "轻度冻雨",
            67: "重度冻雨",
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
        waitItOut: "अभी रहने do यार।",
        waitReason: "बारिश होने वाली है। पैसे बचाओ।",
        dynamicWaitReason: "अभी रुक जाएं। आने वाले दिनों में {reasons} की उम्मीद है।",
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
        currentLocation: "वर्तमान स्थान",
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
        criteriaInfoTitle: "मानदंड विवरण",
        critBadWeather: "बारिश/बर्फ से बचें",
        critBadWeatherDesc: "खराब मौसम वाले दिनों को छोड़ें।",
        critBadWeatherInfo: "यह उन दिनों को अनदेखा करता है जहां मौसम पूर्वानुमान सक्रिय वर्षा को दर्शाता है।",
        critHighPrecip: "बारिश की संभावना > {val}%",
        critHighPrecipDesc: "बारिश की उच्च संभावना वाले दिनों को छोड़ें।",
        critHighPrecipInfo: "यह उन दिनों को अनदेखा करता है जहां बारिश की संभावना {val}% से अधिक है।",
        critHighWind: "तेज़ हवा से बचें",
        critHighWindDesc: "तेज़ हवा वाले दिनों को छोड़ें (>{val}km/h)।",
        critHighWindInfo: "यह {val} किमी/घंटा से अधिक हवा की गति वाले दिनों को अनदेखा करता है।",
        critFreezing: "जमने से बचें",
        critFreezingDesc: "Skips days below {val}°C.",
        critFreezingInfo: "यह उन दिनों को अनदेखा करता है जहां तापमान {val}°C ({val_f}°F) से नीचे चला जाता है।",
        critExtremeHeat: "तेज़ गर्मी से बचें",
        critExtremeHeatDesc: "Skips days above {val}°C.",
        critExtremeHeatInfo: "यह उन दिनों को अनदेखा करता है जहां तापमान {val}°C ({val_f}°F) से अधिक हो जाता है।",
        critHighUV: "उच्च UV से बचें",
        critHighUVDesc: "UV इंडेक्स > {val} वाले दिनों को छोड़ें।",
        critHighUVInfo: "यह {val} से अधिक यूवी इंडेक्स वाले दिनों को अनदेखा करता है।",
        reason_badWeather: "बारिश या बर्फ",
        reason_highPrecip: "बारिश की उच्च संभावना",
        reason_highWind: "तेज हवाएं",
        reason_freezing: "जमा देने वाला तापमान",
        reason_extremeHeat: "भीषण गर्मी",
        reason_highUV: "उच्च यूवी (UV) स्तर",
        adjustThresholds: "सीमाएं बदलें",
        labelPrecip: "बारिश की सीमा",
        labelWind: "हवा की गति सीमा",
        labelFreezing: "जमने का बिंदु",
        labelHeat: "तेज़ गर्मी की सीमा",
        labelUV: "यूवी (UV) इंडेक्स सीमा",
        descPrecip: "बारिश होने की अधिकतम स्वीकार्य संभावना।",
        descWind: "कार धोने से पहले हवा की अधिकतम स्वीकार्य गति।",
        descFreezing: "यदि तापमान इस मान से नीचे जाता है तो धोने से बचें।",
        descHeat: "यदि तापमान इस मान से ऊपर जाता है तो धोने से बचें।",
        descUV: "यदि यूवी सूचकांक इस मान से अधिक है तो धोने से बचें।",
        resetDefaults: "डिफ़ॉल्ट मान",
        saveBtn: "सहेजें और लागू करें",
        dataProvided: "Open-Meteo द्वारा डेटा",
        weather: {
            0: "साफ़", 1: "ज़्यादातर साफ़", 2: "थोड़े बादल", 3: "बादल",
            45: "कोहरा", 48: "जमता कोहरा", 51: "बूंदाबांदी", 53: "बूंदाबांदी",
            55: "घनी बूंदाबांदी", 56: "हल्की जमी हुई बूंदाबांदी", 57: "सघन जमी हुई बूंदाबांदी",
            61: "हल्की बारिश", 63: "बारिश", 65: "ज़ोरदार बारिश", 66: "हल्की जमी हुई बारिश",
            67: "भारी जमी हुई बारिश",
            71: "हल्की बर्फ", 73: "बर्फ", 75: "भारी बर्फबारी", 77: "बर्फ दाने",
            80: "बौछारें", 81: "बौछारें", 82: "भारी बौछारें",
            85: "बर्फ बौछارें", 86: "भारी बर्फबारी", 95: "आंधी-तूफ़ान",
            96: "तूफ़ान/ओले", 99: "भारी तूफ़ान"
        }
    },
    ar: {
        appTitle: "متى يجب أن أغسل سيارتي؟",
        locating: "بندور...",
        recommendationTitle: "الخلاصة",
        waitItOut: "استنّى شوية.",
        waitReason: "هتمطر قريب. وفر فلوسك.",
        dynamicWaitReason: "استنّى شوية. التوقعات بتشير لـ {reasons} الأيام الجاية.",
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
        currentLocation: "الموقع الحالي",
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
        criteriaInfoTitle: "تفاصيل المعايير",
        critBadWeather: "تجنب المطر والثلج",
        critBadWeatherDesc: "يتخطى الأيام ذات الطقس السيئ.",
        critBadWeatherInfo: "يتجاهل الأيام التي تشير فيها التوقعات إلى هطول أمطار أو ثلوج.",
        critHighPrecip: "احتمالية المطر > {val}%",
        critHighPrecipDesc: "يتخطى الأيام ذات احتمالية المطر العالية.",
        critHighPrecipInfo: "يتجاهل الأيام التي تزيد فيها فرصة هطول الأمطار عن {val}%.",
        critHighWind: "تجنب الرياح القوية",
        critHighWindDesc: "يتخطى الأيام ذات الرياح القوية (>{val} كم/ساعة).",
        critHighWindInfo: "يتجاهل الأيام التي تزيد فيها سرعة الرياح عن {val} كم/ساعة، والتي يمكن أن تنفخ الغبار.",
        critFreezing: "تجنب التجمد",
        critFreezingDesc: "يتخطى الأيام تحت {val}°م.",
        critFreezingInfo: "يتجاهل الأيام التي تنخفض فيها درجة الحرارة عن {val}°م ({val_f}°ف) لمنع تجمد المياه.",
        critExtremeHeat: "تجنب الحر الشديد",
        critExtremeHeatDesc: "يتخطى الأيام فوق {val}°م.",
        critExtremeHeatInfo: "يتجاهل الأيام التي تتجاوز فيها درجات الحرارة {val}°م ({val_f}°ف).",
        critHighUV: "تجنب الأشعة فوق البنفسجية",
        critHighUVDesc: "يتخطى الأيام بمؤشر UV > {val}.",
        critHighUVInfo: "يتجاهل الأيام التي يكون فيها مؤشر الأشعة فوق البنفسجية أعلى من {val}.",
        reason_badWeather: "مطر أو ثلج",
        reason_highPrecip: "فرص عالية للمطر",
        reason_highWind: "رياح قوية",
        reason_freezing: "درجات حرارة متجمدة",
        reason_extremeHeat: "حرارة شديدة",
        reason_highUV: "مستويات عالية من الأشعة فوق البنفسجية",
        adjustThresholds: "ضبط المعايير",
        labelPrecip: "حد احتمالية المطر",
        labelWind: "حد سرعة الرياح",
        labelFreezing: "درجة التجمد",
        labelHeat: "حد الحرارة الشديدة",
        labelUV: "حد مؤشر الأشعة فوق البنفسجية",
        descPrecip: "الحد الأقصى المسموح به لاحتمالية هطول الأمطار.",
        descWind: "الحد الأقصى لسرعة الرياح المسموح بها قبل غسيل السيارة.",
        descFreezing: "تجنب غسل السيارة إذا انخفضت درجة الحرارة عن هذه القيمة.",
        descHeat: "تجنب غسل السيارة إذا تجاوزت درجة الحرارة هذه القيمة.",
        descUV: "تجنب غسل السيارة إذا تجاوز مؤشر الأشعة فوق البنفسجية هذه القيمة.",
        resetDefaults: "الافتراضي",
        saveBtn: "حفظ وتطبيق",
        dataProvided: "البيانات مقدمة من Open-Meteo",
        weather: {
            0: "صافي", 1: "صافي غالباً", 2: "مغيم", 3: "غيوم",
            45: "ضباب", 48: "ضباب بيجمد", 51: "رذاذ", 53: "رذاذ",
            55: "رذاذ تقيل", 56: "رذاذ متجمد خفيف", 57: "رذاذ متجمد كثيف",
            61: "مطر خفيف", 63: "مطر", 65: "مطر شديد", 66: "مطر متجمد خفيف",
            67: "مطر متجمد غزير",
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
        dynamicWaitReason: "فعلاً دست نگه دار. پیش‌بینی‌ها نشان‌دهنده {reasons} در روزهای آینده است.",
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
        currentLocation: "مکان فعلی",
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
        criteriaInfoTitle: "جزئیات معیارها",
        critBadWeather: "دوری از باران و برف",
        critBadWeatherDesc: "رد کردن روزهای با هوای بد.",
        critBadWeatherInfo: "روزهایی که پیش‌بینی آب و هوا نشان‌دهنده بارش فعال است را نادیده می‌گیرد.",
        critHighPrecip: "احتمال بارش > {val}%",
        critHighPrecipDesc: "رد کردن روزهای با احتمال بارش بالا.",
        critHighPrecipInfo: "روزهایی را که احتمال بارندگی بیش از {val} درصد است را نادیده می‌گیرد.",
        critHighWind: "دوری از باد شدید",
        critHighWindDesc: "رد کردن روزهای با باد شدید (>{val}km/h).",
        critHighWindInfo: "روزهای با سرعت باد بیش از {val} کیلومتر در ساعت را نادیده می‌گیرد.",
        critFreezing: "دوری از یخبندان",
        critFreezingDesc: "رد کردن روزهای زیر {val}°C.",
        critFreezingInfo: "روزهایی را که دما به زیر {val} درجه سانتی‌گراد ({val_f}°F) می‌رسد نادیده می‌گیرد.",
        critExtremeHeat: "دوری از گرمای شدید",
        critExtremeHeatDesc: "رد کردن روزهای بالای {val}°C.",
        critExtremeHeatInfo: "روزهایی که دما از {val} درجه سانتی‌گراد ({val_f}°F) فراتر می‌رود را نادیده می‌گیرد.",
        critHighUV: "دوری از اشعه UV",
        critHighUVDesc: "رد کردن روزهای با شاخص UV > {val}.",
        critHighUVInfo: "روزهایی با شاخص UV بالاتر از {val} را نادیده می‌گیرد.",
        reason_badWeather: "باران یا برف",
        reason_highPrecip: "احتمال بالای بارش",
        reason_highWind: "بادهای شدید",
        reason_freezing: "دمای یخبندان",
        reason_extremeHeat: "گرمای شدید",
        reason_highUV: "سطح بالای اشعه فرابنفش",
        adjustThresholds: "تنظیم آستانه‌ها",
        labelPrecip: "حد احتمال بارش",
        labelWind: "حد سرعت باد",
        labelFreezing: "نقطه یخبندان",
        labelHeat: "حد گرمای شدید",
        labelUV: "حد شاخص UV",
        descPrecip: "حداکثر احتمال مجاز برای بارندگی.",
        descWind: "حداکثر سرعت مجاز باد قبل از توصیه به عدم شستشو.",
        descFreezing: "اگر دما به زیر این مقدار رسید از شستشو خودداری کنید.",
        descHeat: "اگر دما از این مقدار بالاتر رفت از شستشو خودداری کنید.",
        descUV: "اگر شاخص UV از این مقدار بالاتر رفت از شستشو خودداری کنید.",
        resetDefaults: "پیش‌فرض‌ها",
        saveBtn: "ذخیره و اعمال",
        dataProvided: "داده‌ها از Open-Meteo",
        weather: {
            0: "صاف", 1: "بیشتر صاف", 2: "کمی ابری", 3: "ابری",
            45: "مه", 48: "مه یخ‌زده", 51: "نم‌نم", 53: "نم‌نم",
            55: "نم‌نم شدید", 56: "نم‌نم باران یخ‌زده خفیف", 57: "نم‌نم باران یخ‌زده شدید",
            61: "بارون خفیف", 63: "بارون", 65: "بارون شدید", 66: "باران یخ‌زده خفیف",
            67: "باران یخ‌زده شدید",
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
    el.addEventListener('change', (e) => setLanguage(e.target.value));
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,uv_index_max&timezone=auto`;
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

    for (let i = 0; i < 7; i++) {
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

        // Collect all reasons why this day might be flagged as dirty based on criteria
        const dirtyReasons = [];
        if (washCriteria.badWeather && weatherInfo.badForWash) dirtyReasons.push('badWeather');
        if (washCriteria.highPrecip && precipProb > washCriteriaThresholds.highPrecip) dirtyReasons.push('highPrecip');
        if (washCriteria.highWind && windSpeed > washCriteriaThresholds.highWind) dirtyReasons.push('highWind');
        if (washCriteria.freezing && daily.temperature_2m_min[i] <= washCriteriaThresholds.freezing) dirtyReasons.push('freezing');
        if (washCriteria.extremeHeat && daily.temperature_2m_max[i] > washCriteriaThresholds.extremeHeat) dirtyReasons.push('extremeHeat');
        if (washCriteria.highUV && uvIndexRaw > washCriteriaThresholds.highUV) dirtyReasons.push('highUV');

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
            dirtyReasons: dirtyReasons
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

        let guaranteedCleanDays = 0;
        for (let j = i; j < 7; j++) {
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

    if (bestDayIndex === -1) {
        verdictCard.classList.add('verdict-wait-bg', 'text-slate-900');
        verdictTitle.innerText = t('waitItOut');

        // Dynamic wait reason construction
        let foundReasons = new Set();
        // Check reasons for the next 3 days to give a relevant dynamic explanation
        for(let i=0; i<3; i++) {
            if(days[i] && days[i].dirtyReasons) {
                days[i].dirtyReasons.forEach(r => foundReasons.add(r));
            }
        }

        // Fallback to checking all 7 days if the first 3 days were somehow skipped
        if(foundReasons.size === 0) {
            for(let i=0; i<7; i++) {
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
        verdictCard.classList.add('verdict-recommend-bg', 'text-white');
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
                        <span class="${(washCriteria.highPrecip && day.precipProb > washCriteriaThresholds.highPrecip) ? 'text-accent-500' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="Precipitation">
                            <i data-lucide="droplets" class="w-3 h-3"></i> ${day.precipProb}%
                        </span>
                        <span class="${(washCriteria.highUV && day.uvIndex > washCriteriaThresholds.highUV) ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="UV Index">
                            <i data-lucide="sun-dim" class="w-3 h-3"></i> ${day.uvIndex}
                        </span>
                        <span class="${(washCriteria.highWind && day.windSpeed > washCriteriaThresholds.highWind) ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'} flex items-center gap-0.5" dir="ltr" title="Wind">
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

// Register service worker for offline support / Progressive Web App capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Service Worker registered successfully on scope:', reg.scope);
            })
            .catch(err => {
                console.error('Service Worker registration failed:', err);
            });
    });
}