import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../pages/HomePage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import EmailConfirmPage from "../pages/EmailConfirmPage.vue";

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
        {
            path: "/verify/:userId/:token",
            component: EmailConfirmPage,
        },
    ],
    mode: "history",
});

export default router;
