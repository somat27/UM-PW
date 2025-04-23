<template>
  <div class="dashboard-container">
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

          <StatisticsGrid />

          <div class="page-header">
            <h2>Gestão de Professionais</h2>
          </div>

          <div class="filters-container">
            <Filters :filters="filterOptions" :gap="'172px'" search-placeholder="Procurar Professionais..."
              button-text="+ Adicionar Professionais" @search="handleSearch" @filter-change="handleFilterChange"
              @add="handleAddMaterial" />
          </div>

          <GenericTable :data="peritos" :columns="columns" :type="'striped'" @action="handlePeritoAction" />
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
          key: 'type',
          label: 'Tipo',
          selected: '',
          options: [
            { value: '', label: 'Filtrar Por' },
            { key: 'area', label: 'Área/Especialidade' },
            { key: 'qtd', label: 'Quantidade' }
          ]
        }
      ],
      columns: [
        { key: 'area', label: 'Área/Especialidade' },
        { key: 'qtd', label: 'Quantidade' },
        { key: 'actions', label: 'Ações' }
      ],
      peritos: [
        {
          area: "Bombeiros",
          qtd: "100"
        },
        {
          area: "Polícia",
          qtd: "140"
        }
      ]
    };
  }
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  gap: 20px;
}

.sidebar-column {
  width: 20%;
}

.main-content {
  flex: 1;
  margin-right: 10px;
}

.content-wrapper {
  margin-top: 40px;
}

.tab-link {
  text-decoration: none;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.tab-link:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.tab-link.active {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.08);
  font-weight: 600;
}

.tab-link.active::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 16px;
  right: 16px;
  height: 2px;
  background-color: #1890ff;
  border-radius: 2px 2px 0 0;
}

.tab-link::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 50%;
  right: 50%;
  height: 2px;
  background-color: #1890ff;
  transition: all 0.3s ease;
  border-radius: 2px 2px 0 0;
}

.filters-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: fit-content;
}
</style>