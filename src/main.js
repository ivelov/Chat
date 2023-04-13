import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import axios from "./plugins/axios";
import VueCookies from "vue-cookies";
import store from "./plugins/store";
import router from "./plugins/router"

Vue.config.productionTip = false;

Vue.use(Buefy);

Vue.use(VueCookies);

const app = new Vue({
  axios,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

app.$store.dispatch("defineUser");