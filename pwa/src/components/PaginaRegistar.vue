<template>
    <div class="fundo">
        <AppCabecalho />
        <button class="campo-detalhe" @click="goToPaginaDetalhe">
            <i class="bi bi-arrow-left"></i>
            <p>Voltar para Detalhes</p>
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
                    </div>
                </div>

                <div class="campo-imagens">

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
    import AppCabecalho from './AppCabecalho.vue';
    export default {
        name: 'PaginaRegistar',
        components: {
            AppCabecalho,
        },
        methods: {
            goToPaginaDetalhe() {
                this.$router.push("/PaginaDetalhe");
            },
        },
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
        gap: 4px;
        margin-right: 2vh;
        padding: 2vw;
        border-radius: 15px;
        background-color: rgba(197, 196, 196, 0.247);
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
        padding: 1vh;
        
        height: 20vh;

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
</style>