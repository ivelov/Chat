export default {
    //sync
    setAuth(state, payload) {
        state.isAuth = payload;
    },
    setUser(state, payload) {
        payload.photo = `${process.env.VUE_APP_API_URL}/${payload.photo}`;
        state.user = payload;
    },
    setChats(state, payload) {
        state.chat = payload;
    },
};
