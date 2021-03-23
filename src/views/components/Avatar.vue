<template>
  <div class="avatar__container" :style="avatartStyle">
    <img class="avatar-image" v-if="imgSrc" :src="imgSrc" >
    <span class="avatar-text" v-else >{{ text }}</span>
  </div>
</template>

<script>

import { colorFactory, getColorFactoryLength } from '../../helpers/colors';
const COLOR_FACTORY_LENGTH = getColorFactoryLength();
export default {
  name: 'Avatar',
  constants: {
    COLOR_FACTORY_LENGTH
  },
  props: {
    avatarId: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: 60
    },
    width: {
      type: Number,
      default: 60
    },
    text: {
      type: String,
      default: ''
    },
    imgSrc: {
      type: String,
      default: ''
    },
    textSize: {
      type: Number,
      default: 10
    }

  },
  data() {
    return {
      colorFactory: colorFactory
    }
  },
  computed: {
    avatartStyle() {
      //console.log($options.colorFactory(Math.floor(Math.random() * Math.floor(COLOR_FACTORY_LENGTH))).bg)
      const colorId = this.avatarId % COLOR_FACTORY_LENGTH
      return {
        '--height': this.height  + 'px',
        '--width': this.width  + 'px',
        '--background-color': this.colorFactory(colorId).bg,
        '--color': this.colorFactory(colorId).font,
        '--font-size' : this.textSize + 'pt'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar__container {
    width: var(--width);
    height: var(--height);
    border-radius: 50%;
    background-color: var(--background-color);
    border: solid 5px white; 
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
  }

  .avatar-text {
    // width: 100%;
    // height: 100%;
    color: var(--color);
    font-size: var(--font-size);
    text-transform: capitalize;
  }
</style>