<template>
  <div class="bg-main is-overlay">
    <div class="mt-4"></div>
    <section class="container">
      <p v-if="success" class="has-text-centered">
        Email confirmed successfully! You may close this page or go
        <router-link to="/" class="is-underlined">home</router-link>
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

    //Add user id and token to url
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

    //Add query params to url
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
      .post("/api/" + url)
      .then(() => {
        this.success = true;
      })
      .catch((reason) => {
        if (reason.response.status === 401) {
          this.$buefy.notification.open({
            duration: 5000,
            message: "You must be logged in to perform this action",
            type: "is-danger",
          });
        } else {
          this.$buefy.notification.open({
            message: "An error occurred!",
            type: "is-danger",
          });
        }
      });
  },
};
</script>

<style scoped>
.container {
  max-width: 300px;
}
</style>
