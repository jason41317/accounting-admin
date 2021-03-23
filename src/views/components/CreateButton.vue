<template>
  <b-button
    @click="$emit('click')"
    variant="outline-primary">
    <v-icon 
      name="plus-circle" />
    {{ label }}
  </b-button>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>