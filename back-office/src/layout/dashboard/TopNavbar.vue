<template>
  <nav  v-if="$route.path.startsWith('/dashboard')" 
  class="navbar navbar-expand-lg navbar-light"  >
    <div class="container-fluid">
        <button
        class="navbar-toggler navbar-burger"
        type="button"
        @click="toggleSidebar"
        :aria-expanded="$sidebar.showSidebar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
      </button>
      <div>
    <!-- Navegação entre seções -->
    <nav class="navigation-tabs">
        <button 
        class="tab-link" 
        :class="{ active: activeTab === 'auditorias' }" 
        @click="switchTab('auditorias')"
      >
        Auditorias por região
      </button>

      <button 
        class="tab-link" 
        :class="{ active: activeTab === 'ocorrencias' }" 
        @click="switchTab('ocorrencias')"
      >
        Ocorrências resolvidas
      </button>

      <button 
        class="tab-link" 
        :class="{ active: activeTab === 'peritos' }" 
        @click="switchTab('peritos')"
      >
        Peritos mobilizados e no aguardo
      </button>

      <button 
        class="tab-link" 
        :class="{ active: activeTab === 'materiais' }" 
        @click="switchTab('materiais')"
      >
        Materiais expedidos
      </button>
    </nav>
    <component :is="activeComponent" />  
  </div>
    </div>

  </nav>

</template>
<script>
import DashboardAuditorias from "@/pages/DashboardAuditorias.vue";
import DashboardOcorrencias from "@/pages/DashboardOcorrencias.vue";
export default {
  components: {
    DashboardAuditorias,
    DashboardOcorrencias,
  },

  data() {
    return {
      activeTab: 'auditorias', 

      activeNotifications: false,
    };
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    activeComponent() {
      // Retorna o componente correto em vez de uma string
      const componentsMap = {
        auditorias: DashboardAuditorias,
        ocorrencias: DashboardOcorrencias,
      };
      return componentsMap[this.activeTab];
    },
  },
  methods: {
    switchTab(tabName) {
      this.activeTab = tabName;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
  },
};
</script>
<style>
.navigation-tabs {
  display: flex;
  gap: 10px;
  margin-top: 20px;

  margin-bottom: 20px;
}

.tab-link {
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  transition: background 0.3s ease;
}

.tab-link.active {
  background: #007bff;
  color: white;
}

</style>
