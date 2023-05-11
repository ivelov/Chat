import axios from "axios";
import VueCookies from "vue-cookies";
import Echo from "@ably/laravel-echo";
import Vue from "vue";
import router from "../router";

function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then((response) => {
        resolve(response);
      })
      .catch((reason) => {
        console.error(reason);

        if (
          reason?.response?.status === 401 &&
          router.currentRoute.path !== "/login"
        ) {
          router.push("/login");
          router.go();
        }
        reject(reason);
      });
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        resolve(response);
      })
      .catch((reason) => {
        console.error(reason);

        if (
          reason?.response?.status === 401 &&
          router.currentRoute.path !== "/login"
        ) {
          router.push("/login");
          router.go();
        }
        reject(reason);
      });
  });
}

function getChatCallback(state, chatId) {
  return (message) => {
    if (message.userId === state.state.user.id) {
      return;
    }

    let chat = state.state.chats[chatId];
    if (!chat) {
      console.error("New message to chat that do not exist");
      return;
    }
    if (checkIfMessageExist(chat, message.id)) {
      console.error("New message already exist");
      return;
    }

    state.commit("addNewMessages", {
      messages: [
        {
          ...message,
          fromYou: false,
          created_at: parseDate(new Date()),
        },
      ],
      chatId: chatId,
    });
    state.commit("setLastMessage", {
      message: message.message,
      chatId: chatId,
      attachment_type: message.attachment_type,
    });

    if (state.getters.getActiveChatIndex !== chatId) {
      state.commit("incrementUnreadCount", chatId);
    }

    //Send notification if user is idle
    if (state.getters.isIdle) {
      if (state.state.notificationAllow && !chat.muted) {
        let body = message.message ? message.message : message.attachment_type;
        Vue.notification.show(
          chat.name,
          {
            body: body,
          },
          {}
        );
      }

      if (state.getters.getActiveChatIndex === chatId) {
        state.commit("incrementUnreadCount", chatId);
      }
      // Mark as read if user is not idle
    } else if (state.getters.getActiveChatIndex === chatId) {
      state.dispatch("markAsRead", chatId);
    }
  };
}

function checkIfMessageExist(chat, messageId) {
  let limit = 10;
  for (let i = 0; i < chat.messages.length && i < limit; i++) {
    if (chat.messages[i].id === messageId) {
      return true;
    }
  }
  return false;
}

function getMessageUpdateCallback(state, chatId) {
  return (message) => {
    if (message.userId === state.state.user.id) {
      return;
    }

    let chat = state.state.chats[chatId];
    if (!chat) {
      console.error("Update message in chat that do not exist");
      return;
    }

    state.commit("updateMessage", {
      messageId: message.id,
      message: message.message,
      chatId: chatId,
    });
  };
}

function getMessageDeleteCallback(state, chatId) {
  return (message) => {
    if (message.userId === state.state.user.id) {
      return;
    }

    let chat = state.state.chats[chatId];
    if (!chat) {
      console.error("Delete message in chat that do not exist");
      return;
    }

    state.commit("deleteMessage", {
      messageId: message.id,
      chatId: chatId,
    });
  };
}

function parseDate(date) {
  let month = ("0" + date.getMonth()).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`;
}

export default {
  //async
  async login(state, data) {
    return new Promise((resolve, reject) => {
      post("/api/login", data)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.token;

          VueCookies.set("apiToken", response.data.token);
          VueCookies.set("emailVerified", true);

          state.commit("setUser", response.data.user);

          state.dispatch("registerEcho");
          state.dispatch("registerUserPrivateListener");

          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async logout(state) {
    return new Promise((resolve, reject) => {
      post("/api/logout")
        .then((response) => {
          delete axios.defaults.headers.common["Authorization"];

          VueCookies.remove("apiToken");
          VueCookies.remove("emailVerified");

          state.commit("setUser", null);
          state.commit("setChats", {});
          state.commit("setActiveChat", null);

          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async register(state, data) {
    return new Promise((resolve, reject) => {
      post("/api/register", data)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.token;

          VueCookies.set("apiToken", response.data.token);
          VueCookies.remove("emailVerified");

          state.commit("setUser", response.data.user);

          state.dispatch("registerEcho");
          state.dispatch("registerUserPrivateListener");

          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async defineUser(state) {
    return new Promise((resolve) => {
      get("/api/user")
        .then((response) => {
          state.commit("setUser", response.data);
          if (response.data.email_verified_at) {
            state.dispatch("registerUserPrivateListener");            
            VueCookies.set("emailVerified", true);
          }else{
            VueCookies.remove("emailVerified");
          }

          resolve(response.data);
        })
        .catch(() => {
          state.commit("setUser", null);
          VueCookies.remove("apiToken");
          VueCookies.remove("emailVerified");
          resolve(false);
        });
    });
  },
  async sendMail(state) {
    return new Promise((resolve) => {
      post("/api/email/verification-notification")
        .then((response) => {
          state.commit("setUser", response.data);
          resolve(response.data);
        })
        .catch(() => {
          state.commit("setUser", null);
          VueCookies.remove("apiToken");
          VueCookies.remove("emailVerified");
          resolve(false);
        });
    });
  },
  async getChats(state) {
    return new Promise((resolve, reject) => {
      get("/api/chats")
        .then((response) => {
          state.dispatch("setListenersToChats", response.data);
          state.dispatch("setLastMessageToChats", response.data);
          resolve(response.data);
        })
        .catch(() => {
          reject();
        });
    });
  },
  async addChat(state, userId) {
    return new Promise((resolve, reject) => {
      post("/api/chats", { userId: userId })
        .then((response) => {
          let chat = response.data;
          for (let i = 0; i < chat.messages.length; i++) {
            chat.messages[i].created_at = parseDate(
              new Date(chat.messages[i].created_at)
            );
          }
          state.commit("setChat", chat);//
          state.commit("setActiveChat", chat.id);
          
          if(chat.messages[0]){
            state.commit("setLastMessage", {...chat.messages[0], chatId:chat.id});
          }

          let chatInObject = {};
          chatInObject[response.data.id] = response.data;
          state.dispatch("setListenersToChats", chatInObject);

          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async getActiveChatInfo(state) {
    return new Promise((resolve, reject) => {
      if (!state.getters.getActiveChat) {
        console.error("Vuex active chat is null");
        reject();
        return;
      }
      //If messages already loaded
      if (state.getters.getActiveChat.hasMore === false) {
        resolve();
        return;
      }

      get("/api/chats/" + state.getters.getActiveChatIndex)
        .then((response) => {
          let chat = response.data;
          for (let i = 0; i < chat.messages.length; i++) {
            chat.messages[i].created_at = parseDate(
              new Date(chat.messages[i].created_at)
            );
          }

          state.commit("setChatMessages", chat);
          resolve(chat);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async setActiveChat(state, index) {
    state.commit("setActiveChat", index);
    state.dispatch("getActiveChatInfo");
    if (state.state.chats[index]?.unread_count > 0) {
      state.dispatch("markAsRead", index);
      state.commit("resetUnreadCount", index);
    }
  },
  async sendMessage(state, payload) {
    return new Promise((resolve, reject) => {
      let chatId = state.getters.getActiveChatIndex;

      let data = new FormData();
      data.append("message", payload.message);

      //Add attachment
      let attachment_type = null;
      if (payload.attachment) {
        data.append("attachment", payload.attachment);

        if (payload.attachment.type.indexOf("image") !== -1) {
          attachment_type = "image";
        } else if (payload.attachment.type.indexOf("video") !== -1) {
          attachment_type = "video";
        } else {
          console.error("unexpected attachment type");
          reject("unexpected type");
          return;
        }
        data.append("attachment_type", attachment_type);
      }

      post("/api/chats/" + chatId, data)
        .then((response) => {
          let message = response.data;
          message.created_at = parseDate(new Date(message.created_at));

          state.commit("addNewMessages", {
            messages: [
              {
                fromYou: true,
                ...message,
              },
            ],
            chatId: chatId,
          });

          state.commit("setLastMessage", message);
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async updateUser(state, data) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      for (const key in data) {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }

      post("/api/user/" + state.state.user.id, formData)
        .then((response) => {
          state.commit("setUser", response.data);

          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async setListenersToChats(state, chats) {
    for (const key in chats) {
      window.Echo.private("chats." + key)
        .listen("NewMessageEvent", getChatCallback(state, key))
        .listen("MessageUpdateEvent", getMessageUpdateCallback(state, key))
        .listen("MessageDeleteEvent", getMessageDeleteCallback(state, key));
    }
  },
  async markAsRead(state, chatId) {
    return new Promise((resolve, reject) => {
      post(`/api/chats/${chatId}/mark-as-read`)
        .then(() => {
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  registerEcho() {
    window.Echo = new Echo({
      broadcaster: "ably",
      // authEndpoint: "/V1/broadcasting/auth",
      authEndpoint: process.env.VUE_APP_API_URL+"/broadcasting/auth",
      auth: {
        headers: { authorization: "Bearer " + VueCookies.get("apiToken") },
      },
      echoMessages: true, // self-echo for published message is set to false internally.
      queueMessages: true, // default: true, maintains queue for messages to be sent.
      disconnectedRetryTimeout: 15000, // Retry connect after 15 seconds when client gets disconnected
    });
  },
  registerUserPrivateListener(state) {
    let userId = state.state.user.id;
    if (!userId) {
      console.error("UserPrivateChannel: userId is null");
      return;
    }

    window.Echo.private("users." + userId).listen("NewChatEvent", (data) => {
      let chat = {
        id: data.chatId,
        name: data.name,
        unread_count: 0,
        hasMore: false,
        muted: 0,
        messages: [],
        avatar: data.avatar,
      };
      state.commit("setChat", chat);

      let chatInObject = {};
      chatInObject[chat.id] = chat;
      state.dispatch("setListenersToChats", chatInObject);
    });
  },
  async toggleActiveChatMute(state) {
    return new Promise((resolve, reject) => {
      let chat = state.getters.getActiveChat;
      if (!chat) {
        console.error("chat not found");
        reject();
        return;
      }

      let chatId = state.getters.getActiveChatIndex;

      post(`/api/chats/${chatId}/${chat.muted ? "unmute" : "mute"}`)
        .then(() => {
          state.commit("setChatMuted", { chatId: chatId, muted: !chat.muted });
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async resetActiveChat(state) {
    state.commit("setActiveChat", null);
  },
  async setLastMessageToChats(state, chats) {
    for (const key in chats) {
      let message = chats[key].last_message?.message;

      if (!message) {
        if (!chats[key].last_message?.attachment) {
          chats[key].last_message = "";
          continue;
        } else {
          chats[key].last_message = chats[key].last_message.attachment_type;
          continue;
        }
      }

      chats[key].last_message =
        message.length > 14 ? message.substring(0, 14) + "..." : message;
    }

    state.commit("setChats", chats);
  },
  async deleteMessage(state, messageId) {
    return new Promise((resolve, reject) => {
      let chatId = state.getters.getActiveChatIndex;
      if (!messageId || !chatId) {
        console.error("delete message invalid params");
        reject();
        return;
      }

      post(`/api/messages/${messageId}/delete`)
        .then(() => {
          state.commit("deleteMessage", {
            chatId: chatId,
            messageId: messageId,
          });
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async saveMessage(state, payload) {
    return new Promise((resolve, reject) => {
      let chatId = state.getters.getActiveChatIndex;
      if (!payload?.messageId || !chatId || !payload?.message) {
        console.error("save message invalid params");
        reject();
        return;
      }

      post(`/api/messages/${payload.messageId}`, {
        message: payload.message,
      })
        .then(() => {
          state.commit("updateMessage", {
            chatId: chatId,
            messageId: payload.messageId,
            message: payload.message,
          });
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async loadMoreMessages(state) {
    return new Promise((resolve, reject) => {
      let chatId = state.getters.getActiveChatIndex;
      if (!chatId) {
        reject();
        return;
      }

      let offset =
        state.state.chats[state.getters.getActiveChatIndex].messages.length;
      get(`/api/chats/${chatId}?offset=${offset}`)
        .then((response) => {
          let chat = response.data;
          for (let i = 0; i < chat.messages.length; i++) {
            chat.messages[i].created_at = parseDate(
              new Date(chat.messages[i].created_at)
            );
          }
          
          state.commit("addNewMessages", {
            chatId: chat.id,
            messages: chat.messages,
            toBack: true,
          });
          state.commit("setChatHasMore", {
            chatId: chat.id,
            hasMore: chat.hasMore,
          });
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async searchUsers(state, searchText) {
    return new Promise((resolve, reject) => {
      post(`/api/users`, {searchText:searchText})
        .then((response) => {
          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
};
