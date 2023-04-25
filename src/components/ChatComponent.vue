<template>
  <section class="h-full has-background-link-dark">
    <div
      v-if="chat"
      class="is-flex is-flex-direction-column is-justify-content-space-between h-full has-background-color-dodger"
    >
      <!-- Header -->
      <div
        class="is-flex is-justify-content-space-between is-align-content-center px-3 py-1 h-50 is-flex-grow-0 has-text-white has-background-link-dark"
      >
        <div class="my-auto">{{ chat.name }}</div>
        <b-button
          @click="toggleMute"
          class="is-primary my-auto"
          :disabled="muteLoading"
          :loading="muteLoading"
        >
          {{ chat.muted ? "Unmute" : "Mute" }}
        </b-button>
      </div>

      <!-- Messages -->
      <div
        class="is-flex-grow-1 has-background-color-dodger overflow-y-scroll-hidden py-5 px-2"
        v-chat-scroll
      >
        <ul class="is-flex is-flex-direction-column-reverse">
          <li
            v-if="messagesLoading"
            class="message message-right mb-2 is-relative h-34 loading"
          >
            Sending...
          </li>

          <li
            v-for="(message, index) in messages"
            :key="index"
            :class="message.fromYou ? 'message-right' : ''"
            class="message mb-2"
          >
            <p class="is-size-7">{{ message.created_at }}</p>
            <p v-html="message.message"></p>
          </li>
        </ul>
      </div>

      <!-- Input field -->
      <div
        class="h-50 is-flex-grow-0"
        @keydown.enter.exact.prevent="sendMessage"
      >
        <b-field>
          <b-input
            v-model="message"
            class="child-h-full"
            custom-class="h-50 resize-none is-clipped"
            type="textarea"
            rows="1"
            icon-right-clickable
            icon-right="send-circle"
            @icon-right-click="sendMessage"
          ></b-input>
        </b-field>
      </div>
    </div>

    <!-- Select a chat -->
    <div
      v-else
      class="h-full is-flex is-align-content-center is-flex-direction-column"
    >
      <p class="my-auto is-size-2 has-text-white has-text-centered">
        Select a chat
      </p>
    </div>
  </section>
</template>

<script>
import IdleMixin from "../mixins/IdleMixin.vue";
export default {
  data() {
    return {
      muteLoading: false,
      message: "",
      messagesSending: 0,
    };
  },
  computed: {
    chat() {
      return this.$store.getters.getActiveChat;
    },
    messages() {
      return this.$store.getters.getActiveChatMessages;
    },
    messagesLoading() {
      return this.messagesSending > 0;
    },
  },
  mounted() {
    this.handleUnIdle = this.handleUnIdleFun;
  },
  methods: {
    toggleMute() {
      if (this.muteLoading) {
        return;
      }
      this.muteLoading = true;
      this.$store.dispatch("toggleActiveChatMute").finally(() => {
        this.muteLoading = false;
      });
    },
    sendMessage() {
      let message = this.message.trim();
      if (message.length === 0) {
        return;
      }
      this.messagesSending++;
      this.$store.dispatch("sendMessage", message).finally(() => {
        this.messagesSending--;
      });
      this.message = "";
    },
    handleUnIdleFun() {
      if (this.chat && this.chat.unread_count > 0) {
        this.$store.dispatch(
          "markAsRead",
          this.$store.getters.getActiveChatIndex
        );
        this.$store.commit(
          "resetUnreadCount",
          this.$store.getters.getActiveChatIndex
        );
      }
    },
  },
  mixins: [IdleMixin],
};
</script>

<style scoped>
.h-full {
  height: 100%;
}
.has-background-color-dodger {
  background-color: dodgerblue;
}
.overflow-y-scroll-hidden {
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.overflow-y-scroll-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.message {
  max-width: 90%;
  background-color: aqua;
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  margin-left: 0px;
  margin-right: auto;
  border-radius: 10px;

  white-space: pre-wrap;
  word-wrap: break-word;
}
.message-right {
  text-align: right;
  margin-right: 0px;
  margin-left: auto;
}
.loading {
  background-color: darkgray;
}
</style>

<style>
.h-50 {
  height: 50px;
}
.resize-none {
  resize: none;
}
.child-h-full span {
  height: 100% !important;
}
</style>
