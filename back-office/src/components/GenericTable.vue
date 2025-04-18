<template>
  <div class="table-wrapper">
    <div v-if="title" class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <p v-if="subTitle" class="table-subtitle">{{ subTitle }}</p>
    </div>

    <div class="table-responsive">
      <table class="generic-table" :class="tableClass">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td v-for="column in columns" :key="`${item.id}-${column.key}`">
              <template v-if="column.key === 'nameEmail'">
                <div class="name-email-cell">
                  <div class="name">{{ item.name }}</div>
                  <div class="email">{{ item.email }}</div>
                </div>
              </template>
              <template v-else-if="column.key === 'status'">
                <span :class="['status-badge', item.status.toLowerCase()]">{{ item.status }}</span>
              </template>
              <template v-else-if="column.key === 'actions'">
              <div class="action-btn-group">
                <button class="icon-btn" @click="$emit('view', item)">
                  <img src="@/assets/icons8-eye-forma-light/icons8-eye-24.png" alt="Ver" />
                </button>
                <button class="icon-btn" @click="$emit('edit', item)">
                  <img src="@/assets/icons8-pencil-pastel-glyph/icons8-pencil-24.png" alt="Editar" />
                </button>
                <button class="icon-btn" @click="$emit('delete', item)">
                  <img src="@/assets/icons8-trash-ink/icons8-trash-24.png" alt="Eliminar" />
                </button>
                </div>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "GenericTable",
  props: {
    title: String,
    subTitle: String,
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: 'striped',
      validator: (val) => ['striped', 'hover', 'plain'].includes(val)
    }
  },
  computed: {
    tableClass() {
      return {
        'table-striped': this.type === 'striped',
        'table-hover': this.type === 'hover'
      };
    }
  },
  methods: {
    handleAction(item) {
      this.$emit('action', item);
    }
  }
};
</script>

<style scoped>
.table-wrapper {
  margin: 1.5rem 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.table-header {
  padding: 1rem 1.5rem 0;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.table-subtitle {
  color: #6c757d;
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.table-responsive {
  overflow-x: auto;
}

.generic-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.generic-table th {
  background-color: #f8f9fa;
  padding: 12px 16px;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
  text-align: left;
}

.generic-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
  text-align: left;
}

.name-email-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-weight: 500;
  color: #333;
}

.email {
  font-size: 0.85rem;
  color: #6c757d;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.mobilizado {
  background-color: #e6f7e6;
  color: #28a745;
}

.status-badge.disponível {
  background-color: #e6f7e6;
  color:rgb(40, 112, 167);
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
}

.check-icon {
  display: inline-block;
}

.action-btn-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.icon-btn img {
  width: 20px;
  height: 20px;
}



/**.table-striped tbody tr:nth-child(even) {
  *background-color: #f8f9fa;
*}

*.table-hover tbody tr:hover {
*  background-color: #f1f3f5;
*}
*/
</style>
