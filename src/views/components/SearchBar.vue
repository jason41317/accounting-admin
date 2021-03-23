<template>
  <b-form-input 
    v-model="filter.criteria"
    debounce="500"
    @update="$emit('update')"
    :placeholder="placeholder">
  </b-form-input>
</template>
<script>
export default {
  props: {
    filter: {
      type: Object
    },
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>