<template>
  <article>
    <b-tooltip type="is-light" :triggers="['contextmenu']" :position="message.fromYou ? 'is-left' : 'is-right'" :auto-close="['outside', 'escape', 'inside']">
      <template v-slot:content>
        <ul>
          <li>
            <b-button type="is-text" class="w-100">Edit</b-button>
          </li>
          <li>
            <b-button type="is-text" class="w-100" @click="deleteMessage">Delete</b-button>
          </li>
        </ul>
      </template>

      <div :class="message.fromYou ? 'message-right' : ''" class="message mb-2">
        <p class="is-size-7">{{ message.created_at }}</p>
        <p v-html="message.message"></p>
        <img
          v-if="message.attachment_type === 'image'"
          :src="`${apiUrl}/${message.attachment}`"
          alt="attachment"
        />
        <video
          v-if="message.attachment_type === 'video'"
          :src="`${apiUrl}/${message.attachment}`"
          controls
          class="h-max-500"
        >
          Video error
        </video>
      </div>
    </b-tooltip>
  </article>
</template>

<script>
export default {
  data() {
    return {
      apiUrl: process.env.VUE_APP_API_URL,
    };
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteMessage(){
      this.$store.dispatch('deleteMessage', this.message.id);
    }
  },
};
</script>

<style scoped>
.message {
  max-width: 90%;
  background-color: aqua;
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  margin-left: 0px;
  margin-right: auto;
  border-radius: 10px;

  white-space: pre-wrap;
  word-wrap: break-word;
}
.message-right {
  text-align: right;
  margin-right: 0px;
  margin-left: auto;
}
.h-max-500 {
  max-height: 500px;
}
.w-100{
  width: 100%;
}
</style>
