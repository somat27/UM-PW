<template>
  <header class="cabecalho">
    <h1 class="texto">{{ titulo }}</h1>
    <div class="icons">
      <button class="botao" @click="notificacao = !notificacao, detalhePerfil = false">
        <i class="bi bi-bell"></i>
      </button>
      <button class="botao" @click="detalhePerfil = !detalhePerfil, notificacao = false">
        <div class="perfil">
          <i class="bi bi-person-circle"></i>
          <div class="seta">
            <i class="bi bi-chevron-down"></i>
          </div>
        </div>
      </button>
    </div>
    
    <div v-if="notificacao" class="popup" id="popupNotificacao">
      <h2>NOTIFICACAO</h2>
    </div>
    <div v-if="detalhePerfil" class="popup" id="popupPerfil">
      <button class="botao" @click="goToVerPerfil"><h2>Ver Perfil</h2></button>
      <button class="botao" @click="terminarSessao"><h2>Log Out</h2></button>
    </div>
  </header>
</template>


<script>
  import { logout } from "@/firebase/firebase.js";
  export default {
    name: "AppCabecalho",
    data() {
      return {
        notificacao: false,
        detalhePerfil: false,
      };
    },
    props: {
      titulo: {
        type: String,
        default: 'EyesEverywhere'
      }
    },
    methods: {
      goToVerPerfil() {
        this.$router.push("/Perfil");
      },
      terminarSessao() {
        logout;
        localStorage.removeItem("userUID");
        this.$router.push("/");
      },
    },
  }
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

  .botao {
    border: none;
    background-color: transparent;
  }

  .popup {
    display: flex;
    flex-direction: column;
    position: absolute;
    padding: 1vh;
    top: 0;
    margin-top: 7.5vh;
    right: 0;
    text-align: left;

    background-color: #fff;
    border: 1px solid #cccccccc;

    z-index: 100;
  }

  #popupNotificacao {
    width: 40vw;
    margin-right: 4.25vh;
  }

  #popupPerfil {
    margin-right: 2vh;
  }

  h2 {
    font-size: 16px;
    color: #888;
  }
</style>