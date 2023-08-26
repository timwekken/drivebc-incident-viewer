/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_APP_MAPBOX_TOKEN,
    NEXT_PUBLIC_STATIC_APP_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_STATIC_APP_MAPBOX_TOKEN,
  },
}

module.exports = nextConfig
