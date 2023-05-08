<template>
  <div class="has-background-light p-3">

    <form action="" class="form-small mt-3">
      <b-field label="Search for users">
        <b-input type="text" v-model="searchText"> </b-input>
      </b-field>

      <b-button
        native-type="submit"
        @click.prevent="search"
        class="is-primary"
        :loading="loading"
        :disabled="loading"
        >Search</b-button
      >
    </form>

    <div v-if="users.length > 0" class="mt-3">
      <p class="mb-3">Results:</p>

      <b-table :data="users" hoverable :loading="loading" @click="addChat">
        <b-table-column field="photo" label="Photo" width="50" v-slot="props">
          <img class="avatar" :src="apiUrl + '/public/' + props.row.photo" alt="avatar" />
        </b-table-column>

        <b-table-column field="name" label="Name" width="150" v-slot="props">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column
          field="nickname"
          label="Nick"
          width="150"
          v-slot="props"
        >
          {{ props.row.nickname }}
        </b-table-column>

        <b-table-column field="email" label="Email" width="150" v-slot="props">
          {{ props.row.email }}
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      users: [],
      loading: false,
      apiUrl: process.env.VUE_APP_API_URL,
    };
  },
  mounted() {},
  methods: {
    search() {
      if (this.loading || !this.searchText) {
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("searchUsers", this.searchText)
        .then((users) => {
          this.users = users;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addChat(row) {
      if (this.loading) {
        return;
      }
      this.loading = true;

      this.$store
        .dispatch("addChat", row.id)
        .then(() => {
          this.$emit('close');
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
.form-small {
  max-width: 300px;
}
.avatar{
  width: 50px;
  height: 50px;
}
</style>
