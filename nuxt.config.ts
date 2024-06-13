// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    typescript: {
        typeCheck: true,
        strict: true,
    },
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            authUrl: process.env.AUTHURL,
        },
    },
    modules: ['@pinia/nuxt', 'nuxt-swiper'],
    plugins: [
        { src: '~/plugins/sweetalert2.ts', mode: 'client' },
        { src: '~/plugins/konva.ts', mode: 'client' },
        { src: '~/plugins/color.ts', mode: 'client' },
    ],
    // devServer: {
    //     host: '192.168.11.36',
    // },
});
