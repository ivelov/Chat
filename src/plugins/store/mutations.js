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
    setChat(state, chat) {
        Vue.set(state.chats, chat.id, chat);
    },
    setActiveChat(state, index){
        state.activeChatIndex = index;
    },
    addNewMessages(state, payload){
        if(!state.chats[payload.chatId]){
            return;
        }
        
        if(!state.chats[payload.chatId].messages){
            state.chats[payload.chatId].messages = [];
        }

        state.chats[payload.chatId].messages.unshift(...payload.messages);
    }
};
