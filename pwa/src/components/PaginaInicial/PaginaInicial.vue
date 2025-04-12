<template>
    <div>
        <AppCabecalho/>
        <div class="campo-pesquisa">
            <i class="bi bi-search icon"></i>
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Pesquisar auditorias..."
                @input="onSearch"
            />
        </div>
        <div class="campo-auditorias-filtro">
            <div class="total-auditorias">
                <p>{{ auditoriasVisiveis.length }} auditorias</p>
            </div>

            <div class="campo-filtro">
                <button class="filtro" @click="popupfiltro = !popupfiltro">
                    <span>
                        <i class="bi bi-funnel"></i>
                    </span>
                    Filtrar
                    <span>
                        <i class="bi bi-chevron-down"></i>
                    </span>
                </button>
                <div class="filtro-conteudo" v-if="popupfiltro">
                    <label><input type="radio" name="radio" value="Concluido" v-model="valorRadio" @click="toggleSelection('Concluido')" /> Concluido</label>
                    <label><input type="radio" name="radio" value="Incompleto" v-model="valorRadio" @click="toggleSelection('Incompleto')" /> Incompleto</label>
                    <label><input type="radio" name="radio" value="Pendente" v-model="valorRadio" @click="toggleSelection('Pendente')" /> Pendente</label>
                </div>
            </div>
        </div>

        <div class="campo-auditoria">

            <button class="auditoria" v-for="audit in auditoriasVisiveis" :key="audit.id" @click="goToPaginaDetalhe(audit)">

                <div class="auditoria-cabecalho">
                    <h1>{{audit.nome}}</h1>
                    <h2>{{audit.status}}</h2>
                </div>

                <div class="campo-paragrafo">
                    <div class="paragrafo">
                        <i class="bi bi-geo-alt"></i>
                        <h3>{{audit.origem}}</h3>
                    </div>
                    <div class="paragrafo">
                        <i class="bi bi-clock"></i>
                        <h3>{{audit.dataInicioFormatada}}</h3>
                    </div>
                </div>

            </button>

            
        </div>
    </div>
    
</template>


<script>

    import AppCabecalho from '../AppCabecalho.vue';
    import { db } from '@/firebase/firebase.js';
    import { collection, getDocs } from 'firebase/firestore';
    export default {
        name: 'PaginaInicial',
        components: {
            AppCabecalho,
        },  
        data() {
            return {
                valorRadio: null,
                popupfiltro: false,
                searchQuery: '',
                //uid: null,

                listaAuditorias: [],
            }; 
        },
        created() {
            const json = localStorage.getItem("listaAuditorias");
            if (json) {
                this.listaAuditorias = JSON.parse(json);
            }
        },
        computed: {
            auditoriasVisiveis() {
                return this.listaAuditorias.filter(auditoria => {
                    const nomeMatch = auditoria.nome.toLowerCase().includes(this.searchQuery.toLowerCase());
                    const statusMatch = this.valorRadio ? auditoria.status === this.valorRadio : true;
                    return nomeMatch && statusMatch;
                });
            }
        },
        async mounted() {
            //this.uid = this.$route.params.uid;

            try {
                const querySnapshot = await getDocs(collection(db, "auditorias"));
                this.listaAuditorias = querySnapshot.docs.map(doc => {
                    const data = doc.data();

                    // converte timestamp para string legível
                    const dataInicio = data.dataInicio?.toDate?.(); // faz .toDate() apenas se existir

                    return {
                        id: doc.id,
                        ...data,
                        dataInicioFormatada: dataInicio
                        ? dataInicio.toLocaleDateString("pt-PT") // → "11/04/2025"
                        : ""
                    };
                });

            } catch (error) {
                console.error("Erro ao buscar auditorias:", error);
            }
            },
        methods: {
            onSearch() {
                
            },
            toggleSelection(value) {
                if (this.valorRadio === value) {
                    this.valorRadio = null;
                } else {
                    this.valorRadio = value;
                }
                this.popupfiltro = false;
            },
            goToPaginaDetalhe(audit) {
                this.$router.push({
                    name: "PaginaDetalhe",
                    params: { id: audit.id },
                });
            }
        }
    };
</script>


<style scoped>
    .campo-pesquisa {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3vh;

        position: relative;
    }

    input {
        border-radius: 15px;
        
        padding: 8px;
        font-size: 16px;
        border: 1px solid #ccc;
        width: 100%;
        text-indent: 3.5vh;
    }

    .icon {
        pointer-events: none;
        position: absolute;
        left: 4.5vh;

        font-size: 18px;
        color: #888;
    }

    .campo-auditorias-filtro {
        display: flex;
        justify-content: space-between;
    }

    .total-auditorias {
        padding-left: 3vh;
    }

    .campo-filtro {
        padding-right: 3vh;
    }

    .filtro {
        border-radius: 15px;
        
        padding: 1vh;
        font-size: 16px;
        border: 1px solid #ccc;
    }

    .filtro-conteudo {
        display: none;
        flex-direction: column;
        align-items: flex-start;
        position: relative;

        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        
        font-size: 16px;
        border-radius: 10px;
        padding: 5px;

        z-index: 10;
    }

    .filtro-conteudo label {
        display: flex;
        align-items: left;
    }

  .campo-filtro:hover .filtro-conteudo {
        position: absolute;
        display: flex;
        flex-direction: column;
    }

    .campo-auditoria {
        margin-top: 2.5vh;
    }

    .auditoria {
        border: none;
        border-radius: 15px;
        
        background-color: #fff;
        border: 1px solid #cccccccc;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.075);

        height: 20vh;
        width: 90%;

        margin-bottom: 2vh;
    }

    h1 {
        font-size: 20px;
        text-align: left;
    }

    h2 {
        font-size: 12px;
    }

    h3 {
        font-size: 10px;
    }

    .auditoria-cabecalho {
        display: flex;
        justify-content: space-between;
        align-items: top;
        padding: 1vh;
        gap: 1vh;
        min-height: 12vh;
    }

    .paragrafo {
        display: flex;
        font-size: 12px;
        gap: 4px;
    }

    .campo-paragrafo {
        align-items: center;
        padding-left: 1vh;
    }
</style>