/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ['openweathermap.org'], // Allow images from OpenWeatherMap
      unoptimized: true,
    },
  };
  
  export default nextConfig;
  