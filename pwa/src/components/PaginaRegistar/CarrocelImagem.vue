<template>
    <div class="carrossel" v-if="imagens.length != 0">
        <button @click="imagemAnterior" class="botao-carrossel" id="esquerda"><i class="bi bi-chevron-compact-left"></i></button>
        <img :src="imagens[imagemAtual]" alt="Imagem" class="imagem-carrossel" />
        <button @click="imagemSeguinte" class="botao-carrossel" id="direita"><i class="bi bi-chevron-compact-right"></i></button>
    </div>
</template>


<script>
    export default {
    name: 'CarrocelImagem',
    props: {
        imagens: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            imagemAtual: 0,
        };
    },
    methods: {
        imagemAnterior() {
        this.imagemAtual = (this.imagemAtual + 1) % this.imagens.length;
        },
        imagemSeguinte() {
        this.imagemAtual = (this.imagemAtual - 1 + this.imagens.length) % this.imagens.length;
        }
    }
    };
</script>


<style scoped>
    .carrossel {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .imagem-carrossel {
        border-radius: 15px;
        height: 20vh;
        max-height: 20vh;
        min-width: 80vw;
        object-fit: cover;
        width: auto;
    }

    .botao-carrossel {
        position: absolute;
        border: none;
        height: 20vh;
        font-size: 28px;
        background-color: rgba(197, 196, 196, 0.089);
    }

    #esquerda {
        left: 10vw;
    }

    #direita {
        right: 10vw;
    }
</style>