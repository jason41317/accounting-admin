<template>
  <div>
    <CustomCard
      header="Location"
      subHeader="List of all location.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.LocationPermissions.ADD.id)"
          placeholder="Search Location"
          buttonLabel="Create Location"
          :filter="filters.location"
          :table="tables.locations"
          :pagination="paginations.location">
          <template v-slot:cell(action)="data">
            <b-dropdown 
              v-if="isAccessible($options.RDOPermissions.EDIT.id, $options.RDOPermissions.DELETE.id)"
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.RDOPermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.RDOPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <LocationEntry
      @save="onLocationEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.location"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onLocationDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.location.isProcessing"
      name="Location" />
  </div>
</template>
<script>
const locationFields = {
  id: null,
  name: null,
  description: null,
  rdoId: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import LocationEntry from './LocationEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { LocationApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { LocationPermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    LocationEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ LocationApi, tables, Access ],
  LocationPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        location: {
          isProcessing: false,
          fields: { ...locationFields },
          states: { ...locationFields },
          errors: { ...locationFields },
        }
      },
      tables: {
        locations: {
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
              key: 'rdo.name',
              label: 'RDO',
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
        location: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        location: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadLocation()
  },
  methods: {
    loadLocation() {
      const params = {
        paginate: false
      }
      const { locations } = this.tables
      const { location } = this.paginations
      locations.isBusy = true
      this.getLocationList(params)
      .then(({ data }) => {
        locations.items = data
        location.totalRows = data.length
        this.recordDetails(location)
        locations.isBusy = false
      })
    },
    onLocationEntry(){
      const { location, location: { fields } } = this.forms
      const { locations } = this.tables
      location.isProcessing = true
      reset(location)
      if(this.entryMode == "Add"){
        this.addLocation(fields)
          .then(({ data }) => {
            this.addRow(locations, this.paginations.location, data)
            location.isProcessing = false
            showNotification(this, "success", "Location created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            location.isProcessing = false
            validate(location, errors)
          })
      }
      else {
        const { fields } = this.forms.location
        this.updateLocation(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(locations, data)
            location.isProcessing = false
            showNotification(this, "success", "Location updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            location.isProcessing = false
            validate(location, errors)
          })
      }
    },
    onLocationDelete(){
      const { location, location: { fields: { id } } } = this.forms
      const { locations } = this.tables
      location.isProcessing = true
      this.deleteLocation(id)
        .then(({ data }) => {
          this.deleteRow(locations, this.paginations.location, id)
          location.isProcessing = false
          showNotification(this, "success", "Location deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          location.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { location, location: { fields } } = this.forms
      location.isLoading = true
      copyValue(row.item, fields)
      reset(location)
      this.entryMode = "Edit"
      location.isLoading = false
    },
    setCreate() {
      const { location } = this.forms
      clearFields(location)
      reset(location)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.location
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>