<template>
  <div>
    <CustomCard
      header="Tax Type"
      subHeader="List of all tax type.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.TaxTypePermissions.ADD.id)"
          placeholder="Search Tax Type"
          buttonLabel="Create Tax Type"
          :filter="filters.taxType"
          :table="tables.taxTypes"
          :pagination="paginations.taxType">
          <template v-slot:cell(action)="data">
            <b-dropdown 
              v-if="isAccessible([$options.TaxTypePermissions.EDIT.id, $options.TaxTypePermissions.DELETE.id])"
              boundary="window"
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.TaxTypePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.TaxTypePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <TaxTypeEntry
      @save="onTaxTypeEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.taxType"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onTaxTypeDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.taxType.isProcessing"
      name="Tax Type" />
  </div>
</template>
<script>
const taxTypeFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import TaxTypeEntry from './TaxTypeEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { TaxTypeApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { TaxTypePermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    TaxTypeEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ TaxTypeApi, tables, Access ],
  TaxTypePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        taxType: {
          isProcessing: false,
          fields: { ...taxTypeFields },
          states: { ...taxTypeFields },
          errors: { ...taxTypeFields },
        }
      },
      tables: {
        taxTypes: {
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
        taxType: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        taxType: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadTaxType()
  },
  methods: {
    loadTaxType() {
      const params = {
        paginate: false
      }
      const { taxTypes } = this.tables
      const { taxType } = this.paginations
      taxTypes.isBusy = true
      this.getTaxTypeList(params)
      .then(({ data }) => {
        taxTypes.items = data
        taxType.totalRows = data.length
        this.recordDetails(taxType)
        taxTypes.isBusy = false
      })
    },
    onTaxTypeEntry(){
      const { taxType, taxType: { fields } } = this.forms
      const { taxTypes } = this.tables
      taxType.isProcessing = true
      reset(taxType)
      if(this.entryMode == "Add"){
        this.addTaxType(fields)
          .then(({ data }) => {
            this.addRow(taxTypes, this.paginations.taxType, data)
            taxType.isProcessing = false
            showNotification(this, "success", "Tax Type created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            taxType.isProcessing = false
            validate(taxType, errors)
          })
      }
      else {
        const { fields } = this.forms.taxType
        this.updateTaxType(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(taxTypes, data)
            taxType.isProcessing = false
            showNotification(this, "success", "Tax Type updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            taxType.isProcessing = false
            validate(taxType, errors)
          })
      }
    },
    onTaxTypeDelete(){
      const { taxType, taxType: { fields: { id } } } = this.forms
      const { taxTypes } = this.tables
      taxType.isProcessing = true
      this.deleteTaxType(id)
        .then(({ data }) => {
          this.deleteRow(taxTypes, this.paginations.taxType, id)
          taxType.isProcessing = false
          showNotification(this, "success", "Tax Type deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          taxType.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { taxType, taxType: { fields } } = this.forms
      taxType.isLoading = true
      copyValue(row.item, fields)
      reset(taxType)
      this.entryMode = "Edit"
      taxType.isLoading = false
    },
    setCreate() {
      const { taxType } = this.forms
      clearFields(taxType)
      reset(taxType)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.taxType
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>