<template>
  <div class="has-background-light p-3" v-if="$store.getters.isAuth">
    <div class="is-flex is-justify-content-space-between">
      <!-- User info -->
      <div class="is-flex is-align-content-center">
        <img class="avatar" :src="$store.state.user.photo" alt="avatar" />
        <span class="my-auto ml-3">
          {{ userName }}
        </span>
      </div>

      <!-- Logout -->
      <div>
        <b-button
          @click="logout"
          class="is-primary"
          :loading="logoutLoading"
          :disabled="logoutLoading"
        >
          Log out
        </b-button>
      </div>
    </div>

    <!-- New user data form -->
    <form action="" class="form-small mt-3">
      <b-field
        label="New nickname"
        :type="errors && errors.nickname ? 'is-danger' : ''"
        :message="errors && errors.nickname ? errors.nickname[0] : ''"
      >
        <b-input
          type="text"
          v-model="userData.nickname"
          @blur="errors.nickname = null"
        >
        </b-input>
      </b-field>

      <b-field
        label="New name"
        :type="errors && errors.name ? 'is-danger' : ''"
        :message="errors && errors.name ? errors.name[0] : ''"
      >
        <b-input
          required
          type="text"
          v-model="userData.name"
          @blur="errors.name = null"
        >
        </b-input>
      </b-field>

      <b-field
        label="Change language"
        :type="errors && errors.lang ? 'is-danger' : ''"
        :message="errors && errors.lang ? errors.lang[0] : ''"
      >
        <b-select v-model="userData.lang" @blur="errors.lang = null">
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="ua">Ukrainian</option>
        </b-select>
      </b-field>

      <b-field
        label="Change photo"
        :type="errors && errors.photo ? 'is-danger' : ''"
        :message="errors && errors.photo ? errors.photo[0] : ''"
      >
        <b-upload
          v-model="userData.photo"
          class="file-label"
          accept=".png,.jpg,.jpeg"
          @blur="errors.photo = null"
        >
          <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label">Click to upload</span>
          </span>
          <span class="file-name" v-if="userData.photo">
            {{ userData.photo.name }}
          </span>
        </b-upload>
      </b-field>

      <b-button
        native-type="submit"
        @click.prevent="submit"
        class="is-primary"
        :loading="loading"
        :disabled="loading"
        >Save</b-button
      >

    </form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      logoutLoading: false,
      userData: {},
      loading: false,
      errors: {}
    };
  },
  computed: {
    userName() {
      return this.$store.getters.getUserName;
    },
  },
  mounted() {
    this.userData = {
      name: this.$store.state.user.name,
      nickname: this.$store.state.nickname,
      lang: this.$store.state.lang,
      photo: null,
    };
  },
  methods: {
    logout() {
      this.logoutLoading = true;
      this.$store.dispatch("logout").then(() => {
        this.logoutLoading = false;
        this.$router.push("/login");
      });
    },
    submit() {
      if (this.loading) {
        return;
      }
      this.loading = true;

      this.$store.dispatch('updateUser', this.userData)
      .then(()=>{
        this.$buefy.notification.open({
            message: "Data saved!",
            type: "is-success",
          });
      })
      .catch((response)=>{
        if(!response?.data?.errors){
          console.error(response);
          return;
        }

        for (const key in response.data.errors) {
          this.errors[key] = response.data.errors[key];
        }
      })
      .finally(()=>{
        this.loading = false;
      })
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 50px;
  height: 50px;
}
.form-small{
  max-width: 300px;
}
</style>
