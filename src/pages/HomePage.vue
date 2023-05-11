<template>
  <div>
    <div class="is-flex p-4 bg-main is-overlay">
      <ChatsComponent v-if="!$store.getters.getActiveChat || windowWidth > 768" class="left pr-4 mx-auto"></ChatsComponent>
      <ChatComponent
        v-if="windowWidth > 768 || $store.getters.getActiveChat"
        class="right"
        @onBack="back"
      ></ChatComponent>
    </div>
  </div>
</template>

<script>
import ChatsComponent from "../components/ChatsComponent.vue";
import ChatComponent from "../components/ChatComponent.vue";

export default {
  name: "HomePage",
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    back() {
      this.$store.dispatch("resetActiveChat");
    },
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
