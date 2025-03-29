<template>
  <header class="app-header">
    <div class="logo-container">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/38f17a1d99a4d32ae43c535e127dd6719394bcb6"
        alt="Profile Icon"
        class="icon-image"
      />
    </div>
    <div class="texto-container">
      <h1 class="app-title">  EyesEveryWhere</h1>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  background-color: rgba(240, 240, 240, 0.97);
  z-index: 1000;
}

.texto-container {
  width:max-width;
  margin-left: 2%;
}

.logo-container {
  width:max-width;
  justify-content: center;
  align-items: center;
  padding: 1% 1%;
}

.icon-image {
  width: 80%;
  height: 80%;
}

.app-title {
  color: #000;
  margin: 0;
}
</style>
