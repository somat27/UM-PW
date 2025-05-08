<template>
  <div class="table-wrapper">
    <div v-if="title" class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <p v-if="subTitle" class="table-subtitle">{{ subTitle }}</p>
    </div>
    
    <div class="table-responsive">
      <table class="audit-table" :class="tableClass">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key || column"
              :class="column.headerClass"
            >
              {{ column.label || column }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td 
              v-for="column in columns" 
              :key="`${item.id}-${column.key || column}`"
              :class="column.cellClass"
            >
              <slot :name="`column-${column.key || column}`" :value="getValue(item, column)" :item="item">
                {{ getValue(item, column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuditTable",
  props: {
    columns: {
      type: Array,
      required: true,
      validator: (cols) => cols.every(c => typeof c === 'string' || (c.key && c.label))
    },
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
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
      }
    }
  },
  methods: {
    getValue(item, column) {
      const key = typeof column === 'string' ? column.toLowerCase() : column.key;
      return item[key] ?? '—';
    }
  }
}
</script>

<style scoped>
.table-wrapper {
  margin: 1.5rem 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table-header {
  padding: 1rem 1.5rem 0;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.table-subtitle {
  color: #6c757d;
  margin: 0.25rem 0 0;
}

.table-responsive {
  overflow-x: auto;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  text-align: left !important;
}

.audit-table th {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

.audit-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: top;
}

.table-striped tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.table-hover tbody tr:hover {
  background-color: #f1f3f5;
}
</style>