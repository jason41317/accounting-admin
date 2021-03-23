<template>
  <!-- <b-modal 
    v-model="showModal"
    @close="$emit('close')"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true" >
    <div slot="modal-title">
        Delete {{ name }}
    </div>
    Are you sure you want to delete this {{ name }} ?
    <div slot="modal-footer">
      <b-button
      :disabled="isProcessing"
      variant="outline-primary" 
      class="mr-2 btn-save" 
      @click="$emit('yes')">
      <v-icon 
        v-if="isProcessing"
        name="sync"
        spin
        class="mr-2" />
      Yes
    </b-button>
    <b-button
      class="btn-close"
      variant="outline-danger"
      @click="$emit('close')">
      No
    </b-button> 
    </div>
  </b-modal> -->
  <CustomModal
    :show="showModal" @closeModal="$emit('close')" size="sm">
    <template #modal-header>
      {{ deleteLabel }} {{ name }}
    </template>
    <template #modal-body>
      <p>Are you sure you want to {{ deleteLabel.toLowerCase() }} this {{ name }} ?</p>
    </template>
    <template #modal-footer>
       <div class="button-footer">
         <b-button
            :disabled="isProcessing"
            variant="outline-primary" 
            class="mr-2 btn-save" 
            @click="$emit('yes')">
            <v-icon 
              v-if="isProcessing"
              name="sync"
              spin
              class="mr-2" />
            Yes
          </b-button>
          <b-button
            class="btn-close ml-2"
            variant="outline-danger"
            @click="$emit('close')">
            No
          </b-button> 
      </div>
    </template>
  </CustomModal>
</template>
<script>
import { CustomModal } from "../components";
export default {
  name: 'DeleteConfirmation',
  components: {
    CustomModal
  },
  props: {
    name: String,
    deleteLabel: {
      type: String,
      default: 'Delete'
    },
    show: Boolean,
    isProcessing: Boolean
  },
  computed: {
    showModal: {
      get: function() {
        return this.show
      },
      set: function(newValue) {
        return newValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .button-footer {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
  }
</style>