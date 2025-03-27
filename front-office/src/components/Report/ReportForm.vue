<template>
  <section class="body">
    <div class="forms">
      <div class="form-background">
        <div class="form-container">
          <h1 class="form-title">
            <span class="title-text">Reportar uma Ocorrência</span>
          </h1>
          
          <p class="form-description">
            Ajude a melhorar a cidade! Preencha os dados abaixo para registrar o problema.
          </p>

          <div class="form-section">
            <div class="category-section">
              <label class="category-label">Categoria</label>
              <select 
                v-model="selectedCategory" 
                class="category-select"
              >
                <option value="" disabled selected>Selecione uma categoria</option>
                <option value="roads">Vias e Passeios</option>
                <option value="lights">Iluminação Pública</option>
                <option value="sinals">Sinalização em Falta</option>
                <option value="other">Outros</option>
              </select>
            </div>

            <div class="location-section">
              <h2 class="location-title">Localização</h2>
              <p class="location-description">
                Selecione a localização do incidente (no mapa ou insira o endereço)
              </p>
            </div>

            <div class="map-section">
              <div id="map" class="map-image"></div>
            </div>

            <div class="input-section">
              <div class="input-group">
                <label>Endereço</label>
                <input 
                  v-model="address" 
                  class="address-input" 
                  placeholder="Digite o endereço do incidente"
                />
              </div>

              <div class="input-group">
                <label>Observações</label>
                <textarea 
                  v-model="observations" 
                  class="observations-input" 
                  placeholder="Descreva o problema (máximo 100 palavras)"
                  maxlength="100"
                ></textarea>
              </div>
            </div>

            <div class="submit-section">
              <button 
                @click="submitForm" 
                class="submit-button"
                :disabled="!isFormValid"
              >
                <div class="submit-button-content">SUBMETER</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: "ReportForm",
  data() {
    return {
      map: null,
      selectedCategory: '',
      address: '',
      observations: '',
      uploadedFiles: [],
      userLocation: null
    }
  },
  computed: {
    isFormValid() {
      return this.selectedCategory && this.address
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      // Coordenadas específicas com zoom menos próximo
      const braga = [41.445750, -8.300961]
      this.map = L.map('map').setView(braga, 10)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)

      // Adicionar marcador na localização especificada
      L.marker(braga).addTo(this.map)
        .bindPopup("Braga, Portugal").openPopup()
    },
    handleFileUpload(event) {
      this.uploadedFiles = Array.from(event.target.files)
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    submitForm() {
      if (!this.isFormValid) {
        alert('Por favor, preencha todos os campos obrigatórios')
        return
      }

      const formData = {
        category: this.selectedCategory,
        address: this.address,
        observations: this.observations,
        location: this.userLocation,
        files: this.uploadedFiles
      }

      console.log('Dados do formulário:', formData)
    }
  }
}
</script>

<style scoped>
.body {
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  width: 100%;
  padding: 120px 80px 91px; /* Adicionado padding no topo para navbar fixa */
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

.category-select {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(32, 76, 109, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f0f8ff;
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

.map-image {
  height: 400px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.upload-icon, .upload-button-icon {
  width: 48px;
  height: 48px;
  fill: rgba(32, 76, 109, 1);
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

@media (max-width: 768px) {
  .body {
    padding: 100px 20px 60px;
  }
}
</style>