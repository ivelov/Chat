<template>
  <section class="bg-main is-flex is-flex-direction-column">
    <!-- User info -->
    <div class="is-flex is-align-content-center" v-if="$store.getters.isAuth">
      <img
        class="avatar"
        :src="$store.state.user.photo"
        alt="avatar"
        @click="photoClick"
      />
      <span class="my-auto ml-3 text-white">
        {{ userName }}
      </span>
    </div>

    <!-- New chat btn -->
    <div class="is-flex is-align-content-center mt-5">
      <b-button @click="addChatModal = true" class="bg-btn"> New chat </b-button>
    </div>

    <!-- Chat list -->
    <div class="is-flex-grow-1 overflow-y-auto">
      <ul class="mt-3 text-white chat-list">
        <li
          class="is-flex mb-3"
          v-for="(chat, id) in $store.state.chats"
          :key="id"
          @click="selectChat(id)"
        >
          <!-- Avatar -->
          <img
            class="avatar"
            :src="`${apiUrl}/public/${chat.avatar}`"
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
                  {{ chat.last_message }}
                </span>
              </div>

              <!-- Unread count -->
              <div class="unread" v-if="chat.unread_count > 0">
                <div>
                  {{ chat.unread_count }}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <b-modal v-model="addChatModal" trap-focus>
      <UserSearchComponent @close="addChatModal = false"></UserSearchComponent>
    </b-modal>

    <b-modal v-model="userPropertiesModal" trap-focus>
      <UserActionsComponent></UserActionsComponent>
    </b-modal>
  </section>
</template>

<script>
import UserActionsComponent from "../components/UserActionsComponent.vue";
import UserSearchComponent from "../components/UserSearchComponent.vue";
export default {
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      userPropertiesModal: false,
      addChatModal: false,
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
      this.userPropertiesModal = true;
    },
    selectChat(id) {
      this.$store.dispatch("setActiveChat", id);
    },
    
  },
  components: { UserActionsComponent, UserSearchComponent },
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
.overflow-y-auto {
  overflow-y: auto;
}
</style>
