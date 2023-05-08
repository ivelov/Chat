<template>
  <article v-if="message">
    <b-tooltip
      type="is-light"
      :triggers="message.fromYou ? ['contextmenu'] : []"
      :position="message.fromYou ? 'is-left' : 'is-right'"
      :auto-close="['outside', 'escape', 'inside']"
    >
      <template v-slot:content>
        <ul>
          <li>
            <b-button type="is-text" class="w-100" @click="editMessage"
              >Edit</b-button
            >
          </li>
          <li>
            <b-button type="is-text" class="w-100" @click="deleteMessage"
              >Delete</b-button
            >
          </li>
        </ul>
      </template>

      <div :class="message.fromYou ? 'message-right' : ''" class="message mb-2">
        <!-- Datetime -->
        <p class="is-size-7">{{ message.created_at }}</p>

        <!-- On edit input -->
        <div v-if="message.editing" class="h-50 is-flex-grow-0">
          <b-field>
            <b-input
              v-model="message.message"
              class="child-h-full"
              custom-class="h-50 resize-none is-clipped"
              type="textarea"
              rows="1"
            ></b-input>
          </b-field>
        </div>

        <!-- Save and cancel btns -->
        <div
          class="is-flex is-justify-content-space-between mb-3"
          v-if="message.editing"
        >
          <b-button type="is-success" size="is-small" @click="saveMessage"
            >Save</b-button
          >
          <b-button
            type="is-danger is-light"
            size="is-small"
            @click="cancelEditing"
            >Cancel</b-button
          >
        </div>

        <!-- Message with attachments -->
        <p v-if="!message.editing" v-html="message.message"></p>
        <img
          v-if="message.attachment_type === 'image'"
          :src="`${apiUrl}/public/${message.attachment}`"
          alt="attachment"
          class="mt-1"
        />
        <video
          v-if="message.attachment_type === 'video'"
          :src="`${apiUrl}/public/${message.attachment}`"
          controls
          class="h-max-500 mt-1"
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
      message: null,
    };
  },
  props: {
    messageInit: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.message = this.messageInit;
  },
  methods: {
    deleteMessage() {
      this.$store.dispatch("deleteMessage", this.message.id);
    },
    editMessage() {
      this.message.oldMessage = this.message.message;
      this.$set(this.message, "editing", true);
      this.$emit("edit", this.message.id);
    },
    cancelEditing() {
      this.message.message = this.message.oldMessage;
      this.$set(this.message, "editing", false);
    },
    saveMessage() {
      this.$set(this.message, "editing", false);
      this.$store.dispatch("saveMessage", {
        messageId: this.message.id,
        message: this.message.message,
      });
    },
  },
};
</script>

<style scoped>
.message {
  max-width: 90%;
  min-width: 120px;
  background-color: aqua;
  padding: 5px;
  padding-left: 15px;
  padding-right: 15px;
  margin-left: 0px;
  margin-right: auto;
  border-radius: 10px;
  border-bottom-left-radius: 0px;

  white-space: pre-wrap;
  word-wrap: break-word;
}
.message-right {
  text-align: right;
  margin-right: 0px;
  margin-left: auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 0px;
}
.h-max-500 {
  max-height: 500px;
}
.w-100 {
  width: 100%;
}
</style>
