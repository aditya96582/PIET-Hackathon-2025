// API Configuration for Kisan Sathi Digital Bharat
export const API_CONFIG = {
  // Gemini AI API Configuration - Universal access
  GEMINI_API_KEY: 'AIzaSyDelASTKVGcWCbP58f6FFk2QGT5Stu0VU8',
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  
  // OpenWeatherMap API Configuration - Universal access
  OPENWEATHER_API_KEY: 'your_openweather_api_key_here',
  OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  
  // API Endpoints
  ENDPOINTS: {
    GEMINI_GENERATE: '/models/gemini-2.0-flash:generateContent',
    GEMINI_VISION: '/models/gemini-2.0-flash:generateContent',
    WEATHER_CURRENT: '/weather',
    WEATHER_FORECAST: '/forecast',
    WEATHER_ONECALL: '/onecall'
  }
};

// Gemini AI Service Configuration
export const GEMINI_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

// Weather API Configuration
export const WEATHER_CONFIG = {
  units: 'metric',
  lang: 'en'
};