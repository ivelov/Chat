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
a:hover{
  color: #b9a6ee !important;
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
.bg-btn{
  background-color: #2b5278 !important;
  border-color: transparent !important;
  color: #f5f5f5 !important;
}
.bg-btn:hover{
  background-color: #1d4a77 !important;
  color: #f5f5f5 !important;
  border-color: transparent !important;
}
.input-dark, .select-dark select{
  background-color: #17212b !important;
  border-color: #0c1116 !important;
  color: #f5f5f5 !important;
}
.select-dark option{
  color: #f5f5f5 !important;
}
.text-white{
  color: #f5f5f5;
}
.table-dark table{
  background-color: #242f3d;
  color: #f5f5f5;
}
.table-dark table thead th{
  color: #f5f5f5;
}
.table-dark table tbody tr{
  background-color: #242f3d;
}
.table-dark table tbody tr:hover{
  background-color: #17212b;
}
</style>