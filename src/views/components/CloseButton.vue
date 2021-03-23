<template>
  <b-button
    @click="$emit('click')"
    variant="danger"
    :disabled="isProcessing">
    <v-icon 
      name="window-close"
      class="mr-2" />
    Close
  </b-button>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  }
}
</script>