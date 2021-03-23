<template>
  <div>
    <CustomCard
      header="Bank"
      subHeader="List of all bank.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.BankPermissions.ADD.id)"
          placeholder="Search Bank"
          buttonLabel="Create Bank"
          :filter="filters.bank"
          :table="tables.banks"
          :pagination="paginations.bank">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.BankPermissions.EDIT.id, $options.BankPermissions.DELETE.id])" 
              boundary="window" 
              right
              variant="link" 
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.BankPermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.BankPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <BankEntry
      @save="onBankEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.bank"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onBankDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.bank.isProcessing"
      name="Bank" />
  </div>
</template>
<script>
const bankFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from '../../components'
import Full from '../../components/Full'
import BankEntry from './BankEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { BankApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { BankPermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    BankEntry,
    DeleteConfirmation,
    CustomCard
  },
  mixins: [ BankApi, tables, Access ],
  BankPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        bank: {
          isProcessing: false,
          fields: { ...bankFields },
          states: { ...bankFields },
          errors: { ...bankFields },
        }
      },
      tables: {
        banks: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              sortable: true,
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              sortable: true
            },
            {   
              key: 'action',
              label: '',
              thStyle: {width: '85px'},
              tdClass: 'text-center align-middle'
            },
          ],
          items: []
        }
      },
      paginations: {
        bank: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        bank: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadBanks()
  },
  methods: {
    loadBanks() {
      const params = {
        paginate: false
      }
      const { banks } = this.tables
      const { bank } = this.paginations
      banks.isBusy = true
      this.getBankList(params)
      .then(({ data }) => {
        banks.items = data
        bank.totalRows = data.length
        this.recordDetails(bank)
        banks.isBusy = false
      })
    },
    onBankEntry(){
      const { bank, bank: { fields } } = this.forms
      const { banks } = this.tables
      bank.isProcessing = true
      reset(bank)
      if(this.entryMode == "Add"){
        this.addBank(fields)
          .then(({ data }) => {
            this.addRow(banks, this.paginations.bank, data)
            bank.isProcessing = false
            showNotification(this, "success", "Bank created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            bank.isProcessing = false
            validate(bank, errors)
          })
      }
      else {
        const { fields } = this.forms.bank
        this.updateBank(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(banks, data)
            bank.isProcessing = false
            showNotification(this, "success", "Bank updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            bank.isProcessing = false
            validate(bank, errors)
          })
      }
    },
    onBankDelete(){
      const { bank, bank: { fields: { id } } } = this.forms
      const { banks } = this.tables
      bank.isProcessing = true
      this.deleteBank(id)
        .then(({ data }) => {
          this.deleteRow(banks, this.paginations.bank, id)
          bank.isProcessing = false
          showNotification(this, "success", "Bank deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          bank.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { bank, bank: { fields } } = this.forms
      bank.isLoading = true
      copyValue(row.item, fields)
      reset(bank)
      this.entryMode = "Edit"
      bank.isLoading = false
    },
    setCreate() {
      const { bank } = this.forms
      clearFields(bank)
      reset(bank)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.bank
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>