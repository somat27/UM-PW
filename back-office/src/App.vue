<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  watch: {
    $route(to) {
      if (to.path === '/peritos') {
        document.body.style.overflow = 'auto'; 
      } else {
        document.body.style.overflow = 'hidden';
      }
    }
  },
  mounted() {
    if (this.$route.path === '/peritos') {
      document.body.style.overflow = 'auto'; 
    } else {
      document.body.style.overflow = 'hidden'; 
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: rgba(32, 76, 109, 1); 
  overflow: hidden; 
}
</style>

