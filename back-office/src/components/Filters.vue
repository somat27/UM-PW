<template>
  <div class="search-filter-bar" :style="{ gap }">
    <input
      type="text"
      class="search-input"
      :placeholder="searchPlaceholder"
      v-model="searchQuery"
      @input="$emit('search', searchQuery)"
    />

    <select 
      v-for="filter in filters" 
      :key="filter.key"
      class="dropdown"
      v-model="filter.selected"
      @change="$emit('filter-change', filter)"
    >
      <option 
        v-for="option in filter.options" 
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <button class="primary-btn" @click="$emit('add')">
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
export default {
  name: "FilterBar",
  props: {
    filters: {
      type: Array,
      required: true,
      validator: (filters) => filters.every(f => 
        f.key && 
        f.options && 
        Array.isArray(f.options) &&
        f.options.every(o => o.value !== undefined && o.label)
      )
    },
    searchPlaceholder: {
      type: String,
      default: "Procurar"
    },
    buttonText: {
      type: String,
      default: "+ Adicionar"
    },
    gap: {
      type: String,
      default: '12px'
    },
  },
  data() {
    return {
      searchQuery: ""
    };
  }
};
</script>

<style scoped>
.search-filter-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  min-width: 180px;
}

.dropdown {
  padding: 8px 10px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #fff;
  min-width: 140px;
}

.primary-btn {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
</style>