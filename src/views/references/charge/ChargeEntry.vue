<template>
  <CustomModal 
    :show="showModal"
    @closeModal="$emit('close')"
    @shown="$refs.name.focus()"
    size="md">
    <template #modal-header>
      Charge Entry - {{mode}}
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
        <!-- <b-form-group>
          <label class="required">Account Title</label>
          <b-form-select
            :state="form.states.accountTitleId"
            v-model="form.fields.accountTitleId" >
            <template v-slot:first>
              <b-form-select-option :value="null">-- Select Account Title --</b-form-select-option>
            </template>
            <b-form-select-option
              v-for="accountTitle in options.accountTitles.items"
              :key="accountTitle.id"
              :value="accountTitle.id">
              {{ accountTitle.name }}
            </b-form-select-option>
          </b-form-select>
          <b-form-invalid-feedback>
            {{form.errors.accountTitleId}}
          </b-form-invalid-feedback>
        </b-form-group> -->
        <b-form-group
          :invalid-feedback="form.errors.accountTitleId"
          :state="form.states.accountTitleId">
          <label class="required">Account Title</label>
          <v-select
            :options="options.accountTitles.items"
            label="name"
            :disable="options.accountTitles.isBusy"
            v-model="form.fields.accountTitleId"
            :reduce="accountTitle => accountTitle.id"
            :class=" { 'is-invalid' : !!form.errors.accountTitleId  }"
          />
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
import { AccountTitleApi } from '../../../mixins/api'
import { SaveButton, CloseButton } from '../../components'
import CustomModal from '../../components/CustomModal'
export default {
  components: {
    SaveButton, 
    CloseButton,
    CustomModal
  },
  mixins: [ AccountTitleApi ],
  props: {
    show: Boolean,
    form: Object,
    mode: String
  },
  data() {
    return {
      options: {
        accountTitles: {
          items: []
        }
      }
    }
  },
  created(){
    this.loadAccountTitle()
  },
  methods: {
    loadAccountTitle() {
      const { accountTitles } = this.options
      const params = { paginate: false }
      this.getAccountTitleList(params).then(({ data }) => {
        accountTitles.items = data
      }).catch(error => {
        console.log(error)
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