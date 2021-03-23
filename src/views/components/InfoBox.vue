<template>
  <div class="info-box__main-container">
    <div class="info-box__header-container">
      <div clas="info-box__header">
        <div class="info-box__title">{{ title }}</div>
        <div class="info-box__sub-title"> {{ subTitle }} </div>
      </div>
      <div class="info-box__count">
        {{ count }}
      </div>
    </div>
    <div class="info-box__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    },
    subTitle: {
      type: String,
      default: 'sub'
    },
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss">
  .info-box__main-container {
    border: solid 1px lightgray;
    width: calc(100%/3 - 10px);
    min-height: 225px;
    max-height: 225px;
    
    background-color: white;
    display: flex;
    flex-direction: column;
  }

  .info-box__title {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    width: 100%;
  }

  .info-box__sub-title {
    font-size: 10pt;
    color: gray;
    width: 100%;
  }

  .info-box__header-container {
    padding: 10px;
    min-height: 80px;
    border-bottom: solid 1px lightgray;
    display: flex;
    position: relative;
    align-items: center;

    .info-box__header {
      display: flex;
    }

    .info-box__count {
      position: absolute;
      right: 15px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 25pt;
    }
  }

  .info-box__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>