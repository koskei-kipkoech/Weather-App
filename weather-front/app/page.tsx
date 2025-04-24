"use client"

import type React from "react"
import { useState } from "react"
import { Cloud, Droplet, Wind, Search, Thermometer, Calendar, Gauge } from "lucide-react"
import Image from "next/image"
import { fetchWeatherByCity, type WeatherData } from "../lib/api"

// Helper functions
const getWeatherIconUrl = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })
}

const getWindSpeed = (speed: number, unit: string): string => {
  if (unit === "metric") {
    const kmh = speed * 3.6
    return `${Math.round(kmh)} km/h`
  } else {
    return `${Math.round(speed)} mph`
  }
}

const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

const getPressureDescription = (pressure: number, unit: string): string => {
  if (unit === "metric") {
    // Assuming hPa
    if (pressure < 1000) return "Low pressure"
    if (pressure >= 1000 && pressure < 1015) return "Normal pressure"
    return "High pressure"
  } else {
    // Assuming inHg, but thresholds are not adjusted here for simplicity
    return "Pressure: " + pressure + " inHg"
  }
}

export default function Home() {
  const [city, setCity] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!city.trim()) return

    setLoading(true)
    setError(null)

    try {
      const data = await fetchWeatherByCity(city, unit)
      if (!data || !data.main) {
        throw new Error("Invalid weather data received")
      }
      setWeatherData(data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center py-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 flex items-center gap-2 mb-2">
            <Cloud className="text-blue-600" /> Weather Forecast
          </h1>
          <p className="text-blue-600 text-center">Get real-time weather updates for any city</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] min-h-[650px]">
            {/* Left Panel - Current Weather */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 md:p-8 flex flex-col relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
                <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-white"></div>
              </div>

              {/* Search Form - Mobile Only */}
              <form onSubmit={handleSearch} className="mb-8 md:hidden relative z-10">
                <div className="flex">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    className="bg-blue-800 hover:bg-blue-900 px-4 py-3 rounded-r-lg transition-colors flex items-center justify-center"
                    disabled={loading}
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              <div className="relative z-10 flex-1 flex flex-col">
                {weatherData ? (
                  <>
                    <div className="flex justify-center items-center mb-4">
                      <div className="relative w-40 h-40">
                        <Image
                          src={getWeatherIconUrl(weatherData.current.weather[0].icon) || "/placeholder.svg"}
                          alt={weatherData.current.weather[0].description}
                          width={160}
                          height={160}
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                    <div className="text-center mb-6">
                      <h1 className="text-6xl md:text-7xl font-bold mb-2">
                        {Math.round(weatherData.current.temp)}
                        <span className="text-4xl md:text-5xl">°{unit === "metric" ? "C" : "F"}</span>
                      </h1>
                      <p className="text-xl md:text-2xl capitalize mt-1 font-light">
                        {weatherData.current.weather[0].description}
                      </p>
                      <p className="text-base md:text-lg mt-4 opacity-80">
                        Feels like {Math.round(weatherData.current.feels_like)}°{unit === "metric" ? "C" : "F"}
                      </p>
                    </div>
                    <div className="mt-auto text-center">
                      <p className="text-lg md:text-xl font-light">{formatDate(weatherData.current.dt)}</p>
                      <p className="text-xl md:text-2xl font-semibold mt-2">
                        {weatherData.city.name}, {weatherData.city.country}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <Cloud className="w-20 h-20 md:w-24 md:h-24 mb-6 opacity-50" />
                    <p className="text-lg md:text-xl text-center font-light">
                      {loading ? "Loading weather data..." : "Enter a city to get weather information"}
                    </p>
                    {error && <p className="text-red-200 mt-4 text-center bg-red-900/20 p-3 rounded-lg">{error}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Search, Forecast, Details */}
            <div className="p-4 md:p-8">
              {/* Search Form and Unit Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 mr-4 w-full">
                  <div className="flex w-full relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Search city..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg transition-colors flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Search size={18} /> Search
                    </button>
                  </div>
                </form>

                <div className="flex border rounded-lg overflow-hidden shadow-sm">
                  <button
                    className={`px-4 py-2 flex items-center gap-1 transition-colors ${
                      unit === "metric" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setUnit("metric")}
                  >
                    <Thermometer size={16} /> °C
                  </button>
                  <button
                    className={`px-4 py-2 flex items-center gap-1 transition-colors ${
                      unit === "imperial" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setUnit("imperial")}
                  >
                    <Thermometer size={16} /> °F
                  </button>
                </div>
              </div>

              {weatherData && (
                <>
                  {/* 3-Day Forecast */}
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <Calendar size={20} className="text-blue-600" /> 3-Day Forecast
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                      {weatherData.daily.slice(0, 3).map((day, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 text-center shadow-sm hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-medium text-gray-700 mb-2">
                            {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </h3>
                          <div className="flex justify-center mb-2">
                            <div className="relative w-16 h-16 md:w-20 md:h-20">
                              <Image
                                src={getWeatherIconUrl(day.weather[0].icon) || "/placeholder.svg"}
                                alt={day.weather[0].description}
                                width={80}
                                height={80}
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <p className="text-base md:text-lg font-bold text-gray-800">
                            {Math.round(day.temp.min)}° - {Math.round(day.temp.max)}° {unit === "metric" ? "C" : "F"}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 mt-1 capitalize">
                            {day.weather[0].description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weather Details */}
                  <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Current Conditions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {/* Wind Status */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Wind size={18} className="text-blue-600" /> Wind Status
                      </h3>
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-2xl md:text-4xl font-bold mr-2">
                          {getWindSpeed(weatherData.current.wind_speed, unit)}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <div
                              className="absolute w-6 md:w-8 h-1.5 bg-blue-600 origin-center"
                              style={{
                                transform: `rotate(${weatherData.current.wind_deg}deg)`,
                                transformOrigin: "center",
                              }}
                            />
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-600" />
                          </div>
                          <p className="text-center mt-2 text-sm text-gray-500">
                            {getWindDirection(weatherData.current.wind_deg)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Droplet size={18} className="text-blue-600" /> Humidity
                      </h3>
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-2xl md:text-4xl font-bold mr-2">{weatherData.current.humidity}</span>
                        <span className="text-xl">%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mb-2">
                        <div
                          className="bg-blue-600 h-2 md:h-3 rounded-full"
                          style={{ width: `${weatherData.current.humidity}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Pressure */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Gauge size={18} className="text-blue-600" /> Pressure
                      </h3>
                      <div className="flex items-center justify-center">
                        <span className="text-2xl md:text-4xl font-bold mr-2">{weatherData.current.pressure}</span>
                        <span className="text-xl">{unit === "metric" ? "hPa" : "inHg"}</span>
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-4">
                        {getPressureDescription(weatherData.current.pressure, unit)}
                      </p>
                    </div>

                    {/* Min/Max Temperature */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Thermometer size={18} className="text-blue-600" /> Min/Max Temp
                      </h3>
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <span className="text-blue-600 text-sm mb-1 block">Min</span>
                          <span className="text-xl md:text-2xl font-bold block">
                            {Math.round(weatherData.daily[0].temp.min)}°{unit === "metric" ? "C" : "F"}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-red-500 text-sm mb-1 block">Max</span>
                          <span className="text-xl md:text-2xl font-bold block">
                            {Math.round(weatherData.daily[0].temp.max)}°{unit === "metric" ? "C" : "F"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!weatherData && !loading && (
                <div className="text-center py-12 md:py-16 text-gray-500">
                  <div className="flex justify-center mb-4">
                    <Cloud className="w-16 h-16 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Weather Data</h3>
                  <p>Search for a city to display weather information</p>
                </div>
              )}

              {loading && !weatherData && (
                <div className="text-center py-12 md:py-16 text-gray-500">
                  <div className="flex justify-center mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                  <p>Loading weather data...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>Weather data provided by OpenWeatherMap</p>
        </div>
      </div>
    </main>
  )
}
