<template>
  <section class="h-full">
    <div v-if="chat" class="is-flex is-flex-direction-column is-justify-content-space-between h-full">

    <!-- Header -->
    <div class="is-flex is-justify-content-space-between is-align-content-center px-3 h-50 is-flex-grow-0 has-text-white">
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
    <div class="is-flex-grow-1" style="background-color: aqua;">

    </div>

    <!-- Input field -->
    <div class="h-50 is-flex-grow-0">
      <b-field>
          <b-input custom-class="h-50" maxlength="500" type="text" icon-right-clickable icon-right="close-circle" @icon-right-click="sendMessage"></b-input>
      </b-field>
    </div>
  </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      muteLoading: false,
    };
  },
  computed: {
    chat() {
      return this.$store.getters.getActiveChat;
    },
  },
  mounted() {
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
    sendMessage(){

    },
  },
};
</script>

<style scoped>
.h-full{
  height: 100%;
}
</style>

<style>
.h-50{
  height: 50px;
}
</style>