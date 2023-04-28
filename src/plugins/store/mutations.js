import Vue from "vue";
export default {
  //sync
  setAuth(state, isAuth) {
    state.isAuth = isAuth;
  },
  setUser(state, user) {
    if (user) {
      user.photo = `${process.env.VUE_APP_API_URL}/${user.photo}`;
    }
    state.user = user;
  },
  setChats(state, chats) {
    if (Array.isArray(chats)) {
      chats = Object.assign({}, chats);
    }
    state.chats = chats;
  },
  setChat(state, chat) {
    if (!state.chats) {
      state.chats = {};
      state.chats[chat.id] = chat;
    } else {
      Vue.set(state.chats, chat.id, chat);
    }
  },
  setChatMessages(state, chat) {
    Vue.set(state.chats[chat.id], "messages", chat.messages);
  },
  setActiveChat(state, index) {
    state.activeChatIndex = index;
  },
  addNewMessages(state, payload) {
    if (!state.chats[payload.chatId]) {
      return;
    }

    if (!state.chats[payload.chatId].messages) {
      state.chats[payload.chatId].messages = [];
    }

    state.chats[payload.chatId].messages.unshift(...payload.messages);
  },
  setLastMessage(state, message) {
    let newMessage = message?.message;

    if (!newMessage) {
      if (!message?.attachment_type) {
        Vue.set(state.chats[message.chatId], "last_message", "");
        return;
      } else {
        Vue.set(
          state.chats[message.chatId],
          "last_message",
          message.attachment_type
        );
        return;
      }
    }

    newMessage =
      newMessage.length > 14 ? newMessage.substring(0, 14) + "..." : newMessage;
    Vue.set(state.chats[message.chatId], "last_message", newMessage);
  },
  resetUnreadCount(state, chatId) {
    if (!state.chats[chatId]) {
      return;
    }
    state.chats[chatId].unread_count = 0;
  },
  incrementUnreadCount(state, chatId) {
    state.chats[chatId].unread_count++;
  },
  setIdle(state, status) {
    state.isIdle = status;
  },
  setNotificationAllow(state, status) {
    state.notificationAllow = status;
  },
  setChatMuted(state, payload) {
    Vue.set(state.chats[payload.chatId], "muted", payload.muted);
  },
};
