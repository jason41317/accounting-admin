<template>
  <div>
    <CustomCard
      header="Business Style"
      subHeader="List of all business style.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.BusinessStylePermissions.ADD.id)"
          placeholder="Search Business Style"
          buttonLabel="Create Business Style"
          :filter="filters.businessStyle"
          :table="tables.businessStyles"
          :pagination="paginations.businessStyle">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.BusinessStylePermissions.EDIT.id,$options.BusinessStylePermissions.DELETE.id])"
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.BusinessStylePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.BusinessStylePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <BusinessStyleEntry
      @save="onBusinessStyleEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.businessStyle"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onBusinessStyleDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.businessStyle.isProcessing"
      name="Business Style" />
  </div>
</template>
<script>
const businessStyleFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import BusinessStyleEntry from './BusinessStyleEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { BusinessStyleApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
import { BusinessStylePermissions } from '../../../helpers/enum'
export default {
  components: {
    Full,
    BusinessStyleEntry,
    DeleteConfirmation,
    CustomCard
  },
  mixins: [ BusinessStyleApi, tables, Access ],
  BusinessStylePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        businessStyle: {
          isProcessing: false,
          fields: { ...businessStyleFields },
          states: { ...businessStyleFields },
          errors: { ...businessStyleFields },
        }
      },
      tables: {
        businessStyles: {
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
        businessStyle: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        businessStyle: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadBusinessStyle()
  },
  methods: {
    loadBusinessStyle() {
      const params = {
        paginate: false
      }
      const { businessStyles } = this.tables
      const { businessStyle } = this.paginations
      businessStyles.isBusy = true
      this.getBusinessStyleList(params)
      .then(({ data }) => {
        businessStyles.items = data
        businessStyle.totalRows = data.length
        this.recordDetails(businessStyle)
        businessStyles.isBusy = false
      })
    },
    onBusinessStyleEntry(){
      const { businessStyle, businessStyle: { fields } } = this.forms
      const { businessStyles } = this.tables
      businessStyle.isProcessing = true
      reset(businessStyle)
      if(this.entryMode == "Add"){
        this.addBusinessStyle(fields)
          .then(({ data }) => {
            this.addRow(businessStyles, this.paginations.businessStyle, data)
            businessStyle.isProcessing = false
            showNotification(this, "success", "Business Style created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            businessStyle.isProcessing = false
            validate(businessStyle, errors)
          })
      }
      else {
        const { fields } = this.forms.businessStyle
        this.updateBusinessStyle(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(businessStyles, data)
            businessStyle.isProcessing = false
            showNotification(this, "success", "Business Style updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            businessStyle.isProcessing = false
            validate(businessStyle, errors)
          })
      }
    },
    onBusinessStyleDelete(){
      const { businessStyle, businessStyle: { fields: { id } } } = this.forms
      const { businessStyles } = this.tables
      businessStyle.isProcessing = true
      this.deleteBusinessStyle(id)
        .then(({ data }) => {
          this.deleteRow(businessStyles, this.paginations.businessStyle, id)
          businessStyle.isProcessing = false
          showNotification(this, "success", "Business Style deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          businessStyle.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { businessStyle, businessStyle: { fields } } = this.forms
      businessStyle.isLoading = true
      copyValue(row.item, fields)
      reset(businessStyle)
      this.entryMode = "Edit"
      businessStyle.isLoading = false
    },
    setCreate() {
      const { businessStyle } = this.forms
      clearFields(businessStyle)
      reset(businessStyle)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.businessStyle
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>