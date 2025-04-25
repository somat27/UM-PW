<template>
    
    <AppHeader titulo="Detalhe"/>

    <button class="flex-linha transparente margem" @click="goToPaginaIncial">
        <h2><i class="bi bi-arrow-left"></i>   Voltar para menu</h2>
    </button>

    <div class="flex-coluna margem painel" v-if="auditoria.nome">

        <div class="flex-linha centro item-ponta">
            <h1>{{ auditoria.nome }}</h1>
            <h2 :class="corEstado(auditoria.status)" id="estado">{{ auditoria.status }}</h2>
        </div>

        <h3 class="margem-cima"><i class="bi bi-geo-alt"></i> {{ auditoria.endereco }}</h3>
        <h3><i class="bi bi-clock"></i> {{ auditoria.dataInicio.toDate().toLocaleDateString() }}</h3>

        <div class="painel fundo-cinza margem-cima">
            <h2>Descricao</h2>
            <h3>{{ auditoria.descricao || "Verificação de rotina dos sistemas conforme procedimento padrão." }}</h3>
        </div>


        <button class="flex-linha transparente" @click="popUpProfissionais = !popUpProfissionais">
            <h2><i class='bi bi-people'></i> Profissionais</h2>
            <PopUpPresente v-if="popUpProfissionais && auditoria.profissionais.length > 0" :dados="this.auditoria.profissionais" :texto="`<i class='bi bi-people'></i> Profissionais`"/>
        </button>


        <button class="flex-linha transparente" @click="popUpMateriais = !popUpMateriais">
            <h2><i class='bi bi-file-earmark-text'></i> Materiais</h2>
            <PopUpPresente v-if="popUpMateriais && auditoria.materiais.length > 0" :dados="this.auditoria.materiais" :texto="`<i class='bi bi-file-earmark-text'></i> Materiais`"/>
        </button>


        <div class="painel fundo-cinza margem-cima">            <!--Local para colocar o mapa-->

        </div>

        <button class="flex-linha transparente centro fundo-azul margem-cima" id="iniciar" @click="goToPaginaRegisto">
            <h2><i class="bi bi-play-circle"></i> Iniciar Auditoria</h2>
        </button>

    </div>
</template>


<script>
    import { doc, getDoc } from 'firebase/firestore';
    import { db } from '@/firebase/firebase.js';
    import PopUpPresente from './PopUp/PopUpPresente.vue';
    import AppHeader from '../AppHeader.vue';
    export default {
        name: "InfoAuditoria",
        components: {
            AppHeader,
            PopUpPresente,
        },
        data() {
            return {
                auditoria: {},
                popUpProfissionais: false,
                popUpMateriais: false,
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
            goToPaginaRegisto() {
                this.$router.push({
                    name: "RegistoAuditoria",
                    params: { id: this.auditoria.id },
                });
            },
            corEstado(valor) {
                switch(valor) {
                    case "Concluido":
                        return "fundo-verde";
                    case "Pendente":
                        return "fundo-amarelo";
                    case "Incompleto":
                        return "fundo-vermelho";
                    default:
                        return "";
                }
            },
        }
    }
</script>


<style>
    #iniciar {
        padding: 1.5vh 1.5vh;

        color: #F8FAFC;

        border: 1px solid #e6eaf0;
        border-radius: 15px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
</style>