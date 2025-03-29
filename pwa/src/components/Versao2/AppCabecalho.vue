<template>
  <header class="cabecalho">
    <h1 class="texto">Dashboard</h1>
    <div class="icons">
      <i class="bi bi-bell"></i>
      <div class="perfil">
        <i class="bi bi-person-circle"></i>
        <div class="seta">
          <i class="bi bi-chevron-down"></i>
        </div>
      </div>
    </div>
  </header>
</template>


<script>
export default {
  name: "AppCabecalho",
};
</script>


<style scoped>
  .cabecalho {
    position: sticky;
    top: 0;

    min-height: 7.5vh;
    
    align-items: center;
    display: flex;
    justify-content: space-between;

    background-color: #fff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .texto {
    margin-left: 1.5vh;
  }

  .icons {
    margin-right: 2.25vh;
    font-size: 3.5vh;
    
    display: flex;
    gap: 2.25vh;
  }

  .perfil {
    align-items: center;
    display: flex;
    gap: 0.5vh;
  }

  .seta {
    font-size: 2vh;
  }
</style>