// Weather data types based on OpenWeatherMap API response
export interface WeatherData {
    main: {
      temp: number
      feels_like: number
      pressure: number
      humidity: number
    }
    current: {
      temp: number
      feels_like: number
      pressure: number
      humidity: number
      weather: {
        id: number
        main: string
        description: string
        icon: string
      }[]
      wind_speed: number
      wind_deg: number
      dt: number
    }
    daily: {
      dt: number
      temp: {
        min: number
        max: number
      }
      weather: {
        id: number
        main: string
        description: string
        icon: string
      }[]
    }[]
    city: {
      name: string
      country: string
    }
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
  