<template>
  <div class="has-text-black">
    <div class="mt-4"></div>
    <section class="container">
      <form action="">
        <b-field
          label="Email"
          :type="errors && errors.email ? 'is-danger' : ''"
          :message="errors && errors.email ? errors.email[0] : ''"
        >
          <b-input
            required
            type="email"
            v-model="data.email"
            @blur="errors.email = null"
          >
          </b-input>
        </b-field>

        <b-field
          label="Password"
          :type="errors && errors.password ? 'is-danger' : ''"
          :message="errors && errors.password ? errors.password[0] : ''"
        >
          <b-input
            minlength="6"
            required
            type="password"
            v-model="data.password"
          >
          </b-input>
        </b-field>

        <b-field
          label="Name"
          :type="errors && errors.name ? 'is-danger' : ''"
          :message="errors && errors.name ? errors.name[0] : ''"
        >
          <b-input required v-model="data.name" @blur="errors.name = null">
          </b-input>
        </b-field>

        <b-button
          native-type="submit"
          @click.prevent="submit"
          class="is-primary"
          outlined
          :loading="loading"
          :disabled="loading || mustVerificate"
          >Register</b-button
        >

        <p v-if="mustVerificate" class="mt-2">
          Email confirmation mail has been sent.
          <a href="" @click.prevent="sendMail">Send again</a>
        </p>
      </form>

      <p class="mt-3">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
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
        name: "",
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
        .dispatch("register", this.data)
        .then(() => {
          this.mustVerificate = true;
        })
        .catch((response) => {
          if (response?.data?.errors) {
            this.errors = response.data.errors;
          }else{
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
