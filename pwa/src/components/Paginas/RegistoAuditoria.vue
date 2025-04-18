<template>

    <AppHeader titulo="Detalhe"/>

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

        <div class="painel fundo-cinza" style="padding: 0;">
            <PainelImagens :imagens="auditoria.imagemVideo" />
        </div>


        <div class="flex-linha item-ponta margem-cima centro">
            <h2><i class="bi bi-mic icon"></i> Áudio</h2>
        </div>

        <div class="painel fundo-cinza">

        </div>


        <h2 class="margem-cima">Observações</h2>

        <textarea  
            type="text" 
            v-model="auditoria.descricao"
            placeholder="Adicione notas, observações ou detalhes importantes..." 
            class="painel fundo-cinza"
            id="caixa-texto"></textarea>
        



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
    //import PopUpInfo from './PopUp/PopUpInfo.vue';

    export default {
        name: "RegistoAuditoria",
        components: {
            AppHeader,
            PainelImagens,
            //PopUpInfo,
        },
        data() {
            return {
                auditoria: {},
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
                    const url = await uploadToCloudinary(file);
                    const tipo = file.type;

                    this.auditoria.imagemVideo.push({
                        url: url,
                        tipo: tipo
                    });
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
</style>