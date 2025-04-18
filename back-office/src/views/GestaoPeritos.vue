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
          <h1 class="page-title">Gestão de Peritos</h1>

          <nav class="navigation-tabs">
          </nav>

          <StatisticsGrid />

          <div class="search-section">
              <div class="search-form">
                <div class="search-input">
                  <input 
                    type="text" 
                    class="search-container" 
                    placeholder="Procurar Peritos" 
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e2adb638175328e468397894582b9de35e2a0581?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
                    alt="Search"
                    class="search-button"
                  />
                </div>
              </div>
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

export default {
  name: "GestaoPeritos",
  components: {
    NavigationList,
    GenericTable
  },
  data() {
    return {
      columns: [
  { key: 'nameEmail', label: 'Nome' },
  { key: 'address', label: 'Morada' },
  { key: 'birthDate', label: 'Data Nascimento' },
  { key: 'specialty', label: 'Especialidade' },
  { key: 'phone', label: 'Telemóvel' },
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
  },
  methods: {
    handlePeritoAction(perito) {
      console.log("Ação realizada para:", perito);
      // Aqui podes adicionar lógica para editar, remover ou ver detalhes do perito
    }
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


    .search-section {
      position: relative;
      top: -20px;
      left: -930px;
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

    </style>
    