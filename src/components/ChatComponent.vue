<template>
  <section class="h-full has-background-link-dark">
    <div
      class="is-flex is-flex-direction-column is-justify-content-space-between h-full has-background-color-dodger"
      :class="chat?'':'is-hidden'"
    >
      <!-- Header -->
      <div
        v-if="chat"
        class="is-flex is-justify-content-space-between is-align-content-center px-3 py-1 h-50 is-flex-grow-0 has-text-white has-background-link-dark"
      >
        <div class="is-flex">
          <!-- Back btn -->
          <b-button
            @click="back"
            class="is-primary my-auto mr-3 is-hidden-tablet"
          >
            <b-icon icon="arrow-left"> </b-icon>
          </b-button>

          <!-- Chat name -->
          <div class="my-auto">{{ chat.name }}</div>
        </div>

        <!-- Mute btn -->
        <b-button
          @click="toggleMute"
          class="is-primary my-auto"
          :disabled="muteLoading"
          :loading="muteLoading"
        >
          {{ chat.muted ? "Unmute" : "Mute" }}
        </b-button>
      </div>

      <!-- Messages -->
      <div
        class="is-flex-grow-1 has-background-color-dodger overflow-y-scroll-hidden py-5 px-2"
        v-chat-scroll="{always: false, enabled: autoScroll}"
        ref="chat"
      >
        <ul class="is-flex is-flex-direction-column-reverse" ref="chatInner" v-if="chat">
          <li
            v-if="messagesLoading"
            class="message message-right mb-2 is-relative h-34 loading"
          >
            Sending...
          </li>

          <li
            v-for="message in messages"
            :key="message.id"
            :class="message.fromYou ? 'message-right' : ''"
          >
          <MessageComponent :message-init="message" @edit="scrollToMessage"></MessageComponent>
          </li>
        </ul>
      </div>

      <div
        v-if="attachment"
        class="has-background-light has-text-centered is-flex px-1"
      >
        <p class="is-flex-grow-1">{{ attachment.name }}</p>
        <div @click="removeAttachment">
          <b-icon
            icon="close-circle-outline my-auto"
            size="is-small"
            class="is-clickable"
          >
          </b-icon>
        </div>
      </div>

      <!-- Input field -->
      <div
        class="h-50 is-flex-grow-0"
        @keydown.enter.exact.prevent="sendMessage"
      >
        <b-field>
          <b-input
            v-model="message"
            class="child-h-full"
            custom-class="h-50 resize-none is-clipped pl-40"
            type="textarea"
            rows="1"
            icon="plus-circle-outline"
            icon-clickable
            @icon-click="addAttachment"
            icon-right-clickable
            icon-right="send-circle"
            @icon-right-click="sendMessage"
          ></b-input>
        </b-field>
      </div>
    </div>

    <!-- 'Select a chat' text -->
    <div
      v-if="!chat"
      class="h-full is-flex is-align-content-center is-flex-direction-column"
    >
      <p class="my-auto is-size-2 has-text-white has-text-centered">
        Select a chat
      </p>
    </div>

    <!-- Attachment modal -->
    <b-modal v-model="attachmentModal" trap-focus>
      <div class="has-background-light w-max p-3 border-3 mx-auto">
        <b-upload
          v-model="attachment"
          drag-drop
          accept=".png,.jpg,.jpeg,.mp4"
          @input="checkSize"
        >
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"> </b-icon>
              </p>
              <p>Drop your file here or click to upload</p>
            </div>
          </section>
        </b-upload>
      </div>
    </b-modal>
  </section>
</template>

<script>
import IdleMixin from "../mixins/IdleMixin.vue";
import MessageComponent from "./MessageComponent.vue";
export default {
  data() {
    return {
      muteLoading: false,
      message: "",
      messagesSending: 0,
      attachment: null,
      attachmentModal: false,
      fileMaxSize: 8000000,
      autoScroll: true,
      chatScrollTop: 0,
      newLoading: false,
    };
  },
  computed: {
    chat() {
      return this.$store.getters.getActiveChat;
    },
    messages() {
      return this.$store.getters.getActiveChatMessages;
    },
    messagesLoading() {
      return this.messagesSending > 0;
    },
  },
  mounted() {
    this.handleUnIdle = this.handleUnIdleFun;
    if (process.env.VUE_APP_FILE_MAX_SIZE) {
      this.fileMaxSize = process.env.VUE_APP_FILE_MAX_SIZE;
    }

    const el = this.$refs.chat;
    el.addEventListener('scroll', () => {
        this.chatScrollTop = el.scrollTop;
        if(this.chatScrollTop < 100){
          this.loadMore();
        }
    });
  },
  methods: {
    toggleMute() {
      if (this.muteLoading) {
        return;
      }
      this.muteLoading = true;
      this.$store.dispatch("toggleActiveChatMute").finally(() => {
        this.muteLoading = false;
      });
    },
    sendMessage() {
      let message = this.message.trim();
      if (message.length === 0 && !this.attachment) {
        return;
      }

      this.messagesSending++;
      this.$store
        .dispatch("sendMessage", {
          message: message,
          attachment: this.attachment,
        })
        .catch((response) => {
          if (response?.status === 500) {
            this.$buefy.notification.open({
              message: "An internal error occured",
              type: "is-danger",
            });
          }else{
            console.log(response);
          }
        })
        .finally(() => {
          this.messagesSending--;
        });

      this.message = "";
      this.$nextTick(() => {
        this.attachment = null;
      });
    },
    handleUnIdleFun() {
      if (this.chat && this.chat.unread_count > 0) {
        this.$store.dispatch(
          "markAsRead",
          this.$store.getters.getActiveChatIndex
        );
        this.$store.commit(
          "resetUnreadCount",
          this.$store.getters.getActiveChatIndex
        );
      }
    },
    back() {
      this.$emit("onBack");
    },
    addAttachment() {
      this.attachmentModal = true;
    },
    checkSize(file) {
      if (file.size > this.fileMaxSize) {
        this.attachment = null;
        this.$buefy.notification.open({
          message: "Maximum file size is 8Mb",
          type: "is-danger",
        });
      } else {
        this.attachmentModal = false;
      }
    },
    removeAttachment() {
      this.attachment = null;
    },
    scrollToMessage(){
      this.autoScroll = false;
      this.$nextTick(()=>{
        this.autoScroll = true;
      })
    },
    loadMore(){
      if(this.newLoading || this.chat.hasMore === false){
        return;
      }
      let oldHeight = this.$refs.chatInner.clientHeight;
      this.autoScroll = false;
      this.newLoading = true;
      this.$store.dispatch('loadMoreMessages').finally(()=>{
        this.newLoading = false;
        this.autoScroll = true;
        this.$nextTick(()=>{
          this.$refs.chat.scrollTop = this.$refs.chatInner.clientHeight - oldHeight;
        })
      });
    },
  },
  components:{MessageComponent},
  mixins: [IdleMixin],
};
</script>

<style scoped>
.h-full {
  height: 100%;
}
.has-background-color-dodger {
  background-color: dodgerblue;
}
.overflow-y-scroll-hidden {
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.overflow-y-scroll-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
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
.loading {
  background-color: darkgray;
}
.w-max {
  width: max-content;
}
.border-3 {
  border-radius: 15px;
}
</style>

<style>
.h-50 {
  height: 50px;
}
.resize-none {
  resize: none;
}
.child-h-full span {
  height: 100% !important;
}
.pl-40{
  padding-left: 40px;
}
</style>
