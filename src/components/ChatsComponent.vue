<template>
  <section class="has-background-info-dark">
    <!-- User info -->
    <div class="is-flex is-align-content-center">
      <img
        class="avatar"
        :src="$store.state.user.photo"
        alt="avatar"
        @click="photoClick"
      />
      <span class="my-auto ml-3 has-text-white">
        {{ userName }}
      </span>
    </div>

    <!-- New chat btn -->
    <div class="is-flex is-align-content-center mt-5">
      <b-button @click="newChat" class="is-primary"> New chat </b-button>
    </div>

    <!-- Chat list -->
    <ul
      class="mt-3 has-text-white"
    >
      <li class="is-flex"
      v-for="(chat, id) in $store.state.chats"
      :key="id"
      @click="selectChat(id)">
        <!-- Avatar -->
        <img
          class="avatar"
          :src="`${apiUrl}/${chat.avatar}`"
          alt="chat avatar"
        />

        <!-- Chat name -->
        <div class="ml-3 w-full">
          <p>
            {{ chat.name }}
          </p>

          <div
            class="is-flex is-justify-content-space-between is-align-content-center is-size-7"
          >
            <div class="is-clipped my-auto">
              <!-- Last message stripped -->
              <span>
                {{
                  chat.lastMessage
                    ? chat.lastMessage.length > 14
                      ? chat.lastMessage.substring(0, 14) + "..."
                      : chat.lastMessage
                    : "12345678901234"
                }}
              </span>
            </div>

            <!-- Unread count -->
            <div class="unread">
              <div>
                {{ chat.unread_count === 0 ? "99+" : chat.unreadedCount }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      addChatLoading: false,
    };
  },
  computed: {
    userName() {
      return this.$store.getters.getUserName;
    },
  },
  mounted() {
    this.$store.dispatch("getChats");
  },
  methods: {
    photoClick() {
      ///////////////////
      console.log("photo");
    },
    newChat() {
      this.$buefy.dialog.prompt({
        message: "Enter user email",
        inputAttrs: {
          type: "email",
        },
        confirmText: "Add",
        trapFocus: true,
        closeOnConfirm: false,
        onConfirm: (email, { close }) => {
          if (this.addChatLoading) {
            return;
          }
          this.addChatLoading = true;

          this.$store
            .dispatch("addChat", email)
            .then(() => {
              close();
            })
            .catch((response) => {
              if (response.data?.errors?.email) {
                this.$buefy.notification.open({
                  message: response.data.errors.email,
                  type: "is-danger",
                });
              } else {
                this.$buefy.notification.open({
                  message: "An error occurred!",
                  type: "is-danger",
                });
              }
            })
            .finally(() => {
              this.addChatLoading = false;
            });
        },
      });
    },
    selectChat(id){
      this.$store.dispatch('setActiveChat', id);
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 50px;
  height: 50px;
}
.w-full {
  width: 100%;
}
.unread {
  display: table;
  width: 25px;
  height: 25px;
  text-align: center;
  background-color: dodgerblue;
  border-radius: 50%;
}
.unread * {
  display: table-cell;
  vertical-align: middle;
}
</style>
