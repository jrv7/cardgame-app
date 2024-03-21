// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  meta: {
    title: 'Fiducial'
  },
  ssr: false,
  $development: {
    routeRules: {
      '/**': { isr: false }
    }
  },
  vite: {
    hmr: false,
    server: {
      port: 24678,
      strictPort: true,
      watch: {
        usePolling: true
      }
    }
  },
  router: {
    options: {
      hashMode: false
    }
  },
  runtimeConfig:{
    public: {
      baseAppUrl: process.env.APP_BASE_URI,
      baseApiUrl: process.env.API_BASE_URL,
      useDevTools: process.env.ENVIRONMENT === 'development'
    }
  },
  modules: [
    'formidable',
    '@nuxtjs/i18n'
  ],
  buildModules: [
    '@nuxtjs/moment'
  ],
  i18n: {
    /* module options */
    lazy:true,
    langDir: "locales",
    strategy: "no_prefix",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        name: "English (US)",
        file: "en-US.json"
      },
      {
        code: "fr-FR",
        iso: "fr-FR",
        name: "Français",
        file: "fr-FR.json"
      }
    ],
    defaultLocale: "en-US",
    vueI18n: './nuxt-i18n.js'
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/scss/_resets.scss',
    '@/assets/scss/_imports.scss',
    '@/assets/scss/globals.scss',
    '@/assets/scss/colors.scss',
    '@/assets/scss/app.scss',
    '@/assets/scss/_grid.scss',
    '@/assets/scss/components/system/app-header.scss',
    '@/assets/scss/components/system/app-body.scss',
    '@/assets/scss/components/system/app-footer.scss',
    '@/assets/scss/components/common/app-card.scss',
    '@/assets/scss/components/common/app-card-message.scss',
    '@/assets/scss/components/common/app-input.scss',
    '@/assets/scss/components/common/app-button.scss',
      // Pages
    '@/assets/scss/components/pages/authorize-page.scss'
  ],
  components: [
    {
      global: true,
      pathPrefix: false,
      dirs: ['~/components/Common']
    },
    {
      global: true,
      pathPrefix: false,
      dirs: ['~/components/System']
    },
    {
      global: true,
      pathPrefix: false,
      dirs: ['~/components/Pages']
    }
  ]
})
