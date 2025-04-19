<template>
    
    <AppHeader titulo="Detalhe"/>

    <button class="flex-linha transparente margem" @click="goToPaginaIncial">
        <h2><i class="bi bi-arrow-left"></i>   Voltar para menu</h2>
    </button>

    <div class="flex-coluna margem painel" v-if="auditoria.nome">

        <div class="flex-linha centro item-ponta">
            <h1>{{ auditoria.nome }}</h1>
            <h2 :class="corEstado(auditoria.estado)" id="estado">{{ auditoria.estado }}</h2>
        </div>

        <h3 class="margem-cima"><i class="bi bi-geo-alt"></i> {{ auditoria.local }}</h3>
        <h3><i class="bi bi-clock"></i> {{ auditoria.dataInicio.toDate().toLocaleDateString() }}</h3>

        <div class="painel fundo-cinza margem-cima">
            <h2>Descricao</h2>
            <h3>{{ auditoria.descricao || "Verificação de rotina dos sistemas conforme procedimento padrão." }}</h3>
        </div>


        <div v-for="dados in popUp" :key="dados">
            <button class="flex-linha transparente" @click="dados.estado = !dados.estado">
                <h2 v-html="dados.texto"/>

                <PopUpPresente v-if="dados.estado" :dados="dados"/>
            </button>
        </div>

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
                popUp: [
                    {
                        "texto": "<i class='bi bi-people'></i> Equipa",
                        "estado": false,
                        "lista": [
                            {
                                "item": "Engenheiro Civil",
                                "quantidade": 0,
                                "presente": false,
                            },
                            {
                                "item": "Engenheiro Eletricista",
                                "quantidade": 0,
                                "presente": true,
                            },
                            {
                                "item": "Auditor de Infraestruturas",
                                "quantidade": 0,
                                "presente": true,
                            },
                            {
                                "item": "Fiscal de Obras Públicas",
                                "quantidade": 0,
                                "presente": false,
                            },
                            {
                                "item": "Policia",
                                "quantidade": 0,
                                "presente": false,
                            },
                        ]
                    },
                    {
                        "texto": "<i class='bi bi-file-earmark-text'></i> Equipamento",
                        "estado": false,
                        "lista": [
                            {
                                "item": "Madeira",
                                "quantidade": 0,
                                "presente": false,
                            },
                            {
                                "item": "Metal",
                                "quantidade": 0,
                                "presente": false,
                            },
                            {
                                "item": "Cimento",
                                "quantidade": 0,
                                "presente": false,
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