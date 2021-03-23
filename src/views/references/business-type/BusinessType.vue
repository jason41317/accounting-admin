<template>
  <div>
    <CustomCard
      header="Business Type"
      subHeader="List of all business type.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.BusinessTypePermissions.ADD.id)"
          placeholder="Search Business Type"
          buttonLabel="Create Business Type"
          :filter="filters.businessType"
          :table="tables.businessTypes"
          :pagination="paginations.businessType">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.BusinessTypePermissions.EDIT.id, $options.BusinessTypePermissions.DELETE.id])" 
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.BusinessTypePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.BusinessTypePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <BusinessTypeEntry
      @save="onBusinessTypeEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.businessType"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onBusinessTypeDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.businessType.isProcessing"
      name="Business Type" />
  </div>
</template>
<script>
const businessTypeFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import BusinessTypeEntry from './BusinessTypeEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { BusinessTypeApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
import { BusinessTypePermissions } from '../../../helpers/enum'
export default {
  components: {
    Full,
    BusinessTypeEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ BusinessTypeApi, tables, Access ],
  BusinessTypePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        businessType: {
          isProcessing: false,
          fields: { ...businessTypeFields },
          states: { ...businessTypeFields },
          errors: { ...businessTypeFields },
        }
      },
      tables: {
        businessTypes: {
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
        businessType: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        businessType: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadBusinessType()
  },
  methods: {
    loadBusinessType() {
      const params = {
        paginate: false
      }
      const { businessTypes } = this.tables
      const { businessType } = this.paginations
      businessTypes.isBusy = true
      this.getBusinessTypeList(params)
      .then(({ data }) => {
        businessTypes.items = data
        businessType.totalRows = data.length
        this.recordDetails(businessType)
        businessTypes.isBusy = false
      })
    },
    onBusinessTypeEntry(){
      const { businessType, businessType: { fields } } = this.forms
      const { businessTypes } = this.tables
      businessType.isProcessing = true
      reset(businessType)
      if(this.entryMode == "Add"){
        this.addBusinessType(fields)
          .then(({ data }) => {
            this.addRow(businessTypes, this.paginations.businessType, data)
            businessType.isProcessing = false
            showNotification(this, "success", "Business Type created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            businessType.isProcessing = false
            validate(businessType, errors)
          })
      }
      else {
        const { fields } = this.forms.businessType
        this.updateBusinessType(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(businessTypes, data)
            businessType.isProcessing = false
            showNotification(this, "success", "Business Type updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            businessType.isProcessing = false
            validate(businessType, errors)
          })
      }
    },
    onBusinessTypeDelete(){
      const { businessType, businessType: { fields: { id } } } = this.forms
      const { businessTypes } = this.tables
      businessType.isProcessing = true
      this.deleteBusinessType(id)
        .then(({ data }) => {
          this.deleteRow(businessTypes, this.paginations.businessType, id)
          businessType.isProcessing = false
          showNotification(this, "success", "Business Type deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          businessType.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { businessType, businessType: { fields } } = this.forms
      businessType.isLoading = true
      copyValue(row.item, fields)
      reset(businessType)
      this.entryMode = "Edit"
      businessType.isLoading = false
    },
    setCreate() {
      const { businessType } = this.forms
      clearFields(businessType)
      reset(businessType)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.businessType
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>