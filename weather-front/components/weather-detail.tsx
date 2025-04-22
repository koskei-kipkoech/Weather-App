import type React from "react"

interface WeatherDetailProps {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  direction?: number
  progress?: number
}

export default function WeatherDetail({ title, value, unit, icon, direction, progress }: WeatherDetailProps) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-gray-500 font-medium mb-4">{title}</h3>
      <div className="flex items-center justify-center mb-4">
        <span className="text-4xl font-bold mr-2">{value}</span>
        <span className="text-xl">{unit}</span>
      </div>

      {direction !== undefined && (
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div
                className="absolute w-6 h-1 bg-blue-500 origin-center"
                style={{
                  transform: `rotate(${direction}deg)`,
                  transformOrigin: "center",
                }}
              />
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <p className="text-center mt-2 text-sm text-gray-500">N/NW</p>
          </div>
        </div>
      )}

      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }} />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      )}
    </div>
  )
}
