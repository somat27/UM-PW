<template>
  <section class="content-section">
    <Transition name="slide-fade" appear>
      <img
        src="@/assets/AboutUS.jpg"
        alt="Report Interface"
        class="report-image"
      />
    </Transition>

    <article class="about-container">
      <Transition name="fade-in" appear>
        <h1 class="about-title">Sobre Nós</h1>
      </Transition>

      <Transition name="fade-up" appear :delay="300">
        <p class="about-description">
          Na EyesEverywhere, acreditamos que uma cidade melhor começa com a
          participação ativa dos cidadãos. A nossa plataforma permite que
          qualquer pessoa reporte problemas urbanos, como buracos na estrada,
          iluminação pública avariada ou sinalização em falta, de forma rápida e
          intuitiva.
        </p>
      </Transition>

      <Transition name="fade-up" appear :delay="600">
        <p class="about-description">
          Com uma interface moderna e tecnologia inteligente, ligamos os
          cidadãos às entidades responsáveis, garantindo que as ocorrências
          sejam analisadas e resolvidas com eficiência. Juntos, tornamos os
          espaços urbanos mais seguros, funcionais e bem cuidados.
        </p>
      </Transition>
    </article>
  </section>
</template>

<script>
export default {
  name: "AboutContent",
};
</script>

<style scoped>
/* Estilo base */
.content-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px 42px;
}

/* Estilo da imagem */
.report-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  margin: 40px;
  margin-top: 70px;
  width: 550px;
}

/* Estilo do container de texto */
.about-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  text-align: center;
}

/* Estilo do título */
.about-title {
  color: #204c6d;
  font-size: 100px;
  font-weight: bold;
  font-family: Inter, sans-serif;
}

/* Estilo do texto */
.about-description {
  color: #333;
  font-size: 30px;
  font-family: Inter, sans-serif;
  line-height: 2;
}

/* Animações */
/* Deslizamento e fade para a imagem */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-enter-from {
  transform: translateX(-50px);
  opacity: 0;
}

/* Fade simples para o título */
.fade-in-enter-active {
  transition: opacity 1s ease;
}
.fade-in-enter-from {
  opacity: 0;
}

/* Fade com deslize para cima para os parágrafos */
.fade-up-enter-active {
  transition: all 0.8s ease-out;
}
.fade-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

/* Responsividade para telas maiores */
@media (min-width: 992px) {
  .content-section {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: left;
  }

  .report-image {
    max-width: 50%;
    height: auto;
  }

  .about-container {
    max-width: 50%;
    text-align: left;
  }

  .about-title {
    font-size: 60px;
  }

  .about-description {
    font-size: 22px;
  }

  /* Alteração da direção da animação em desktop */
  .slide-fade-enter-from {
    transform: translateX(-80px);
  }
}

/* Ajustes para telas menores */
@media (max-width: 640px) {
  .content-section {
    padding: 16px;
  }

  .about-title {
    font-size: 40px;
  }

  .about-description {
    font-size: 18px;
  }
}
</style>
