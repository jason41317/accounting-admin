<template>
    <!-- <div class="main-container" key="main" v-if="showModal">
      <div class="wrapper">
        <div class="modal-overlay"
          v-if="showModal" 
          key="overlay">
        </div>
        
        <div id="custom-modal" class="custom-modal"  v-if="showModal" :style="modalStyle" key="modal">
          <div class="custom-modal__header">
            <v-icon name="times" class="close-icon" @click="onCloseModal()"/>
            <slot name="modal-header"></slot>
          </div>
          <div class="custom-modal__body" >
            <slot name="modal-body"></slot>
          </div>
          <div class="custom-modal__footer">
            <slot name="modal-footer"></slot>
          </div>
        </div>
      </div>
    </div> -->

    <b-modal
      v-model="showModal"
      no-close-on-backdrop
      no-close-on-esc
      :size="size"
      @shown="$emit('shown')"
      class="custom-modal-v2">
      <template #modal-header>
        <slot name="modal-header"></slot>
      </template>

      <slot name="modal-body"></slot>

      <template #modal-footer>
        <slot name="modal-footer"></slot>
      </template>
    </b-modal>
</template>

<script>
export default {
  name: 'CustomModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'sm'
    }
  
  },
  data() {
    return {
      isClosing: false,
    }
  },
  methods: {
    onCloseModal() { 
      this.$emit('closeModal')
    },
  },
  created() {
    this.isClosing = this.showModal
  },
  // mounted() {
  //   const body = document.querySelector('body');
  //   if (body) {
  //     body.style.overflow = 'hidden!important';
  //   }
  // },
  // // updated() {
  // //   this.$emit('shown')
  // // },
  // beforeDestroy() {
  //   const body = document.querySelector('body');
  //   if (body) {
  //     body.style.overflow = 'auto!important';
  //   }
  // },
  computed: {
    showModal: {
      get: function() {
        return this.show
      },
      set: function(newValue) {
        return newValue
      }
    },
    modalStyle() {
      if(this.size === 'md') {
        return '--max-width: 600px'
      }
      else if (this.size === 'lg') {
        return '--max-width: 800px'
      }
      else if (this.size === 'xl') {
        return '--max-width: 1140px;'
      }

      return '--max-width: 400px'
    },
    modalClass() {
      if(this.size === 'md') {
        return 'modal-md'
      }
      else if (this.size === 'lg') {
        return 'modal-lg'
      }
      else if (this.size === 'xl') {
        return 'modal-xl'
      }
      return 'modal-sm'
    },
    overlayStyle() {
      // if(this.showModal) {
      //   this.$nextTick(function() { 
      //     const customModal = document.querySelector('.custom-modal');
      //     console.log(customModal.style)
      //     if (customModal) {
      //       return '--height:' + customModal.style.height + 'px'
      //     }
      //   })
        
      // }
      
      return '--height: 100%'
      
    }
  },
  // watch: {
  //   show(value) {
  //     if(value) {
  //       setTimeout(() => {
  //         this.$nextTick(function() {
  //           this.$emit('shown')
  //         })
  //       }, 100);
  //     }
  //     else {
  //       this.$emit('hide')
  //     }
  //   }
  // }
}
</script>

<style lang="scss" scoped>


  .main-container {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 9999;
    overflow: hidden;
  }

  .wrapper {
    position: relative;
    height: 100%;
    min-height: 100%;
    width: 100%;
    overflow-y: auto;
  }


  .custom-modal {
    position: absolute;
    top: 40px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0 auto;
    width: var(--max-width);
    height: fit-content;
    max-width: var(--max-width);
    border-radius: 5px;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    background: #FFF;
    z-index: 99999;
    transform: none;
    overflow: hidden;

    @media screen and (max-width: 1250px) {
      max-width: 900px;
    }

    @media screen and (max-width: 1000px) {
      max-width: 700px;
    }

    @media screen and (max-width: 800px) {
      max-width: 600px;
    }

    @media screen and (max-width: 650px) {
      max-width: 450px;
    }

    @media screen and (max-width: 500px) {
      max-width: calc(100% - 20px);
    }

  }

  .custom-modal h1 {
    margin: 0 0 1rem;
  }

  .modal-overlay {
    position: sticky;
    z-index: 9997;
    background: #2c3e50;
    opacity: 0.6;
    // cursor: pointer;
    // min-height: var(--height);
    min-height: 100%;
    width: 100%;
    
  }

  /* ---------------------------------- */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .4s linear;
    .custom-modal {
      transition: transform 0.35s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.35s linear;
    }
  }

  .fade-enter,
  .fade-leave-to {
    
      opacity: 0;
      .custom-modal {
        // opacity: 0;
        transform: scale(0.3) translateY(-50%);
      }

  }


  .custom-modal__header {
    min-height: 60px;
    height: auto;
    width: 100%;
    border-bottom: solid 1px gray;
    padding: 10px 20px;
    font-size: 16pt;
    font-weight: bold;
    display: flex;
    align-items: center;
    position: relative;
  }

  .custom-modal__body {
    width: 100%;
    height: auto;
    padding: 20px 20px;
  }

  .custom-modal__footer {
    width: 100%;
    height: auto;
    min-height: 60px;
    border-top: solid 1px gray;
    padding: 10px 20px;
  }

  .close-icon {
    position: absolute;
    top: 16px;
    right: 20px;
    height: 24px;
    width: 24px;

    &:hover {
      cursor: pointer;
      color: red;
    }
  }
  
  .custom-modal-v2 {
    z-index: 999999!important;
  }

</style>
