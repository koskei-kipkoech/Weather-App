"use client"

import type React from "react"
import { useState } from "react"
import { Cloud, Droplet, Wind, Search, Thermometer, SunMedium, CloudRain, Compass, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { fetchWeatherByCity, WeatherData } from "../lib/api"

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
    const kmh = speed * 3.6;
    return `${Math.round(kmh)} km/h`;
  } else {
    return `${Math.round(speed)} mph`;
  }
}

const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

const getPressureDescription = (pressure: number, unit: string): string => {
  if (unit === "metric") {
    // Assuming hPa
    if (pressure < 1000) return "Low";
    if (pressure >= 1000 && pressure < 1015) return "Normal";
    return "High";
  } else {
    // Assuming inHg
    return pressure + " inHg";
  }
}

// Calendar and Gauge components
const Calendar = ({ size = 24, className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
};

const Gauge = ({ size = 24, className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
};

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
        throw new Error('Invalid weather data received')
      }
      setWeatherData(data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get weather background gradient based on weather conditions and time
  const getWeatherBackground = () => {
    if (!weatherData) return "from-blue-500 to-indigo-600";
    
    const icon = weatherData.current.weather[0].icon;
    const isNight = icon.includes('n');
    const condition = weatherData.current.weather[0].main?.toLowerCase();
    
    if (isNight) {
      if (condition?.includes('clear')) return "from-gray-900 to-indigo-950";
      if (condition?.includes('cloud')) return "from-gray-800 to-indigo-900";
      if (condition?.includes('rain') || condition?.includes('drizzle')) return "from-gray-800 to-blue-900";
      if (condition?.includes('thunder')) return "from-gray-900 to-purple-900";
      if (condition?.includes('snow')) return "from-gray-800 to-blue-800";
      return "from-gray-900 to-indigo-900";
    } else {
      if (condition?.includes('clear')) return "from-blue-400 to-sky-600";
      if (condition?.includes('cloud')) return "from-blue-300 to-gray-400";
      if (condition?.includes('rain') || condition?.includes('drizzle')) return "from-blue-500 to-gray-600";
      if (condition?.includes('thunder')) return "from-gray-600 to-indigo-800";
      if (condition?.includes('snow')) return "from-blue-100 to-gray-300";
      return "from-blue-500 to-indigo-600";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center py-4 md:py-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 flex items-center gap-2 mb-2">
            <Cloud className="text-blue-500" strokeWidth={1.5} /> Weather App
          </h1>
          <p className="text-blue-600 text-center text-lg">Real-time weather information at your fingertips</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] min-h-[650px]">
            {/* Left Panel - Current Weather */}
            <div className={`bg-gradient-to-br ${getWeatherBackground()} text-white p-6 md:p-8 flex flex-col relative overflow-hidden transition-all duration-500 ease-in-out`}>
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
                    className="w-full px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                  />
                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-3 rounded-r-lg transition-colors flex items-center justify-center shadow-lg"
                    disabled={loading}
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                {weatherData ? (
                  <>
                    <div className="flex justify-center items-center mb-6">
                      <div className="relative w-32 h-32 md:w-40 md:h-40">
                        <Image
                          src={getWeatherIconUrl(weatherData.current.weather[0].icon) || "/placeholder.svg"}
                          alt={weatherData.current.weather[0].description}
                          width={160}
                          height={160}
                          className="object-contain drop-shadow-lg"
                          priority
                        />
                      </div>
                    </div>
                    <div className="text-center mb-8">
                      <h1 className="text-6xl md:text-7xl font-bold mb-2 drop-shadow-md flex items-center justify-center">
                        {Math.round(weatherData.current.temp)}
                        <span className="text-4xl md:text-5xl">°{unit === "metric" ? "C" : "F"}</span>
                      </h1>
                      <p className="text-xl md:text-2xl capitalize mt-1 font-light">{weatherData.current.weather[0].description}</p>
                      <p className="text-lg mt-4 opacity-90">
                        Feels like {Math.round(weatherData.current.feels_like)}°{unit === "metric" ? "C" : "F"}
                      </p>
                    </div>
                    <div className="mt-auto text-center">
                      <div className="inline-flex items-center gap-2 text-xl font-light mb-3">
                        <Calendar size={18} className="opacity-80" /> {formatDate(weatherData.current.dt)}
                      </div>
                      <p className="text-2xl font-semibold flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {weatherData.city.name}, {weatherData.city.country}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative">
                      <Cloud className="w-24 h-24 mb-6 opacity-60" />
                      <CloudRain className="w-16 h-16 absolute -bottom-4 -right-4 text-white/70" />
                      <SunMedium className="w-10 h-10 absolute -top-2 -left-4 text-yellow-200" />
                    </div>
                    <p className="text-xl text-center font-light mt-4">
                      {loading ? "Loading weather data..." : "Enter a city to get weather information"}
                    </p>
                    {error && <p className="text-red-200 mt-4 text-center bg-red-900/20 p-3 rounded-lg">{error}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Search, Forecast, Details */}
            <div className="p-6 md:p-8">
              {/* Search Form and Unit Toggle */}
              <div className="flex justify-between items-center mb-8 gap-4">
                <form onSubmit={handleSearch} className="hidden md:flex flex-1">
                  <div className="flex w-full relative shadow-md rounded-lg overflow-hidden">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Search any city..."
                      className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-colors flex items-center justify-center gap-2 rounded-r-lg"
                      disabled={loading}
                    >
                      <Search size={18} /> Search
                    </button>
                  </div>
                </form>

                <div className="flex border rounded-lg overflow-hidden shadow-md">
                  <button
                    className={`px-4 py-2 flex items-center gap-1 transition-colors ${
                      unit === "metric" ? "bg-blue-600 text-white font-medium" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setUnit("metric")}
                  >
                    <Thermometer size={16} /> °C
                  </button>
                  <button
                    className={`px-4 py-2 flex items-center gap-1 transition-colors ${
                      unit === "imperial" ? "bg-blue-600 text-white font-medium" : "bg-gray-100 hover:bg-gray-200"
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
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <Calendar size={20} className="text-blue-600" /> 3-Day Forecast
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {weatherData.daily.slice(0, 3).map((day, index) => (
                        <div 
                          key={index} 
                          className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                          <h3 className="font-medium text-gray-700 mb-2">
                            {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
                          </h3>
                          <div className="flex justify-center mb-2">
                            <div className="relative w-20 h-20">
                              <Image
                                src={getWeatherIconUrl(day.weather[0].icon) || "/placeholder.svg"}
                                alt={day.weather[0].description}
                                width={80}
                                height={80}
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <p className="text-lg font-bold text-gray-800">
                            {Math.round(day.temp.min)}° - {Math.round(day.temp.max)}° {unit === "metric" ? "C" : "F"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{day.weather[0].description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weather Details */}
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <Compass size={20} className="text-blue-600" /> Current Conditions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                    {/* Wind Status */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Wind size={18} className="text-blue-600" /> Wind Status
                      </h3>
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold mr-2">{getWindSpeed(weatherData.current.wind_speed, unit)}</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <div
                              className="absolute w-8 h-1.5 bg-blue-600 origin-center"
                              style={{
                                transform: `rotate(${weatherData.current.wind_deg}deg)`,
                                transformOrigin: "center",
                              }}
                            />
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                          </div>
                          <p className="text-center mt-2 text-sm text-gray-500">
                            {getWindDirection(weatherData.current.wind_deg)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Droplet size={18} className="text-blue-600" /> Humidity
                      </h3>
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold mr-2">{weatherData.current.humidity}</span>
                        <span className="text-xl">%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className="bg-blue-600 h-3 rounded-full"
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
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Gauge size={18} className="text-blue-600" /> Pressure
                      </h3>
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold mr-2">{weatherData.current.pressure}</span>
                        <span className="text-xl">{unit === "metric" ? "hPa" : "inHg"}</span>
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-4">
                        {getPressureDescription(weatherData.current.pressure, unit)} pressure
                      </p>
                    </div>

                    {/* Min/Max Temperature */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <h3 className="text-gray-500 font-medium mb-2 flex items-center gap-2">
                        <Thermometer size={18} className="text-blue-600" /> Min/Max Temp
                      </h3>
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <span className="text-blue-600 text-sm mb-1 block">Min</span>
                          <span className="text-2xl font-bold block">
                            {Math.round(weatherData.daily[0].temp.min)}°{unit === "metric" ? "C" : "F"}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-red-500 text-sm mb-1 block">Max</span>
                          <span className="text-2xl font-bold block">
                            {Math.round(weatherData.daily[0].temp.max)}°{unit === "metric" ? "C" : "F"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!weatherData && !loading && (
                <div className="text-center py-16 text-gray-500 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="flex justify-center mb-4">
                    <Cloud className="w-16 h-16 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Weather Data</h3>
                  <p>Search for a city to display weather information</p>
                </div>
              )}

              {loading && !weatherData && (
                <div className="text-center py-16 text-gray-500 bg-blue-50/50 rounded-xl border border-blue-100">
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
        <div className="text-center text-sm text-gray-500 mt-6 py-4">
          <p>Weather data provided by OpenWeatherMap • Made with ❤️ by Patrick Kipkoech</p>
        </div>
      </div>
    </main>
  )
}