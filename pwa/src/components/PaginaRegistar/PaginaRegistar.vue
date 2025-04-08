<template>
    <div class="fundo">
        <AppCabecalho titulo="Registo"/>
        <button class="campo-detalhe" @click="goToPaginaIncial">
            <i class="bi bi-arrow-left"></i>
            <p>Voltar para Dashboard</p>
        </button>

        <div class="campo-registo">
            <div class="registo">

                <div class="auditoria-cabecalho">
                    <h1>Registar Evidências</h1>
                </div>

                <div class="fotografia">
                    <div class="icon-texto">
                        <i class="bi bi-camera icon"></i>
                        <h2>Fotografias</h2>
                    </div>
                    <div class="botao-upload">
                    <i class="bi bi-box-arrow-up"></i>
                    <h3>Adicionar</h3>
                    <input 
                        type="file"
                        class="adiciona-imagem" 
                        @change="carregarImagem" 
                        accept="image/*"
                    />
                    </div>
                </div>

                <div class="campo-imagens">
                    <CarrocelImagem :imagens="imagens" />
                </div>

                <div class="icon-texto">
                    <i class="bi bi-mic icon"></i>
                    <h2>Áudio</h2>
                </div>

                <div class="campo-audio">
                    <div class="campo-circulo">
                        <i class="bi bi-mic"></i>
                    </div>
                </div>

                <div class="icon-texto">
                    <h2>Observações</h2>
                </div>
                <div class="campo-texto">
                    <textarea
                        type="text"
                        v-model="observacao"
                        placeholder="Adicione notas, observações ou detalhes importantes..."
                    />
                </div>

                <div class="campo-profissionais">
                    <h2>Profissioais</h2>
                    <button class="botao-profissionais" @click="popup = !popup">
                        <h3>{{ profissionalEscolhido.length }} funcionarios em uso</h3>
                    </button>
                    <PopUpTrabalhadores v-if="popup" @fecharPopup="popup = false" />

                </div>

                <div class="campo-datahora">
                    <div class="campo-data">
                        <h2 class="texto-datahora">Data</h2>
                        <h4 id="data">{{ dataAtual }}</h4>
                    </div>
                    <div>
                        <div class="campo-hora">
                            <h2 class="texto-datahora">Inicio</h2>
                            <h4 class="hora">{{ horainicio }}</h4>
                        </div>
                        <div class="campo-hora">
                            <h2 class="texto-datahora">Fim</h2>
                            <h4 class="hora">{{ horafim }}</h4>
                        </div>
                    </div>
                </div>

                <div class="botao-guardar">
                    <i class="bi bi-save"></i>
                    <h2>Guardar Evidências</h2>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
    import AppCabecalho from '../AppCabecalho.vue';
    import PopUpTrabalhadores from './PopUpTrabalhadores.vue';
    import CarrocelImagem from './CarrocelImagem.vue';
    export default {
        name: 'PaginaRegistar',
        components: {
            AppCabecalho,
            PopUpTrabalhadores,
            CarrocelImagem,
        },
        data() {
            return {
                profissionalEscolhido: [],
                dataAtual: new Date().toLocaleDateString(),
                horainicio: new Date().toLocaleTimeString(),
                horafim: new Date().toLocaleTimeString(),
                observacao: "",
                imagens: [],
                imagem: null,
                popup: false,
            };
        },
        methods: {
            goToPaginaIncial() {
                this.$router.push("/PaginaInicial");
            },
            carregarImagem(event) {
                const file = event.target.files[0];
                if (file) {
                    this.imagem = URL.createObjectURL(file);
                    this.imagens.push(this.imagem)
                }
            },
            atualizaHoraFinal() {
                this.horafim = new Date().toLocaleTimeString();
            },
        },
        mounted() {
            this.intervalId = setInterval(this.atualizaHoraFinal, 1000);
        },
        beforeUnmount() {
            clearInterval(this.intervalId);
        }
    };
</script>


<style scoped>
    .fundo {
        align-items: normal;
        justify-content: flex-start;
    }

    .campo-detalhe {
        display: flex;
        margin: 3vh;
        gap: 1vw;
        color: #888;
        border: none;
        background-color: transparent;
    }

    .campo-registo {
        display: flex;
        justify-content: center;
    }

    .registo {
        border-radius: 15px;
        
        background-color: #fff;
        border: 1px solid #cccccccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.075);

        width: 90%;

        margin-bottom: 2vh;
    }

    h1 {
        font-size: 20px;
        text-align: left;
    }

    .fotografia {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .icon-texto {
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 2vh;
    }

    .icon {
        color: blue;
    }

    .botao-upload {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 29vw;
        height: 5vh;
        gap: 4px;
        margin-right: 2vh;
        padding: 1vh 1vw;
        border-radius: 15px;
        background-color: rgba(197, 196, 196, 0.247);
        border: 1px solid #ccc;
    }

    .auditoria-cabecalho {
        display: flex;
        padding: 1vh;
        gap: 1vh;
    }

    h2 {
        font-size: 16px;
    }

    h3 {
        font-size: 14px;
        color: #888;
    }

    .campo-imagens {
        border-radius: 15px;
        margin: 3vh;

        background-color: rgba(197, 196, 196, 0.247);
    }

    .campo-audio {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        margin: 3vh;
        padding: 1vh;
        
        height: 10vh;


        background-color: rgba(197, 196, 196, 0.247);
    }

    .campo-circulo {
        width: 7vh;
        height: 7vh;
        border-radius: 50%;
        background-color: blue;
        color: #fff;
        font-size: 3vh;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .campo-texto {
        border-radius: 15px;
        margin: 1vh 3vh;
        padding: 1vh;
        
        height: 15vh;

        background-color: rgba(197, 196, 196, 0.247);
    }

    .botao-guardar {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 2vw;
        padding: 1vh;
        color: #fff;
        margin: 3vh;
        border-radius: 15px;
        background-color: blue;
    }

    textarea {
        text-align: left;
        padding: 8px;
        font-size: 14px;
        border: none;
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    .adiciona-imagem {
        border-radius: 15px;
        position: absolute;
        width: 28vw;
        height: auto;
        opacity: 0%;
    }

    #imagem-colocada {
        border-radius: 15px;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .campo-datahora {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 3vh;
        margin-left: 2vh;
    }

    .campo-data {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        gap: 2vh;
        margin-bottom: 1vh;
    }
    /* ----------- Pensar se arranjo isto ------------ */
    #data {
        background-color: rgba(197, 196, 196, 0.247);
        border-radius: 15px;
        border: none;
        padding: 1vh;
    }

    .campo-hora {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: center;
        gap: 2vh;
        margin-bottom: 1vh;
    }

    .hora {
        background-color: rgba(197, 196, 196, 0.247);
        border-radius: 15px;
        border: none;
        padding: 1vh;
    }

    .texto-datahora {
        text-align: left;
        width: 10vw;
    }
    /* ----------------------------------------------- */

    h4 {
        font-size: 14px;
    }

    .campo-profissionais {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 3vh;
        margin-left: 2vh;
    }

    .botao-profissionais {
        position: relative;
        border-radius: 15px;
        width: 50vw;
        padding: 1vh;
        font-size: 16px;
        border: 1px solid #ccc;
    }
</style>