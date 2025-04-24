<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function getWeatherByCity(Request $request)
    {
        $request->validate([
            'city' => 'required|string|max:255',
            'units' => 'string|in:metric,imperial'
        ]);

        try {
            $weatherData = $this->weatherService->getWeatherByCity(
                $request->input('city'),
                $request->input('units', 'metric')
            );
            return response()->json($weatherData);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}