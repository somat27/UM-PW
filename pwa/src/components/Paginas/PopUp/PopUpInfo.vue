<template>
    <div v-if="dados" class="fundo centro">
        <div class="fundo-cinza painel flex-coluna popup" @click.stop>

            <h1 v-html="dados.texto"/>

            <div v-for="(elemento, index) in dados.lista" :key="index" class="flex-linha item-ponta centro">
                <h2>{{ elemento.item }}</h2>

                <div class="flex-linha painel painel-ajustado centro">
                    <h2>{{ elemento.quantidade }}</h2>
                    <div class="flex-coluna">
                        <button class="transparente" @click="adiciona(index)"><i class="bi bi-chevron-up"></i></button>
                        <button class="transparente" @click="remove(index)"><i class="bi bi-chevron-down"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: "PopUpInfo",
        props: {
            dados: {
                type: Object,
                required: true
            }
        },
        methods: {
            adiciona(index) {
                this.$emit('atualizaQuantidade', index, this.dados.lista[index].quantidade + 1, this.dados.identificador);
            },
            remove(index) {
                if (this.dados.lista[index].quantidade > 0) {
                    this.$emit('atualizaQuantidade', index, this.dados.lista[index].quantidade - 1, this.dados.identificador);
                }
            }
        }
    }
</script>


<style scoped>
    .fundo {
        position: fixed;

        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;

        background-color: rgba(0, 0, 0, 0.5);

        z-index: 50;
    }

    .popup {
        width: 90vw;
    }

    .painel-ajustado {
        width: 20vw;
        padding: 0;

        justify-content: space-evenly;
    }
</style>