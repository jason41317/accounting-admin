<template>
  <div>
    <CustomCard
      header="Account Type"
      subHeader="List of all account type.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.AccountTypePermissions.ADD.id)"
          placeholder="Search Account Type"
          buttonLabel="Create Account Type"
          :filter="filters.accountType"
          :table="tables.accountTypes"
          :pagination="paginations.accountType">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.AccountTypePermissions.EDIT.id, $options.AccountTypePermissions.DELETE.id])" 
              boundary="window" 
              right
              variant="link" 
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.AccountTypePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.AccountTypePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <AccountTypeEntry
      @save="onAccountTypeEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.accountType"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onAccountTypeDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.accountType.isProcessing"
      name="Account Type" />
  </div>
</template>
<script>
const accountTypeFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import AccountTypeEntry from './AccountTypeEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { AccountTypeApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { AccountTypePermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    AccountTypeEntry,
    DeleteConfirmation,
    CustomCard
  },
  mixins: [ AccountTypeApi, tables, Access ],
  AccountTypePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        accountType: {
          isProcessing: false,
          fields: { ...accountTypeFields },
          states: { ...accountTypeFields },
          errors: { ...accountTypeFields },
        }
      },
      tables: {
        accountTypes: {
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
        accountType: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        accountType: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadAccountType()
  },
  methods: {
    loadAccountType() {
      const params = {
        paginate: false
      }
      const { accountTypes } = this.tables
      const { accountType } = this.paginations
      accountTypes.isBusy = true
      this.getAccountTypeList(params)
      .then(({ data }) => {
        accountTypes.items = data
        accountType.totalRows = data.length
        this.recordDetails(accountType)
        accountTypes.isBusy = false
      })
    },
    onAccountTypeEntry(){
      const { accountType, accountType: { fields } } = this.forms
      const { accountTypes } = this.tables
      accountType.isProcessing = true
      reset(accountType)
      if(this.entryMode == "Add"){
        this.addAccountType(fields)
          .then(({ data }) => {
            this.addRow(accountTypes, this.paginations.accountType, data)
            accountType.isProcessing = false
            showNotification(this, "success", "Account Type created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            accountType.isProcessing = false
            validate(accountType, errors)
          })
      }
      else {
        const { fields } = this.forms.accountType
        this.updateAccountType(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(accountTypes, data)
            accountType.isProcessing = false
            showNotification(this, "success", "Account Type updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            accountType.isProcessing = false
            validate(accountType, errors)
          })
      }
    },
    onAccountTypeDelete(){
      const { accountType, accountType: { fields: { id } } } = this.forms
      const { accountTypes } = this.tables
      accountType.isProcessing = true
      this.deleteAccountType(id)
        .then(({ data }) => {
          this.deleteRow(accountTypes, this.paginations.accountType, id)
          accountType.isProcessing = false
          showNotification(this, "success", "Account Type deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          accountType.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { accountType, accountType: { fields } } = this.forms
      accountType.isLoading = true
      copyValue(row.item, fields)
      reset(accountType)
      this.entryMode = "Edit"
      accountType.isLoading = false
    },
    setCreate() {
      const { accountType } = this.forms
      clearFields(accountType)
      reset(accountType)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.accountType
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>