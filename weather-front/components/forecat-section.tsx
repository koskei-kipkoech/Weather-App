import Image from "next/image"
import type { ForecastData } from "@/lib/types"

interface ForecastSectionProps {
  forecastData: ForecastData[]
}

export default function ForecastSection({ forecastData }: ForecastSectionProps) {
  // Helper function to format date
  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecastData.map((forecast, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
            <h3 className="font-medium text-gray-700 mb-2">{formatDay(forecast.dt)}</h3>
            <div className="flex justify-center mb-2">
              <Image
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                alt={forecast.weather[0].description}
                width={50}
                height={50}
              />
            </div>
            <p className="text-xl font-bold text-gray-800 mb-1">{Math.round(forecast.main.temp)}°C</p>
            <p className="text-xs text-gray-500 capitalize">{forecast.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
