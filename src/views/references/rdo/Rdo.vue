<template>
  <div>
    <CustomCard
      header="RDO"
      subHeader="List of all RDO.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.RDOPermissions.ADD.id)"
          placeholder="Search Rdo"
          buttonLabel="Create RDO"
          :filter="filters.rdo"
          :table="tables.rdos"
          :pagination="paginations.rdo">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.RDOPermissions.EDIT.id, $options.RDOPermissions.DELETE.id])" 
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
    <RdoEntry
      @save="onRdoEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.rdo"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onRdoDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.rdo.isProcessing"
      name="Rdo" />
  </div>
</template>
<script>
const rdoFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import RdoEntry from './RdoEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { RdoApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { RDOPermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    RdoEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ RdoApi, tables, Access ],
  RDOPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        rdo: {
          isProcessing: false,
          fields: { ...rdoFields },
          states: { ...rdoFields },
          errors: { ...rdoFields },
        }
      },
      tables: {
        rdos: {
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
        rdo: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        rdo: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadRdo()
  },
  methods: {
    loadRdo() {
      const params = {
        paginate: false
      }
      const { rdos } = this.tables
      const { rdo } = this.paginations
      rdos.isBusy = true
      this.getRdoList(params)
      .then(({ data }) => {
        rdos.items = data
        rdo.totalRows = data.length
        this.recordDetails(rdo)
        rdos.isBusy = false
      })
    },
    onRdoEntry(){
      const { rdo, rdo: { fields } } = this.forms
      const { rdos } = this.tables
      rdo.isProcessing = true
      reset(rdo)
      if(this.entryMode == "Add"){
        this.addRdo(fields)
          .then(({ data }) => {
            this.addRow(rdos, this.paginations.rdo, data)
            rdo.isProcessing = false
            showNotification(this, "success", "Rdo created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            rdo.isProcessing = false
            validate(rdo, errors)
          })
      }
      else {
        const { fields } = this.forms.rdo
        this.updateRdo(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(rdos, data)
            rdo.isProcessing = false
            showNotification(this, "success", "Rdo updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            rdo.isProcessing = false
            validate(rdo, errors)
          })
      }
    },
    onRdoDelete(){
      const { rdo, rdo: { fields: { id } } } = this.forms
      const { rdos } = this.tables
      rdo.isProcessing = true
      this.deleteRdo(id)
        .then(({ data }) => {
          this.deleteRow(rdos, this.paginations.rdo, id)
          rdo.isProcessing = false
          showNotification(this, "success", "Rdo deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          rdo.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { rdo, rdo: { fields } } = this.forms
      rdo.isLoading = true
      copyValue(row.item, fields)
      reset(rdo)
      this.entryMode = "Edit"
      rdo.isLoading = false
    },
    setCreate() {
      const { rdo } = this.forms
      clearFields(rdo)
      reset(rdo)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.rdo
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>