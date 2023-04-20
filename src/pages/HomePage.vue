<template>
  <div>
    <div class="is-flex p-4 has-background-info-dark is-overlay">
      <ChatsComponent class="left pr-4"></ChatsComponent>
      <ChatComponent class="right"></ChatComponent>
    </div>
  </div>
</template>

<script>
import ChatsComponent from "../components/ChatsComponent.vue";
import ChatComponent from "../components/ChatComponent.vue";

export default {
  name: "HomePage",
  data() {
    return {};
  },
  components: { ChatsComponent, ChatComponent },
};
</script>

<style scoped>
.left {
  flex-basis: 200px;
  height: 100%;
}
.right {
  flex-grow: 1;
}
</style>
