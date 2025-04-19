<template>
    <header class="flex-linha item-ponta" id="cabecalho">
        <h1>{{ titulo }}</h1>

        <div id="perfil">
            <button class="transparente" id="icon" @click="perfil = !perfil">
                <i class="bi bi-person"></i>
            </button>

            <PopUpPerfil v-if="perfil" />
        </div>
            
    </header>
</template>


<script>
    import PopUpPerfil from './Paginas/PopUp/PopUpPerfil.vue';
    export default {
        name: "AppHeader",
        components: {
            PopUpPerfil
        },
        props: {
            titulo: {
                type: String,
                default: 'EyesEverywhere'
            }
        },
        data() {
            return {
                perfil: false,
            }
        },
    }
</script>


<style>
    #cabecalho {
        position: sticky;
        top: 0;

        padding: 2vh 2vh;

        background-color: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

        z-index: 100;
    }

    #perfil {
        position: relative; 
        display: inline-block;
    }

    #icon {
        font-size: 20px;

        border-radius: 50%;

        color: #086cfc;
        background-color: #dbebff;
    }
</style>