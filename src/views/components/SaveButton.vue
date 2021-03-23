<template>
  <b-button
    @click="$emit('click')"
    variant="success"
    :disabled="isProcessing">
    <v-icon 
      v-if="!isProcessing"
      name="save"
      class="mr-2" />
    <v-icon 
      v-if="isProcessing"
      name="sync"
      spin
      class="mr-2" />
    {{ label }}
  </b-button>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Save'
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  }
}
</script>