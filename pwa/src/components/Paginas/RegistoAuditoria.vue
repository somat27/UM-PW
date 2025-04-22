<template>

    <AppHeader titulo="Registo"/>

    <button class="flex-linha transparente margem" @click="goToPaginaIncial">
        <h2><i class="bi bi-arrow-left"></i>   Voltar para menu</h2>
    </button>

    <div class="flex-coluna margem painel" v-if="auditoria.nome">
        <h1>{{ auditoria.nome }}</h1>


        <div class="flex-linha item-ponta margem-cima centro">
            <h2><i class="bi bi-camera icon"></i> Fotografias</h2>

            <button class="flex-linha transparente centro painel" id="filtro" @click="$refs.inputFicheiro.click()">
                <h3><i class="bi bi-box-arrow-up"></i></h3>
                <h3>Adicionar</h3>
                <input 
                        type="file"
                        ref="inputFicheiro"
                        style="display: none;"
                        @change="carregarImagem" 
                        accept="image/*,video/*"
                    />
            </button>
        </div>

        <div class="painel fundo-cinza pop-up" style="padding: 0;">
            <progress v-if="carregarFicheiro" id="barra-progresso" :value="percentagemUpload" max="100"></progress>
            <PainelImagens :imagens="auditoria.imagemVideo" @removeFicheiro="removeFicheiro"/>
        </div>


        <div class="flex-linha item-ponta margem-cima centro">
            <h2><i class="bi bi-mic icon"></i> Áudio</h2>

            <button class="transparente" @touchstart.prevent="iniciarGravacao" @touchend.prevent="pararGravacao"><i :class="isGravando ? 'bi bi-circle-fill' : 'bi bi-record-circle'" id="gravar"></i></button>
        </div>

        <div class="painel fundo-cinza" style="padding: 0;">
            <PainelAudios :audios="auditoria.audios" @removeAudio="removeAudio"/>
        </div>


        <h2 class="margem-cima">Observações</h2>

        <textarea  
            type="text" 
            v-model="auditoria.descricao"
            placeholder="Adicione notas, observações ou detalhes importantes..." 
            class="painel fundo-cinza"
            id="caixa-texto"></textarea>
        

        <div v-for="dados in popUp" :key="dados" class="margem-cima">
            <button class="flex-linha transparente" @click="dados.estado = !dados.estado">
                <h2 v-html="dados.texto"/>

                <PopUpInfo v-if="dados.estado" :dados="dados"/>
            </button>
        </div>


        <button class="flex-linha transparente centro fundo-azul margem-cima" id="iniciar" @click="guardarAuditoria">
            <h2><i class="bi bi-save"></i> Guardar Auditoria</h2>
        </button>
    </div>
</template>


<script>
    import { doc, getDoc, setDoc } from 'firebase/firestore';
    import { db, uploadToCloudinary } from '@/firebase/firebase.js';
    import AppHeader from '../AppHeader.vue';
    import PainelImagens from './Extra/PainelImagens.vue';
    import PainelAudios from './Extra/PainelAudios.vue';
    import PopUpInfo from './PopUp/PopUpInfo.vue';

    export default {
        name: "RegistoAuditoria",
        components: {
            AppHeader,
            PainelImagens,
            PainelAudios,
            PopUpInfo,
        },
        data() {
            return {
                auditoria: {},
                mediaRecorder: null,
                chunks: [],
                isGravando: false,

                carregarFicheiro: false,
                percentagemUpload: 0,
                popUp: [
                    {
                        "texto": "<i class='bi bi-people icon'></i> Equipa",
                        "estado": false,
                        "lista": [
                            {
                                "item": "Engenheiro Civil",
                                "quantidade": 0,
                            },
                            {
                                "item": "Engenheiro Eletricista",
                                "quantidade": 0,
                            },
                            {
                                "item": "Auditor de Infraestruturas",
                                "quantidade": 0,
                            },
                            {
                                "item": "Fiscal de Obras Públicas",
                                "quantidade": 0,
                            },
                            {
                                "item": "Policia",
                                "quantidade": 0,
                            },
                        ]
                    },
                    {
                        "texto": "<i class='bi bi-file-earmark-text icon'></i> Equipamento",
                        "estado": false,
                        "lista": [
                            {
                                "item": "Madeira",
                                "quantidade": 0,
                            },
                            {
                                "item": "Metal",
                                "quantidade": 0,
                            },
                            {
                                "item": "Cimento",
                                "quantidade": 0,
                            },
                        ]
                    }
                ],
            }
        },
        async mounted() {
            const id = this.$route.params.id;
            const docSnap = await getDoc(doc(db, "auditorias", id));
            if (docSnap.exists()) {
                const dados = docSnap.data();
                this.auditoria = { id: docSnap.id, ...dados };
            } else {
                this.auditoria = {};
            }
        },
        methods: {
            goToPaginaIncial() {
                this.$router.push("/ListaAuditorias");
            },
            async carregarImagem(event) {
                const file = event.target.files[0];
                if (file) {
                    this.carregarFicheiro = true;
                    this.percentagemUpload = 0;

                    const url = await uploadToCloudinary(file, (e) => {
                        const percent = Math.round((e.loaded * 100) / e.total);
                        this.percentagemUpload = percent;
                        console.log("Progresso:", percent);
                    });
                    const tipo = file.type;

                    this.auditoria.imagemVideo.push({
                        url: url,
                        tipo: tipo
                    });
                    this.carregarFicheiro = false;
                    this.percentagemUpload = 0;
                }
            },
            async guardarAuditoria() {
                try {
                    this.auditoria.estado = "Pendente";

                    const auditoriaId = this.$route.params.id;
                    await setDoc(doc(db, "auditorias", auditoriaId), {
                    ...this.auditoria
                    });
                    console.log("Dados da auditoria salvos com sucesso!");
                    this.$router.push({
                        name: "InfoAuditoria",
                        params: { id: this.auditoria.id },
                    });
                } catch (error) {
                    console.error("Erro ao salvar os dados:", error);
                }
            },
            removeAudio(index) {
                this.auditoria.audios.splice(index, 1);
            },
            removeFicheiro(index) {
                this.auditoria.imagemVideo.splice(index, 1);
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

                    this.mediaRecorder.onstop = async () => {
                        const blob = new Blob(this.chunks, { type: 'audio/webm' });
                        const file = new File([blob], "gravacao.webm", { type: "audio/webm" });
                        const url = await uploadToCloudinary(file);

                        this.auditoria.audios.push(url);

                        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());

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
            }
        }
    }
</script>


<style>
    #caixa-texto {
        height: 15vh;

        padding: 1vh;
        font-size: 14px;
    }

    #gravar {
        color: red;
    }

    #barra-progresso {
        position: absolute;
        z-index: 5;
        top: -1vh;
        left: 0;
        width: 100%;
    }
</style>