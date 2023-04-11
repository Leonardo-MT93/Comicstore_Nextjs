/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['imgs.xkcd.com']
  },
  i18n: {         //De forma automatica nos va a crear -- /comic/123 => /es/comic/123 -----   La version en español
    locales: ['en', 'es'],
    defaultLocale: 'en',
  }
}

module.exports = nextConfig
