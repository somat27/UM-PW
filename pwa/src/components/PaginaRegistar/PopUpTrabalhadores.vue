<template>
    <div class="fundo">
        <div class="filtro-conteudo">
            <button id="botao-fechar" @click="$emit('fecharPopup')"><i class="bi bi-x-lg"></i></button>
            
                <label v-for="(profissional, index) in listaProfissionais" :key="index" class="campo-quantidadetexto">
                    <h2>{{ profissional.nome }}</h2>
                    <div class="campo-quantidade">
                        <h3>{{ profissional.quantidade }}</h3>
                        <div class="metade-campo-quantidade">
                            <button class="botao-updown" @click="adiciona(index)"><i class="bi bi-chevron-up"></i></button>
                            <button class="botao-updown" @click="remove(index)"><i class="bi bi-chevron-down"></i></button>
                        </div>
                    </div>
                </label>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'PopUpTrabalhadores',
        data() {
            return {
                listaProfissionais: [
                    {"nome": "Engenheiro Civil", "quantidade": 0}, 
                    {"nome": "Engenheiro Eletricista", "quantidade": 0}, 
                    {"nome": "Auditor de Infraestruturas", "quantidade": 0}, 
                    {"nome": "Fiscal de Obras Públicas", "quantidade": 0}, 
                    {"nome": "Policia", "quantidade": 0}
                ],
            };
        },
        methods: {
            adiciona(index) {
                this.listaProfissionais[index].quantidade++;
            },
            remove(index) {
                if (this.listaProfissionais[index].quantidade > 0) {
                    this.listaProfissionais[index].quantidade--;
                }
            }
        },
    };

</script>


<style scoped>
    .fundo {
        position: fixed;
        height: 100vh;
        width: 100vw;
        
        top: 50vh;
        left: 50vw;
        transform: translate(-50%, -50%);
        background-color: rgba(165, 165, 165, 0.589);
    }

    .filtro-conteudo {
        gap: 1vw;
        position: fixed;
        display: flex;
        flex-direction: column;

        padding: 3vh;
        top: 50vh;
        left: 50vw;
        transform: translate(-50%, -50%);
        height: auto;
        width: 85vw;


        font-size: 16px;
        border-radius: 15px;
        background-color: #fff;
        z-index: 10;
    }

    #botao-fechar {
        align-self: flex-end;
        border: none;
        background-color: transparent;
    }

    .campo-textoquantidade {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .campo-quantidadetexto {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    h2 {
        font-size: 16px;
    }

    h3 {
        font-size: 14px;
        color: #888;
    }

    .campo-quantidade {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 5vh;
        height: 5vh;
    }

    .metade-campo-quantidade {
        display: flex;
        flex-direction: column;
        font-size: 10px;
    }

    .botao-updown {
        border: none;
        background-color: transparent;
    }
</style>