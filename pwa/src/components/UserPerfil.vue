<template>
    
    <AppHeader titulo="Perfil"/>

    <button class="flex-linha transparente margem" @click="goToPaginaIncial">
        <h2><i class="bi bi-arrow-left"></i>   Voltar para menu</h2>
    </button>

    <div class="flex-coluna margem painel" v-if="user">
        <img :src="user.photoURL" alt="Foto de perfil" id="imagem"/>

        <div class="flex-linha item-ponta">
            <h2>Nome</h2>
            <h2>{{ user.displayName }}</h2>
        </div>

        <div class="flex-linha item-ponta">
            <h2>Email</h2>
            <h2>{{ user.email }}</h2>
        </div>
    </div>
</template>


<script>
    import { getAuth } from "firebase/auth";
    import AppHeader from './AppHeader.vue';
    export default {
        name: "UserPerfil",
        components: {
            AppHeader,
        },
        data() {
            return {
                user: null,
            };
        },
        methods: {
            goToPaginaIncial() {
                this.$router.push("/ListaAuditorias");
            },
        },
        mounted() {
            const auth = getAuth();
            this.user = auth.currentUser;
        }
    }
</script>


<style>
    #imagem {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        height: 15vh;
        width: 15vh;
        border-radius: 50%;
        margin: 2vh;

        align-self: center;
    }
</style>