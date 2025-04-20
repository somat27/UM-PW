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
          <nav class="navigation-tabs"></nav>

          <StatisticsGrid />

          <div class="page-header">
            <h2>Gestão de Peritos</h2>
          </div>

          <div class="filters-container">
            <Filters
              :filters="filterOptions"
              :gap="'10%'"
              search-placeholder="Procurar Peritos..."
              button-text="+ Adicionar Peritos"
              @search="handleSearch"
              @filter-change="handleFilterChange"
              @add="togglePeritoForm"
            />
          </div>

          <!-- Notificação de sucesso -->
          <transition name="fade">
            <div
              v-if="notification.show"
              class="notification"
              :class="notification.type"
            >
              <div class="notification-content">
                <i class="notification-icon" :class="notification.icon"></i>
                <span>{{ notification.message }}</span>
              </div>
              <button class="notification-close" @click="closeNotification">
                ×
              </button>
            </div>
          </transition>

          <!-- Expander para formulário de adição de perito -->
          <transition name="expand">
            <div v-if="showPeritoForm" class="perito-form-wrapper">
              <div class="perito-form-expander">
                <div class="perito-form-header">
                  <h3>Adicionar Novo Perito</h3>
                  <button
                    class="close-button"
                    @click="togglePeritoForm"
                    aria-label="Fechar formulário"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <form @submit.prevent="submitPeritoForm" class="perito-form">
                  <div class="form-scroll-area">
                    <div class="form-row">
                      <div class="form-group">
                        <label for="nome">Nome</label>
                        <input
                          type="text"
                          id="nome"
                          v-model="novoPeritoData.nome"
                          required
                          placeholder="Nome completo"
                        />
                      </div>
                      <div class="form-group">
                        <label for="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          v-model="novoPeritoData.email"
                          required
                          placeholder="exemplo@email.com"
                        />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="morada">Morada</label>
                        <input
                          type="text"
                          id="morada"
                          v-model="novoPeritoData.morada"
                          required
                          placeholder="Endereço completo"
                        />
                      </div>
                      <div class="form-group">
                        <label for="dataNascimento">Data de Nascimento</label>
                        <input
                          type="date"
                          id="dataNascimento"
                          v-model="novoPeritoData.dataNascimento"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="especialidade">Especialidade</label>
                        <input
                          type="text"
                          id="especialidade"
                          v-model="novoPeritoData.especialidade"
                          required
                          placeholder="Ex: Engenheiro Civil"
                        />
                      </div>
                      <div class="form-group">
                        <label for="numeroTelemovel">Número de Telemóvel</label>
                        <input
                          type="tel"
                          id="numeroTelemovel"
                          v-model="novoPeritoData.numeroTelemovel"
                          required
                          placeholder="9XX XXX XXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button
                      type="button"
                      class="cancel-button"
                      @click="togglePeritoForm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="submit-button"
                      :disabled="isSubmitting"
                    >
                      <span v-if="isSubmitting" class="spinner"></span>
                      <span>{{
                        isSubmitting ? "A processar..." : "Guardar Perito"
                      }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </transition>

          <div class="table-container">
            <GenericTable
              :title="'Lista de Peritos'"
              :subTitle="'Gestão de peritos mobilizados'"
              :data="peritos"
              :columns="columns"
              :type="'striped'"
              @action="handlePeritoAction"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import NavigationList from "../components/NavigationList.vue";
import GenericTable from "../components/GenericTable.vue";
import Filters from "../components/Filters.vue";
import { addPerito } from "../firebase.js";

export default {
  name: "GestaoPeritos",
  components: {
    NavigationList,
    GenericTable,
    Filters,
  },
  data() {
    return {
      filterOptions: [
        {
          key: "status",
          label: "Estado",
          selected: "",
          options: [
            { value: "", label: "Todos os Estados" },
            { value: "mobilizado", label: "Mobilizados" },
            { value: "disponivel", label: "Disponivel" },
          ],
        },
        {
          key: "type",
          label: "Tipo",
          selected: "",
          options: [
            { value: "", label: "Filtrar Por" },
            { key: "name", label: "Nome" },
            { key: "address", label: "Morada" },
            { key: "birthdate", label: "Data Nascimento" },
            { key: "specialty", label: "Especialidade" },
            { key: "phone", label: "Número de Telemóvel" },
          ],
        },
      ],
      columns: [
        { key: "nameEmail", label: "Nome" },
        { key: "address", label: "Morada" },
        { key: "birthDate", label: "Data Nascimento" },
        { key: "specialty", label: "Especialidade" },
        { key: "phone", label: "Número de Telemóvel" },
        { key: "status", label: "Estado" },
        { key: "actions", label: "Ações" },
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
          status: "Mobilizado",
        },
        {
          id: 2,
          name: "Carlos Pinto",
          email: "carlos@sapo.pt",
          address: "Lisboa",
          birthDate: "15/11/1987",
          specialty: "Pedreiro",
          phone: "934567890",
          status: "Disponível",
        },
      ],
      // Novos estados para o formulário de adicionar perito
      showPeritoForm: false,
      isSubmitting: false,
      novoPeritoData: {
        nome: "",
        email: "",
        morada: "",
        dataNascimento: "",
        especialidade: "",
        numeroTelemovel: "",
      },
      // Sistema de notificações
      notification: {
        show: false,
        message: "",
        type: "",
        icon: "",
        timeout: null,
      },
    };
  },
  methods: {
    // Métodos para notificações
    showNotification(message, type = "success") {
      // Limpar timeout anterior se existir
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }

      this.notification.show = true;
      this.notification.message = message;
      this.notification.type = type;

      // Definir ícone baseado no tipo
      if (type === "success") {
        this.notification.icon = "icon-check";
      } else if (type === "error") {
        this.notification.icon = "icon-error";
      } else if (type === "warning") {
        this.notification.icon = "icon-warning";
      } else {
        this.notification.icon = "icon-info";
      }

      // Auto-fechar após 5 segundos
      this.notification.timeout = setTimeout(() => {
        this.closeNotification();
      }, 5000);
    },

    closeNotification() {
      this.notification.show = false;
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }
    },

    // Métodos existentes
    handleSearch(query) {
      // Implementar lógica de busca
      console.log("Busca por:", query);
    },

    handleFilterChange(filters) {
      // Implementar lógica de filtro
      console.log("Filtros alterados:", filters);
    },

    handlePeritoAction(action) {
      // Implementar lógica para ações na tabela
      console.log("Ação na tabela:", action);
    },

    // Novos métodos para o formulário de adicionar perito
    togglePeritoForm() {
      this.showPeritoForm = !this.showPeritoForm;
      if (!this.showPeritoForm) {
        this.resetPeritoForm();
      }
    },

    resetPeritoForm() {
      this.novoPeritoData = {
        nome: "",
        email: "",
        morada: "",
        dataNascimento: "",
        especialidade: "",
        numeroTelemovel: "",
      };
      this.isSubmitting = false;
    },

    async submitPeritoForm() {
      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;

        // Validação adicional de dados (opcional)
        if (!this.validarFormulario()) {
          this.showNotification(
            "Por favor, preencha todos os campos corretamente.",
            "error"
          );
          this.isSubmitting = false;
          return;
        }

        // Chamar a função de adicionar perito
        const peritoId = await addPerito(this.novoPeritoData);

        // Adicionar o novo perito à lista local
        const novoPeritoParaLista = {
          id: peritoId,
          name: this.novoPeritoData.nome,
          email: this.novoPeritoData.email,
          address: this.novoPeritoData.morada,
          birthDate: this.formatarDataNascimento(
            this.novoPeritoData.dataNascimento
          ),
          specialty: this.novoPeritoData.especialidade,
          phone: this.novoPeritoData.numeroTelemovel,
          status: "Disponível",
        };

        this.peritos.push(novoPeritoParaLista);

        // Mostrar notificação de sucesso
        this.showNotification("Perito adicionado com sucesso!", "success");

        // Fechar o formulário e redefinir
        this.$nextTick(() => {
          this.togglePeritoForm();
        });
      } catch (error) {
        console.error("Erro ao adicionar perito:", error);
        this.showNotification(
          "Erro ao adicionar perito. Por favor, tente novamente.",
          "error"
        );
      } finally {
        this.isSubmitting = false;
      }
    },

    validarFormulario() {
      // Validação básica - verifica se todos os campos obrigatórios estão preenchidos
      return (
        this.novoPeritoData.nome.trim() !== "" &&
        this.novoPeritoData.email.trim() !== "" &&
        this.novoPeritoData.morada.trim() !== "" &&
        this.novoPeritoData.dataNascimento !== "" &&
        this.novoPeritoData.especialidade.trim() !== "" &&
        this.novoPeritoData.numeroTelemovel.trim() !== ""
      );
    },

    formatarDataNascimento(data) {
      if (!data) return "";

      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    },

    handleAddPerito() {
      this.togglePeritoForm();
    },
  },
};
</script>

<style scoped>
:root {
  --primary-color: #1890ff;
  --primary-color-hover: #40a9ff;
  --success-color: #28a745;
  --error-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --gray-light: #f0f0f0;
  --gray-medium: #ddd;
  --gray-dark: #666;
  --text-primary: #333;
  --text-secondary: #555;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --transition-fast: 0.2s;
  --transition-med: 0.3s;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Base Styles */
.dashboard-container {
  background: linear-gradient(
      0deg,
      var(--color-grey-98, #fafafb) 0%,
      var(--color-grey-98, #fafafb) 100%
    ),
    var(--color-white-solid, #fff);
  padding-right: 1.5%;
  padding-bottom: 5%;
  height: 100vh;
  overflow-y: auto;
}

.dashboard-layout {
  display: flex;
  height: 100%;
}

/* Sidebar Styles */
.sidebar-column {
  width: 19%;
  height: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
}

.sidebar-nav {
  box-shadow: 1px 0 0 0 var(--gray-light);
  background-color: #fff;
  height: 100vh;
  overflow: hidden;
}

.sidebar-background {
  background-color: #fff;
  height: 100%;
}

/* Main Content Styles */
.main-content {
  width: 81%;
  padding-left: 2%;
  overflow-y: auto;
  height: 100vh;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  padding-top: 2%;
  width: 100%;
  position: relative;
}

.page-header {
  margin-bottom: 2%;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  transition: font-size var(--transition-fast) var(--easing-standard);
}

.filters-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 2%;
  max-width: fit-content;
  width: 80%;
}

/* Animation Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-med) var(--easing-standard),
    transform var(--transition-med) var(--easing-standard);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-0.625rem);
}

.expand-enter-active,
.expand-leave-active {
  transition: all var(--transition-med) var(--easing-standard);
  max-height: 80vh;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-5%);
}

/* Notification System */
.notification {
  position: relative;
  margin: 0 auto 2%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  max-width: 50rem;
  box-shadow: var(--shadow-light);
  animation: slideInDown var(--transition-med) var(--easing-standard);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification.success {
  background-color: #e6f7e6;
  border-left: 0.25rem solid var(--success-color);
  color: #155724;
}

.notification.error {
  background-color: #fae3e5;
  border-left: 0.25rem solid var(--error-color);
  color: #721c24;
}

.notification.warning {
  background-color: #fff3cd;
  border-left: 0.25rem solid var(--warning-color);
  color: #856404;
}

.notification.info {
  background-color: #e9f5fe;
  border-left: 0.25rem solid var(--info-color);
  color: #0c5460;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notification-icon {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.icon-check {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='%23155724' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
}

.icon-error {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='%23721c24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='15' y1='9' x2='9' y2='15'%3E%3C/line%3E%3Cline x1='9' y1='9' x2='15' y2='15'%3E%3C/line%3E%3C/svg%3E");
}

.icon-warning {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='%23856404' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'%3E%3C/path%3E%3Cline x1='12' y1='9' x2='12' y2='13'%3E%3C/line%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'%3E%3C/line%3E%3C/svg%3E");
}

.icon-info {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='%230c5460' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='16' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'%3E%3C/line%3E%3C/svg%3E");
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.notification-close:hover {
  opacity: 1;
}

/* Perito Form */
.perito-form-wrapper {
  position: relative;
  width: 100%;
  margin: 2% 0;
  z-index: 10;
  display: flex;
  justify-content: center;
}

.perito-form-expander {
  background-color: #fff;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-medium);
  padding: 1.5rem;
  width: 80%;
  max-width: 60rem;
  display: flex;
  flex-direction: column;
}

.perito-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--gray-light);
}

.perito-form-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-dark);
  transition: color var(--transition-fast);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  line-height: 1;
}

.close-button:hover {
  color: var(--text-primary);
  background-color: rgba(0, 0, 0, 0.05);
}

.form-scroll-area {
  overflow-y: auto;
  max-height: 50vh;
  padding-right: 0.625rem;
}

.perito-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group label {
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-group input {
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  font-size: 0.875rem;
  transition: border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-light);
}

.cancel-button {
  padding: 0.625rem 1rem;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--gray-dark);
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.cancel-button:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.submit-button {
  padding: 0.625rem 1.125rem;
  border: none;
  background-color: var(--primary-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button:hover {
  background-color: var(--primary-color-hover);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Table Container */
.table-container {
  width: 100%;
  margin-top: 2%;
  overflow-x: auto;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-light);
  background-color: #fff;
  transition: box-shadow var(--transition-fast);
}

.table-container:hover {
  box-shadow: var(--shadow-medium);
}

/* Media Queries */
@media (max-width: 1200px) {
  .page-header h2 {
    font-size: 1.25rem;
  }

  .form-row {
    gap: 0.75rem;
  }

  .perito-form-expander {
    width: 90%;
  }
}

@media (max-width: 1024px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar-column {
    width: 100%;
    height: auto;
    position: relative;
  }

  .sidebar-nav {
    height: auto;
    padding-bottom: 1.25rem;
  }

  .main-content {
    width: 100%;
    padding-left: 0;
    margin-top: 1.25rem;
    height: auto;
  }

  .notification,
  .perito-form-expander {
    width: 95%;
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .filters-container {
    width: 95%;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
    justify-content: center;
  }

  .perito-form-header h3 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding-right: 0.625rem;
    padding-left: 0.625rem;
  }

  .perito-form-expander {
    padding: 1rem;
  }

  .page-header h2 {
    font-size: 1.125rem;
  }
}
</style>
