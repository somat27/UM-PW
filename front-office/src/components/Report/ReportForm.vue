<template>
  <section class="container mt-6" style="margin-top: 150px">
    <div class="card shadow p-4">
      <h1 class="text-center text-primary">Reportar uma Ocorrência</h1>
      <p class="text-center text-muted">
        Ajude a melhorar a cidade! Preencha os dados abaixo para registrar o
        problema.
      </p>

      <div class="mb-3">
        <label class="form-label">Categoria</label>
        <select v-model="selectedCategory" class="form-select">
          <option value="" disabled selected>Selecione uma categoria</option>
          <option value="roads">Vias e Passeios</option>
          <option value="lights">Iluminação Pública</option>
          <option value="sinals">Sinalização em Falta</option>
          <option value="other">Outros</option>
        </select>
      </div>

      <div class="mb-3">
        <h2 class="h5">Localização</h2>
        <p class="text-muted">
          Selecione a localização do incidente (no mapa ou insira o endereço)
        </p>
        <div class="map-container">
          <div id="map" class="border rounded"></div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Endereço</label>
        <input
          v-model="address"
          class="form-control"
          placeholder="Digite o endereço do incidente"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Observações</label>
        <textarea
          v-model="observations"
          class="form-control"
          placeholder="Descreva o problema (máximo 100 palavras)"
          maxlength="100"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Anexos</label>
        <input
          type="file"
          ref="fileInput"
          class="form-control"
          @change="handleFileUpload"
          multiple
        />
        <div v-if="uploadedFiles.length" class="mt-2 text-muted">
          Arquivos selecionados:
          {{ uploadedFiles.map((file) => file.name).join(", ") }}
        </div>
      </div>

      <button
        @click="submitForm"
        class="btn btn-primary w-100"
        :disabled="!isFormValid"
      >
        <i class="bi bi-send-fill"></i> Submeter
      </button>
    </div>
  </section>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
      customIconUrl: "/assets/map-marker.png", // Caminho do ícone nos assets
    };
  },
  computed: {
    isFormValid() {
      return this.selectedCategory && this.address;
    },
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      if (typeof window !== "undefined" && document.getElementById("map")) {
        const init = [41.44575, -8.300961];
        this.map = L.map("map").setView(init, 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(this.map);

        this.map.on("click", this.onMapClick);
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
      });

      // Adicionando o marcador ao mapa
      L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
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
    submitForm() {
      if (!this.isFormValid) {
        alert("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      const formData = {
        category: this.selectedCategory,
        address: this.address,
        observations: this.observations,
        location: this.userLocation,
        files: this.uploadedFiles,
      };

      console.log("Dados do formulário:", formData);
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
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: rgba(32, 76, 109, 0.9);
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
  transition: background-color 0.3s;
}

.submit-button:disabled {
  background-color: rgba(32, 76, 109, 0.5);
  cursor: not-allowed;
}

/* Ajuste do mapa para mais margem lateral */
.map-container {
  max-width: 90%; /* Garante que o mapa não fique muito largo */
  margin: 0 auto; /* Centraliza o mapa horizontalmente */
  padding: 20px; /* Adiciona um espaçamento interno */
}

#map {
  width: 100%; /* Garante que o mapa ocupe toda a largura do contêiner */
  height: 400px; /* Altura fixa */
  border-radius: 12px; /* Bordas arredondadas */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
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
}

@media (max-width: 768px) {
  .body {
    padding: 100px 20px 60px;
  }
}
</style>
