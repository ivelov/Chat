import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import VueCookies from "vue-cookies";

// axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.defaults.headers.common = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json",
};

if (VueCookies.isKey("apiToken")) {
  axios.defaults.headers.common["Authorization"] =
      "Bearer " + VueCookies.get("apiToken");
}

axios.defaults.withCredentials = "true";

Vue.use(VueAxios, axios);

export default axios;
