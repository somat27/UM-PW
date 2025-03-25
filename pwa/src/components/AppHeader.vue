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
  padding: 2% 0% 2% 0%;
  align-items: center;
  background-color: rgba(240, 240, 240, 0.97);
}

.logo-container {
  width:15%;
  height: 100%;
  border-radius: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2.5%;
  margin-right: 2.5%;
}

.icon-image {
  width: 80%;
  height: 80%;
}

.app-title {
  text-align: center;
  color: #000;
  font-family: Arial, sans-serif;
  font-size: 150%;
  margin-left: 2.5%;
  align-self: flex-end;
}
</style>
