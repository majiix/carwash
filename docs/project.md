# Car Wash Planner

## Overview
Car Wash Planner is a client-side web application and Progressive Web App (PWA) that assists drivers in deciding the optimal day to wash their vehicle based on 7 to 10 day weather forecasts from Open-Meteo using the European Centre for Medium-Range Weather Forecasts (ECMWF IFS 0.25°) model. The interface offers both English and Farsi (Persian) languages with automatic Right-to-Left (RTL) layout switching and persistent user preferences.

## Tech Stack
- Frontend: HTML5, Vanilla JavaScript (ES6+), CSS3
- Styling: Tailwind CSS (standalone build)
- Typography: Vazirmatn font family (local woff2 files) and Outfit
- Icons: Lucide Icons
- APIs: Open-Meteo Weather Forecast API (Daily, Hourly, and Current Conditions via ECMWF IFS) and Geocoding Search API
- PWA: Service Worker (caching, offline support, background sync hooks) and Web App Manifest

## Dependencies
- `js/tailwindcss.js`: Standalone script for Tailwind CSS utility styling
- `js/lucide.min.js`: Client-side icon rendering library
- `fonts/`: Local WOFF2 font files for Vazirmatn typography
- Open-Meteo API: External public weather and geocoding endpoints (no API key required)

## Architecture
- `index.html`: Main user interface structure including dashboard cards, criteria controls, settings modal, and responsive language switches.
- `js/app.js`: Core client application logic handling:
  - Dynamic loading of language packs (`js/lang/en.js`, `js/lang/fa.js`)
  - Language switching, RTL document direction toggling, and locale-specific date formatting
  - Geolocation detection via HTML5 Geolocation API and manual city search via Open-Meteo
  - Weather data fetching using the global gold-standard `ecmwf_ifs025` model alongside real-time current conditions
  - Weather analysis engine computing continuous 0-100 Wash Scores, streak projections, and best wash day
  - 24-Hour hourly weather code scanning per day to identify rain, drizzle, and storm codes even when daily summary codes indicate overcast
  - Real-time current condition safeguards detecting active precipitation today
  - Daytime-aware hourly filtering (7 AM to 8 PM) for volume and probability calculations
  - Threshold customizer and calendar ICS export
  - Service worker registration and PWA state management
- `js/lang/`:
  - `en.js`: English translations
  - `fa.js`: Farsi (Persian) translations
- `css/style.css`: Custom animations, font-face declarations, and responsive drawer styles
- `sw.js`: Service worker implementing cache management for offline execution
- `manifest.json`: Web application manifest configuration for installable PWA experience
- `test/wash_engine.test.js`: Automated unit test suite covering wash score calculations, threshold penalties, daytime filtering, 24-hour weather code scanning, active rain safeguards, and ECMWF model compatibility

## Current Features
- Continuous 0-100 Wash Score: Evaluates precipitation chance, rain volume (mm), wind gusts (km/h), freezing temperature, extreme heat, and UV index.
- Zero-Tolerance Rain & Snow Protection: Automated protection that strictly rejects any forecasted rain or snow accumulation (precipSum > 0 mm) or bad weather codes (drizzle, rain, snow, thunderstorms), alongside a 30% PoP cutoff and mild score deduction for trace probabilities below 30%.
- ECMWF IFS Global Model: Powered by the ECMWF 0.25° model, preventing false clean recommendations in regions where default models miss precipitation events.
- 24-Hour Weather Code Scan: Evaluates all 24 hours of each day to detect drizzle, rain, or thunderstorms (codes 51-99) and reflects the rainy icon on the daily agenda.
- Real-Time Rain Safeguard: Ingests `current` weather conditions to immediately flag today as dirty if precipitation is actively occurring.
- Quality Tiers & Badges: Classifies each day into Ideal (80-100), Good (60-79), Fair (40-59), or Poor (0-39) with color-coded UI badges.
- Daytime-Aware Filtering: Optional toggle (default disabled) that filters weather volume and probability metrics specifically between 7:00 AM and 8:00 PM local time.
- Forward Window Recommendation: Selects optimal wash day by weighing current suitability against multi-day forward streak quality.
- Dual Language Support: English (`en`) and Farsi (`fa`) with full RTL alignment and Persian number/date formatting.
- Dynamic Language Loading: Loads translation modules on demand with automatic fallback to English.
- Custom Criteria and Thresholds: Allows users to customize thresholds for wind speed and freezing point, alongside an optional Daytime Focus toggle.
- Calendar Export: Generates downloadable `.ics` files for the recommended wash day.
- Modal Scroll Containment: Prevents background document scroll and chaining when modals or bottom sheets are open, isolating scroll exclusively to modal content.
- Offline Capability: Pre-caches application assets via Service Worker for reliable offline access.

## Decisions and Assumptions
- Primary Weather Model: The application exclusively uses Open-Meteo's `ecmwf_ifs025` model to provide accurate global precipitation and wind forecasts.
- Real-Time Rain Safeguard: If `current.precipitation > 0` or current weather indicates active precipitation, today's score is immediately penalized by 50 points and flagged with `activeRain`.
- Weather Code Priority: If any hour during a 24-hour period contains a bad weather code (51-99), `badForWash` is set to true and the representative rain code replaces milder daily codes like overcast.
- Language Scope: Only English (`en`) and Farsi (`fa`) are retained. Unused language files (`ar.js`, `es.js`, `fr.js`, `hi.js`, `zh.js`) were permanently removed from the repository.
- Preference Fallback: Stored language preferences in `localStorage` or URL query parameters that do not match `en` or `fa` automatically reset to English (`en`).
- Daytime Hours: Set to 7:00 AM through 8:00 PM local time when daytime-focus is enabled.
- Default Thresholds and Flags: Daytime focus toggle is off by default. Wind speed limit defaults to 15 km/h, and freezing point defaults to 0°C.
- Zero-Tolerance Precipitation Architecture: The manual Precipitation Limit slider has been removed. All days with measurable precipitation (precipSum > 0 mm) or bad weather codes (51-99) are strictly disqualified. When volume is 0.0 mm, precipitation probabilities (PoP) of 30% or higher disqualify the day as dirty, while trace probabilities below 30% incur a mild linear deduction (1 to 15 points) without disqualifying the wash window.
- Consolidated Criteria Modal: Dashboard criteria boxes are replaced by a single prominent entry card ("Customize Wash Criteria & Thresholds"). Direct numerical threshold sliders in the modal allow customization of wind speed and freezing point, while Daytime Focus is housed in an Additional Settings section.
- Clean Window Recommendation Requirement: A wash day candidate is only eligible if the car is guaranteed to keep clean for at least one full day after washing (guaranteedCleanDays >= 2, requiring streakLength >= 1). Days followed immediately by precipitation (active rain, rain accumulation, bad weather codes, or PoP >= 30%) or score < 50 are disqualified. If no multi-day clean window exists in the forecast, the engine defaults to "Wait it out" rather than suggesting an isolated clean day before rain.
- First-Time Visitor Default Locations: Instead of prompting for browser geolocation on initial visit, default coordinates and location names are automatically set according to the selected language: Tehran (lat: 35.69439, lon: 51.42151, locName: 'Tehran, Tehran') for Farsi (`fa`), and New York (lat: 40.71427, lon: -74.00597, locName: 'New York, New York') for English (`en`).

## Verification Commands
To inspect and verify repository changes and state:
- Run unit test suite: `rtk run "node test/wash_engine.test.js"`
- Validate JS syntax: `rtk run "node -c js/app.js js/lang/en.js js/lang/fa.js sw.js"`
- Check git status: `C:\Users\Espadana\.gemini\antigravity\scratch\rtk\bin\rtk.exe git status`
- Test local HTTP server (e.g. via Python): `python -m http.server 8000`
