import { defineNuxtPlugin } from '#app';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('color-picker', ColorPicker);
});
