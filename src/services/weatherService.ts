import { API_CONFIG, WEATHER_CONFIG } from './apiConfig';

export interface WeatherData {
  location: {
    name: string;
    lat: number;
    lon: number;
    country: string;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    uv_index: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather_main: string;
    weather_description: string;
    icon: string;
    sunrise: number;
    sunset: number;
  };
  forecast: ForecastDay[];
  alerts?: WeatherAlert[];
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  humidity: number;
  wind_speed: number;
  weather_main: string;
  weather_description: string;
  icon: string;
  precipitation: number;
  precipitation_probability: number;
}

export interface WeatherAlert {
  event: string;
  start: number;
  end: number;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
}

class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_CONFIG.OPENWEATHER_API_KEY;
    this.baseUrl = API_CONFIG.OPENWEATHER_BASE_URL;
  }

  async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using default location');
        resolve({ lat: 28.6139, lon: 77.2090 });
        return;
      }

      // Check permission status first
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'denied') {
            console.warn('Location permission denied, using default location');
            resolve({ lat: 28.6139, lon: 77.2090 });
            return;
          }
        }).catch(() => {
          // Permissions API not supported, continue with geolocation
        });
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Location obtained: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
          
          // Only use location if accuracy is reasonable (within 5km)
          if (accuracy <= 5000) {
            resolve({ lat: latitude, lon: longitude });
          } else {
            console.warn(`Location accuracy too low (${accuracy}m), using default location`);
            resolve({ lat: 28.6139, lon: 77.2090 });
          }
        },
        (error) => {
          let errorMessage = 'Location access failed';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          console.warn(`${errorMessage}, using default location (Delhi)`);
          resolve({ lat: 28.6139, lon: 77.2090 });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  }

  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const currentUrl = `${this.baseUrl}${API_CONFIG.ENDPOINTS.WEATHER_CURRENT}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${WEATHER_CONFIG.units}`;
      const forecastUrl = `${this.baseUrl}${API_CONFIG.ENDPOINTS.WEATHER_FORECAST}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${WEATHER_CONFIG.units}`;

      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

      if (!currentResponse.ok) {
        throw new Error(`Current weather API failed: ${currentResponse.status}`);
      }
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API failed: ${forecastResponse.status}`);
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      return this.formatWeatherData(currentData, forecastData);
    } catch (error) {
      console.error('Weather data fetch error:', error);
      throw error;
    }
  }

  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`;
      const geoResponse = await fetch(geoUrl);
      
      if (!geoResponse.ok) {
        throw new Error('Location not found');
      }

      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geoData[0];
      return await this.getWeatherData(lat, lon);
    } catch (error) {
      console.error('Weather by city error:', error);
      throw error;
    }
  }

  private formatWeatherData(currentData: any, forecastData: any): WeatherData {
    const current = {
      temp: Math.round(currentData.main.temp),
      feels_like: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      uv_index: 0,
      visibility: currentData.visibility / 1000,
      wind_speed: currentData.wind.speed,
      wind_deg: currentData.wind.deg,
      weather_main: currentData.weather?.[0]?.main || 'Unknown',
      weather_description: currentData.weather?.[0]?.description || 'No description',
      icon: currentData.weather?.[0]?.icon || '01d',
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset
    };

    const location = {
      name: currentData.name,
      lat: currentData.coord.lat,
      lon: currentData.coord.lon,
      country: currentData.sys.country
    };

    const forecast: ForecastDay[] = [];
    const processedDates = new Set();

    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!processedDates.has(date) && forecast.length < 7) {
        processedDates.add(date);
        
        forecast.push({
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          temp_max: Math.round(item.main.temp_max),
          temp_min: Math.round(item.main.temp_min),
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          weather_main: item.weather?.[0]?.main || 'Unknown',
          weather_description: item.weather?.[0]?.description || 'No description',
          icon: item.weather?.[0]?.icon || '01d',
          precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
          precipitation_probability: item.pop * 100
        });
      }
    }

    return {
      location,
      current,
      forecast
    };
  }

  async getAgriculturalInsights(weatherData: WeatherData): Promise<any> {
    return {
      irrigation_advice: this.getIrrigationAdvice(weatherData),
      pest_disease_alerts: this.getPestDiseaseAlerts(weatherData),
      planting_conditions: this.getPlantingConditions(weatherData),
      harvest_recommendations: this.getHarvestRecommendations(weatherData),
      weather_warnings: this.getWeatherWarnings(weatherData)
    };
  }

  private getIrrigationAdvice(weather: WeatherData): any {
    const { current, forecast } = weather;
    const rainInNext3Days = forecast.slice(0, 3).some(day => day.precipitation_probability > 60);
    
    if (rainInNext3Days) {
      return {
        action: 'Postpone irrigation - rain expected',
        schedule: 'Delay by 2-3 days',
        requirement: 'reduced'
      };
    } else if (current.temp > 35 && current.humidity < 40) {
      return {
        action: 'Increase irrigation frequency',
        schedule: 'Early morning or late evening',
        requirement: 'increased'
      };
    }
    
    return {
      action: 'Normal irrigation schedule',
      schedule: 'As per crop requirements',
      requirement: 'normal'
    };
  }

  private getPestDiseaseAlerts(weather: WeatherData): any {
    const { current } = weather;
    const alerts = [];

    if (current.humidity > 75 && current.temp > 20 && current.temp < 30) {
      alerts.push({
        type: 'fungal_disease',
        risk: 'high',
        message: 'High risk of fungal diseases',
        prevention: 'Apply preventive fungicide'
      });
    }

    if (current.temp > 32 && current.humidity < 50) {
      alerts.push({
        type: 'pest_activity',
        risk: 'medium',
        message: 'Increased pest activity',
        prevention: 'Monitor crops closely'
      });
    }

    return alerts;
  }

  private getPlantingConditions(weather: WeatherData): any {
    const { current } = weather;
    
    return {
      soil_temperature: current.temp > 15 ? 'suitable' : 'too_cold',
      moisture_level: current.humidity > 60 ? 'adequate' : 'low',
      overall: current.temp > 10 && current.temp < 40 ? 'good' : 'poor'
    };
  }

  private getHarvestRecommendations(weather: WeatherData): any {
    const { forecast } = weather;
    const rainSoon = forecast.slice(0, 3).some(day => day.precipitation_probability > 70);
    
    if (rainSoon) {
      return {
        urgency: 'high',
        message: 'Harvest immediately - rain expected',
        timeframe: 'next 24-48 hours'
      };
    }
    
    return {
      urgency: 'normal',
      message: 'Good conditions for harvesting',
      timeframe: 'next 3-5 days'
    };
  }

  private getWeatherWarnings(weather: WeatherData): any {
    const warnings = [];
    const { current } = weather;

    if (current.temp > 40) {
      warnings.push({
        type: 'extreme_heat',
        severity: 'high',
        message: 'Extreme heat - protect crops'
      });
    }

    if (current.temp < 5) {
      warnings.push({
        type: 'frost_risk',
        severity: 'high',
        message: 'Frost risk - protect sensitive crops'
      });
    }

    if (current.wind_speed > 15) {
      warnings.push({
        type: 'high_wind',
        severity: 'medium',
        message: 'High winds - secure structures'
      });
    }

    return warnings;
  }

  async getHydroSyncRecommendations(weatherData: WeatherData, cropData: any, soilData: any): Promise<any> {
    const irrigationSchedule = {
      current_recommendation: this.calculateIrrigationNeed(weatherData, cropData, soilData),
      weekly_schedule: this.generateWeeklyIrrigationSchedule(weatherData, cropData),
      water_requirements: this.calculateWaterRequirements(cropData, weatherData),
      efficiency_tips: this.getIrrigationEfficiencyTips(weatherData, soilData),
      cost_optimization: this.getIrrigationCostOptimization(weatherData)
    };
    
    return irrigationSchedule;
  }

  async getWeatherGuardAlerts(weatherData: WeatherData, cropData: any): Promise<any> {
    const alerts = {
      immediate_risks: this.assessImmediateRisks(weatherData),
      crop_specific_alerts: this.getCropSpecificAlerts(weatherData, cropData),
      protective_measures: this.getProtectiveMeasures(weatherData),
      timing_recommendations: this.getTimingRecommendations(weatherData)
    };
    
    return alerts;
  }

  private calculateIrrigationNeed(weatherData: WeatherData, cropData: any, soilData: any): string {
    const { current, forecast } = weatherData;
    const rainExpected = forecast.slice(0, 2).some(day => day.precipitation_probability > 60);
    
    if (rainExpected) return 'No irrigation needed - Rain expected within 48 hours';
    if (current.temp > 35 && current.humidity < 40) return 'High irrigation needed - Hot and dry conditions';
    if (current.temp > 30 && current.humidity < 60) return 'Moderate irrigation needed';
    return 'Light irrigation recommended based on soil moisture';
  }

  private generateWeeklyIrrigationSchedule(weatherData: WeatherData, cropData: any): string[] {
    const schedule = [];
    const { forecast } = weatherData;
    
    for (let i = 0; i < Math.min(7, forecast.length); i++) {
      const day = forecast[i];
      const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
      
      if (day.precipitation_probability > 60) {
        schedule.push(`${dayName}: Skip irrigation - Rain expected (${day.precipitation_probability}% chance)`);
      } else if (day.temp_max > 32) {
        schedule.push(`${dayName}: Early morning irrigation (5-7 AM) - Hot day expected`);
      } else if (day.temp_max < 20) {
        schedule.push(`${dayName}: Reduce irrigation - Cool conditions`);
      } else {
        schedule.push(`${dayName}: Normal irrigation schedule`);
      }
    }
    
    return schedule;
  }

  private calculateWaterRequirements(cropData: any, weatherData: WeatherData): string {
    const cropType = cropData?.type || 'general';
    const { current } = weatherData;
    
    const baseRequirements = {
      rice: 1200,
      wheat: 450,
      cotton: 700,
      sugarcane: 1500,
      maize: 500,
      tomato: 400,
      potato: 350,
      general: 600
    };
    
    const baseReq = baseRequirements[cropType as keyof typeof baseRequirements] || baseRequirements.general;
    const tempAdjustment = current.temp > 30 ? 1.3 : current.temp < 20 ? 0.8 : 1.0;
    const humidityAdjustment = current.humidity < 50 ? 1.2 : current.humidity > 80 ? 0.9 : 1.0;
    
    const adjustedReq = Math.round(baseReq * tempAdjustment * humidityAdjustment);
    return `${adjustedReq} mm per season (adjusted for current weather)`;
  }

  private getIrrigationEfficiencyTips(weatherData: WeatherData, soilData: any): string[] {
    const tips = [
      'Use drip irrigation to reduce water wastage by 30-50%',
      'Apply mulch to reduce evaporation losses by 20-30%',
      'Monitor soil moisture using sensors for precision irrigation'
    ];
    
    if (weatherData.current.temp > 30) {
      tips.push('Irrigate during early morning (5-7 AM) or late evening (6-8 PM) to minimize evaporation');
    }
    
    if (weatherData.current.wind_speed > 10) {
      tips.push('Avoid sprinkler irrigation during windy conditions');
    }
    
    return tips;
  }

  private getIrrigationCostOptimization(weatherData: WeatherData): string {
    return 'Schedule irrigation during off-peak electricity hours (10 PM - 6 AM) to reduce energy costs by 20-30%. Use solar pumps during peak sunlight hours for maximum efficiency.';
  }

  private assessImmediateRisks(weatherData: WeatherData): any[] {
    const risks = [];
    const { current, forecast } = weatherData;
    
    if (current.temp > 40) {
      risks.push({
        type: 'heat_stress',
        severity: 'critical',
        message: 'Extreme heat can damage crops',
        action: 'Provide shade and increase irrigation'
      });
    }
    
    const heavyRain = forecast.some(day => day.precipitation > 50);
    if (heavyRain) {
      risks.push({
        type: 'flooding',
        severity: 'high',
        message: 'Heavy rainfall expected',
        action: 'Ensure proper drainage systems'
      });
    }
    
    return risks;
  }

  private getCropSpecificAlerts(weatherData: WeatherData, cropData: any): any[] {
    const alerts = [];
    const cropType = cropData?.type || 'general';
    const { current } = weatherData;
    
    if (cropType === 'rice' && current.temp > 35) {
      alerts.push({
        crop: 'rice',
        alert: 'High temperature stress',
        recommendation: 'Maintain water levels and provide adequate ventilation'
      });
    }
    
    if (cropType === 'wheat' && current.humidity > 80) {
      alerts.push({
        crop: 'wheat',
        alert: 'Fungal disease risk',
        recommendation: 'Apply preventive fungicide and improve air circulation'
      });
    }
    
    return alerts;
  }

  private getProtectiveMeasures(weatherData: WeatherData): string[] {
    const measures = [];
    const { current, forecast } = weatherData;
    
    if (current.temp > 35) {
      measures.push('Install shade nets to protect crops from heat stress');
      measures.push('Increase irrigation frequency during hot periods');
    }
    
    if (forecast.some(day => day.wind_speed > 15)) {
      measures.push('Secure support structures and protect tall crops');
    }
    
    if (current.humidity > 85) {
      measures.push('Improve ventilation to prevent fungal diseases');
    }
    
    return measures;
  }

  private getTimingRecommendations(weatherData: WeatherData): any {
    const { current, forecast } = weatherData;
    
    return {
      best_spray_time: current.wind_speed < 10 ? 'Current conditions suitable for spraying' : 'Wait for calmer conditions',
      harvest_window: forecast.every(day => day.precipitation_probability < 30) ? 'Good harvest conditions for next 3 days' : 'Harvest before rain arrives',
      planting_conditions: current.temp > 15 && current.temp < 35 ? 'Suitable for planting' : 'Wait for better temperature conditions'
    };
  }
}

export const weatherService = new WeatherService();