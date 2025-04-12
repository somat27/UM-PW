<template>
    <div class="fundo">
        <AppCabecalho titulo="Registo"/>
        <button class="campo-detalhe" @click="goToPaginaIncial">
            <i class="bi bi-arrow-left"></i>
            <p>Voltar para menu</p>
        </button>

        <div class="campo-registo">
            <div class="registo">

                <div class="auditoria-cabecalho">
                    <h1>Registar Evidências</h1>
                </div>

                <div class="fotografia">
                    <div class="icon-texto">
                        <i class="bi bi-camera icon"></i>
                        <h2>Fotografias | Video</h2>
                    </div>
                    <div class="botao-upload">
                    <i class="bi bi-box-arrow-up"></i>
                    <h3>Adicionar</h3>
                    <input 
                        type="file"
                        class="adiciona-imagem" 
                        @change="carregarImagem" 
                        accept="image/*,video/*"
                    />
                    </div>
                </div>

                <div class="campo-imagens">
                    <CarrocelImagem :imagens="auditoria.imagemVideo" />
                </div>

                <div class="icon-texto">
                    <i class="bi bi-mic icon"></i>
                    <h2>Áudio</h2>
                </div>

                <div class="campo-audio">
                    <div class="campo-circulo" @touchstart.prevent="iniciarGravacao" @touchend.prevent="pararGravacao">     <!-- @mousedown="iniciarGravacao" @mouseup="pararGravacao" -->
                        <i class="bi bi-mic" :class="{ 'audio-gravar': isGravando }"></i>
                    </div>
                </div>

                <div v-for="(audio, index) in audios" :key="index" class="audio-gravado">
                    <audio :src="audio" controls></audio>
                </div>


                <div class="icon-texto">
                    <h2>Observações</h2>
                </div>
                <div class="campo-texto">
                    <textarea
                        type="text"
                        v-model="auditoria.descricao"
                        placeholder="Adicione notas, observações ou detalhes importantes..."
                    />
                </div>

                <div class="campo-profissionais">
                    <h2>Profissioais</h2>
                    <button class="botao-profissionais" @click="popup = !popup">
                        <h3>{{ contarPeritos() }} funcionarios em uso</h3>
                    </button>
                    <PopUpTrabalhadores v-if="popup" :peritos="auditoria.peritos" @fecharPopup="popup = false" @atualizaQuantidade="atualizaQuantidade"/>

                </div>

                <div class="campo-datahora">
                    <div class="campo-data">
                        <h2 class="texto-datahora">Data</h2>
                        <h4 id="data">{{ auditoria.dataInicio ? auditoria.dataInicio.toDate().toLocaleDateString("pt-PT") : 'Data não definida' }}</h4>
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

                <div class="botao-guardar" @click="guardarAuditoria">
                    <i class="bi bi-save"></i>
                    <h2>Guardar Evidências</h2>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { db } from "@/firebase/firebase";
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
                imagens: [],

                popup: false,
                mediaRecorder: null,
                chunks: [],
                isGravando: false,
                audios: [],

                auditoria: {},
            };
        },
        methods: {
            goToPaginaIncial() {
                this.$router.push("/PaginaInicial");
            },
            carregarImagem(event) {
                const file = event.target.files[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    const tipo = file.type;

                    this.auditoria.imagemVideo.push({
                        url: url,
                        tipo: tipo
                    });
                }
            },
            async iniciarGravacao() {
                try {
                    // Ativa o estado de gravação
                    this.isGravando = true;

                    // Solicita acesso ao microfone
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                    this.mediaRecorder = new MediaRecorder(stream);
                    this.chunks = [];

                    this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        this.chunks.push(e.data);
                    }
                    };

                    this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.chunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);

                    this.audios.push(url);

                    // Finaliza o estado de gravação
                    this.isGravando = false;
                    };

                    this.mediaRecorder.start();
                } catch (error) {
                    console.error('Erro ao iniciar gravação:', error);
                    this.isGravando = false;
                }
                },

            pararGravacao() {
                if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                    this.mediaRecorder.stop();
                }
            },

            atualizaQuantidade(index, novaQuantidade) {
                this.auditoria.peritos[index].quantidade = novaQuantidade;
            },

            contarPeritos() {
                let totalPeritos = 0;
                for (let i in this.auditoria.peritos) {
                    totalPeritos += this.auditoria.peritos[i].quantidade;
                }
                return totalPeritos;
            },

            async guardarAuditoria() {
                try {
                    const auditoriaId = this.$route.params.id;
                    await setDoc(doc(db, "auditorias", auditoriaId), {
                    ...this.auditoria
                    });
                    console.log("Dados da auditoria salvos com sucesso!");
                } catch (error) {
                    console.error("Erro ao salvar os dados:", error);
                }
            }

        },
        async mounted() {
            const id = this.$route.params.id;

            if (id) {
                try {
                const docRef = doc(db, "auditorias", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    this.auditoria = {
                    id: docSnap.id,
                    nome: data.nome || '',
                    estado: data.status || '',
                    local: data.origem || '',
                    descricao: data.descricao || '',
                    peritos: data.peritos || [],
                    imagemVideo: data.imagemVideo || [],
                    audio: data.audio || [],
                    coordenadas: data.coordenadas || {},
                    dataInicio: data.dataInicio || null,
                    dataFim: data.dataFim || null,
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

    .audio-gravar {
        color: red;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
</style>