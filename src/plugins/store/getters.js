export default {
  isAuth(state) {
    return state.user;
  },
  getUserName(state){
    return state.user.nickname
      ? state.user.nickname
      : state.user.name;
  },
};
