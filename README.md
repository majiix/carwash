Car Wash Planner 🚗✨

An intelligent, modern, and multilingual 7-day weather planner designed to help you find the absolute best day to wash your car. Stop washing your car right before it rains! This app analyzes upcoming weather patterns to maximize the number of days your car stays spotless.

🌟 Features

Smart Recommendation Engine: Analyzes precipitation probability and weather codes to recommend the optimal wash day and calculates your "clean streak".

7-Day Agenda: Provides a clean, at-a-glance forecast for the upcoming week.

Zero Setup & No API Keys: Built entirely with Vanilla JavaScript and uses the free, open-source Open-Meteo API for weather and geocoding data.

Multilingual & RTL Support: Fully translated into 7 languages (English, Spanish, French, Chinese, Hindi, Arabic, Farsi) with automatic Right-to-Left (RTL) layout switching and dynamic font loading for perfect typography.

Dark & Light Mode: Seamlessly adapts to system preferences with a manual toggle switch.

Location Flexible: Uses browser GPS for auto-location or allows manual city searching worldwide.

Premium UI/UX: Features a beautiful, responsive, two-column dashboard layout inspired by modern SaaS applications, complete with skeleton loading states.

🚀 Live Demo

(You can add your GitHub Pages link here once published, for example: https://yourusername.github.io/car-wash-planner/)

🛠️ Technologies Used

HTML5 & Vanilla JavaScript: No heavy frameworks required.

Tailwind CSS: For rapid, utility-first styling (loaded via CDN).

Lucide Icons: Beautiful, consistent iconography.

Google Fonts: Utilizing Inter, Noto Sans, and Vazirmatn for robust internationalization.

Open-Meteo API: For both weather forecasting and city geocoding.

💻 Getting Started

Because this application relies entirely on client-side technologies and free APIs, there is absolutely zero build process required.

Clone the repository:

git clone [https://github.com/yourusername/car-wash-planner.git](https://github.com/yourusername/car-wash-planner.git)


Navigate to the project directory.

Open the index.html file directly in your web browser.

To host on GitHub Pages:
Simply push the code to your repository, go to Settings > Pages, and select your main branch as the source. Your app will be live globally in minutes!

🧠 How the Algorithm Works

The app fetches a 7-day forecast and iterates through each day to calculate a "wash score".

It identifies "dirty" days based on WMO weather codes (rain, snow, drizzle, thunderstorms) or a precipitation probability over 30%.

For every potential clear day, it looks ahead to see how many consecutive clear days follow.

It heavily penalizes days that are immediately followed by rain and rewards days that start a long "clean streak".

The day with the highest score is presented as "The Verdict".

🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📝 License

This project is open source and available under the MIT License.