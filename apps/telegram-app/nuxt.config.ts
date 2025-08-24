export default defineNuxtConfig({
  extends: ['@woodlands/ui'],
  modules: ['@pinia/nuxt'],
  experimental: {
    typedPages: true,
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  devtools: {
    componentInspector: false,
  },
  devServer: {
    port: 4300,
    host: 'app.local',
    https: {
      key: '../../.cert/localhost-key.pem',
      cert: '../../.cert/localhost.pem',
    },
  },
  routeRules: {
    '/**': { ssr: false },
    '/api/**': { prerender: false },
  },
  runtimeConfig: {
    telegram: {
      botToken: '',
      devBotToken: '',
    },
  },
  css: ['~/assets/css/styles.css'],
  i18n: {
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en-US.json' },
    ],
    strategy: 'no_prefix',
  },
  pinia: {
    storesDirs: ['./app/stores/**'],
  },
  compatibilityDate: '2025-08-22',
})
