<template>
  <div class="dashboard-container">
    <div class="dashboard-layout">
      <aside class="sidebar-column">
        <nav class="sidebar-nav">
          <div class="sidebar-background">
            <NavigationList />
          </div>
        </nav>
      </aside>
      <main class="main-content">
        <div class="content-wrapper">
          <div class="page-header">
            <h2>Plano de Auditoria</h2>
          </div>
          <div class="audit-form">
            <div class="form-group">
              <label>Descrição</label>
              <textarea v-model="ocorrencia.descricao" disabled class="input"></textarea>
            </div>
            <div class="form-group">
              <label>Tipo de Ocorrência</label>
              <input v-model="ocorrencia.tipoOcorrencia" disabled class="input" />
            </div>
            <div class="form-group">
              <label>Endereço</label>
              <input v-model="ocorrencia.endereco" disabled class="input" />
            </div>
            <!-- Mapa embutido via iframe -->
            <div class="map-container">
              <iframe :src="mapUrl" width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen
                loading="lazy"></iframe>
            </div>

            <h3>Seleção de Perito</h3>
            <GenericTable :columns="columnsPeritos" :data="peritosList" class="table-scroll">
              <template #cell-select="{ row }">
                <input type="radio" name="perito" :value="row.uid" v-model="selectedPerito" />
              </template>
            </GenericTable>

            <h3>Seleção de Materiais</h3>
            <GenericTable :columns="columnsMateriais" :data="materiaisList" class="table-scroll">
              <template #cell-qtd="{ row }">
                <input type="number" min="0" :max="row.quantidade" v-model.number="row.qtd" class="input" />
              </template>
            </GenericTable>

            <h3>Seleção de Profissionais</h3>
            <GenericTable :columns="columnsProfissionais" :data="profissionaisList" class="table-scroll">
              <template #cell-qtd="{ row }">
                <input type="number" min="0" :max="row.quantidade" v-model.number="row.qtd" class="input" />
              </template>
            </GenericTable>

            <div class="form-group">
              <label>Data de Fim de Obra</label>
              <input type="date" v-model="deadline" class="input" />
            </div>
            <div class="form-group">
              <label>Tempo Estimado (horas)</label>
              <input type="number" v-model.number="estimatedTime" class="input" />
            </div>
            <button @click="submitAuditoria" class="btn">Aprovar Ocorrência</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavigationList from '@/components/NavigationList.vue';
import GenericTable from '@/components/GenericTable.vue';
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const route = useRoute();
const router = useRouter();
const ocorrencia = ref({ descricao: '', tipoOcorrencia: '', endereco: '', coordenadas: { latitude: 0, longitude: 0 } });
const peritosList = ref([]);
const materiaisList = ref([]);
const profissionaisList = ref([]);
const selectedPerito = ref(null);
const deadline = ref('');
const estimatedTime = ref(0);

const columnsPeritos = [
  { key: 'select', label: '' },
  { key: 'displayName', label: 'Nome' },
  { key: 'specialty', label: 'Especialidade' },
  { key: 'address', label: 'Localidade' }
];
const columnsMateriais = [
  { key: 'nome', label: 'Nome' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'quantidade', label: 'Disponível' },
  { key: 'qtd', label: 'Qtd Requerida' }
];
const columnsProfissionais = [
  { key: 'nome', label: 'Nome' },
  { key: 'area', label: 'Área' },
  { key: 'quantidade', label: 'Disponível' },
  { key: 'qtd', label: 'Qtd Requerida' }
];

const mapUrl = computed(() => {
  const { latitude, longitude } = ocorrencia.value.coordenadas;
  return `https://www.google.com/maps?q=${latitude},${longitude}&hl=pt&z=15&output=embed`;
});

async function loadData() {
  const id = route.params.id;
  // Ocorrência
  const ocRef = doc(db, 'ocorrencias', id);
  const ocSnap = await getDoc(ocRef);
  if (ocSnap.exists()) ocorrencia.value = ocSnap.data();

  // Peritos
  const peritosSnap = await getDocs(collection(db, 'peritos'));
  peritosList.value = peritosSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

  // Materiais
  const matSnap = await getDocs(collection(db, 'materiais'));
  materiaisList.value = matSnap.docs.map(d => ({ id: d.id, ...d.data()}));

  // Profissionais
  const profSnap = await getDocs(collection(db, 'profissionais'));
  profissionaisList.value = profSnap.docs.map(d => ({ id: d.id, ...d.data()}));
}

async function submitAuditoria() {
  const id = route.params.id;

  // 1) Constroi o objecto sem undefined
  const auditoria = {
    descricao: ocorrencia.value.descricao || '',
    tipo: ocorrencia.value.tipoOcorrencia || '',
    endereco: ocorrencia.value.endereco || '',
    coordenadas: ocorrencia.value.coordenadas || { latitude: 0, longitude: 0 },
    perito: selectedPerito.value || null,
    dataInicio: new Date(),
    tempoEstimado: typeof estimatedTime.value === 'number' ? estimatedTime.value : 0
  };

  // 2) Só adiciona dataFim se houver deadline
  if (deadline.value) {
    auditoria.dataFim = new Date(deadline.value);
  }

  // 3) Garantir quantidade sempre numérico
  auditoria.materiais = materiaisList.value.map(m => ({
    id: m.id,
    nome: m.nome,
    quantidade: typeof m.qtd === 'number' ? m.qtd : 0
  }));
  auditoria.profissionais = profissionaisList.value.map(p => ({
    id: p.id,
    nome: p.nome,
    quantidade: typeof p.qtd === 'number' ? p.qtd : 0
  }));

  // 4) Agora podes gravar sem undefined
  await setDoc(doc(db, 'auditorias', id), auditoria);
  router.push('/GestaoOcorrencias');
}


onMounted(loadData);
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  gap: 20px;
}

.sidebar-column {
  width: 20%;
}

.main-content {
  flex: 1;
  margin-right: 10px;
}

.content-wrapper {
  margin-top: 40px;
}

.page-header h2 {
  margin: 0 0 1em;
}

.audit-form {
  background: #fff;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.map-container {
  width: 100%;
  height: 300px;
  margin-bottom: 1em;
  border-radius: 8px;
  overflow: hidden;
}

.input {
  width: 100%;
  padding: .5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1em;
}

.btn {
  padding: .75em 1.5em;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-scroll {
  margin-bottom: 1.5em;
}

.table-scroll .generic-table-wrapper {
  max-height: 200px;
  overflow-y: auto;
}
</style>
