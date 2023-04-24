import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import axios from "./plugins/axios";
import VueCookies from "vue-cookies";
import store from "./plugins/store";
import router from "./plugins/router";
import VueChatScroll from 'vue-chat-scroll';
import Echo from '@ably/laravel-echo';
import * as Ably from 'ably';

Vue.config.productionTip = false;

Vue.use(Buefy);

Vue.use(VueCookies);

Vue.use(VueChatScroll);

window.Ably = Ably;
window.Echo = new Echo({
    broadcaster: 'ably',
    authEndpoint: '/V1/broadcasting/auth',
    auth:{headers:{'authorization': "Bearer " + VueCookies.get("apiToken")}},
    echoMessages: true, // self-echo for published message is set to false internally.
    queueMessages: true, // default: true, maintains queue for messages to be sent.
    disconnectedRetryTimeout: 1500000, // Retry connect after 15 seconds when client gets disconnected
});

const app = new Vue({
  axios,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

app.$store.dispatch("defineUser");
