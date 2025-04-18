<template>
    <div class="flex-linha centro">
        <button class="transparente botao-carrocel" id="esquerda" @click="imagemAnterior">
            <i class="bi bi-chevron-compact-left"></i>
        </button>

        <img v-if="imagens[imagemAtual].tipo.startsWith('image/')" :src="imagens[imagemAtual].url" class="imagem" />
        
        <video v-else-if="imagens[imagemAtual].tipo.startsWith('video/')" :src="imagens[imagemAtual].url" controls class="imagem"></video>

        <button class="transparente botao-carrocel" id="direita" @click="imagemSeguinte">
            <i class="bi bi-chevron-compact-right"></i>
        </button>
    </div>
</template>


<script>
    export default {
        name: "PainelImagens",
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
    }
</script>


<style scoped>
    .imagem {
        height: 20vh;
        width: 100%;
        border-radius: 15px;

        object-fit: cover;
    }

    .botao-carrocel {
        position: absolute;
        height: 20vh;
    }

    #esquerda {
        left: 5vw;
    }

    #direita {
        right: 5vw;
    }
</style>