import type { WeatherData, ForecastData, ForecastResponse } from "./types"

// Use direct OpenWeatherMap API with your API key
const API_KEY = "0d7f2008c9c666e8df8652df24c9e174"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

/**
 * Fetch current weather data for a city
 * @param city - The city name to get weather for
 * @returns Promise with weather data
 */
export async function fetchWeatherData(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Weather API error:", errorData)
      throw new Error(`Error fetching weather data: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error in fetchWeatherData:", error)
    throw error
  }
}

/**
 * Fetch 5-day forecast data for a city
 * @param city - The city name to get forecast for
 * @returns Promise with forecast data
 */
export async function fetchForecastData(city: string): Promise<ForecastData[]> {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Forecast API error:", errorData)
      throw new Error(`Error fetching forecast data: ${response.statusText}`)
    }

    const data: ForecastResponse = await response.json()

    // Filter to get one forecast per day (at noon)
    const dailyForecasts: ForecastData[] = []
    const processedDays = new Set()

    for (const forecast of data.list) {
      const date = forecast.dt_txt.split(" ")[0]
      if (!processedDays.has(date) && forecast.dt_txt.includes("12:00:00")) {
        dailyForecasts.push(forecast)
        processedDays.add(date)
      }
    }

    // If we don't have enough days, add more
    if (dailyForecasts.length < 3) {
      for (const forecast of data.list) {
        const date = forecast.dt_txt.split(" ")[0]
        if (!processedDays.has(date)) {
          dailyForecasts.push(forecast)
          processedDays.add(date)
          if (dailyForecasts.length >= 3) break
        }
      }
    }

    return dailyForecasts.slice(0, 3)
  } catch (error) {
    console.error("Error in fetchForecastData:", error)
    throw error
  }
}
