<template>
  <div class="dashboard-container">
    <div class="dashboard-layout">
      <aside class="sidebar-column">
        <NavigationList />
      </aside>

      <main class="main-content">
        <h1 class="page-title">Gestão de Auditorias</h1>
        
        <div class="content-section">
          <AuditTable
            title="Tabela de Auditorias"
            subTitle="Lista completa de registros de auditoria"
            :columns="tableColumns"
            :data="tableData"
            type="striped"
          >
            <template #column-salary="{ value }">
              <span class="text-success">{{ value }}</span>
            </template>
            <template #column-acoes="{ item }">
            <div class="action-buttons">
              <button @click="viewItem(item)" class="icon-btn" title="Visualizar">
                <img src="@/assets/icons8-eye-forma-light/icons8-eye-24.png" alt="Visualizar">
              </button>
              <button @click="editItem(item)" class="icon-btn" title="Editar">
                <img src="@/assets/icons8-pencil-pastel-glyph/icons8-pencil-24.png" alt="Editar">
              </button>
              <button @click="deleteItem(item)" class="icon-btn" title="Eliminar">
                <img src="@/assets/icons8-trash-ink/icons8-trash-24.png" alt="Eliminar">
              </button>
            </div>
          </template>
          </AuditTable>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import NavigationList from "@/components/NavigationList.vue";
import AuditTable from "@/components/AuditTables.vue";

export default {
  name: "GestaoAuditorias",
  components: {
    NavigationList,
    AuditTable
  },
  data() {
    return {
      tableColumns: [
        { key: 'id', label: 'ID', headerClass: 'col-id' },
        { key: 'morada', label: 'Morada' },
        { key: 'localidade', label: 'Localidade', cellClass: 'text-right' },
        { key: 'estado', label: 'Estado' },
        { key: 'coordenadas', label: 'Coordenadas' },
        { key: 'acoes', label: 'Ações'}
      ],
      tableData: [
        { 
          id: 1, 
          morada: "Rua das Flores, nº45", 
          localidade: "Lisboa", 
          estado: "Finalizada", 
          coordenadas: "função mapa?"
        },
        { 
          id: 2, 
          morada: "Avenida da Liberdade, nº100", 
          localidade: "Lisboa", 
          estado: "Por confirmar", 
          coordenadas: "função mapa?"
        },
        { 
          id: 3, 
          morada: "Rua Jõao dos Santos, nº12", 
          localidade: "Porto", 
          estado: "Finalizada", 
          coordenadas: "função mapa?"
        },
        { 
          id: 4, 
          morada: "Rua Gil Vicente, nº67", 
          localidade: "Guimarães", 
          estado: "Finalizada", 
          coordenadas: "função mapa?"
        },
        { 
          id: 5, 
          morada: "Rua de Santo António, nº45", 
          localidade: "Guimarães", 
          estado: "Em andamento", 
          coordenadas: "função mapa?"
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
  min-height: 100vh;
  padding-right: 18px;
  margin: 0;
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


.main-content {
  width: 81%;
  margin-left: 20px;
}

.data-section {
  margin-top: 40px;
  border: 1px dashed #ccc;
  padding: 20px;
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
      -webkit-overflow-scrolling: touch; 
    }
    
    .tab-link {
      text-decoration: none;
      color: inherit;
      line-height: 19.5px;
    }
    
    .tab-link.active {
      color: #1890ff;
    }
    
    .search-section {
      transform: rotate(3.141592653589793rad);
      align-self: flex-end;
      display: flex;
      margin-top: 37px;
      padding: 13px;
      align-items: center;
      gap: 4px;
    }
    
    .search-item {
      border-radius: 4px;
      min-height: 34px;
      padding: 6px 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
    }
    
    .search-icon {
      
      aspect-ratio: 0.91;
      object-fit: contain;
      width: 20px;
    }
    
    .search-form {
      position: relative;
      font-family:
        Public Sans,
        -apple-system,
        Roboto,
        Helvetica,
        sans-serif;
      font-size: 14px;
      color: #6c757d;
      width: 200px;
    }
    
    .search-input {
      border-radius: 4px;
      border: 1px solid rgba(19, 194, 194, 0.85);
      background-color: #fff;
      width: 198px;
      padding: 8px 29px 9px 12px;
    }
    
    .search-container {
      transform: rotate(3.141592653589793rad);
      width: 100%;
      overflow: hidden;
    }
    
    .search-button {
      transform: rotate(3.141592653589793rad);
      aspect-ratio: 1;
      object-fit: contain;
      width: 18px;
      position: absolute;
      right: 160px;
      bottom: 14px;
      height: 12px;
  
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
    
      .search-section {
        margin-right: 5px;
      }
    
      .search-input {
        padding-right: 20px;
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

.action-btn {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: #f0f0f0;
}

.icon-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

</style>
    