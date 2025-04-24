<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::get('/weather/city', [WeatherController::class, 'getWeatherByCity'])
         ->name('api.weather.city');
    
    Route::get('/weather/coordinates', [WeatherController::class, 'getWeatherByCoordinates'])
         ->name('api.weather.coordinates');
});