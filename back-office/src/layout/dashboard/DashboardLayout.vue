<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" name="Dashboards" icon="ti-dashboard " />
        <sidebar-link to="/GestaoAuditorias" name="Gestão de Auditorias" icon="ti-camera" />
        <sidebar-link
          to="/GestaoOcorrencias"
          name="Gestão de Ocorrências"
          icon="ti-alert"
        />
        <sidebar-link to="/GestaoPeritos" name="Gestão de Peritos" icon="ti-ruler-alt-2" />
        <sidebar-link to="/GestaoMateriais" name="Gestão de Materiais" icon="ti-package" />
        <sidebar-link to="/GestaoProfissionais" name="Gestão de Profissionais" icon="ti-user" />
        <sidebar-link :to="'/notifications'">
          <div class="user-profile">
            <img 
              :src="userPhoto" 
              :alt="userName"
              class="user-avatar"
            />
            <span class="user-name">{{ userName }}</span>
          </div>
        </sidebar-link>
        <button @click="logOut" class="logout-button">
      <span class="logout-text">LOG OUT ⏻</span>
      <div class="lock-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
    </button>
      </template>
      <mobile-menu>
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-panel"></i>
            <p>Stats</p>
          </a>
        </li>
        <drop-down
          class="nav-item"
          title="5 Notifications"
          title-classes="nav-link"
          icon="ti-bell"
        >
          <a class="dropdown-item">Notification 1</a>
          <a class="dropdown-item">Notification 2</a>
          <a class="dropdown-item">Notification 3</a>
          <a class="dropdown-item">Notification 4</a>
          <a class="dropdown-item">Another notification</a>
        </drop-down>
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-settings"></i>
            <p>Settings</p>
          </a>
        </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
  .sidebar {
    background-color: white !important; // Fundo branco
  }


  .nav-item a.router-link-exact-active {
    color: blue !important; // Azul quando selecionado
    font-weight: bold; // Opcional, para destacar mais
  }

  .sidebar .nav {
    padding-left: 10px;
  }
  .logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3498db; 
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  margin: 15px;
  width: 44%;
  font-size: 7px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logout-button:hover {
  background-color: #e74c3c; 
}

.logout-text {
  margin-right: 10px;
  letter-spacing: 1px;
}
.user-avatar {
  width: 24px;  
  height: 24px; 
  border-radius: 50%; 
  object-fit: cover; 
  margin-right: 10px; 
}

.user-name {
  font-size: 14px; 
  color: #333;
  line-height: 24px; 
}

.user-profile {
  display: flex;
  align-items: center; 
  gap: 10px; 
  margin-left: 3px;
}
</style>
<script>
import { onMounted, ref } from 'vue';

import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";

export default {
  setup() {
    const userName = ref('');
    const userPhoto = ref('');
  },

  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  data() {
    return {
      userName: '',
      userPhoto: '',
    };
  },
  mounted() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userName = user.displayName || user.email;
      this.userPhoto = user.photoURL || 'default-avatar.png';
    }
  },
  methods: {
    logOut() {
      this.$router.push('/');  // Usando this.$router para redirecionar
    },
    toggleSidebar() {
      if (this.$sidebar?.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
