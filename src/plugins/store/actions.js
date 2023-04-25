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
          reason.response.status === 401 &&
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
          reason.response.status === 401 &&
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
  return (data) => {
    if (data.userId === state.state.user.id) {
      return;
    }

    let chat = state.state.chats[chatId];
    if (!chat) {
      console.error("New message to chat that not exist");
      return;
    }

    state.commit("addNewMessages", {
      messages: [
        {
          message: data.message,
          fromYou: false,
          created_at: parseDate(new Date()),
        },
      ],
      chatId: chatId,
    });
    state.commit("setLastMessage", {
      message: data.message,
      chatId: chatId,
    });

    if (state.getters.getActiveChatIndex !== chatId) {
      state.commit("incrementUnreadCount", chatId);
    }

    //Send notification if user is idle
    if (state.getters.isIdle) {
      if (state.state.notificationAllow && !chat.muted) {
        Vue.notification.show(
          chat.name,
          {
            body: data.message,
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

function parseDate(date) {
  let month = ('0'+date.getMonth()).slice(-2);
  let day = ('0'+date.getDate()).slice(-2);
  let hours = ('0'+date.getHours()).slice(-2);
  let minutes = ('0'+date.getMinutes()).slice(-2);
  return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`;
}

export default {
  //async
  async login(state, data) {
    return new Promise((resolve, reject) => {
      post("/V1/api/login", data)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.token;

          VueCookies.set("apiToken", response.data.token);

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
      post("/V1/api/logout")
        .then((response) => {
          delete axios.defaults.headers.common["Authorization"];

          VueCookies.remove("apiToken");

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
      post("/V1/api/register", data)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.token;

          VueCookies.set("apiToken", response.data.token);

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
      get("/V1/api/user")
        .then((response) => {
          state.commit("setUser", response.data);
          state.dispatch("registerUserPrivateListener");

          resolve(response.data);
        })
        .catch(() => {
          state.commit("setUser", null);
          VueCookies.remove("apiToken");
          resolve(false);
        });
    });
  },
  async sendMail(state) {
    return new Promise((resolve) => {
      post("/V1/api/email/verification-notification")
        .then((response) => {
          state.commit("setUser", response.data);
          resolve(response.data);
        })
        .catch(() => {
          state.commit("setUser", null);
          VueCookies.remove("apiToken");
          resolve(false);
        });
    });
  },
  async getChats(state) {
    return new Promise((resolve, reject) => {
      get("/V1/api/chats")
        .then((response) => {
          state.dispatch("setListenersToChats", response.data);

          state.commit("setChats", response.data);
          resolve(response.data);
        })
        .catch(() => {
          reject();
        });
    });
  },
  async addChat(state, email) {
    return new Promise((resolve, reject) => {
      post("/V1/api/chats", { email: email })
        .then((response) => {
          state.commit("setChat", response.data);
          state.commit("setActiveChat", response.data.id);

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

      get("/V1/api/chats/" + state.getters.getActiveChatIndex)
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
  async sendMessage(state, message) {
    let chatId = state.getters.getActiveChatIndex;
    return new Promise((resolve, reject) => {
      post("/V1/api/chats/" + chatId, { message: message })
        .then(() => {
          state.commit("addNewMessages", {
            messages: [
              {
                message: message,
                fromYou: true,
                created_at: parseDate(new Date()),
              },
            ],
            chatId: chatId,
          });
          state.commit("setLastMessage", { message: message, chatId: chatId });
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

      post("/V1/api/user/" + state.state.user.id, formData)
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
      window.Echo.private("chats." + key).listen(
        "NewMessageEvent",
        getChatCallback(state, key)
      );
    }
  },
  async markAsRead(state, chatId) {
    return new Promise((resolve, reject) => {
      post(`/V1/api/chats/${chatId}/mark-as-read`)
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
      authEndpoint: "/V1/broadcasting/auth",
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

      post(`/V1/api/chats/${chatId}/${chat.muted ? "unmute" : "mute"}`)
        .then(() => {
          state.commit("setChatMuted", { chatId: chatId, muted: !chat.muted });
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
};
