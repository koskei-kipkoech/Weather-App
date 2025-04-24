// lib/api.ts
export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  current: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind_speed: number;
    wind_deg: number;
    dt: number;
  };
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
  city: {
    name: string;
    country: string;
  };
}

const API_BASE_URL = "http://localhost:8000/api";

export async function fetchWeatherByCity(city: string, units = "metric"): Promise<WeatherData> {
  try {
    const response = await fetch(`${API_BASE_URL}/weather/city?city=${encodeURIComponent(city)}&units=${units}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error fetching weather data: ${response.status} - ${text}`);
    }

    // Get the response text first to handle any potential PHP comments
    const responseText = await response.text();
    
    // Remove any PHP comments or other non-JSON content at the beginning
    const jsonStartIndex = responseText.indexOf('{');
    if (jsonStartIndex === -1) {
      throw new Error('Invalid JSON response format');
    }
    
    // Extract only the JSON part
    const jsonText = responseText.substring(jsonStartIndex);
    
    try {
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Failed to parse weather data response');
    }
  } catch (error) {
    console.error("Error in fetchWeatherByCity:", error);
    throw error;
  }
}