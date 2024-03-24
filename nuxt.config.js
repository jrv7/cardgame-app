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
    '@/assets/scss/components/system/app-modals-container.scss',
    '@/assets/scss/components/system/app-system-prompt-confirmation-message.scss',
    '@/assets/scss/components/common/app-loading.scss',
    '@/assets/scss/components/common/app-modal.scss',
    '@/assets/scss/components/common/app-card.scss',
    '@/assets/scss/components/common/app-card-message.scss',
    '@/assets/scss/components/common/app-input.scss',
    '@/assets/scss/components/common/app-button.scss',
    '@/assets/scss/components/common/app-table.scss',
    '@/assets/scss/components/common/app-table-pagination.scss',
    '@/assets/scss/components/common/app-list.scss',
    '@/assets/scss/components/common/app-badge.scss',
    '@/assets/scss/components/common/app-accordion.scss',
    '@/assets/scss/components/common/app-date-time-picker.scss',
    '@/assets/scss/components/common/app-label.scss',
    '@/assets/scss/components/common/app-mtg-card.scss',
    '@/assets/scss/components/common/app-mana-cost-symbol.scss',
    '@/assets/scss/components/common/app-mtg-set-symbol.scss',
    // MTG Components
    '@/assets/scss/components/common/mtg/mtg-card.scss',
    '@/assets/scss/components/common/mtg/app-mtg-set-symbol-carousel.scss',
    // Pages
    '@/assets/scss/components/pages/app-page--cards-list.scss',
    '@/assets/scss/components/pages/app-page--consumer.scss',
    // Sub Pages
    '@/assets/scss/components/pages/app-subpage--card-details.scss',
    '@/assets/scss/components/pages/app-page--subpage-card-filters-page.scss'
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
