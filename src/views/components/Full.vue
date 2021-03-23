<template>
  <div class="full-container">
    <div class="full-container__table">
      <div class="create-search-container">
        <CreateButton
          v-if="!noCreateButton"
          @click="$emit('create')"
          class="create-button"
          :label="buttonLabel" />
        <div class="other-filter">
          <slot name="other-filter"></slot>
        </div>
        <SearchBar
          v-if="!noSearchBar"
          @update="$emit('search')"
          :placeholder="placeholder"
          class="search-bar"
          :filter="filter" />
      </div>
      <div class="table-container">
        <CustomTable
          :isServerSide="isServerSide"
          :filter="filter"
          :table="table"
          :pagination="pagination">
          <template v-for="( slotFn, slotName ) in $scopedSlots" v-slot:[slotName]="data">
            <slot :name="slotName" v-bind="data"></slot>
          </template>
        </CustomTable>
        <CustomPagination @paginate="$emit('paginate')" :pagination="pagination"/>
      </div>
    </div>
  </div>
</template>
<script>
import { CustomCard, CreateButton, SearchBar, CustomTable, CustomPagination } from '../components'
export default {
  props: {
    noSearchBar: {
      type: Boolean,
      default: false
    },
    noCreateButton: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Object
    },
    placeholder: {
      type: String,
      default: ''
    },
    table: { 
      type: Object
    },
    pagination: { 
      type: Object
    },
    buttonLabel: {
      type: String,
      default: ''
    },
    isServerSide: {
      type: Boolean,
      default: false
    },
    isPaginated: {
      type: Boolean,
      default: true
    }
  },
  components: {
    CustomTable,
    CustomCard,
    CreateButton,
    SearchBar,
    CustomPagination
  }
}
</script>
<style lang="scss" scoped>
.create-search-container {
  display: flex;
  width: 100%;

  .other-filter {
    flex: 1;
    margin-left: 5px;
  }
  .search-bar {
    width: 250px;
    margin-left: 5px;
  }
}

.table-container {
  width: 100%;
  margin-top: 10px;
}

.full-container {
  display: flex;
  // flex-direction: column;

  .full-container__table {
    flex: 1;
  }
}
</style>
