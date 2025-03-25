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
  padding:  5% 0% 5% 0%;;
  display: flex;
  justify-content: center;
  background-color: rgba(240, 240, 240, 0.97);
}

.nav-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  height: 100%;
  border: none;
}

.nav-button:hover {
  background-color: rgba(0, 253, 13, 0.05);
}
</style>
