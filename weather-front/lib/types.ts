// Weather data types based on OpenWeatherMap API response
export interface WeatherData {
    name: string
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
      sea_level?: number
      grnd_level?: number
    }
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }[]
    wind: {
      speed: number
      deg: number
      gust?: number
    }
    sys: {
      country: string
      sunrise: number
      sunset: number
    }
    dt: number
    timezone: number
    visibility: number
    clouds: {
      all: number
    }
    coord: {
      lon: number
      lat: number
    }
    id: number
    cod: number
  }
  
  // Forecast data type
  export interface ForecastData {
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }[]
    wind: {
      speed: number
      deg: number
      gust?: number
    }
    dt_txt: string
    clouds: {
      all: number
    }
    visibility: number
    pop: number
  }
  
  // Forecast response type
  export interface ForecastResponse {
    list: ForecastData[]
    city: {
      name: string
      country: string
      coord: {
        lat: number
        lon: number
      }
      timezone: number
    }
  }
  