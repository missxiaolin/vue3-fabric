import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueLazyLoad from "vue3-lazyload";
import ViewUiPlus from "view-ui-plus";
import "view-ui-plus/dist/styles/viewuiplus.css";

createApp(App)
  .use(store)
  .use(router)
  .use(VueLazyLoad, {})
  .use(ViewUiPlus)
  .mount("#app");
