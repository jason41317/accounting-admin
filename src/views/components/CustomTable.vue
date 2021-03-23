<template>
  <div>
    <b-table
      v-if="!isServerSide"  
      small hover outlined show-empty responsive
      :filter="filter.criteria"
      :fields="table.fields"
      :items.sync="isOtherItems ? items : table.items"
      :current-page="pagination ? pagination.page : null"
      :per-page="pagination ? pagination.perPage : null"
      :busy="table.isBusy"
      @filtered="onFiltered($event, pagination)"
      class="custom-table"
      bordered>
      <template #table-busy>
        <div class="text-center my-2">
          <v-icon 
            name="spinner" 
            spin
            class="mr-2" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-for="( slotFn, slotName ) in $scopedSlots" v-slot:[slotName]="data">
        <slot :name="slotName" v-bind="data"></slot>
      </template>
    </b-table>
    <b-table
      v-else
      small hover outlined show-empty responsive
      :fields="table.fields"
      :items.sync="isOtherItems ? items : table.items"
      :busy="table.isBusy"
      class="custom-table"
      bordered>
      <template #table-busy>
        <div class="text-center my-2">
          <v-icon 
            name="spinner" 
            spin
            class="mr-2" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-for="( slotFn, slotName ) in $scopedSlots" v-slot:[slotName]="data">
        <slot :name="slotName" v-bind="data"></slot>
      </template>
    </b-table>
  </div>
</template>
<script>
import tables from '../../helpers/tables'
export default {
  mixins: [tables],
  props: {
    table: {
      type: Object
    },
    isOtherItems: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: null
    },
    pagination: {
      type: Object,
      default: null
    },
    filter: {
      type: Object
    },
    isServerSide: {
      type: Boolean,
      default: false
    },
  }
}
</script>