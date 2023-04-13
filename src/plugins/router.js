import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../pages/HelloWorld.vue";

Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: `/`,
            component: HomePage,
        },
    ],
    mode: "history",
});

export default router;
