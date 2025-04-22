import { format } from "date-fns"
import WeatherIcon from "./weather-icon"
import type { ForecastData } from "@/lib/types"

interface ForecastCardProps {
  forecast: ForecastData
  unit: "metric" | "imperial"
  celsiusToFahrenheit: (celsius: number) => number
}

export default function ForecastCard({ forecast, unit, celsiusToFahrenheit }: ForecastCardProps) {
  // Format date to display day
  const formatDay = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "dd MMM")
  }

  return (
    <div className="bg-white border rounded-lg p-4 text-center">
      <h3 className="font-medium text-gray-700 mb-2">{formatDay(forecast.dt)}</h3>
      <div className="flex justify-center mb-2">
        <WeatherIcon iconCode={forecast.weather[0].icon} description={forecast.weather[0].description} size={60} />
      </div>
      <p className="text-lg font-bold text-gray-800">
        {unit === "metric"
          ? `${Math.round(forecast.main.temp_min)}-${Math.round(forecast.main.temp_max)}°C`
          : `${Math.round(celsiusToFahrenheit(forecast.main.temp_min))}-${Math.round(celsiusToFahrenheit(forecast.main.temp_max))}°F`}
      </p>
    </div>
  )
}
