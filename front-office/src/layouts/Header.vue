<template>
  <header class="site-header" :class="{ scrolled: hasScrolled }">
    <router-link to="/" class="logo-container">
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
  data() {
    return {
      hasScrolled: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);

    // Adiciona uma pequena animação para os links aparecerem com atraso
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link, index) => {
      setTimeout(() => {
        link.classList.add("visible");
      }, 200 * (index + 1));
    });

    // Animar o logo após um pequeno atraso
    setTimeout(() => {
      const logo = document.querySelector(".logo-container");
      if (logo) logo.classList.add("visible");
    }, 100);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.hasScrolled = window.scrollY > 20;
    },
  },
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.site-header.scrolled {
  height: 70px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

body {
  padding-top: 86px;
}

@media (max-width: 640px) {
  .site-header {
    padding: 12px;
  }
}

.logo-container {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.logo-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.logo {
  height: 62px;
  margin-left: 24px;
  transition: transform 0.3s ease;
}

.logo-container:hover .logo {
  transform: scale(1.05);
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
  font-size: 25px;
  position: relative;
  opacity: 0;
  transform: translateY(-10px);
  transition: transform 0.3s ease, opacity 0.5s ease, color 0.3s ease;
  text-decoration: none; /* Removido o underline padrão */
}

.nav-link.visible {
  opacity: 1;
  transform: translateY(0);
}

.nav-link:hover {
  color: #e6f2ff;
  transform: translateY(-2px);
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #fff;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: bottom right;
}

.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* Adicionar animação para quando o header estiver fixo durante o scroll */
.site-header.scrolled .logo {
  height: 50px;
}

@keyframes slideInFromTop {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.site-header {
  animation: slideInFromTop 0.5s ease-out forwards;
}
</style>
