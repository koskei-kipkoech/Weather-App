"use client"

import type React from "react"

import { useState } from "react"
import { Cloud } from "lucide-react"
import Image from "next/image"

// API key
const API_KEY = "0d7f2008c9c666e8df8652df24c9e174"

// Types
interface WeatherData {
  name: string
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
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  dt: number
}

interface ForecastData {
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
  }
  dt_txt: string
}

export default function Home() {
  const [city, setCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")

  // Function to convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9) / 5 + 32
  }

  // Function to convert m/s to km/h
  const msToKmh = (ms: number): number => {
    return ms * 3.6
  }

  // Function to handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!city.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`,
      )

      if (!weatherResponse.ok) {
        throw new Error(`Error fetching weather data: ${weatherResponse.statusText}`)
      }

      const weatherResult = await weatherResponse.json()
      setWeatherData(weatherResult)

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`,
      )

      if (!forecastResponse.ok) {
        throw new Error(`Error fetching forecast data: ${forecastResponse.statusText}`)
      }

      const forecastResult = await forecastResponse.json()

      // Filter to get one forecast per day
      const dailyForecasts: ForecastData[] = []
      const processedDays = new Set()

      for (const forecast of forecastResult.list) {
        const date = forecast.dt_txt.split(" ")[0]
        if (!processedDays.has(date)) {
          dailyForecasts.push(forecast)
          processedDays.add(date)
          if (dailyForecasts.length >= 3) break
        }
      }

      setForecastData(dailyForecasts)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
  }

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
  }

  return (
    <main className="min-h-screen bg-[#f0f9ff] p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] min-h-[600px]">
          {/* Left Panel - Current Weather */}
          <div className="bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white p-8 flex flex-col">
            {/* Search Form - Mobile Only */}
            <form onSubmit={handleSearch} className="mb-8 md:hidden">
              <div className="flex">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Search city..."
                  className="w-full px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#1d4ed8] hover:bg-[#1e40af] px-4 py-2 rounded-r-lg"
                  disabled={loading}
                >
                  GO
                </button>
              </div>
            </form>

            {weatherData ? (
              <>
                <div className="flex justify-center items-center mb-4">
                  <div className="relative w-32 h-32">
                    <Image
                      src={getWeatherIconUrl(weatherData.weather[0].icon) || "/placeholder.svg"}
                      alt={weatherData.weather[0].description}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <h1 className="text-6xl font-bold">
                    {unit === "metric"
                      ? Math.round(weatherData.main.temp)
                      : Math.round(celsiusToFahrenheit(weatherData.main.temp))}
                    °{unit === "metric" ? "C" : "F"}
                  </h1>
                  <p className="text-2xl capitalize mt-2">{weatherData.weather[0].description}</p>
                </div>
                <div className="mt-auto text-center">
                  <p className="text-xl">{formatDate(weatherData.dt)}</p>
                  <p className="text-xl">
                    {weatherData.name}, {weatherData.sys.country}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Cloud className="w-24 h-24 mb-4 opacity-50" />
                <p className="text-xl text-center">
                  {loading ? "Loading weather data..." : "Enter a city to get weather information"}
                </p>
                {error && <p className="text-red-200 mt-2 text-center">{error}</p>}
              </div>
            )}
          </div>

          {/* Right Panel - Search, Forecast, Details */}
          <div className="p-6">
            {/* Search Form and Unit Toggle */}
            <div className="flex justify-between items-center mb-8">
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 mr-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Search city..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-r-lg transition-colors"
                  disabled={loading}
                >
                  GO
                </button>
              </form>

              <div className="flex border rounded-lg overflow-hidden">
                <button
                  className={`px-3 py-1 ${unit === "metric" ? "bg-[#3b82f6] text-white" : "bg-gray-100"}`}
                  onClick={() => setUnit("metric")}
                >
                  °C
                </button>
                <button
                  className={`px-3 py-1 ${unit === "imperial" ? "bg-[#3b82f6] text-white" : "bg-gray-100"}`}
                  onClick={() => setUnit("imperial")}
                >
                  °F
                </button>
              </div>
            </div>

            {weatherData && forecastData && (
              <>
                {/* 3-Day Forecast */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">3-Day Forecast</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {forecastData.map((forecast, index) => (
                      <div key={index} className="bg-white border rounded-lg p-4 text-center">
                        <h3 className="font-medium text-gray-700 mb-2">
                          {new Date(forecast.dt * 1000).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                        </h3>
                        <div className="flex justify-center mb-2">
                          <div className="relative w-16 h-16">
                            <Image
                              src={getWeatherIconUrl(forecast.weather[0].icon) || "/placeholder.svg"}
                              alt={forecast.weather[0].description}
                              width={60}
                              height={60}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-gray-800">
                          {unit === "metric"
                            ? `${Math.round(forecast.main.temp_min)}-${Math.round(forecast.main.temp_max)}°C`
                            : `${Math.round(celsiusToFahrenheit(forecast.main.temp_min))}-${Math.round(
                                celsiusToFahrenheit(forecast.main.temp_max),
                              )}°F`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-gray-500 font-medium mb-4">Wind Status</h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold mr-2">{Math.round(msToKmh(weatherData.wind.speed))}</span>
                      <span className="text-xl">km/h</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <div
                            className="absolute w-6 h-1 bg-[#3b82f6] origin-center"
                            style={{
                              transform: `rotate(${weatherData.wind.deg}deg)`,
                              transformOrigin: "center",
                            }}
                          />
                          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                        </div>
                        <p className="text-center mt-2 text-sm text-gray-500">N/NW</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-gray-500 font-medium mb-4">Humidity</h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold mr-2">{weatherData.main.humidity}</span>
                      <span className="text-xl">%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-[#3b82f6] h-2.5 rounded-full"
                        style={{ width: `${weatherData.main.humidity}%` }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
