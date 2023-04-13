import axios from "axios";
import VueCookies from "vue-cookies";

export default {
    //async
    async login(state, data) {
        return new Promise((resolve, reject) => {
            axios
                .post("/api/login", data)
                .then((response) => {
                    axios.defaults.headers.common["Authorization"] =
                        "Bearer " + response.data.token;

                    VueCookies.set("apiToken", response.data.token);

                    state.commit("setUser", response.data.user);

                    resolve(response.data);
                })
                .catch((reason) => {
                    reject(reason.response);
                });
        });
    },
    async logout(state) {
        return new Promise((resolve, reject) => {
            axios
                .post("/api/logout")
                .then((response) => {
                    delete axios.defaults.headers.common["Authorization"];

                    VueCookies.remove("apiToken");

                    state.commit("setUser", null);

                    resolve(response.data);
                })
                .catch((reason) => {
                    reject(reason.response);
                });
        });
    },
    async register(state, data) {
        return new Promise((resolve, reject) => {
            axios
                .post("/V1/api/register", data)
                .then((response) => {
                    // axios.defaults.headers.common["Authorization"] =
                    //     "Bearer " + response.data.token;

                    // VueCookies.set("apiToken", response.data.token);

                    // state.commit("setUser", response.data.user);

                    // resolve(response.data);
                    console.log(response);
                })
                .catch((reason) => {
                    console.log(reason.response);
                    reject(reason.response);
                });
        });
    },
    async defineUser(state) {
        state;
        // return new Promise((resolve) => {
        //     axios
        //         .get("/api/user")
        //         .then((response) => {
        //             state.commit("setUser", response.data);
        //             resolve(response.data);
        //         })
        //         .catch(() => {
        //             state.commit("setUser", null);
        //             VueCookies.remove("apiToken");
        //             resolve(false);
        //         });
        // });
    },
};
