<template>
  <div class="detail__group">
    <div class="detail__label">
      {{ label }}
    </div>
    <div class="detail__value">
      {{ value }}
    </div>
    <slot name="extra-value"></slot>
</div>
    
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  }

}
</script>

<style lang="scss" scoped>
  .detail__group {
    display: flex;  
    flex-direction: column;
    width: 100%;
    margin-top: 8px;

    .detail__label {
      font-size: 10pt;
      font-weight: bold;
    }

    .detail__value {
      font-size: 12pt;
    }
  }
</style>