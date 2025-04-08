<template>
    <div>
        <AppCabecalho titulo="Perfil" />
        <button class="campo-dashboard" @click="goToPaginaIncial">
            <i class="bi bi-arrow-left"></i>
            <p>Voltar para Dashboard</p>
        </button>

        <div class="campo-perfil" v-if="user">
            <div class="perfil">
                <img :src="user.photoURL" alt="Foto de perfil" class="imagem"/>
                <div class="campo-info">
                    <h2>Nome</h2>
                    <h2>{{ user.displayName }}</h2>
                </div>
                
                <div class="campo-info">
                    <h2>Email</h2>
                    <h2>{{ user.email }}</h2>
                </div>
                
            </div>
        </div>
    </div>
</template>


<script>
    import { getAuth } from "firebase/auth";
    import AppCabecalho from './AppCabecalho.vue';
    export default {
        name: "VerPerfil",
        components: {
            AppCabecalho,
        },
        data() {
            return {
                user: null,
            };
        },
        methods: {
            goToPaginaIncial() {
                this.$router.push("/PaginaInicial");
            },
        },
        mounted() {
            const auth = getAuth();
            this.user = auth.currentUser;
        }
    }
</script>


<style scoped>
    .campo-dashboard {
        display: flex;
        margin: 3vh;
        gap: 1vw;
        color: #888;
        border: none;
        background-color: transparent;
    }

    .campo-perfil {
        display: flex;
        justify-content: center;
    }

    .perfil {
        border-radius: 15px;
        
        background-color: #fff;
        border: 1px solid #cccccccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.075);

        width: 90%;

        margin-bottom: 2vh;
    }

    .imagem {
        border: 1px solid #cccccccc;
        border-radius: 50%;
        margin: 2vh;
    }

    h2 {
        font-size: 16px;
    }

    .campo-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 1vh 5vw;
    }
</style>