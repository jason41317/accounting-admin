<template>
  <div>
    <CustomCard
      header="Service"
      subHeader="List of all service.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.ServicePermissions.ADD.id)"
          placeholder="Search Service"
          buttonLabel="Create Service"
          :filter="filters.service"
          :table="tables.services"
          :pagination="paginations.service">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.ServicePermissions.EDIT.id, $options.ServicePermissions.DELETE.id])" 
              boundary="window"
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.ServicePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.ServicePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <ServiceEntry
      @save="onServiceEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.service"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onServiceDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.service.isProcessing"
      name="Service" />
  </div>
</template>
<script>
const serviceFields = {
  id: null,
  code: null,
  name: null,
  description: null,
  serviceCategoryId: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import ServiceEntry from './ServiceEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { ServiceApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
import { ServicePermissions } from '../../../helpers/enum'
export default {
  components: {
    Full,
    ServiceEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ ServiceApi, tables, Access ],
  ServicePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        service: {
          isProcessing: false,
          fields: { ...serviceFields },
          states: { ...serviceFields },
          errors: { ...serviceFields },
        }
      },
      tables: {
        services: {
          isBusy: false,
          fields: [
            {
              key: 'code',
              label: 'Code',
              tdClass: 'align-middle',
              sortable: true,
            },
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
              key: 'serviceCategory.name',
              label: 'Service Category',
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
        service: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        service: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadService()
  },
  methods: {
    loadService() {
      const params = {
        paginate: false
      }
      const { services } = this.tables
      const { service } = this.paginations
      services.isBusy = true
      this.getServiceList(params)
      .then(({ data }) => {
        services.items = data
        service.totalRows = data.length
        this.recordDetails(service)
        services.isBusy = false
      })
    },
    onServiceEntry(){
      const { service, service: { fields } } = this.forms
      const { services } = this.tables
      service.isProcessing = true
      reset(service)
      if(this.entryMode == "Add"){
        this.addService(fields)
          .then(({ data }) => {
            this.addRow(services, this.paginations.service, data)
            service.isProcessing = false
            showNotification(this, "success", "Service created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            service.isProcessing = false
            validate(service, errors)
          })
      }
      else {
        const { fields } = this.forms.service
        this.updateService(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(services, data)
            service.isProcessing = false
            showNotification(this, "success", "Service updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            service.isProcessing = false
            validate(service, errors)
          })
      }
    },
    onServiceDelete(){
      const { service, service: { fields: { id } } } = this.forms
      const { services } = this.tables
      service.isProcessing = true
      this.deleteService(id)
        .then(({ data }) => {
          this.deleteRow(services, this.paginations.service, id)
          service.isProcessing = false
          showNotification(this, "success", "Service deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          service.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { service, service: { fields } } = this.forms
      service.isLoading = true
      copyValue(row.item, fields)
      reset(service)
      this.entryMode = "Edit"
      service.isLoading = false
    },
    setCreate() {
      const { service } = this.forms
      clearFields(service)
      reset(service)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.service
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>