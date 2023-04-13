import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "./plugins/router"

Vue.config.productionTip = false;

Vue.use(Buefy);

Vue.use(VueAxios, axios);

new Vue({
  axios,
  router,
  render: (h) => h(App),
}).$mount("#app");
