<template>
  <div class="bg-main p-3" v-if="$store.getters.isAuth">
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
          class="bg-btn"
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
        custom-class="text-white"
        label="New nickname"
        :type="errors && errors.nickname ? 'is-danger' : ''"
        :message="errors && errors.nickname ? errors.nickname[0] : ''"
      >
        <b-input
          custom-class="input-dark"
          type="text"
          v-model="userData.nickname"
          @blur="errors.nickname = null"
        >
        </b-input>
      </b-field>

      <b-field
        custom-class="text-white"
        label="New name"
        :type="errors && errors.name ? 'is-danger' : ''"
        :message="errors && errors.name ? errors.name[0] : ''"
      >
        <b-input
          custom-class="input-dark"
          required
          type="text"
          v-model="userData.name"
          @blur="errors.name = null"
        >
        </b-input>
      </b-field>

      <b-field
        custom-class="text-white"
        label="Change language"
        :type="errors && errors.lang ? 'is-danger' : ''"
        :message="errors && errors.lang ? errors.lang[0] : ''"
      >
        <b-select
          v-model="userData.lang"
          @blur="errors.lang = null"
          class="select-dark"
        >
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="ua">Ukrainian</option>
        </b-select>
      </b-field>

      <b-field
        custom-class="text-white"
        label="Change photo"
        :type="errors && errors.photo ? 'is-danger' : ''"
        :message="errors && errors.photo ? errors.photo[0] : ''"
      >
        <b-upload
          v-model="userData.photo"
          class="file-label"
          accept=".png,.jpg,.jpeg"
          @blur="errors.photo = null"
          @input="checkSize"
        >
          <span class="file-cta input-dark">
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
        class="bg-btn"
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
      errors: {},
      fileMaxSize: 2000000,
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
      nickname: this.$store.state.user.nickname,
      lang: this.$store.state.user.lang,
      photo: null,
    };
  },
  methods: {
    logout() {
      this.logoutLoading = true;
      this.$store.dispatch("logout").then(() => {
        this.logoutLoading = false;
        this.$router.go();
        // this.$router.push("/login");
      });
    },
    submit() {
      if (this.loading) {
        return;
      }
      this.loading = true;

      this.$store
        .dispatch("updateUser", this.userData)
        .then(() => {
          this.$buefy.notification.open({
            message: "Data saved!",
            type: "is-success",
          });
        })
        .catch((response) => {
          if (!response?.data?.errors) {
            console.error(response);
            return;
          }

          for (const key in response.data.errors) {
            this.errors[key] = response.data.errors[key];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    checkSize(file) {
      if (file.size > this.fileMaxSize) {
        this.userData.photo = null;
        this.$buefy.notification.open({
          message: "Maximum photo size is 2Mb",
          type: "is-danger",
        });
      }
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 50px;
  height: 50px;
}
.form-small {
  max-width: 300px;
}
</style>
