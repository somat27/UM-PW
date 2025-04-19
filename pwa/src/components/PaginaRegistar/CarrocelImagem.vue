<template>
    <div class="carrossel" v-if="imagens && imagens.length > 0">
        <button v-if="imagens.length > 1" @click="imagemAnterior" class="botao-carrossel" :class="{ 'botao-video': imagens[imagemAtual].tipo.startsWith('video/') }" id="esquerda"><i class="bi bi-chevron-compact-left"></i></button>
        <img v-if="imagens[imagemAtual].tipo.startsWith('image/')" :src="imagens[imagemAtual].url" alt="Imagem" class="imagem-carrossel" />
        <video v-else-if="imagens[imagemAtual].tipo.startsWith('video/')" :src="imagens[imagemAtual].url" controls class="imagem-carrossel"></video>
        <button v-if="imagens.length > 1" @click="imagemSeguinte" class="botao-carrossel" :class="{ 'botao-video': imagens[imagemAtual].tipo.startsWith('video/') }" id="direita"><i class="bi bi-chevron-compact-right"></i></button>
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
        z-index: 50;
    }

    #esquerda {
        left: 10vw;
    }

    #direita {
        right: 10vw;
    }

    .botao-video {
        height: 5vh;
    }
</style>