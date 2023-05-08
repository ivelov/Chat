import VueCookies from "vue-cookies";
export default {
  isAuth() {
    return VueCookies.get('emailVerified');
  },
  getUserName(state){
    if(!state.user){
      return '';
    }
    return state.user.nickname
      ? state.user.nickname
      : state.user.name;
  },
  getActiveChat(state){
    if(!state.activeChatIndex){
      return null;
    }
    return state.chats[state.activeChatIndex];
  },
  getActiveChatMessages(state){
    if(!state.activeChatIndex){
      return null;
    }
    return state.chats[state.activeChatIndex].messages;
  },
  getActiveChatIndex(state){
    return state.activeChatIndex;
  },
  isIdle(state){
    return state.isIdle;
  },
};
