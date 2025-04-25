<template>

    <AppHeader/>

    <div class="flex-linha margem" id="pesquisa">
        <i class="bi bi-search"></i>
        <input
            class="transparente"
            type="text"
            v-model="pesquisa"
            placeholder="Pesquisar auditorias..."
        />
    </div>

    <div class="flex-linha margem centro item-ponta">
        <h2>{{ auditoriasVisiveis.length }} auditorias</h2>

        <div class="pop-up">
            <button class="flex-linha centro" id="filtro" @click="filtroEstado = !filtroEstado">
                <i class="bi bi-funnel"></i>
                <h2>Filtrar</h2>
                <i class="bi bi-chevron-down"></i>
            </button>

            <PopUpFiltro v-if="filtroEstado" :filtroValor="filtroValor" @fechaFiltro="fechaFiltro"/>
        </div>

        
    </div>

    <button class="flex-coluna margem painel item-ponta" id="auditoria" v-for="audit in auditoriasVisiveis" :key="audit.id" @click="goToPaginaDetalhe(audit)">
        <div class="flex-linha centro item-ponta">
            <h1>{{ audit.nome }}</h1>
            <h2 :class="corEstado(audit.status)" id="estado">{{ audit.status }}</h2>
        </div>

        <div class="flex-coluna">
            <h3><i class="bi bi-geo-alt"></i> {{ audit.endereco }}</h3>
            <h3><i class="bi bi-clock"></i> {{audit.dataInicio.toDate().toLocaleDateString()}}</h3>
        </div>
    </button>
</template>


<script>
    import AppHeader from '../AppHeader.vue'
    import { db } from '@/firebase/firebase.js';
    import { collection, getDocs } from 'firebase/firestore';
    import PopUpFiltro from './PopUp/PopUpFiltro.vue';
    export default {
        name: 'ListaAuditorias',
        components: {
            AppHeader,
            PopUpFiltro,
        },
        data() {
            return {
                listaAuditorias: [],
                pesquisa: "",
                filtroEstado: false,
                filtroValor: "",
            };
        },
        async mounted() {
            const querySnapshot = await getDocs(collection(db, "auditorias"));
            this.listaAuditorias = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        },
        methods: {
            fechaFiltro(novoValor) {
                this.filtroValor = novoValor;
                this.filtroEstado = false;
            },
            goToPaginaDetalhe(audit) {
                this.$router.push({
                    name: "InfoAuditoria",
                    params: { id: audit.id },
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
            }

        },
        computed: {
            auditoriasVisiveis() {
                return this.listaAuditorias.filter(auditoria => {
                    const nomeMatch = auditoria.nome.toLowerCase().includes(this.pesquisa.toLowerCase());
                    const statusMatch = this.filtroValor ? auditoria.estado === this.filtroValor : true;
                    return nomeMatch && statusMatch;
                });
            }
        },
    };
</script>


<style>

    #pesquisa {
        align-items: center;

        padding: 1vh 1vw;
        gap: 2.5vw;

        background-color: #fff;
        
        border-radius: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    #pesquisa input {
        flex: 1;
    }

    #filtro {
        padding: 1vh 2.5vw;
        gap: 2.5vw;

        background-color: #F1F5F9;

        border: none;
        border-radius: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    #auditoria {
        width: 90vw;
        height: 20vh;
    }

    #estado {
        padding: 1.5vh 1.5vh;

        color: #F8FAFC;

        border: 1px solid #e6eaf0;
        border-radius: 15px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
</style>