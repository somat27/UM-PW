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
              <nav class="navigation-tabs">
      <router-link 
        to="/dashboards/auditorias" 
        class="tab-link" 
        :class="{ active: activeTab === 'auditorias' }"
      >
        Auditorias por região
      </router-link>
      
      <router-link 
        to="/dashboards/ocorrencias" 
        class="tab-link" 
        :class="{ active: activeTab === 'ocorrencias' }"
      >
        Ocorrências resolvidas
      </router-link>
      <router-link 
        to="/dashboards/peritos" 
        class="tab-link" 
        :class="{ active: activeTab === 'peritos' }"
      >
      Peritos mobilizados e no aguardo
      </router-link>
      <router-link 
            to="/dashboards/materiais" 
            class="tab-link" 
            :class="{ active: activeTab === 'materiais' }"
        >
        Materiais expedidos
     </router-link>
              </nav>
  
              <StatisticsGrid />
    
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
                    <input 
                      type="text" 
                      class="search-container" 
                      placeholder="Pesquisar Localidade..." 
                    />
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/e2adb638175328e468397894582b9de35e2a0581?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
                      alt="Search"
                      class="search-button"
                    />
                  </div>
                </div>
  
              </div>
    
          
            <div id="chart">
                <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
                <apexchart type="bar" height="350" :options="chartOptions2" :series="series2"></apexchart>

            </div>
            
            
            </div>
          </main>
        </div>
      </div>
    </template>
  <script>
  import NavigationList from "@/components/NavigationList.vue";
  import StatisticsGrid from "@/components/StatisticsGridPeritos.vue";
  import VueApexCharts from 'vue3-apexcharts';
  import { ref } from 'vue';
  
  export default {
    name: "DashboardPeritos",
    components: {
      NavigationList,
      StatisticsGrid,
      apexchart: VueApexCharts, 
    },
    setup() {
      const activeTab = ref('peritos');
  
  
      return {
     
        activeTab,
       
        series: [
      {
        name: 'Q1 Budget',
        group: 'budget',
        data: [44000, 55000, 41000, 67000, 22000]
      },
    
      {
        name: 'Q2 Budget',
        group: 'budget',
        data: [13000, 36000, 20000, 8000, 13000]
      }
    ],
    chartOptions: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      dataLabels: {
        formatter: (val) => {
          return val / 1000 + 'K'
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      xaxis: {
        categories: [
          'Online advertising',
          'Sales Training',
          'Print advertising',
          'Catalogs',
          'Meetings'
        ],
        labels: {
          formatter: (val) => {
            return val / 1000 + 'K'
          }
        }
      },
      fill: {
        opacity: 1,
      },
      colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      }
    },

    series2: [{
      name: 'Servings',
      data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65, 35]
    }],
    chartOptions2: {
    
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '50%',
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 0
      },
      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: ['Apples', 'Oranges', 'Strawberries', 'Pineapples', 'Mangoes', 'Bananas',
          'Blackberries', 'Pears', 'Watermelons', 'Cherries', 'Pomegranates', 'Tangerines', 'Papayas'
        ],
        tickPlacement: 'on'
      },
      yaxis: {
        title: {
          text: 'Servings',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        },
      }
    },
    
    
    
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
  margin-top: -15px; 
  display: flex;
  align-items: center;
  gap: 8px; 
  font-family: 'Public Sans', -apple-system, Roboto, Helvetica, sans-serif;
  padding: 8px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0; 
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

.tab-link.active::after {
  left: 16px;
  right: 16px;
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
    .navigation-tabs {
    overflow-x: auto; 
    padding-bottom: 8px; 
    -webkit-overflow-scrolling: touch; 
  }
  
  .tab-link {
    padding: 8px 12px;
    font-size: 13px;
  }
  }

  </style>
    