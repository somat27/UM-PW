<template>
    <button class="campo-dashboard">
        <i class="bi bi-arrow-left"></i>
        <p>Voltar para Dashboard</p>
    </button>

    <div class="campo-auditoria">
        <div class="auditoria">

            <div class="auditoria-cabecalho">
                <h1>Inspeção Instalações Elétricas</h1>
                <h2>Pendente</h2>
            </div>

            <div class="campo-paragrafo">
                <div class="paragrafo">
                    <i class="bi bi-geo-alt"></i>
                    <div class="local-hora">
                        <h2>Edificio Central, Porto</h2>
                        <h3>Avenida Central, 123, 1000-001 Lisboa</h3>
                    </div>
                </div>
                <div class="paragrafo">
                    <i class="bi bi-clock"></i>
                    <div class="local-hora">
                        <h2>09:00 - 12:00</h2>
                        <h3>02/06/2023</h3>
                    </div>
                </div>
            </div>

            <div class="campo-descricao">
                <h1>Descrição</h1>
                <h3>Verificação de rotina dos sistemas conforme procedimento padrão.</h3>
            </div>

            <div class="campo-equipa-equipamento">
                <div class="equipa-equipamento">
                    <i class="bi bi-people"></i>
                    <h2>Equipa</h2>
                </div>

                <div class="equipa-equipamento">
                    <i class="bi bi-file-earmark-text"></i>
                    <h2>Equipamento</h2>
                </div>
            </div>

            <div class="imagem">
                <img src="@/assets/logo.png">
                <button class="botao-imagem">Ver no mapa</button>
            </div>

            <button class="iniciar-auditoria">
                <i class="bi bi-play-circle"></i>
                <h2>Iniciar Auditoria</h2>
            </button>

        </div>
    </div>
</template>


<script>
    export default {
        name: "PaginaDetalhe",
    };
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

    .campo-auditoria {
        display: flex;
        justify-content: center;
    }

    .auditoria {
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

    h2 {
        font-size: 16px;
    }

    h3 {
        font-size: 14px;
        color: #888;
    }

    .auditoria-cabecalho {
        display: flex;
        justify-content: space-between;
        align-items: top;
        padding: 1vh;
        gap: 1vh;
        min-height: 8vh;
    }

    .paragrafo {
        display: flex;
        font-size: 12px;
        gap: 4px;
        text-align: left;
    }

    .campo-paragrafo {
        align-items: center;
        padding-left: 1vh;
    }

    .local-hora {
        display: flex;
        flex-direction: column;
    }

    .campo-descricao {
        text-align: left;
        border-radius: 15px;
        margin: 3vh;
        padding: 1vh;

        background-color: rgba(197, 196, 196, 0.247);
    }

    .campo-equipa-equipamento {
        display: flex;
        flex-direction: column;
        
        gap: 4px;
        padding-left: 1vh;
    }

    .equipa-equipamento {
        width: 85vw;
        display: flex;
        font-size: 12px;
        gap: 4px;
        text-align: left;
    }

    .imagem {
        position: relative;
        margin: 3vh;
        border-radius: 15px;
        border: 1px solid #cccccccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.075);
    }

    .botao-imagem {
        position: absolute;
        bottom: 1vh;
        right: 1vw;
        
        font-size: 16px;

        color: blue;

        background-color: #fff;
        border-radius: 15px;
        border: 1px solid #cccccccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.075);

        z-index: 10;
    }

    .iniciar-auditoria {
        margin: 3vh auto;
        display: flex;
        justify-content: center;
        gap: 2vw;
        padding: 1vh 1vw;
        width: 75vw;


        color: #fff;
        background-color: blue;
        border-radius: 15px;
        border: 1px solid #cccccccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.075);
    }
</style>