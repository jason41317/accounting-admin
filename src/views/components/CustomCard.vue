<template>
  <div class="custom-card__container">
    <b-card>
      <template #header>
        <div class="header-container">
          <div class="header-info">
            <div class="header">{{ header}}</div>
            <div class="sub-header">{{ subHeader }}</div>
          </div>
          <div class="header-filter">
            <slot name="card-header-filter"></slot>
          </div>
        </div>
      </template>
      <slot name="body"></slot>
      <template #footer v-if="showFooter">
        <slot name="customFooter"></slot>
      </template>
    </b-card>
  </div>
</template>

<script>

export default {
  props: {
    header: {
      type: String,
      default: ''
    },
    subHeader: {
      type: String,
      default: ''
    },
    showFooter: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss" scoped>
  .custom-card__container {
    height: 100%;
    width: 100%;
  }

  .header {
    color: rgb(94, 93, 93);
    font-weight: bold;
    font-size: 16pt;
  }

  .sub-header {
    font-size: 9pt;
    color: gray;

  }

  .header-container {
    display: flex;
    align-items: center;
  }

  .header-info {
    flex: 1;
    height: 100%;
  }

  .header-filter {
    min-width: 150px;
    margin-right: 13px;
  }
</style>
