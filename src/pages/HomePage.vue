<template>
  <div>
    <div class="is-flex p-4">
      <ChatsComponent class="left"></ChatsComponent>
      <div class="right">
        <b-button
          @click="logout"
          class="is-primary"
          outlined
          :loading="loading"
          :disabled="loading"
        >
          Log out
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import ChatsComponent from "../components/ChatsComponent.vue";

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
  components: {ChatsComponent}
};
</script>

<style scoped>
  .left{
    flex-basis: 200px;
  }
  .right{
    flex-grow: 1;
  }
</style>