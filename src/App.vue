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

<style>
#app{
  color: #f5f5f5;
}
.bg-main{
  background-color: #242f3d;
}
.bg-head{
  background-color: #17212b;
}
.bg-chat{
  background-color: #0e1621;
}
.bg-message{
  background-color: #182533;
}
</style>