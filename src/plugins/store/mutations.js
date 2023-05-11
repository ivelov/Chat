import Vue from "vue";
export default {
  //sync
  setAuth(state, isAuth) {
    state.isAuth = isAuth;
  },
  setUser(state, user) {
    if (user) {
      user.photo = `${process.env.VUE_APP_API_URL}/public/${user.photo}`;
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
    let chat = state.chats[payload.chatId];
    if (!chat) {
      return;
    }

    if (!chat.messages) {
      chat.messages = [];
    }

    let limit = 10;
    let idsToSearch = []; //id`s of last or first messages
    if (payload.toBack) {
      for (let i = chat.messages.length-1; i >= 0 && chat.messages.length - i < limit; i--) {
        idsToSearch.push(chat.messages[i].id);
      }
    }else{
      for (let i = 0; i < chat.messages.length && i < limit; i++) {
        idsToSearch.push(chat.messages[i].id);
      }
    }
    
    //remove messages that already exist
    payload.messages.filter((message)=>{
      for (let i = 0; i < idsToSearch.length; i++) {
        if(message.id === idsToSearch[i]){
          return false;
        }
      }
      return true;
    })

    if (payload.toBack) {
      chat.messages.push(...payload.messages);
    } else {
      chat.messages.unshift(...payload.messages);
    }
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
  deleteMessage(state, payload) {
    for (let i = 0; i < state.chats[payload.chatId].messages.length; i++) {
      if (state.chats[payload.chatId].messages[i].id === payload.messageId) {
        state.chats[payload.chatId].messages.splice(i, 1);
        return;
      }
    }
  },
  updateMessage(state, payload) {
    for (let i = 0; i < state.chats[payload.chatId].messages.length; i++) {
      if (state.chats[payload.chatId].messages[i].id === payload.messageId) {
        state.chats[payload.chatId].messages[i].message = payload.message;
        return;
      }
    }
  },
  setChatHasMore(state, payload) {
    Vue.set(state.chats[payload.chatId], "hasMore", payload.hasMore);
  },
};
