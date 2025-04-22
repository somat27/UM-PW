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
          <div class="page-header">
            <h2>Plano de Auditoria</h2>
          </div>

          <div class="audit-form">
            <div class="breadcrumb"> Criar Plano de Auditoria / Registo</div>

            <form class="form-grid">
              <div class="form-row">
                <label for="nome">Nome da auditoria :</label>
                <input id="nome" type="text" />
              </div>

              <div class="form-row">
                <label for="origem">Origem :</label>
                <input id="origem" type="text" />
              </div>

              <div class="form-row">
                <label for="descricao">Descrição :</label>
                <input id="descricao" type="text" />
              </div>

              <div class="form-row">
                <label for="tipo">Tipo :</label>
                <input id="tipo" type="text" />
              </div>
            </form>
          </div>
          <div class="audit-form">
            <div class="breadcrumb"> Criar Plano de Auditoria / Associar Perito</div>

            <GenericTable :columns="columns" :data="peritos" type="striped" @view="handleView" @edit="handleEdit"
              @delete="handleDelete" />
          </div>
          <div class="audit-form">
            <div class="breadcrumb"> Criar Plano de Auditoria / Associar Materiais</div>
            <GenericTable1 :data="materiais" :columns="columns1" :type="'striped'" @action="handlePeritoAction" />
          </div>
          <div class="audit-form">
            <div class="breadcrumb1">Criar Plano de Auditoria / Duração Estimada</div>
            <form class="form-grid">
              <div class="form-row duration-row">
                <label for="duracao">Duração estimada:</label>
                <input id="duracao" type="text" class="small-input" />
                <span class="days-text">dias.</span>
              </div>
            </form>
          </div>
          <div class="audit-form">
            <router-link to="/GestaoAuditorias" class="tab-link">
              <button class="btn-primary">Criar Plano</button>
            </router-link>
          </div>
        </div>

      </main>

    </div>
  </div>
</template>
<script>
import NavigationList from "../components/NavigationList.vue";
import GenericTable from "../components/GenericTable.vue";
import GenericTable1 from "../components/GenericTable.vue";

export default {
  name: "AprovacaoOcorrencia",
  components: {
    NavigationList,
    GenericTable,
    GenericTable1
  },
  setup() {

    return {

      columns: [
        { key: 'nameEmail', label: 'Nome' },
        { key: 'address', label: 'Morada' },
        { key: 'specialty', label: 'Especialidade' },

      ],
      columns1: [
        { key: 'details', label: 'Detalhes do Material' },
        { key: 'category', label: 'Categoria' },
        { key: 'qtd', label: 'Quantidade' },


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

        },
        {
          id: 2,
          name: "Carlos Pinto",
          email: "carlos@sapo.pt",
          address: "Lisboa",
          specialty: "Pedreiro",

        }
      ],
      materiais: [
        {
          details: "Asfalto",
          category: "Materiais de construção",
          qtd: "3",
        },

        {
          details: "Câmeras",
          category: "Equipamento de segurança",
          qtd: "70",
        }
      ],

    };
  }
};
</script>


<style scoped>
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

.btn-primary {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover {
  background-color: #3a5ce4;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}


.btn-primary::before {
  content: "+";
  font-weight: bold;
  font-size: 16px;
}

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
  margin-right: 850px;
}

.breadcrumb1 {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 24px;
  margin-right: 850px;
}

.duration-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.duration-row label {
  width: auto;
  margin-right: 0;
  white-space: nowrap;
}

.small-input {
  width: 60px !important;
  padding: 6px 8px !important;
  margin-right: 0;
}

.days-text {
  font-size: 14px;
  color: #6c757d;
  white-space: nowrap;
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

.dashboard-layout {
  display: flex;
  gap: 20px;
}

.sidebar-column {
  width: 20%;
}

.main-content {
  flex: 1;
}

.content-wrapper {
  margin-top: 40px;
}
</style>