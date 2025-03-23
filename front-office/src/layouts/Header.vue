<template>
  <header class="site-header">
    <router-link to="/">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d53a9511a1256cea3f418e8a092040afc0c5df77"
        alt="Logo"
        class="logo"
      />
    </router-link>
    <nav class="navigation">
      <a href="#" class="nav-link">Ocorrências</a>
      <a href="#" class="nav-link">Mapa</a>
    </nav>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  height: 86px;
  background-color: #204c6d;
  z-index: 1000;
}

body {
  padding-top: 86px;
}

@media (max-width: 640px) {
  .site-header {
    padding: 12px;
  }
}

.logo {
  height: 62px;
  margin-left: 24px;
}

.navigation {
  display: flex;
  gap: 96px;
  margin-right: 92px;
}

@media (max-width: 991px) {
  .navigation {
    gap: 48px;
    margin-right: 48px;
  }
}

@media (max-width: 640px) {
  .navigation {
    display: none;
  }
}

.nav-link {
  color: #fff;
  text-decoration: underline;
  font-size: 25px;
}
</style>
