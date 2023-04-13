<template>
  <div>
      <!-- <HeaderComponent></HeaderComponent> -->
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
                  :message="
                      errors && errors.password ? errors.password[0] : ''
                  "
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
                  label="Nickname"
                  :type="errors && errors.name ? 'is-danger' : ''"
                  :message="errors && errors.name ? errors.name[0] : ''"
              >
                  <b-input
                      required
                      v-model="data.name"
                      @blur="errors.name = null"
                  >
                  </b-input>
              </b-field>

              <b-button
                  native-type="submit"
                  @click.prevent="submit"
                  class="is-primary"
                  outlined
                  :loading="loading"
                  :disabled="loading"
                  >Register</b-button
              >
          </form>
          <p class="mt-3">
              Already have an account?
              <router-link to="/login">Sign in</router-link>
          </p>
      </section>
  </div>
</template>

<script>
// import HeaderComponent from "../components/HeaderComponent.vue";

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
      };
  },
  methods: {
      submit() {
          this.loading = true;
          this.$store
              .dispatch("register", this.data)
              .then(() => {
                  // this.$router.push("/");
              })
              .catch((response) => {
                  this.errors = response.data.errors;
              })
              .finally(() => {
                  this.loading = false;
              });
      },
  },
  // components: { HeaderComponent },
};
</script>

<style scoped>
.container {
  max-width: 300px;
}
</style>
