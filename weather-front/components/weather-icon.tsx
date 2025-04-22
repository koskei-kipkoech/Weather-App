import Image from "next/image"

interface WeatherIconProps {
  iconCode: string
  description: string
  size?: number
}

export default function WeatherIcon({ iconCode, description, size = 64 }: WeatherIconProps) {
  // Map OpenWeatherMap icon codes to appropriate icons
  const getIconUrl = (code: string) => {
    return `https://openweathermap.org/img/wn/${code}@4x.png`
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={getIconUrl(iconCode) || "/placeholder.svg"}
        alt={description}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}
