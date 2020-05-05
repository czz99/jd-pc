<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
html,body,#app{
  height: 100%;
  width: 100%;
}
@import "./styles/global.css";
@import "./styles/global.scss";
</style>
