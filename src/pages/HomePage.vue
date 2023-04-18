<template>
  <div>
    <div class="is-flex p-4 has-background-info-dark is-overlay">
      <ChatsComponent class="left pr-4"></ChatsComponent>
      <div class="right has-background-link-dark">
        <!-- <b-button
          @click="logout"
          class="is-primary"
          :loading="loading"
          :disabled="loading"
        >
          Log out
        </b-button> -->
        <ChatComponent></ChatComponent>
      </div>
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
      loading: false,
    };
  },
  mounted(){
    
  },
  methods: {
    logout() {
      this.loading = true;
      this.$store.dispatch("logout").then(() => {
        this.loading = false;
        this.$router.push('/login');
      });
    },
  },
  components: {ChatsComponent, ChatComponent}
};
</script>

<style scoped>
  .left{
    flex-basis: 200px;
    height: 100%;
  }
  .right{
    flex-grow: 1;
  }
</style>