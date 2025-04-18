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

        <h1 class="page-title">Gestão de Ocorrências</h1>
        
        <div class="content-section">
          <AuditTable
            title="Tabela de Ocorrências"
            subTitle="Lista completa de registros de ocorrências"
            :columns="tableColumns"
            :data="tableData"
            type="striped"
          >
            <template #column-salary="{ value }">
              <span class="text-success">{{ value }}</span>
            </template>
          </AuditTable>
        </div>
        <div class="details-down">
        <div class="details-wrapper">
          <DetailsOco
            datetime="19/03/2024, 18:00"
            category="Infraestruturas"
            priority="Alta"
            description="Queda de muro devido ao mau tempo, bloqueando parcialmente a via."
          />
        </div>
      <div class="buttons-container">
        <div class="buttons-column">
          <router-link 
      to="/GestaoOcorrencias/AprovacaoOcorrencia" 
      class="tab-link" 
    >
          <button class="btn-approve">Aprovar</button>
        </router-link>

          <button class="btn-reject">Rejeitar</button>
            </div>
          </div>
        <div class="search-section">
              <div class="search-form">
                <div class="search-input">
                  <input 
                    type="text" 
                    class="search-container" 
                    placeholder="Inserir Id da Ocorrência" 
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e2adb638175328e468397894582b9de35e2a0581?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
                    alt="Search"
                    class="search-button"
                  />
                </div>
              </div>

            </div>
        </div>
      </div>
      </main>
    </div>
  </div>
</template>

<script>
import NavigationList from "@/components/NavigationList.vue";
import AuditTable from "@/components/AuditTables.vue";
import DetailsOco from "@/components/DetailsOco.vue";

export default {
  name: "GestaoAuditorias",
  components: {
    NavigationList,
    AuditTable,
    DetailsOco
  },
  data() {

    return {
      tableColumns: [
        { key: 'id', label: 'ID', headerClass: 'col-id' },
        { key: 'morada', label: 'Morada' },
        { key: 'localidade', label: 'Localidade', cellClass: 'text-right' },
        { key: 'coordenadas', label: 'Coordenadas' }
      ],
      tableData: [
        { 
          id: 1, 
          morada: "Rua das Flores, nº45", 
          localidade: "Lisboa",
          coordenadas: "função mapa?" 
        },
        { 
          id: 2, 
          morada: "Avenida da Liberdade, nº100", 
          localidade: "Lisboa",
          coordenadas: "função mapa?"
        },
        { 
          id: 3, 
          morada: "Rua Jõao dos Santos, nº12", 
          localidade: "Porto",
          coordenadas: "função mapa?"
        },
        { 
          id: 4, 
          morada: "Rua Gil Vicente, nº67", 
          localidade: "Guimarães",
          coordenadas: "função mapa?"
        },
        { 
          id: 5, 
          morada: "Rua de Santo António, nº45", 
          localidade: "Guimarães",
          coordenadas: "função mapa?"
        }    
      ]
    };
  },

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

  .details-wrapper {
  margin: 20px 0;
  }

  .action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}


.buttons-container {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
  position: relative;
  top: -220px;
  left: -120px;
}

.buttons-column {
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: fit-content;
}

.btn-approve,
.btn-reject {
  padding: 15px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  width: 120px;
}

.btn-approve {
  background-color: #28a745;
}

.btn-approve:hover {
  background-color: #218838;
}

.btn-reject {
  background-color: #f44336;
}

.btn-reject:hover {
  background-color: #d32f2f;
}


.search-section {
  position: relative;
  top: -450px;
  left: -900px;
}

.AuditTable{
  position: relative;
  left: -100px;
}

</style>
    