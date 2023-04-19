<template>
  <section class="h-full has-background-link-dark">
    <div
      v-if="chat"
      class="is-flex is-flex-direction-column is-justify-content-space-between h-full has-background-color-dodger"
    >
      <!-- Header -->
      <div
        class="is-flex is-justify-content-space-between is-align-content-center px-3 h-50 is-flex-grow-0 has-text-white has-background-link-dark"
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
      <div class="is-flex-grow-1 has-background-color-dodger overflow-y-scroll py-5 px-2">
        <ul class="is-flex is-flex-direction-column-reverse">
          <li v-for="(message, index) in messages" :key="index" :class="message.fromYou?'message-right':''" class="message">
            {{ message.message }}
          </li>
        </ul>
      </div>

      <!-- Input field -->
      <div class="h-50 is-flex-grow-0" @keyup.enter.exact="sendMessage">
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
export default {
  data() {
    return {
      muteLoading: false,
      message: ""
    };
  },
  computed: {
    chat() {
      return this.$store.getters.getActiveChat;
    },
    messages(){
      return this.$store.getters.getActiveChatMessages;
    },
  },
  mounted() {},
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
      if(message.length === 0){
        return;
      }
      this.$store.dispatch("sendMessage", message);
      this.message = "";
    },
  },
};
</script>

<style scoped>
.h-full {
  height: 100%;
}
.has-background-color-dodger {
  background-color: dodgerblue;
}
.overflow-y-scroll-hidden{
  overflow-y: scroll;
  -ms-overflow-style: none; 
  scrollbar-width: none;  
}
.overflow-y-scroll-hidden::-webkit-scrollbar{
  width: 0;
  height: 0;
}
.message{
  max-width: 50%;
  background-color: aqua;
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 10px;
}
.message-right{
  text-align: right;
  margin-right: 0px;
  margin-left: auto;
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
