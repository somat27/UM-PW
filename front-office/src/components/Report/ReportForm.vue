<template>
  <section
    class="container mt-6 fade-in"
    style="margin-top: 150px; margin-bottom: 50px"
  >
    <div class="card shadow p-4 slide-up">
      <h1 class="text-center text-primary pulse">Reportar uma Ocorrência</h1>
      <p class="text-center text-muted fade-in-delay">
        Ajude a melhorar a cidade! Preencha os dados abaixo para registrar o
        problema.
      </p>

      <div class="mb-3 fade-in-delay-1">
        <label class="form-label">Categoria</label>
        <select v-model="selectedCategory" class="form-select hover-effect">
          <option value="" disabled selected>Selecione uma categoria</option>
          <option value="roads">Vias e Passeios</option>
          <option value="lights">Iluminação Pública</option>
          <option value="sinals">Sinalização em Falta</option>
          <option value="other">Outros</option>
        </select>
      </div>

      <div class="mb-3 fade-in-delay-2">
        <h2 class="h5">Localização</h2>
        <p class="text-muted">
          Selecione a localização do incidente (no mapa ou insira o endereço)
        </p>
        <div class="map-container">
          <div id="map" class="border rounded shadow-sm map-fade-in"></div>
        </div>
      </div>

      <div class="mb-3 fade-in-delay-3">
        <label class="form-label">Endereço</label>
        <input
          v-model="address"
          class="form-control hover-effect"
          placeholder="Digite o endereço do incidente"
          :class="{ filled: address }"
        />
      </div>

      <div class="mb-3 fade-in-delay-4">
        <label class="form-label">Observações</label>
        <textarea
          v-model="observations"
          class="form-control hover-effect"
          placeholder="Descreva o problema (máximo 100 palavras)"
          maxlength="100"
          :class="{ filled: observations }"
        ></textarea>
        <small
          class="text-muted float-end mt-1 character-count"
          v-if="observations"
        >
          {{
            observations.split(" ").filter((word) => word.length > 0).length
          }}/100 palavras
        </small>
      </div>

      <div class="mb-3 fade-in-delay-5">
        <label class="form-label">Anexos</label>
        <div class="file-upload-container">
          <input
            type="file"
            ref="fileInput"
            class="form-control hover-effect file-input"
            @change="handleFileUpload"
            multiple
            id="file-upload"
          />
          <label for="file-upload" class="file-upload-label">
            <i class="bi bi-cloud-upload"></i> Selecionar Arquivos
          </label>
        </div>
        <transition name="fade">
          <div v-if="uploadedFiles.length" class="mt-2 text-muted file-list">
            <div class="file-preview">
              Arquivos selecionados:
              {{ uploadedFiles.map((file) => file.name).join(", ") }}
            </div>
          </div>
        </transition>
      </div>

      <button
        @click="submitForm"
        class="btn btn-primary w-100 submit-button"
        :disabled="!isFormValid"
        :class="{ 'button-pulse': isFormValid }"
      >
        <i class="bi bi-send-fill"></i> Submeter
      </button>
    </div>
  </section>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { submitOcorrencia } from "@/services/firebase";

export default {
  name: "ReportForm",
  props: {
    defaultCategory: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      map: null,
      selectedCategory: this.defaultCategory,
      address: "",
      observations: "",
      uploadedFiles: [],
      userLocation: null,
      customIconUrl: "https://imgur.com/orBDSWx",
      mapInitialized: false,
      isSubmitting: false,
    };
  },
  computed: {
    isFormValid() {
      return this.selectedCategory && this.address;
    },
  },
  mounted() {
    // efeito suave
    setTimeout(() => {
      this.initMap();
    }, 300);
  },
  methods: {
    initMap() {
      if (
        typeof window !== "undefined" &&
        document.getElementById("map") &&
        !this.mapInitialized
      ) {
        const init = [41.44575, -8.300961];
        this.map = L.map("map", {
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true,
        }).setView(init, 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(this.map);

        this.map.on("click", this.onMapClick);

        // Adiciona animação de zoom quando o mapa é carregado
        this.map.once("load", () => {
          setTimeout(() => {
            this.map.setZoom(14, {
              animate: true,
              duration: 1,
            });
          }, 500);
        });

        this.mapInitialized = true;
      }
    },
    onMapClick(e) {
      const { lat, lng } = e.latlng;

      // Remove marcadores antigos
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });

      // Criando um ícone personalizado do diretório "assets"
      const customIcon = L.icon({
        iconUrl: this.customIconUrl, // Caminho do ícone nos assets
        iconSize: [40, 40], // Tamanho do ícone
        iconAnchor: [20, 40], // Ponto de ancoragem
        popupAnchor: [0, -40], // Onde aparece o popup
        className: "marker-bounce", // Adiciona classe para animação
      });

      // Adicionando o marcador ao mapa com animação
      const marker = L.marker([lat, lng], {
        icon: customIcon,
        opacity: 0,
      }).addTo(this.map);

      // Anima a opacidade do marcador
      setTimeout(() => {
        marker.setOpacity(1);
      }, 100);

      this.userLocation = { lat, lng };

      // Obtendo endereço reverso
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.address =
            data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        })
        .catch((error) => {
          console.error("Erro na geocodificação:", error);
          this.address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        });
    },
    handleFileUpload(event) {
      this.uploadedFiles = Array.from(event.target.files);
    },
    async submitForm() {
      if (!this.isFormValid) {
        this.showValidationAnimation();
        return;
      }

      // Indica que o envio está em andamento
      this.isSubmitting = true;

      // Referência ao botão para gerenciar a animação
      const button = document.querySelector(".submit-button");
      button.classList.add("success-submit");
      button.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';

      // Prepara os dados do formulário
      const formData = {
        selectedCategory: this.selectedCategory,
        address: this.address,
        observations: this.observations,
        userLocation: this.userLocation,
        files: this.uploadedFiles,
      };

      try {
        // Chama o serviço Firebase para submeter a ocorrência
        const result = await submitOcorrencia(formData);

        if (result.success) {
          console.log("Ocorrência enviada com sucesso! ID:", result.id);

          // Atualiza o botão para indicar sucesso
          button.innerHTML =
            '<i class="bi bi-check-lg"></i> Enviado com Sucesso!';

          setTimeout(() => {
            // Redireciona para a página inicial
            this.$router.push("/");
          }, 1500); // Aguarda 1.5 segundos
        } else {
          throw new Error(result.error || "Erro ao enviar ocorrência");
        }
      } catch (error) {
        console.error("Erro ao processar formulário:", error);

        // Atualiza o botão para indicar erro
        button.classList.remove("success-submit");
        button.classList.add("error-submit");
        button.innerHTML =
          '<i class="bi bi-exclamation-triangle"></i> Erro no envio!';

        // Volta ao estado normal após alguns segundos
        setTimeout(() => {
          button.classList.remove("error-submit");
          button.innerHTML = '<i class="bi bi-send-fill"></i> Submeter';
          this.isSubmitting = false;
        }, 3000);
      }
    },
    showValidationAnimation() {
      const invalidFields = document.querySelectorAll(
        "select:invalid, input:invalid"
      );
      invalidFields.forEach((field) => {
        field.classList.add("shake-animation");
        setTimeout(() => {
          field.classList.remove("shake-animation");
        }, 500);
      });
    },
    resetForm() {
      this.selectedCategory = "";
      this.address = "";
      this.observations = "";
      this.uploadedFiles = [];
      this.userLocation = null;

      // Reset do botão
      const button = document.querySelector(".submit-button");
      button.classList.remove("success-submit");
      button.innerHTML = '<i class="bi bi-send-fill"></i> Submeter';

      // Limpa os marcadores do mapa
      if (this.map) {
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.body {
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  width: 100%;
  padding: 120px 80px 91px;
  flex-direction: column;
  align-items: center;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
}

/* Animações gerais */
.fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

.fade-in-delay {
  animation: fadeIn 0.8s ease-in-out 0.2s forwards;
  opacity: 0;
}

.fade-in-delay-1 {
  animation: fadeIn 0.8s ease-in-out 0.3s forwards;
  opacity: 0;
}

.fade-in-delay-2 {
  animation: fadeIn 0.8s ease-in-out 0.4s forwards;
  opacity: 0;
}

.fade-in-delay-3 {
  animation: fadeIn 0.8s ease-in-out 0.5s forwards;
  opacity: 0;
}

.fade-in-delay-4 {
  animation: fadeIn 0.8s ease-in-out 0.6s forwards;
  opacity: 0;
}

.fade-in-delay-5 {
  animation: fadeIn 0.8s ease-in-out 0.7s forwards;
  opacity: 0;
}

.slide-up {
  animation: slideUp 0.6s ease-out;
}

.map-fade-in {
  animation: fadeIn 1s ease-in-out 0.5s forwards;
  opacity: 0.5;
}

.pulse {
  animation: pulse 1s ease-in-out;
}

/* Efeitos para interação */
.hover-effect {
  transition: all 0.3s ease;
  border: 1px solid rgba(32, 76, 109, 0.3);
}

.hover-effect:hover {
  border-color: rgba(32, 76, 109, 0.8);
  box-shadow: 0 0 5px rgba(32, 76, 109, 0.2);
  transform: translateY(-2px);
}

.hover-effect:focus {
  border-color: rgb(32, 76, 109);
  box-shadow: 0 0 8px rgba(32, 76, 109, 0.4);
  transform: translateY(-2px);
}

.filled {
  border-left: 3px solid rgb(32, 76, 109);
  transition: border-left 0.3s ease;
}

/* Upload de arquivos estilizado */
.file-upload-container {
  position: relative;
  overflow: hidden;
}

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-upload-label {
  display: block;
  padding: 12px;
  background-color: #f0f8ff;
  color: rgba(32, 76, 109, 1);
  text-align: center;
  border: 1px dashed rgba(32, 76, 109, 0.5);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-upload-label:hover {
  background-color: rgba(32, 76, 109, 0.1);
  border-color: rgba(32, 76, 109, 0.8);
}

.file-preview {
  animation: fadeIn 0.5s ease-in-out;
}

/* Animação do botão de submissão */
.submit-button {
  transition: all 0.3s ease;
  background-color: rgba(32, 76, 109, 1);
  transform-origin: center;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(32, 76, 109, 0.3);
}

.button-pulse {
  animation: buttonPulse 2s infinite;
}

.success-submit {
  background-color: #28a745 !important;
  transform: scale(1.05);
}

/* Animação do marcador do mapa */
.marker-bounce {
  animation: bounce 0.6s ease-out;
}

/* Animação de validação */
.shake-animation {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  border-color: #dc3545 !important;
}

/* Contador de caracteres */
.character-count {
  transition: all 0.3s ease;
  animation: fadeIn 0.3s ease-in-out;
}

/* Keyframes para animações */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes buttonPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(32, 76, 109, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(32, 76, 109, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(32, 76, 109, 0);
  }
}

@keyframes bounce {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  60% {
    transform: translateY(5px);
    opacity: 1;
  }
  80% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-2px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(2px, 0, 0);
  }
}

/* Animações para o fade entre seções */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.form-title {
  font-size: 2rem;
  color: #204c6d;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-description {
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.category-section,
.location-section,
.map-section,
.input-section,
.attachments-section,
.submit-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.category-label,
.input-section label {
  color: rgba(32, 76, 109, 1);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.category-select {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(32, 76, 109, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f0f8ff;
}

.category-select,
.address-input,
.observations-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(32, 76, 109, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.observations-input {
  min-height: 120px;
  resize: vertical;
}

.upload-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.upload-icon,
.upload-button-icon {
  width: 48px;
  height: 48px;
  fill: white;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  background-color: rgba(32, 76, 109, 1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.upload-button:hover {
  background-color: rgba(32, 76, 109, 0.9);
  transform: translateY(-2px);
}

.file-input {
  display: none;
}

.file-list {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: rgba(32, 76, 109, 0.7);
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: rgba(32, 76, 109, 1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:disabled {
  background-color: rgba(32, 76, 109, 0.5);
  cursor: not-allowed;
}

/* Ajuste do mapa para mais margem lateral */
.map-container {
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
  transition: all 0.3s ease;
}

#map {
  width: 100%; /* Garante que o mapa ocupe toda a largura do contêiner */
  height: 400px; /* Altura fixa */
  border-radius: 12px; /* Bordas arredondadas */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
  transition: all 0.3s ease;
}

#map:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Responsividade */
@media (max-width: 768px) {
  .map-container {
    max-width: 95%; /* Em telas menores, o mapa ocupa mais espaço */
    padding: 10px; /* Reduz o espaçamento interno */
  }

  #map {
    height: 300px; /* Reduz a altura do mapa em telas pequenas */
  }

  .fade-in-delay-1,
  .fade-in-delay-2,
  .fade-in-delay-3,
  .fade-in-delay-4,
  .fade-in-delay-5 {
    animation-delay: 0.2s; /* Reduz o atraso em dispositivos móveis para melhor UX */
  }
}

@media (max-width: 768px) {
  .body {
    padding: 100px 20px 60px;
  }
}
</style>
