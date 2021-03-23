<template>

  <CustomModal 
    :show="showModal" 
    @closeModal="$emit('close')" 
    size="md"
    @shown="$refs.code.focus()">
    <template #modal-header>
      Account Title Entry - {{mode}}
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
            :invalid-feedback="form.errors.accountClassId"
            :state="form.states.accountClassId">
          <label class="required">Account Class</label>
          <v-select
            :options="options.accountClasses.items"
            label="name"
            :disabled="options.accountClasses.isBusy"
            v-model="form.fields.accountClassId"
            :reduce="accountClass => accountClass.id"
            :class=" { 'is-invalid' : !!form.errors.accountClassId  }"
            :loading="options.accountClasses.isBusy"
          >
            <template #spinner="{ loading }">
              <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner" />
            </template>
          </v-select>
        </b-form-group>
        <b-form-group>
          <label>Parent Account Title</label>
          <v-select
            :options="options.accountTitles.items"
            label="name"
            :disabled="options.accountTitles.isBusy"
            v-model="form.fields.accountTitleId"
            :reduce="accountTitle => accountTitle.id"
            :loading="options.accountTitles.isBusy"
            appendToBody
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
import { AccountClassApi, AccountTitleApi, AccountTypeApi } from '../../../mixins/api'
import { SaveButton, CloseButton } from '../../components'
import CustomModal from '../../components/CustomModal.vue'
export default {
  components: {
    SaveButton, 
    CloseButton,
    CustomModal
  },
  mixins: [ AccountClassApi, AccountTitleApi ],
  props: {
    show: Boolean,
    form: Object,
    mode: String
  },
  data() {
    return {
      options: {
        accountClasses: {
          isBusy: false,
          items: []
        },
        accountTitles: {
          isBusy: false,
          items: []
        }
      }
    }
  },
  created(){
    this.loadAccountClasses()
    this.loadAccountTitles()
  },
  methods: {
    loadAccountClasses() {
      const { accountClasses } = this.options
      const params = { paginate: false }
      accountClasses.isBusy = true
      this.getAccountClassList(params).then(({ data }) => {
        accountClasses.items = data
        accountClasses.isBusy = false
      }).catch(error => {
        console.log(error)
        accountClasses.isBusy = false
      })
    },
    loadAccountTitles() {
      const { accountTitles } = this.options
      const params = { paginate: false }
      accountTitles.isBusy = true
      this.getAccountTitleList(params).then(({ data }) => {
        accountTitles.items = data
        accountTitles.isBusy = false
      }).catch(error => {
        console.log(error)
        accountTitles.isBusy = false
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