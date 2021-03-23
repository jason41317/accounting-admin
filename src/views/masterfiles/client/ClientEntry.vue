<template>
  <CustomModal :show="showModal" @closeModal="$emit('close')" size="md" >
    <template #modal-header>
      Client Entry - {{mode}}
    </template>
    <template #modal-body>
      <b-form autocomplete="off" class="client__form">
        <div class="left-pane">
          <b-form-group>
            <label class="required">Code</label>
            <b-form-input
              v-model="form.fields.code"
              :state="form.states.code"
              debounce="250"
              type="text"
              ref="name" />
            <b-form-invalid-feedback>
              {{form.errors.code}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="required">Company Name</label>
            <b-form-textarea
              v-model="form.fields.name"
              :state="form.states.name"
              debounce="250"
              type="text"
              ref="name"
              rows="2" />
            <b-form-invalid-feedback>
              {{form.errors.name}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="required">Office Address</label>
            <b-form-textarea
              v-model="form.fields.officeAddress"
              :state="form.states.officeAddress"
              debounce="250"
              type="text"
              ref="name"
              rows="2" />
            <b-form-invalid-feedback>
              {{form.errors.officeAddress}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label>Owner</label>
            <b-form-input
              v-model="form.fields.owner"
              :state="form.states.owner"
              debounce="250"
              type="text"
              ref="name" />
            <b-form-invalid-feedback>
              {{form.errors.owner}}
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="right-pane">
          <b-form-group>
            <label>Email</label>
            <b-form-input
              v-model="form.fields.email"
              :state="form.states.email"
              debounce="250"
              type="text"
              ref="name" />
            <b-form-invalid-feedback>
              {{form.errors.email}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label>Contact No</label>
            <b-form-input
              v-model="form.fields.contactNo"
              :state="form.states.contactNo"
              debounce="250"
              type="text"
              ref="name" />
            <b-form-invalid-feedback>
              {{form.errors.contactNo}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :invalid-feedback="form.errors.businessTypeId"
            :state="form.states.businessTypeId">
            <label class="required">Business Type</label>
            <v-select
              :options="options.businessTypes.items"
              label="name"
              :disabled="options.businessTypes.isBusy"
              v-model="form.fields.businessTypeId"
              :reduce="businessType => businessType.id"
              :class=" { 'is-invalid' : !!form.errors.businessTypeId  }"
              :loading="options.businessTypes.isBusy"
            >
              <template #spinner="{ loading }">
                <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner" />
              </template>
            </v-select>
          </b-form-group>
          <b-form-group
            :invalid-feedback="form.errors.businessStyleId"
            :state="form.states.businessTypeId">
            <label class="required">Business Style</label>
            <v-select
              :options="options.businessStyles.items"
              label="name"
              :disabled="options.businessStyles.isBusy"
              v-model="form.fields.businessStyleId"
              :reduce="businessStyle => businessStyle.id"
              :class=" { 'is-invalid' : !!form.errors.businessStyleId  }"
              :loading="options.businessStyles.isBusy"
            >
              <template #spinner="{ loading }">
                <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner" />
              </template>
            </v-select>
          </b-form-group>
          <b-form-group>
            <label >Industry</label>
            <b-form-input
              v-model="form.fields.industry"
              :state="form.states.industry"
              debounce="250"
              type="text"
              ref="name" />
            <b-form-invalid-feedback>
              {{form.errors.industry}}
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
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
import { BusinessStyleApi, BusinessTypeApi } from '../../../mixins/api'
import { SaveButton, CloseButton, CustomModal } from '../../components'
export default {
  components: { SaveButton, CloseButton, CustomModal },
  mixins: [ BusinessStyleApi, BusinessTypeApi ],
  props: {
    show: Boolean,
    form: Object,
    mode: String
  },
  data() {
    return {
      options: {
        businessStyles: {
          items: []
        },
        businessTypes: {
          items: []
        }
      }
    }
  },
  created() {
    this.loadBusinessStyles()
    this.loadBusinessTypes()
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
  },
  methods: {
    loadBusinessStyles() {
      const { businessStyles } = this.options
      const params = { paginate: false}
      this.getBusinessStyleList(params).then(({ data }) => {
        businessStyles.items = data
      })
    },
    loadBusinessTypes() {
      const { businessTypes } = this.options
      const params = { paginate: false}
      this.getBusinessTypeList(params).then(({ data }) => {
        businessTypes.items = data
      })
    },
  }

}
</script>

<style lang="scss" scoped>
  
  .client__form {
    display: flex;
    justify-content: space-between;
  }

  .left-pane, .right-pane {
    width: 48%;
  }

  .button-footer {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
  }
</style>