import Vue from "vue";
export default {
    //sync
    setAuth(state, isAuth) {
        state.isAuth = isAuth;
    },
    setUser(state, user) {
        if(user){
            user.photo = `${process.env.VUE_APP_API_URL}/${user.photo}`;
        }
        state.user = user;
    },
    setChats(state, chats) {
        state.chats = chats;
    },
    addChat(state, chat) {
        if(state.chats[chat.id]){
            return;
        }else{
            Vue.set(state.chats, chat.id, chat);
            state.chats[chat.id] = chat;
        }
    },
    setActiveChat(state, index){
        state.activeChatIndex = index;
    }
};
