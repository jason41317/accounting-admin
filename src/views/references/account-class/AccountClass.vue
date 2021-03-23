<template>
  <div>
    <CustomCard
      header="Account Class"
      subHeader="List of all account class.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.AccountClassPermissions.ADD.id)"
          placeholder="Search Account Class"
          buttonLabel="Create Account Class"
          :filter="filters.accountClass"
          :table="tables.accountClasses"
          :pagination="paginations.accountClass">
          <template v-slot:cell(action)="data">
            <b-dropdown 
              v-if="isAccessible([$options.AccountClassPermissions.EDIT.id, $options.AccountClassPermissions.DELETE.id])"
              boundary="window" 
              right
              variant="link" 
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.AccountClassPermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.AccountClassPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <AccountClassEntry
      @save="onAccountClassEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.accountClass"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onAccountClassDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.accountClass.isProcessing"
      name="Account Class" />
  </div>
</template>
<script>
const accountClassFields = {
  id: null,
  name: null,
  description: null,
  accountTypeId: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import AccountClassEntry from './AccountClassEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { AccountClassApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { AccountClassPermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    CustomCard,
    AccountClassEntry,
    DeleteConfirmation
  },
  mixins: [ AccountClassApi, tables, Access ],
  AccountClassPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        accountClass: {
          isProcessing: false,
          fields: { ...accountClassFields },
          states: { ...accountClassFields },
          errors: { ...accountClassFields },
        }
      },
      tables: {
        accountClasses: {
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
              key: 'accountType.name',
              label: 'Account Type',
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
        accountClass: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        accountClass: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadAccountClass()
  },
  methods: {
    loadAccountClass() {
      const params = {
        paginate: false
      }
      const { accountClasses } = this.tables
      const { accountClass } = this.paginations
      accountClasses.isBusy = true
      this.getAccountClassList(params)
      .then(({ data }) => {
        accountClasses.items = data
        accountClass.totalRows = data.length
        this.recordDetails(accountClass)
        accountClasses.isBusy = false
      })
    },
    onAccountClassEntry(){
      const { accountClass, accountClass: { fields } } = this.forms
      const { accountClasses } = this.tables
      accountClass.isProcessing = true
      reset(accountClass)
      if(this.entryMode == "Add"){
        this.addAccountClass(fields)
          .then(({ data }) => {
            this.addRow(accountClasses, this.paginations.accountClass, data)
            accountClass.isProcessing = false
            showNotification(this, "success", "Account Class created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            accountClass.isProcessing = false
            validate(accountClass, errors)
          })
      }
      else {
        const { fields } = this.forms.accountClass
        this.updateAccountClass(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(accountClasses, data)
            accountClass.isProcessing = false
            showNotification(this, "success", "Account Class updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            accountClass.isProcessing = false
            validate(accountClass, errors)
          })
      }
    },
    onAccountClassDelete(){
      const { accountClass, accountClass: { fields: { id } } } = this.forms
      const { accountClasses } = this.tables
      accountClass.isProcessing = true
      this.deleteAccountClass(id)
        .then(({ data }) => {
          this.deleteRow(accountClasses, this.paginations.accountClass, id)
          accountClass.isProcessing = false
          showNotification(this, "success", "Account Class deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          accountClass.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { accountClass, accountClass: { fields } } = this.forms
      accountClass.isLoading = true
      copyValue(row.item, fields)
      reset(accountClass)
      this.entryMode = "Edit"
      accountClass.isLoading = false
    },
    setCreate() {
      const { accountClass } = this.forms
      clearFields(accountClass)
      reset(accountClass)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.accountClass
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>