<template>
  <div>
    <CustomCard
      header="Account Title"
      subHeader="List of all account title.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.AccountTitlePermissions.ADD.id)"
          placeholder="Search Account Title"
          buttonLabel="Create Account Title"
          :filter="filters.accountTitle"
          :table="tables.accountTitles"
          :pagination="paginations.accountTitle">
          <template v-slot:cell(action)="data">
            <b-dropdown 
              v-if="isAccessible([$options.AccountTitlePermissions.EDIT.id, $options.AccountTitlePermissions.DELETE.id])"
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.AccountTitlePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.AccountTitlePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <AccountTitleEntry
      @save="onAccountTitleEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.accountTitle"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onAccountTitleDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.accountTitle.isProcessing"
      name="Account Title" />
  </div>
</template>
<script>
const accountTitleFields = {
  id: null,
  code: null,
  name: null,
  description: null,
  accountClassId: null,
  parentAccountId: null
}
// import { bTreeView } from 'bootstrap-vue-treeview'
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import AccountTitleEntry from './AccountTitleEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { AccountTitleApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { AccountTitlePermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    AccountTitleEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ AccountTitleApi, tables, Access ],
  AccountTitlePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        accountTitle: {
          isProcessing: false,
          fields: { ...accountTitleFields },
          states: { ...accountTitleFields },
          errors: { ...accountTitleFields },
        }
      },
      treeData: [{"id": 2, "name": "Venus" , "children": [{"id": 3, "name": "Neptune"}, {"id": 4, "name": "Stratus"} ] } ],
      tables: {
        accountTitles: {
          isBusy: false,
          fields: [
            {
              key: 'code',
              label: 'Code',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
              sortable: true,
            },
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '22%' },
              sortable: true,
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: '22%' },
              sortable: true
            },
            {
              key: 'parentAccountTitle.name',
              label: 'Parent',
              tdClass: 'align-middle',
              thStyle: { width: '22%' },
              sortable: true
            },
            {
              key: 'accountClass.name',
              label: 'Account Class',
              tdClass: 'align-middle',
              thStyle: { width: '22%' },
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
        accountTitle: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        accountTitle: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadAccountTitle()
  },
  methods: {
    loadAccountTitle() {
      const params = {
        paginate: false
      }
      const { accountTitles } = this.tables
      const { accountTitle } = this.paginations
      accountTitles.isBusy = true
      this.getAccountTitleList(params)
      .then(({ data }) => {
        accountTitles.items = data
        accountTitle.totalRows = data.length
        this.recordDetails(accountTitle)
        accountTitles.isBusy = false
      })
    },
    onAccountTitleEntry(){
      const { accountTitle, accountTitle: { fields } } = this.forms
      const { accountTitles } = this.tables
      accountTitle.isProcessing = true
      reset(accountTitle)
      if(this.entryMode == "Add"){
        this.addAccountTitle(fields)
          .then(({ data }) => {
            this.addRow(accountTitles, this.paginations.accountTitle, data)
            accountTitle.isProcessing = false
            showNotification(this, "success", "Account Title created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            accountTitle.isProcessing = false
            validate(accountTitle, errors)
          })
      }
      else {
        const { fields } = this.forms.accountTitle
        this.updateAccountTitle(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(accountTitles, data)
            accountTitle.isProcessing = false
            showNotification(this, "success", "Account Title updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            accountTitle.isProcessing = false
            validate(accountTitle, errors)
          })
      }
    },
    onAccountTitleDelete(){
      const { accountTitle, accountTitle: { fields: { id } } } = this.forms
      const { accountTitles } = this.tables
      accountTitle.isProcessing = true
      this.deleteAccountTitle(id)
        .then(({ data }) => {
          this.deleteRow(accountTitles, this.paginations.accountTitle, id)
          accountTitle.isProcessing = false
          showNotification(this, "success", "Account Title deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          accountTitle.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { accountTitle, accountTitle: { fields } } = this.forms
      accountTitle.isLoading = true
      copyValue(row.item, fields)
      reset(accountTitle)
      this.entryMode = "Edit"
      accountTitle.isLoading = false
    },
    setCreate() {
      const { accountTitle } = this.forms
      clearFields(accountTitle)
      reset(accountTitle)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.accountTitle
      fields.id = id
      this.showModalConfirmation = true
    },
    test(event) {
      alert(event)
    }
  }
}
</script>
<style>
  .tree-view {
    width: 350px;
    margin-right: 10px;
    padding: 5px;
  }
</style>