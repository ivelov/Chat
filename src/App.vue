<template>
  <div id="app">
    <router-view></router-view>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css">
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted(){
    this.$notification.requestPermission()
      .then((result)=>{
        this.$store.commit('setNotificationAllow', result === 'granted');
      })
  }
}
</script>
