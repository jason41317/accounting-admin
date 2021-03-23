<template>
  <div>
    <CustomCard
      header="Service Category"
      subHeader="List of all service category.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          placeholder="Search Service Category"
          :noCreateButton="!isAccessible($options.ServiceCategoryPermissions.ADD.id)"
          buttonLabel="Create Service Category"
          :filter="filters.serviceCategory"
          :table="tables.serviceCategories"
          :pagination="paginations.serviceCategory">
          <template v-slot:cell(action)="data">
            <b-dropdown 
              v-if="isAccessible([$options.ServiceCategoryPermissions.EDIT.id, $options.ServiceCategoryPermissions.DELETE.id])"
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.ServiceCategoryPermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.ServiceCategoryPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <ServiceCategoryEntry
      @save="onServiceCategoryEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.serviceCategory"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onServiceCategoryDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.serviceCategory.isProcessing"
      name="Service Category" />
  </div>
</template>
<script>
const serviceCategoryFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import ServiceCategoryEntry from './ServiceCategoryEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { ServiceCategoryApi } from '../../../mixins/api'
import { ServiceCategoryPermissions } from '../../../helpers/enum'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    ServiceCategoryEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ ServiceCategoryApi, tables, Access ],
  ServiceCategoryPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        serviceCategory: {
          isProcessing: false,
          fields: { ...serviceCategoryFields },
          states: { ...serviceCategoryFields },
          errors: { ...serviceCategoryFields },
        }
      },
      tables: {
        serviceCategories: {
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
        serviceCategory: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        serviceCategory: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadServiceCategory()
  },
  methods: {
    loadServiceCategory() {
      const params = {
        paginate: false
      }
      const { serviceCategories } = this.tables
      const { serviceCategory } = this.paginations
      serviceCategories.isBusy = true
      this.getServiceCategoryList(params)
      .then(({ data }) => {
        serviceCategories.items = data
        serviceCategory.totalRows = data.length
        this.recordDetails(serviceCategory)
        serviceCategories.isBusy = false
      })
    },
    onServiceCategoryEntry(){
      const { serviceCategory, serviceCategory: { fields } } = this.forms
      const { serviceCategories } = this.tables
      serviceCategory.isProcessing = true
      reset(serviceCategory)
      if(this.entryMode == "Add"){
        this.addServiceCategory(fields)
          .then(({ data }) => {
            this.addRow(serviceCategories, this.paginations.serviceCategory, data)
            serviceCategory.isProcessing = false
            showNotification(this, "success", "Service Category created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            serviceCategory.isProcessing = false
            validate(serviceCategory, errors)
          })
      }
      else {
        const { fields } = this.forms.serviceCategory
        this.updateServiceCategory(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(serviceCategories, data)
            serviceCategory.isProcessing = false
            showNotification(this, "success", "Service Category updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            serviceCategory.isProcessing = false
            validate(serviceCategory, errors)
          })
      }
    },
    onServiceCategoryDelete(){
      const { serviceCategory, serviceCategory: { fields: { id } } } = this.forms
      const { serviceCategories } = this.tables
      serviceCategory.isProcessing = true
      this.deleteServiceCategory(id)
        .then(({ data }) => {
          this.deleteRow(serviceCategories, this.paginations.serviceCategory, id)
          serviceCategory.isProcessing = false
          showNotification(this, "success", "Service Category deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          serviceCategory.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { serviceCategory, serviceCategory: { fields } } = this.forms
      serviceCategory.isLoading = true
      copyValue(row.item, fields)
      reset(serviceCategory)
      this.entryMode = "Edit"
      serviceCategory.isLoading = false
    },
    setCreate() {
      const { serviceCategory } = this.forms
      clearFields(serviceCategory)
      reset(serviceCategory)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.serviceCategory
      fields.id = id
      this.showModalConfirmation = true
    },
    
  }
}
</script>