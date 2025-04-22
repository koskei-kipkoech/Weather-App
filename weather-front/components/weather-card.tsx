import Image from "next/image"
import { Droplets, Wind, Thermometer, Compass } from "lucide-react"
import type { WeatherData } from "@/lib/types"

interface WeatherCardProps {
  weatherData: WeatherData
}

export default function WeatherCard({ weatherData }: WeatherCardProps) {
  // Format date
  const date = new Date()
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)

  // Get weather icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Location and basic info */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{weatherData.name}</h2>
              <p className="text-gray-500 mb-4">{formattedDate}</p>
              <div className="flex items-center mb-6">
                <div className="relative w-20 h-20 mr-4">
                  <Image
                    src={iconUrl || "/placeholder.svg"}
                    alt={weatherData.weather[0].description}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-5xl font-bold text-gray-800">{Math.round(weatherData.main.temp)}°C</p>
                  <p className="text-gray-600 capitalize">{weatherData.weather[0].description}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <Thermometer className="text-orange-500 mr-2" size={18} />
                <span className="text-gray-700">Feels like: {Math.round(weatherData.main.feels_like)}°C</span>
              </div>
              <div className="flex items-center">
                <Compass className="text-blue-500 mr-2" size={18} />
                <span className="text-gray-700">Wind: {Math.round(weatherData.wind.speed)} m/s</span>
              </div>
            </div>
          </div>

          {/* Right side - Details */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Thermometer className="text-red-500 mr-2" size={18} />
                  <span className="text-gray-600">High / Low</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">
                  {Math.round(weatherData.main.temp_max)}° / {Math.round(weatherData.main.temp_min)}°
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Droplets className="text-blue-500 mr-2" size={18} />
                  <span className="text-gray-600">Humidity</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">{weatherData.main.humidity}%</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Wind className="text-teal-500 mr-2" size={18} />
                  <span className="text-gray-600">Wind</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">{Math.round(weatherData.wind.speed)} m/s</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">Pressure</span>
                </div>
                <p className="text-xl font-semibold text-gray-800">{weatherData.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
