<template>
  <div class="pagination-container">
    <div class="pagination-details">
      Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.totalRows }} records.
    </div>
    <div class="pagination-input">
      <b-pagination
        size="sm" 
        align="right" 
        :total-rows="pagination.totalRows" 
        :per-page="pagination.perPage" 
        v-model="pagination.page"
        @input="$emit('paginate')"
        class="my-0" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pagination: Object,
  }
}
</script>
<style lang="scss" scoped>
.pagination-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>