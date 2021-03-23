<template>
  <CustomModal
    :show="showModal" 
    @closeModal="$emit('close')" 
    size="sm"
    @shown="showModal? $refs.name.focus() : null">
    <template #modal-header>
      Account Class Entry - {{mode}}
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
        <b-form-group
            :invalid-feedback="form.errors.accountTypeId"
            :state="form.states.accountTypeId">
          <label class="required">Account Type</label>
          <v-select
            :options="options.accountTypes.items"
            label="name"
            :disabled="options.accountTypes.isBusy"
            v-model="form.fields.accountTypeId"
            :reduce="accountType => accountType.id"
            :class=" { 'is-invalid' : !!form.errors.accountTypeId  }"
            :loading="options.accountTypes.isBusy"
          >
            <template #spinner="{ loading }">
              <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner" />
            </template>
          </v-select>
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
import { AccountTypeApi } from '../../../mixins/api'
import { SaveButton, CloseButton } from '../../components'
import CustomModal from '../../components/CustomModal.vue'
export default {
  components: {
    SaveButton, CloseButton,
    CustomModal
  },
  mixins: [ AccountTypeApi ],
  props: {
    show: Boolean,
    form: Object,
    mode: String
  },
  data() {
    return {
      options: {
        accountTypes: {
          items: []
        }
      }
    }
  },
  created(){
    this.loadAccountTypeList()

    
  },
  mounted() {
    // setTimeout(() => {
    //   this.$nextTick(() => {
        
    //   })
    // }, 500);
  },
  methods: {
    loadAccountTypeList() {
      const { accountTypes } = this.options
      const params = { paginate: false }
      accountTypes.isBusy = true
      this.getAccountTypeList(params).then(({ data }) => {
        accountTypes.items = data
        accountTypes.isBusy = false
      }).catch(error => {
        console.log(error)
        accountTypes.isBusy = false
      })
    }
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
  
</style>