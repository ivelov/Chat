import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../pages/HelloWorld.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue";

Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: HomePage,
        },
        {
            path: "/register",
            component: RegisterPage,
        },
        {
            path: "/login",
            component: LoginPage,
        },
    ],
    mode: "history",
});

export default router;
