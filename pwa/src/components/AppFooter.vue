<template>
  <footer class="app-footer">
    <button class="nav-button">
      <i class="ti ti-home"></i>
    </button>
    <button class="nav-button">
      <i class="ti ti-search"></i>
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
  height: 56px;
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 -6px 2px -2px rgba(100, 100, 100, 0.25);
  display: flex;
  justify-content: center;
  gap: 0.2px;
  background-color: rgba(240, 240, 240, 0.97);
}

.nav-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-button:hover {
  background-color: rgba(0, 253, 13, 0.05);
}
</style>
