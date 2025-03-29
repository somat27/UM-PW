<template>
    <main class="audit-details-container">
      <h2 class="audit-title">Rua sem luz</h2>
  
      <section class="image-gallery">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/25eace4a31861e2610f8d8154d104ef3858dcd20?placeholderIfAbsent=true&apiKey=ad16d8ed74544ae183b0bcceec058ec5"
          class="background-image"
          alt="Background"
        />
      </section>    
  
      <section class="time-info">
        <span class="time-label">Inicio:</span>
        <div class="time-value">00:00</div>
        <span class="time-label">Fim:</span>
        <div class="time-value">00:00</div>
      </section>
  
      <section class="report-section">
        <h3 class="section-title">Relatório:</h3>
        <div class="report-content">
            <p class="report-text">Relatório da obra em questão de não haver luz na rua e não na ruz</p>
        </div>
      </section>
  
      <section class="professionals-section">
        <h3 class="section-title">Profissionais requeridos:</h3>
        <div class="dropdown">
          <button class="dropdown-btn">
            Selecionar Profissionais
            <span class="arrow">▼</span>
          </button>
          <div class="dropdown-content">
            <label><input type="checkbox" value="Eletricista"> Eletricista</label>
            <label><input type="checkbox" value="Encanador"> Encanador</label>
            <label><input type="checkbox" value="Pedreiro"> Pedreiro</label>
            <label><input type="checkbox" value="Pintor"> Pintor</label>
          </div>
  </div>
      </section>
  
      <section class="status-section">
        <span class="status-label">Estado:</span>
        <div class="status-value">Concluido</div>
      </section>
    </main>
  </template>
  
  <script>
  export default {
    name: "AuditDetailsComponent",
  };
  </script>
  
  <style scoped>
  .audit-details-container {
    min-height: 100vh;
    display: flex;
    padding: 0 5%;
    flex-direction: column;
  }
  
  .audit-title {
    padding-top: 1%;
    color: #000;
  }
  
  .image-gallery {
    max-height: 300px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    position: relative;
    aspect-ratio: 1.75;
    overflow: hidden;
  }
  
  .background-image {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .time-info {
    align-self: center;
    display: flex;
    margin-top: 5%;
    gap: 16px;
    font-size: 100%;
    color: #000;
  }
  
  .time-label {
    margin-top: auto;
    margin-bottom: auto;
    flex-grow: 1;
  }
  
  .time-value {
    border-radius: 15px;
    background-color: rgba(217, 217, 217, 1);
    padding: 2.5% 13px;
    text-align: center;
  }
  
  .section-title {
    padding-top: 5%;
    color: #000;
    align-self: start;
  }
  
  .report-content {
    border-radius: 15px;
    background-color: rgba(217, 217, 217, 1);
    margin-top: 2.5%;
    height: auto;
    min-height: 157px;
  }

  .report-text {
    padding: 10px;
    color: #000;
    text-align: left;
    overflow-wrap: break-word;
    white-space: normal;
  }
  
  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .dropdown-btn {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    border: none;
    background-color: rgba(217, 217, 217, 1);
    text-align: left;
    border-radius: 15px;
  }

.arrow {
  margin-left: auto;
}

  .dropdown-content {
    display: none;
    position: relative;
    background-color: white;
    border: 1px solid #ccc;
    width: 100%;
    max-height: auto;
    overflow-y: auto;
    padding: 5px;
    transition: max-height 0.3s ease-in-out;
  }

  .dropdown-content label {
    text-align: left;
    display: block;
    padding: 5px;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }
  
  .status-section {
    align-self: start;
    display: flex;
    margin-top: 5%;
    margin-bottom: 5%;
    gap: 5%;
    color: #000;
    white-space: normal;
  }
  
  .status-label {
    margin-top: auto;
    margin-bottom: auto;
    flex-grow: 1;
  }
  
  .status-value {
    border-radius: 15px;
    background-color: rgba(0, 255, 0, 1);
    padding: 10px;
    text-align: center;
  }
  </style>
  