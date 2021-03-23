<template>
  <CustomModal 
    :show="showModal"
    @closeModal="$emit('close')"
    @shown="$refs.name.focus()">
    <template #modal-header>
      Document Type Entry - {{mode}}
    </template>
    <template #modal-body>
      <b-form autocomplete="off">
        <b-form-group>
          <label class="required">Name</label>
          <b-form-input
            v-model="form.fields.name"
            :state="form.states.name"
            debounce="250"
            type="text"
            ref="name" />
          <b-form-invalid-feedback>
            {{form.errors.name}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group>
          <label>Description</label>
          <b-form-input
            ref="description"
            v-model="form.fields.description"
            :state="form.states.description"
            debounce="250"
            type="text" />
          <b-form-invalid-feedback>
            {{form.errors.description}}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>
    </template>
    <template #modal-footer>
      <div class="button-footer">
        <SaveButton @click="$emit('save')" :isProcessing="form.isProcessing"/>
        <CloseButton @click="$emit('close')" class="ml-2" :isProcessing="form.isProcessing"/>
      </div>
    </template>
  </CustomModal>
</template>
<script>
import { SaveButton, CloseButton, CustomModal } from '../../components'
export default {
  components: {
    SaveButton, CloseButton, CustomModal
  },
  props: {
    show: Boolean,
    form: Object,
    mode: String
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