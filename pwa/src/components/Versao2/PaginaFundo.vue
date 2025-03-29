<template>
    <main>
        <div class="fundo">
            <AppCabecalho />
            <PaginaInicial />
        </div>
    </main>
</template>


<script>
    import AppCabecalho from './AppCabecalho.vue';
    import PaginaInicial from './PaginaDetalhe/PaginaDetalhe.vue';

    export default {
        name: "PaginaFundo",
        components: {
            AppCabecalho,
            PaginaInicial,
        },
    };
</script>


<style scoped>
    .fundo {
        min-height: 100vh;
        background-color: rgba(197, 196, 196, 0.116);
    }
</style>