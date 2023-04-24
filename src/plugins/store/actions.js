import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  //async
  async login(state, data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/V1/api/login", data)
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
        .post("/V1/api/logout")
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
      axios
        .post("/V1/api/register", data)
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
  async defineUser(state) {
    return new Promise((resolve) => {
      axios
        .get("/V1/api/user")
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
  async sendMail(state) {
    return new Promise((resolve) => {
      axios
        .post("/V1/api/email/verification-notification")
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
      axios
        .get("/V1/api/chats")
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
      axios
        .post("/V1/api/chats", { email: email })
        .then((response) => {
          state.commit("setChat", response.data);
          state.commit("setActiveChat", response.data.id);
          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async getActiveChatInfo(state) {
    if (!state.getters.getActiveChatIndex) {
      console.error("Vuex active chat index is null");
      return;
    }
    //If messages already loaded
    if (state.getters.getActiveChat?.messages) {
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .get("/V1/api/chats/" + state.getters.getActiveChatIndex)
        .then((response) => {
          state.commit("setChatMessages", response.data);
          resolve(response.data);
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
  async setActiveChat(state, index) {
    state.commit("setActiveChat", index);
    state.dispatch("getActiveChatInfo");
    if(state.state.chats[index]?.unread_count > 0){
      state.dispatch("markAsRead", index);
      state.commit('resetUnreadCount', index);
    }
  },
  async sendMessage(state, message) {
    let chatId = state.getters.getActiveChatIndex;
    return new Promise((resolve, reject) => {
      axios
        .post("/V1/api/chats/" + chatId, { message: message })
        .then(() => {
          state.commit("addNewMessages", {
            messages: [{ message: message, fromYou: true }],
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

      axios
        .post("/V1/api/user/" + state.state.user.id, formData)
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
    let getChatCallback = (chatId) => {
      return (data) => {
        if (data.userId === state.state.user.id) {
          return;
        }

        state.commit("addNewMessages", {
          messages: [{ message: data.message, fromYou: false }],
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
          console.log("notify");
        // Mark as read if user is not idle
        } else if (state.getters.getActiveChatIndex === chatId) {
          state.dispatch("markAsRead", chatId);
        }
      };
    };

    for (const key in chats) {
      window.Echo.private("chats." + key).listen(
        "NewMessageEvent",
        getChatCallback(key)
      );
    }
  },
  async markAsRead(state, chatId) {
    return new Promise((resolve, reject) => {
      axios
        .post(`/V1/api/chats/${chatId}/mark-as-read`)
        .then(() => {
          resolve();
        })
        .catch((reason) => {
          reject(reason.response);
        });
    });
  },
};
