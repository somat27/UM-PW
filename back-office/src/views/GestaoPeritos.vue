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
              :gap="'80px'"
              search-placeholder="Procurar Peritos..."
              button-text="+ Adicionar Peritos"
              @search="handleSearch"
              @filter-change="handleFilterChange"
              @add="openAddPeritoModal"
            />
          </div>

          <div v-if="loading" class="loading-container">
            <p>Carregando peritos...</p>
          </div>

          <div v-else-if="error" class="error-container">
            <p>Erro ao carregar peritos: {{ error }}</p>
          </div>

          <GenericTable
            v-else
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

    <!-- Modal para adicionar perito -->
    <div
      class="modal-overlay"
      v-if="showAddPeritoModal"
      @click.self="closeAddPeritoModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>Adicionar Novo Perito</h2>
          <button class="close-button" @click="closeAddPeritoModal">
            &times;
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitPerito">
            <div class="form-group">
              <label for="name">Nome Completo</label>
              <input
                type="text"
                id="name"
                v-model="novoPeritoForm.name"
                required
                placeholder="Insira o nome completo"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="novoPeritoForm.email"
                required
                placeholder="exemplo@email.com"
              />
            </div>

            <div class="form-group">
              <label for="birthDate">Data de Nascimento</label>
              <input
                type="text"
                id="birthDate"
                v-model="novoPeritoForm.birthDate"
                required
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div class="form-group">
              <label for="address">Morada</label>
              <input
                type="text"
                id="address"
                v-model="novoPeritoForm.address"
                required
                placeholder="Cidade, Rua"
              />
            </div>

            <div class="form-group">
              <label for="specialty">Especialidade</label>
              <input
                type="text"
                id="specialty"
                v-model="novoPeritoForm.specialty"
                required
                placeholder="Especialidade do perito"
              />
            </div>

            <div class="form-group">
              <label for="phone">Número de Telemóvel</label>
              <input
                type="text"
                id="phone"
                v-model="novoPeritoForm.phone"
                required
                placeholder="9XXXXXXXX"
              />
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="cancel-button"
                @click="closeAddPeritoModal"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="submit-button"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "A guardar..." : "Guardar" }}
              </button>
            </div>
          </form>

          <!-- Mensagem de erro/sucesso -->
          <div v-if="submitMessage" :class="['submit-message', submitStatus]">
            {{ submitMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationList from "../components/NavigationList.vue";
import GenericTable from "../components/GenericTable.vue";
import Filters from "../components/Filters.vue";
import { addPerito, getPeritos } from "../firebase";

export default {
  name: "GestaoPeritos",
  components: {
    NavigationList,
    GenericTable,
    Filters,
  },
  data() {
    return {
      peritos: [],
      loading: true,
      error: null,
      showAddPeritoModal: false,
      isSubmitting: false,
      submitMessage: "",
      submitStatus: "",
      novoPeritoForm: {
        name: "",
        email: "",
        birthDate: "",
        address: "",
        specialty: "",
        phone: "",
        status: "Disponível",
        role: "perito",
      },
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
    };
  },
  created() {
    // Carregar peritos ao iniciar o componente
    this.loadPeritos();
  },
  methods: {
    async loadPeritos() {
      try {
        this.loading = true;
        this.error = null;

        // Buscar peritos do Firebase
        const peritosList = await getPeritos();

        // Formatar os dados se necessário para compatibilidade com a tabela
        this.peritos = peritosList.map((perito) => ({
          id: perito.uid,
          name: perito.name || "",
          email: perito.email || "",
          nameEmail: {
            // Combinando nome e email para a coluna "Nome"
            name: perito.name || "",
            email: perito.email || "",
          },
          address: perito.address || "",
          birthDate: perito.birthDate || "",
          specialty: perito.specialty || "",
          phone: perito.phone || "",
          status: perito.status || "Disponível",
        }));
      } catch (error) {
        console.error("Erro ao carregar peritos:", error);
        this.error = error.message || "Erro ao carregar peritos";
      } finally {
        this.loading = false;
      }
    },
    handleSearch(searchTerm) {
      // Implementar lógica de busca com Firebase
      console.log("Buscando por:", searchTerm);
      // Aqui você pode buscar localmente nos peritos já carregados
      // ou fazer uma nova consulta ao Firebase com filtros adicionais
    },
    handleFilterChange(filters) {
      // Implementar lógica de filtragem com Firebase
      console.log("Filtros alterados:", filters);
      // Você pode fazer nova consulta ao Firebase incluindo where clauses adicionais
    },
    handlePeritoAction(action, perito) {
      // Implementar ações de perito
      console.log("Ação:", action, "Perito:", perito);
    },
    openAddPeritoModal() {
      // Abre o modal e reseta o formulário
      this.showAddPeritoModal = true;
      this.submitMessage = "";
      this.submitStatus = "";
      this.novoPeritoForm = {
        name: "",
        email: "",
        birthDate: "",
        address: "",
        specialty: "",
        phone: "",
        status: "Disponível",
        role: "perito",
      };
    },
    closeAddPeritoModal() {
      // Fecha o modal
      this.showAddPeritoModal = false;
    },
    async submitPerito() {
      try {
        // Indicador de carregamento
        this.isSubmitting = true;
        this.submitMessage = "";

        const peritoData = {
          ...this.novoPeritoForm,
        };

        // Envia dados para Firebase
        const docId = await addPerito(peritoData);
        console.log("Novo perito: " + docId);

        // Recarrega peritos para refletir a mudança
        await this.loadPeritos();

        // Exibe mensagem de sucesso
        this.submitStatus = "success";
        this.submitMessage = "Perito adicionado com sucesso!";

        // Fecha o modal após 1.5 segundos
        setTimeout(() => {
          this.closeAddPeritoModal();
        }, 1500);
      } catch (error) {
        // Exibe mensagem de erro
        console.error("Erro ao adicionar perito:", error);
        this.submitStatus = "error";
        this.submitMessage = `Erro ao adicionar perito: ${
          error.message || "Tente novamente."
        }`;
      } finally {
        this.isSubmitting = false;
      }
    },
    handleAddPerito() {
      this.openAddPeritoModal();
    },
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
  margin-right: 20px;
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
  font-family: Public Sans, -apple-system, Roboto, Helvetica, sans-serif;
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

/* Estilos para o modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 500px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
}

.modal-body {
  padding: 10%;
  background-position: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  align-items: center;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.submit-button {
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
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

  .modal-content {
    width: 95%;
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
