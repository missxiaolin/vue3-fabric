import svgIcon from './index.vue';

export default {
  install(Vue: any) {
    Vue.component(svgIcon.name, svgIcon);
  },
};
