import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
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
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/register",
      component: RegisterPage,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/login",
      component: LoginPage,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/verify/:userId/:token",
      component: EmailConfirmPage,
    },
  ],
  mode: "history",
});

router.beforeEach((to, from, next) => {
  if (to.meta.hideForAuth) {
    if (store.getters.isAuth) {
      next({ path: "/" });
    } else {
      next();
    }
  } else if (to.meta.requireAuth) {
    if (store.getters.isAuth) {
      next();
    } else {
      next({ path: "/login" });
    }
  } else {
    next();
  }
});

export default router;
