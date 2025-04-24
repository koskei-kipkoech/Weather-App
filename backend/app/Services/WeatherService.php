<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherService
{
    private $apiKey;

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHERMAP_API_KEY');
        if (!$this->apiKey) {
            throw new \Exception('OpenWeatherMap API key is not set in .env');
        }
    }

    public function getWeatherByCity(string $city, string $units = 'metric'): array
    {
        $cacheKey = 'weather_' . md5($city . '_' . $units);
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // Fetch current weather data
        $weatherResponse = Http::get('https://api.openweathermap.org/data/2.5/weather', [
            'q' => $city,
            'units' => $units,
            'appid' => $this->apiKey,
        ]);

        if ($weatherResponse->failed()) {
            $errorData = $weatherResponse->json();
            $errorMessage = $errorData['message'] ?? 'Failed to fetch weather data from OpenWeatherMap';
            throw new \Exception($errorMessage);
        }

        $data = $weatherResponse->json();

        // Fetch forecast data
        $forecastResponse = Http::get('https://api.openweathermap.org/data/2.5/forecast', [
            'q' => $city,
            'units' => $units,
            'appid' => $this->apiKey,
        ]);

        if ($forecastResponse->failed()) {
            $errorData = $forecastResponse->json();
            $errorMessage = $errorData['message'] ?? 'Failed to fetch forecast data from OpenWeatherMap';
            throw new \Exception($errorMessage);
        }

        $forecastData = $forecastResponse->json();

        // Filter to get one forecast per day (next 3 days)
        $dailyForecasts = [];
        $processedDays = [];

        foreach ($forecastData['list'] as $forecast) {
            $date = date('Y-m-d', $forecast['dt']);
            if (!in_array($date, $processedDays)) {
                $dailyForecasts[] = $forecast;
                $processedDays[] = $date;
                if (count($dailyForecasts) >= 3) break;
            }
        }

        $data['forecast'] = $dailyForecasts;

        Cache::put($cacheKey, $data, 1800); // Cache for 30 minutes
        return $data;
    }

    public function getOneCallWeatherByCoordinates(float $lat, float $lon, string $units = 'metric'): array
    {
        $cacheKey = 'onecall_' . md5($lat . '_' . $lon . '_' . $units);
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $weatherResponse = Http::get('https://api.openweathermap.org/data/3.0/onecall', [
            'lat' => $lat,
            'lon' => $lon,
            'exclude' => 'minutely,hourly',
            'units' => $units,
            'appid' => $this->apiKey,
        ]);

        if ($weatherResponse->failed()) {
            throw new \Exception('Failed to fetch weather data');
        }

        $weatherData = $weatherResponse->json();
        Cache::put($cacheKey, $weatherData, now()->addMinutes(30));

        return $weatherData;
    }
}