<template>
  <div class="active-section-header__container">
    <div class="section__number"> {{ sectionNumber }}</div>
    <div>
      <div class="section__header">
        {{ sectionHeader }}
      </div>
      <div class="section__sub-header">
        {{ sectionSubHeader }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sectionNumber: {
      type: Number,
      default: 1
    },
    sectionHeader: {
      type: String,
      default: ''
    },
    sectionSubHeader: {
      type: String,
      default: ''
    }
  }

}
</script>

<style lang="scss" scoped>
  .active-section-header__container {
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .section__number {
    max-height: 30px;
    height: 30px;
    min-width: 30px;
    border-radius: 50%;
    background-color: rgb(42, 128, 20);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-weight: bold;
    color: white;
  }

  .section__header { 
    font-size: 14pt;
    font-weight: bold;
  }

  .section__sub-header {
    font-size: 9pt;
    color: rgb(161, 158, 158);
  }
</style>  