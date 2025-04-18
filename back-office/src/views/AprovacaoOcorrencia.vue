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
            <h1 class="page-title">Plano de Auditoria</h1>

            <div class="audit-form">
              <div class="breadcrumb"> Criar Plano de Auditoria / Registo</div>

              <form class="form-grid">
                <div class="form-row">
                  <label for="nome">Nome da auditoria :</label>
                  <input id="nome" type="text" />
                </div>

                <div class="form-row">
                  <label for="origem">Origem :</label>
                  <input id="origem" type="text"  />
                </div>

                <div class="form-row">
                  <label for="descricao">Descrição :</label>
                  <input id="descricao" type="text" />
                </div>

                <div class="form-row">
                  <label for="tipo">Tipo :</label>
                  <input id="tipo" type="text"  />
                </div>
              </form>
            </div>
            <div class="audit-form">
            <div class="breadcrumb"> Criar Plano de Auditoria / Associar Perito</div>

            <GenericTable

              :columns="columns"
              :data="peritos"
              type="striped"
              @view="handleView"
              @edit="handleEdit"
              @delete="handleDelete"
            />
            </div>
            <nav class="navigation-tabs">

            </nav>

            <StatisticsGrid />
  
        
          
          </div>
        </main>
      </div>
    </div>
  </template>
<script>
import NavigationList from "../components/NavigationList.vue";
import GenericTable from "../components/GenericTable.vue";

export default {
  name: "AprovacaoOcorrencia",
  components: {
    NavigationList,
    GenericTable
  },
  setup() {
 


    return {
      columns: [
  { key: 'nameEmail', label: 'Nome' },
  { key: 'address', label: 'Morada' },
  { key: 'specialty', label: 'Especialidade' },
  
],
      peritos: [
        {
          id: 1,
          name: "Joana Silva",
          email: "joana@sapo.pt",
          address: "Porto",
          specialty: "Engenheira Civil",
        
        },
        {
          id: 2,
          name: "Carlos Pinto",
          email: "carlos@sapo.pt",
          address: "Lisboa",
          specialty: "Pedreiro",
        
        }
      ]
    };
  }
};
</script>

  
  <style scoped>
 .audit-form {
  background-color: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-top: 24px;
}

.breadcrumb {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 24px;
  margin-right:850px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.form-row label {
  width: 200px;
  font-size: 14px;
  font-weight: 500;
  color: #212529;
}

.form-row input {
  flex: 1;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #f9f9f9;
}
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
  </style>
  