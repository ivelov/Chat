import VueCookies from "vue-cookies";

export default {
    user: VueCookies.get("apiToken")
        ? { name: "Loading...", photo:`${process.env.VUE_APP_API_URL}/public/storage/avatars/default.png` }
        : false,
    chats:{},
    activeChatIndex: null,
    isIdle: false,
    notificationAllow: false,
};
