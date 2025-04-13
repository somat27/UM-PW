<template>
    <div>
        <AppCabecalho titulo="Detalhe"/>
        <button class="campo-dashboard" @click="goToPaginaIncial">
            <i class="bi bi-arrow-left"></i>
            <p>Voltar para menu</p>
        </button>

        <div class="campo-auditoria">
            <div class="auditoria">

                <div class="auditoria-cabecalho">
                    <h1>{{ auditoria.nome }}</h1>
                    <h2>{{ auditoria.estado }}</h2>
                </div>

                <div class="campo-paragrafo">
                    <div class="paragrafo">
                        <i class="bi bi-geo-alt"></i>
                        <div class="local-hora">
                            <h2>{{ auditoria.local }}</h2>
                            <h3>{{ auditoria.local }}</h3>
                        </div>
                    </div>
                    <div class="paragrafo">
                        <i class="bi bi-clock"></i>
                        <div class="local-hora">
                            <h2>{{ auditoria.data }}</h2>
                            <h3>00:00 - 00:00</h3>
                        </div>
                    </div>
                </div>

                <div class="campo-descricao">
                    <h1>Descrição</h1>
                    <h3>{{ auditoria.descricao || "Verificação de rotina dos sistemas conforme procedimento padrão." }}</h3>
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

                <button class="iniciar-auditoria" @click="goToPaginaRegistar">
                    <i class="bi bi-play-circle"></i>
                    <h2>Iniciar Auditoria</h2>
                </button>

            </div>
        </div>
    </div>
</template>


<script>

    import { doc, getDoc } from "firebase/firestore";
    import { db } from "@/firebase/firebase";
    import AppCabecalho from '../AppCabecalho.vue';

    export default {
        name: "PaginaDetalhe",
        components: {
            AppCabecalho,
        },
        data() {
            return {
                auditoria: {},
            };
        },
        methods: {
            goToPaginaIncial() {
            this.$router.push("/PaginaInicial");
            },
            goToPaginaRegistar() {
            this.$router.push({name: "PaginaRegistar", params: { id: this.auditoria.id },});
            },
        },
        async mounted() {
            const id = this.$route.params.id;

            if (id) {
                try {
                const docRef = doc(db, "auditorias", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const dataInicio = data.dataInicio?.toDate?.();
                    const dataFormatada = dataInicio
                        ? dataInicio.toLocaleDateString("pt-PT")
                        : "";

                    this.auditoria = {
                    id: docSnap.id,
                    nome: data.nome || '',
                    estado: data.estado || '',
                    local: data.local || '',
                    data: dataFormatada,
                    descricao: data.descricao || '',
                    //peritos: data.peritos || [],
                    //imagemVideo: data.imagemVideo || [],
                    //audio: data.audio || [],
                    //coordenadas: data.coordenadas || {},
                    //dataFim: data.dataFim?.toDate?.() || '',
                    };
                } else {
                    console.log("Documento não encontrado!");
                }
                } catch (error) {
                console.error("Erro ao buscar auditoria:", error);
                }
            }
        }

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
        display: flex;
        align-items: center;
        justify-content: center;
        
        gap: 2vw;
        padding: 1vh;
        margin: 3vh;
        width: 75vw;


        color: #fff;
        background-color: blue;
        border-radius: 15px;
        border: 1px solid #cccccccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.075);
    }
</style>