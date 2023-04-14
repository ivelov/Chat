<template>
  <div>
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
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      loading: false,
    };
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
};
</script>
