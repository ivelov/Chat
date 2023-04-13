import VueCookies from "vue-cookies";

export default {
    user: VueCookies.get("apiToken")
        ? { name: "Loading..." }
        : false,
};
