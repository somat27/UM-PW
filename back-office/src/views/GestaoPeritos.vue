<template>
  <div class="dashboard-container" :space="23">
    <div class="dashboard-layout">
      <aside class="sidebar-column">
        <nav class="sidebar-nav">
          <div class="sidebar-background">
            <NavigationList />
          </div>
        </nav>
      </aside>

  <main class="main-content">
  <div class="content-wrapper">
    <nav class="navigation-tabs"></nav>
    
    <StatisticsGrid />

    <div class="page-header">
      <h2>Gestão de Peritos</h2>
    </div>

    <div class="filters-container">
      <Filters
        :filters="filterOptions"
        :gap="'172px'"
        search-placeholder="Procurar Peritos..."
        button-text="+ Adicionar Peritos"
        @search="handleSearch"
        @filter-change="handleFilterChange"
        @add="handleAddPerito"
      />
    </div>

    <GenericTable
      :title="'Lista de Peritos'"
      :subTitle="'Gestão de peritos mobilizados'"
      :data="peritos"
      :columns="columns"
      :type="'striped'"
      @action="handlePeritoAction"
    />
  </div>
</main>
    </div>
  </div>
</template>

<script>
import NavigationList from "../components/NavigationList.vue";
import GenericTable from "../components/GenericTable.vue";
import Filters from "../components/Filters.vue";

export default {
  name: "GestaoPeritos",
  components: {
    NavigationList,
    GenericTable,
    Filters
  },
  data() {
    return {

filterOptions: [
        {
          key: 'status',
          label: 'Estado',
          selected: '',
          options: [
            { value: '', label: 'Todos os Estados' },
            { value: 'mobilizado', label: 'Mobilizados' },
            { value: 'disponivel', label: 'Disponivel' }
          ]
        },
        {
          key: 'type',
          label: 'Tipo',
          selected: '',
          options: [
            { value: '', label: 'Filtrar Por' },
            { key: 'name', label: 'Nome' },
            { key: 'address', label: 'Morada' },
            { key: 'birthdate', label: 'Data Nascimento' },
            { key: 'specialty', label: 'Especialidade' },
            { key: 'phone', label: 'Número de Telemóvel' }
          ]
        }
      ],
          columns: [
            { key: 'nameEmail', label: 'Nome' },
            { key: 'address', label: 'Morada' },
            { key: 'birthDate', label: 'Data Nascimento' },
            { key: 'specialty', label: 'Especialidade' },
            { key: 'phone', label: 'Número de Telemóvel' },
            { key: 'status', label: 'Estado' },
            { key: 'actions', label: 'Ações' }
      ],
      peritos: [
        {
          id: 1,
          name: "Joana Silva",
          email: "joana@sapo.pt",
          address: "Porto",
          birthDate: "22/07/1990",
          specialty: "Engenheira Civil",
          phone: "912345678",
          status: "Mobilizado"
        },
        {
          id: 2,
          name: "Carlos Pinto",
          email: "carlos@sapo.pt",
          address: "Lisboa",
          birthDate: "15/11/1987",
          specialty: "Pedreiro",
          phone: "934567890",
          status: "Disponível"
        }
      ]
    };
  }
};
</script>

  
    
    <style scoped>
    .dashboard-container {
      background: linear-gradient(
          0deg,
          var(--color-grey-98, #fafafb) 0%,
          var(--color-grey-98, #fafafb) 100%
        ),
        var(--color-white-solid, #fff);
      padding-right: 18px;
      padding-bottom: 135px;
    }
    
    .dashboard-layout {
      display: flex;
      gap: 20px;
    }
    
    .sidebar-column {
      width: 19%;
    }
    
    .sidebar-nav {
      box-shadow: 1px 0px 0px 0px #f0f0f0;
      background-color: #fff;
      padding-bottom: 772px;
      overflow: hidden;
      width: 100%;
    }
    
    .sidebar-background {
      padding-bottom: 395px;
      background-color: #fff;
    }
    
    .logo {
      aspect-ratio: 6.17;
      object-fit: contain;
      width: 260px;
      box-shadow: 0px 4px 4px rgba(254, 247, 247, 1);
    }
    
    .notification-icons {
      z-index: 10;
      margin-top: 160px;
      margin-left: 25px;
      width: 16px;
    }
    
    .notification-icon,
    .alert-icon {
      aspect-ratio: 1;
      object-fit: contain;
      width: 100%;
    }
    
    .alert-icon {
      margin-top: 27px;
    }
    
    .main-content {
      width: 81%;
      margin-left: 20px;
    }
    
    .content-wrapper {
      display: flex;
      margin-top: 59px;
      width: 100%;
      flex-direction: column;
    }
    
    .navigation-tabs {
      display: flex;
      align-items: center;
      gap: 30px;
      font-family:
        Public Sans,
        -apple-system,
        Roboto,
        Helvetica,
        sans-serif;
      font-size: 13px;
      color: #212529;
      flex-wrap: wrap;
    }
    
    .tab-link {
      text-decoration: none;
      color: inherit;
      line-height: 19.5px;
    }
    
    .tab-link.active {
      color: #1890ff;
    }
    
    .map-visualization {
      aspect-ratio: 0.95;
      object-fit: contain;
      width: 100%;
    }
    
    @media (max-width: 991px) {
      .dashboard-container {
        padding-bottom: 100px;
        
      }
    
      .dashboard-layout {
        flex-direction: column;
        align-items: stretch;
        gap: 0;
      }
    
      .sidebar-column {
        width: 100%;
      }
    
      .sidebar-nav {
        margin-top: 24px;
        padding-bottom: 100px;
      }
    
      .sidebar-background {
        padding-bottom: 100px;
      }
    
      .notification-icons {
        margin-left: 10px;
        margin-top: 40px;
      }
    
      .main-content {
        width: 100%;
      }
    
      .content-wrapper {
        max-width: 100%;
        margin-top: 40px;
      }
    
      .map-visualization {
        max-width: 100%;
      }
    }

    .user-profile {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .user-name {
    font-size: 16px;
    font-weight: bold;
  }

.filters-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: fit-content;
}



</style>
    