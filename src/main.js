import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import VueResource from "vue-resource";
import reactiveStorage from "vue-reactive-storage";

Vue.use(VueResource);
Vue.use(reactiveStorage, {
  radioNewUIdark: false,
  radioNewUIendlessScroll: false,
  radioNewUIvolume: 1
});

Vue.config.productionTip = false;
Vue.http.options.emulateJSON = true;

new Vue({
  render: h => h(App)
}).$mount("#app");
