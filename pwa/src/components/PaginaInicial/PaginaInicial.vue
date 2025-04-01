<template>
    <div>
        <AppCabecalho />
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
                <p>x auditorias</p>
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

            <button class="auditoria" @click="goToPaginaDetalhe">

                <div class="auditoria-cabecalho">
                    <h1>Inspeção Instalações Elétricas</h1>
                    <h2>Pendente</h2>
                </div>

                <div class="campo-paragrafo">
                    <div class="paragrafo">
                        <i class="bi bi-geo-alt"></i>
                        <h3>Edificio Central, Porto</h3>
                    </div>
                    <div class="paragrafo">
                        <i class="bi bi-clock"></i>
                        <h3>02/06/2023</h3>
                    </div>
                </div>

            </button>

        </div>
    </div>
    
</template>


<script>

    import AppCabecalho from '../AppCabecalho.vue';
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
            }; 
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
            goToPaginaDetalhe() {
                this.$router.push("/PaginaDetalhe");
            },
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