<template>
  <footer class="app-footer">
    <button class="nav-button">
      <i class="bi bi-house"></i>
    </button>
    <button class="nav-button">
      <i class="bi bi-search"></i>
    </button>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.app-footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  background-color: rgba(240, 240, 240, 0.97);
  z-index: 1000;
}

.nav-button {
  font-size: 150%;
  border: none;
  margin: 0 1%;
}

.nav-button:hover {
  color: #0095b6;
}
</style>
