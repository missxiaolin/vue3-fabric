import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueLazyLoad from "vue3-lazyload";
import ViewUiPlus from "view-ui-plus";
import "view-ui-plus/dist/styles/viewuiplus.css";
import "./assets/fonts/font.css"

import i18n from './language/index';

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(VueLazyLoad, {})
  .use(ViewUiPlus)
  .mount("#app");
