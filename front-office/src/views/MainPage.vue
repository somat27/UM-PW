<template>
  <main class="home-page">
    <AppHeader />
    <HeroSection />
    <section class="service-cards">
      <ServiceCard
        title="Vias Danificadas? Avise-nos!!"
        description="Reporte buracos, fissuras ou danos em estradas e passeios para reparação rápida."
        :imageSrc="cardRoad"
        imageAlt="Roads icon"
        buttonText="Reportar"
      />
      <ServiceCard
        title="Luz Apagada? Ilumine a Cidade!"
        description="Informe falhas em postes, lâmpadas queimadas ou áreas escuras."
        :imageSrc="cardPlaca"
        imageAlt="Light icon"
        buttonText="Reportar"
      />
      <ServiceCard
        title="Sinalização em falta? Resolva já!"
        description="Placas em falta, semáforos avariados ou marcas rodoviárias apagadas? Reporte aqui."
        :imageSrc="cardLights"
        imageAlt="Signs icon"
        buttonText="Reportar"
      />
      <ServiceCard
        title="Obras e Intervenções Urbanas"
        description="Acesse informações sobre obras em curso e impactos no trânsito."
        :imageSrc="cardObras"
        imageAlt="Construction icon"
        buttonText="Consultar"
      />
    </section>
    <section class="statistics-section">
      <StatCard
        :imageSrc="cardAuditoria"
        xs
        iconAlt="Audit icon"
        value="22"
        description="Auditorias realizadas este ano"
      />
      <StatCard
        :imageSrc="cardOcorrencia"
        iconAlt="Reports icon"
        value="150"
        description="Ocorrencias registadas este ano"
      />
      <StatCard
        :imageSrc="cardTempo"
        iconAlt="Time icon"
        value="2-3 dias"
        description="Tempo médio de resolução"
      />
      <StatCard
        :imageSrc="cardSatisfacao"
        iconAlt="Satisfaction icon"
        value="96%"
        description="Percetagem de satisfação da comunidade"
      />
    </section>
    <AppFooter />
  </main>
</template>

<script>
import AppHeader from "@/layouts/Header.vue";
import HeroSection from "@/components/PaginaInicial/HeroSection.vue";
import ServiceCard from "@/components/PaginaInicial/ServiceCard.vue";
import StatCard from "@/components/PaginaInicial/StatCard.vue";
import AppFooter from "@/layouts/Footer.vue";

//imagens dos Report CARDS
import cardRoad from "@/assets/PaginaInicial/cardReport/cardRoads.jpg";
import cardPlaca from "@/assets/PaginaInicial/cardReport/cardPlaca.jpg";
import cardLights from "@/assets/PaginaInicial/cardReport/cardLights.jpg";
import cardObras from "@/assets/PaginaInicial/cardReport/cardObras.jpg";

//imagens para os STATCS CARDS
import cardAuditoria from "@/assets/PaginaInicial/cardEstatistica/auditoria.jpg";
import cardOcorrencia from "@/assets/PaginaInicial/cardEstatistica/ocorrencia.jpg";
import cardTempo from "@/assets/PaginaInicial/cardEstatistica/tempo.jpg";
import cardSatisfacao from "@/assets/PaginaInicial/cardEstatistica/satisfacao.jpg";

export default {
  name: "MainPage",
  components: {
    AppHeader,
    HeroSection,
    ServiceCard,
    StatCard,
    AppFooter,
  },
  data() {
    return {
      cardRoad,
      cardPlaca,
      cardLights,
      cardObras,
      cardAuditoria,
      cardOcorrencia,
      cardTempo,
      cardSatisfacao,
    };
  },
};
</script>

<style scoped>
.home-page {
  font-family: "Inter", sans-serif;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}

.service-cards {
  display: flex;
  padding-top: 100px;
  gap: 50px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .service-cards {
    padding: 15px;
    gap: 25px;
  }
}

.statistics-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px 30px;
  padding: 53px 60px;
  justify-content: center;
}

@media (max-width: 991px) {
  .statistics-section {
    grid-template-columns: 1fr;
    gap: 60px;
    padding: 30px;
  }
}

@media (max-width: 640px) {
  .statistics-section {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 15px;
  }
}
</style>
