<template>
    <div class="dashboard-container" :space="23">
      <div class="dashboard-layout">
        <aside class="sidebar-column">
          <nav class="sidebar-nav">
            <div class="sidebar-background">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9cae2c5a44e739bfd2edc79e5215ab61eb4c5ee8?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
                alt="Logo"
                class="logo"
              />
              
              <NavigationList />
            </div>
          </nav>
        </aside>
  
        <main class="main-content">
          <div class="content-wrapper">
            <nav class="navigation-tabs">
              <router-link 
                to="/auditorias" 
                class="tab-link" 
                :class="{ active: activeTab === 'auditorias' }"
              >
                Auditorias por região
              </router-link>
              
              <router-link 
                to="/ocorrencias" 
                class="tab-link" 
                :class="{ active: activeTab === 'ocorrencias' }"
              >
                Ocorrências resolvidas
              </router-link>

              <a href="#" class="tab-link">Peritos mobilizados e no aguardo</a>
              <a href="#" class="tab-link">Materiais expedidos</a>
            </nav>
  
            <StatisticsGrid2 />
  
            <div class="search-section">
              <div class="search-item">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0dc2d2a81d2a326f4151dcc6a4defcd801630669?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
                  alt="Search Icon"
                  class="search-icon"
                />
              </div>
              <div class="search-form">
                <div class="search-input">
                  <div class="search-container">Pesquisar Localidade...</div>
                </div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/e2adb638175328e468397894582b9de35e2a0581?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
                  alt="Search"
                  class="search-button"
                />
              </div>
            </div>
  
        
          <div id="chart">
            <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>   
           </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
import { ref } from "vue";
import NavigationList from "../components/NavigationList.vue";
import StatisticsGrid2 from "../components/StatisticsGrid2.vue";
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: "DashboardOcorrencias",
  components: {
    NavigationList,
    StatisticsGrid2,
    apexchart: VueApexCharts,
  },
  setup() {
    const activeTab = ref("ocorrencias");

 

    return {
   
      activeTab,
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00.000Z",
            "2018-09-19T01:30:00.000Z",
            "2018-09-19T02:30:00.000Z",
            "2018-09-19T03:30:00.000Z",
            "2018-09-19T04:30:00.000Z",
            "2018-09-19T05:30:00.000Z",
            "2018-09-19T06:30:00.000Z",
          ],
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
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
    aspect-ratio: 1;
    object-fit: contain;
    width: 12px;
    position: absolute;
    right: 11px;
    bottom: 11px;
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
  </style>
  