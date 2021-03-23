<template>
  <div class="custom-progress-bar__container">
    <div class="custom-progress-bar__title">
      <div class="progress__label">{{ progressLabel }} </div>
      <div class="progress__label">{{ progressValue }}</div>
    </div>
    <b-progress :style="progressStyle" class="custom__progress-bar" :value="progressValue" :max="progressMax" :variant="progressVariant" striped ></b-progress>
  </div>
</template>

<script>
export default {
  props: {
    progressLabel: {
      type: String,
      default: ''
    },
    progressValue: {
      type: Number,
      default: 0
    },
    progressMax: {
      type: Number,
      default: 0
    },
    progressVariant: {
      type: String,
      default: 'success'
    },
    progressHeight: {
      type: Number,
      default: 20
    }
  },
  computed: {
    progressStyle() {
      return  {
        '--height' : this.progressHeight + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-progress-bar__container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .custom-progress-bar__title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 5px;

    .progress__label {
      font-size: 10pt;
      font-weight: bold;
    }
  }

  .custom__progress-bar {
    width: 100%;
    height: var(--height);
  }
</style>