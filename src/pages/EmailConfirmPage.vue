<template>
  <div>
    <div class="mt-4"></div>
    <section class="container">
      <p v-if="success" class="has-text-centered">
        Email confirmed successfully!
        <router-link to="/login">Log in</router-link> to procceed
      </p>
      <p class="has-text-centered" v-else>Wait...</p>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      success: false,
    };
  },
  mounted() {
    let url = "email/verify/";
    let userId = "";
    let token = "";
    for (const key in this.$route.params) {
      if (key === "userId") {
        userId = this.$route.params[key];
      } else if (key === "token") {
        token = this.$route.params[key];
      }
    }
    url = url + userId + "/" + token;

    let expires = "";
    let signature = "";
    for (const key in this.$route.query) {
      if (key === "expires") {
        expires = this.$route.query[key];
      } else if (key === "signature") {
        signature = this.$route.query[key];
      }
    }
    url = `${url}?expires=${expires}&signature=${signature}`;

    this.axios
      .post("/V1/api/" + url)
      .then(() => {
        this.success = true;
      })
      .catch(() => {
        this.$buefy.notification.open({
          message: "An error occurred!",
          type: "is-danger",
        });
      });
  },
};
</script>

<style scoped>
.container {
  max-width: 300px;
}
</style>
