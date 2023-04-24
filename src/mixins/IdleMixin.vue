<script>
export default {
  data: function () {
    return {
      idleSeconds: 0,
      idleAfterSeconds: 60,
      timerId: 0,
      handleIdle() {},
      handleUnIdle() {},
    };
  },
  computed:{
    idle:{
      get(){
        return this.$store.state.isIdle;
      },
      set(value){
        this.$store.commit('setIdle', value);
      }
    }
  },
  mounted() {
    if (process.env.VUE_APP_API_URL) {
      this.idleAfterSeconds = process.env.VUE_APP_API_URL;
    }
    document.addEventListener("mousemove", this.resetIdle);
    document.addEventListener("click", this.resetIdle);
    this.timerId = setInterval(this.incrementIdle, 1000);
  },
  destroyed() {
    document.removeEventListener("mousemove", this.resetIdle);
    document.removeEventListener("click", this.resetIdle);
    clearInterval(this.timerId);
  },
  methods: {
    resetIdle() {
      this.idleSeconds = 0;
      if (this.idle) {
        this.idle = false;
        this.handleUnIdle();
      }
    },
    incrementIdle() {
      this.idleSeconds++;
      if (!this.idle && this.idleSeconds > this.idleAfterSeconds) {
        this.idle = true;
        this.handleIdle();
      }
    },
  },
};
</script>
