<template>
  <section>
    <div class="is-flex">
      <img
        class="avatar"
        :src="$store.state.user.photo"
        alt="avatar"
        @click="photoClick"
      />
      <p>
        {{ userName }}
      </p>
    </div>

    <div class="is-flex is-align-content-center">
      <b-button
          @click="newChat"
          class="is-primary"
          outlined
        >
        New chat
        </b-button>
    </div>

    <!-- Chat list -->
    <ul v-for="chat in $store.state.chats" :key="chat.id">
      <li class="is-flex">
        <img class="avatar" :src="chat.avatar" alt="chat avatar" />
        <div class="is-clipped">
          <p>
            {{ chat.lastMessage.substring(0, 50) }}
          </p>
        </div>
        <p>{{ chat.unreadedCount === 0 ? "" : chat.unreadedCount }}</p>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
      addChatLoading: false,
    };
  },
  computed: {
    userName() {
      return this.$store.getters.getUserName;
    },
  },
  mounted() {},
  methods: {
    photoClick() {
      ///////////////////
      console.log("photo");
    },
    newChat(){
      this.$buefy.dialog.prompt({
          message: 'Enter user email',
          inputAttrs: {
              type: 'email',
          },
          confirmText: 'Add',
          trapFocus: true,
          closeOnConfirm: false,
          onConfirm: (email, {close}) => {
            if(this.addChatLoading){
              return;
            }
            this.addChatLoading = true;

            this.$store.dispatch('addChat', email)
              .then(()=>{
                close();
              })
              .catch((response)=>{
                if(response.data?.errors?.email){
                  this.$buefy.notification.open({
                    message: response.data.errors.email,
                    type: "is-danger",
                  });
                }else{
                  this.$buefy.notification.open({
                    message: "An error occurred!",
                    type: "is-danger",
                  });
                }
              })
              .finally(()=>{
                this.addChatLoading = false;
              })
          }
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
</style>
