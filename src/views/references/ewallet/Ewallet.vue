<template>
  <div>
    <CustomCard
      header="E-Wallet"
      subHeader="List of all e-wallet.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.EwalletPermissions.ADD.id)"
          placeholder="Search E-Wallet"
          buttonLabel="Create E-Wallet"
          :filter="filters.ewallet"
          :table="tables.ewallets"
          :pagination="paginations.ewallet">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.EwalletPermissions.EDIT.id, $options.EwalletPermissions.DELETE.id])" 
              boundary="window" 
              right
              variant="link" 
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.EwalletPermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.EwalletPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <EwalletEntry
      @save="onEwalletEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.ewallet"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onEwalletDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.ewallet.isProcessing"
      name="E-Wallet" />
  </div>
</template>
<script>
const ewalletFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from '../../components'
import Full from '../../components/Full'
import EwalletEntry from './EwalletEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { EWalletApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { EwalletPermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    EwalletEntry,
    DeleteConfirmation,
    CustomCard
  },
  mixins: [ EWalletApi, tables, Access ],
  EwalletPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        ewallet: {
          isProcessing: false,
          fields: { ...ewalletFields },
          states: { ...ewalletFields },
          errors: { ...ewalletFields },
        }
      },
      tables: {
        ewallets: {
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
        ewallet: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        ewallet: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadEwallets()
  },
  methods: {
    loadEwallets() {
      const params = {
        paginate: false
      }
      const { ewallets } = this.tables
      const { ewallet } = this.paginations
      ewallets.isBusy = true
      this.getEWalletList(params)
      .then(({ data }) => {
        ewallets.items = data
        ewallet.totalRows = data.length
        this.recordDetails(ewallet)
        ewallets.isBusy = false
      })
    },
    onEwalletEntry(){
      const { ewallet, ewallet: { fields } } = this.forms
      const { ewallets } = this.tables
      ewallet.isProcessing = true
      reset(ewallet)
      if(this.entryMode == "Add"){
        this.addEWallet(fields)
          .then(({ data }) => {
            this.addRow(ewallets, this.paginations.ewallet, data)
            ewallet.isProcessing = false
            showNotification(this, "success", "Bank created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            ewallet.isProcessing = false
            validate(ewallet, errors)
          })
      }
      else {
        const { fields } = this.forms.ewallet
        this.updateEWallet(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(ewallets, data)
            ewallet.isProcessing = false
            showNotification(this, "success", "Bank updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            ewallet.isProcessing = false
            validate(ewallet, errors)
          })
      }
    },
    onEwalletDelete(){
      const { ewallet, ewallet: { fields: { id } } } = this.forms
      const { ewallets } = this.tables
      ewallet.isProcessing = true
      this.deleteEWallet(id)
        .then(({ data }) => {
          this.deleteRow(ewallets, this.paginations.ewallet, id)
          ewallet.isProcessing = false
          showNotification(this, "success", "Bank deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          ewallet.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { ewallet, ewallet: { fields } } = this.forms
      ewallet.isLoading = true
      copyValue(row.item, fields)
      reset(ewallet)
      this.entryMode = "Edit"
      ewallet.isLoading = false
    },
    setCreate() {
      const { ewallet } = this.forms
      clearFields(ewallet)
      reset(ewallet)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.ewallet
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>