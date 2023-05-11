<template>
  <div class="bg-main is-overlay">
    <div class="mt-4"></div>
    <section class="container">
      <form action="">
        <b-field
          custom-class="has-text-white"
          label="Email"
          :type="errors && errors.email ? 'is-danger' : ''"
          :message="errors && errors.email ? errors.email[0] : ''"
        >
          <b-input
            required
            custom-class="input-dark"
            type="email"
            v-model="data.email"
            @blur="errors.email = null"
          >
          </b-input>
        </b-field>
        <b-field
          custom-class="has-text-white"
          label="Password"
          :type="errors && errors.password ? 'is-danger' : ''"
          :message="errors && errors.password ? errors.password[0] : ''"
        >
          <b-input
            custom-class="input-dark"
            minlength="6"
            required
            type="password"
            v-model="data.password"
          >
          </b-input>
        </b-field>
        <b-button
          native-type="submit"
          @click.prevent="submit"
          class="bg-btn"
          :loading="loading"
          :disabled="loading"
          >Login</b-button
        >

        <p v-if="mustVerificate" class="mt-2">
          Email confirmation mail has been sent.
          <a href="" @click.prevent="sendMail">Send again</a>
        </p>
      </form>

      <p class="mt-3">
        Don`t have an account?
        <router-link to="/register">Sign up</router-link>
      </p>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        email: "",
        password: "",
      },
      errors: {},
      loading: false,
      mustVerificate: false,
    };
  },
  methods: {
    submit() {
      this.loading = true;
      this.$store
        .dispatch("login", this.data)
        .then((response) => {
          if (!response.user?.email_verified_at) {
            this.mustVerificate = true;
          } else {
            this.$router.push("/");
          }
        })
        .catch((response) => {
          if (response?.data?.errors) {
            this.errors = response.data.errors;
          } else {
            console.log(response);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    sendMail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("sendMail")
        .then(() => {
          this.$buefy.notification.open({
            message: "Mail sent!",
            type: "is-success",
          });
        })
        .catch(() => {
          this.$buefy.notification.open({
            message: "An error occurred!",
            type: "is-danger",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 300px;
}
</style>
