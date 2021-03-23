<template>
  <div class="tooltip-container">
    <div :class="labelClass">{{ label }}</div>
    <v-icon
      :id="id"
      name="info-circle"
      class="icon-tooltip"/>
    <b-tooltip
      :target="id" 
      triggers="hover"
      :boundary="id"
      custom-class="custom-tooltip">
      <div style="text-align: left">
        <slot name="body"></slot>
      </div>
    </b-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    labelClass: {
      type: String,
      default: ''
    },
    id: {
      type: String
    },
  }
}
</script>

<style lang="scss" scoped>
  .tooltip-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    // border: solid 1px;
  }
</style>