# 🌤️ Weather App

[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-10-red)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)

A modern, responsive weather application built with Next.js frontend and Laravel backend, providing real-time weather information and forecasts.

## ✨ Features

- 🌡️ Real-time weather data display
- 📱 Fully responsive design for all devices
- 🗺️ Location-based weather information
- 📊 Detailed weather forecasts
- 🎨 Beautiful weather icons and animations
- 🚀 Fast and optimized performance

## 🏗️ Project Structure

```
Weather-App/
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/           # Controllers and Middleware
│   │   ├── Models/         # Database Models
│   │   ├── Providers/      # Service Providers
│   │   └── Services/       # Business Logic
│   ├── routes/             # API Routes
│   └── tests/              # Backend Tests
│
└── weather-front/          # Next.js Frontend
    ├── app/                # App Router Components
    ├── components/         # Reusable Components
    │   ├── forecast-card
    │   ├── weather-card
    │   └── weather-icon
    ├── lib/                # Utilities and Types
    └── public/             # Static Assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PHP 8.1 or higher
- Composer
- MySQL or PostgreSQL

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd weather-front
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
composer install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Generate application key:

```bash
php artisan key:generate
```

5. Run migrations:

```bash
php artisan migrate
```

6. Start the server:

```bash
php artisan serve
```

## 📱 Responsive Design

The application is built with a mobile-first approach and is fully responsive across all devices:

- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)
- 🖥️ Large screens (1280px and up)

## 🔄 API Endpoints

The backend provides the following API endpoints:

- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/location` - Get weather by location

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - Frontend Framework
- [Laravel](https://laravel.com/) - Backend Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
