<template>
  <CustomModal 
    :show="showModal"
    @closeModal="$emit('close')"
    @shown="$refs.code.focus()"
    size="md">
    <template #modal-header>
      Service Entry - {{mode}}
    </template>
    <template #modal-body>
      <b-form autocomplete="off">
        <b-form-group>
          <label class="required">Code</label>
          <b-form-input
            v-model="form.fields.code"
            :state="form.states.code"
            debounce="250"
            type="text"
            ref="code" />
          <b-form-invalid-feedback>
            {{form.errors.code}}
          </b-form-invalid-feedback>
        </b-form-group>
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
        <b-form-group
            :invalid-feedback="form.errors.serviceCategoryId"
            :state="form.states.serviceCategoryId">
          <label class="required">Service Category</label>
          <v-select
            :options="options.serviceCategories.items"
            label="name"
            :disable="options.serviceCategories.isBusy"
            v-model="form.fields.serviceCategoryId"
            :reduce="serviceCategory => serviceCategory.id"
            :class=" { 'is-invalid' : !!form.errors.serviceCategoryId }"
            appendToBody/>
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
import { ServiceCategoryApi } from '../../../mixins/api'
import { SaveButton, CloseButton, CustomModal } from '../../components'
export default {
  components: {
    SaveButton, CloseButton, CustomModal
  },
  mixins: [ServiceCategoryApi],
  props: {
    show: Boolean,
    form: Object,
    mode: String
  },
  data() {
    return {
      options: {
        serviceCategories: {
          items: []
        }
      }
    }
  },
  created() {
    this.loadServiceCategory()
  },
  methods: {
    loadServiceCategory() {
      const params = {
        paginate: false
      }
      const { serviceCategories } = this.options
      this.getServiceCategoryList(params)
      .then(({ data }) => {
        serviceCategories.items = data
      })
    },
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