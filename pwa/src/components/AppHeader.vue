<template>
  <header class="app-header">
    <div class="logo-container">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/38f17a1d99a4d32ae43c535e127dd6719394bcb6"
        alt="Profile Icon"
        class="icon-image"
      />
    </div>
    <h1 class="app-title">  EyesEveryWhere</h1>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.app-header {
  display: flex;
  height: 53px;
  padding: 8px 0 3px 20px;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 6px 2px -2px rgba(100, 100, 100, 0.25);
  background-color: rgba(240, 240, 240, 0.97);
}

.logo-container {
  width: 10%;
  height: 100%;
  border-radius: 15%;
  border: 100% solid #00aced;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10%;
  background-color: #f5f8fa;
}

.icon-image {
  width: 100%;
  height: 100%;
}

.app-title {
  color: #000;
  font-family: Arial, sans-serif;
  font-size: 28.8px;
  font-weight: 400;
  margin: 0;
}
</style>
