<template>
  <div>
    <CustomCard
      header="Charge"
      subHeader="List of all charge.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.ChargePermissions.ADD.id)"
          placeholder="Search Charge"
          buttonLabel="Create Charge"
          :filter="filters.charge"
          :table="tables.charges"
          :pagination="paginations.charge">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.ChargePermissions.EDIT.id, $options.ChargePermissions.DELETE.id])" 
              boundary="window"
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.ChargePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.ChargePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <ChargeEntry
      @save="onChargeEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.charge"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onChargeDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.charge.isProcessing"
      name="Charge" />
  </div>
</template>
<script>
const chargeFields = {
  id: null,
  name: null,
  description: null,
  accountTitleId: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import ChargeEntry from './ChargeEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { ChargeApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { ChargePermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    ChargeEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ ChargeApi, tables, Access ],
  ChargePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        charge: {
          isProcessing: false,
          fields: { ...chargeFields },
          states: { ...chargeFields },
          errors: { ...chargeFields },
        }
      },
      tables: {
        charges: {
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
              key: 'accountTitle.name',
              label: 'Account Title',
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
        charge: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        charge: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadCharge()
  },
  methods: {
    loadCharge() {
      const params = {
        paginate: false
      }
      const { charges } = this.tables
      const { charge } = this.paginations
      charges.isBusy = true
      this.getChargeList(params)
      .then(({ data }) => {
        charges.items = data
        charge.totalRows = data.length
        this.recordDetails(charge)
        charges.isBusy = false
      })
    },
    onChargeEntry(){
      const { charge, charge: { fields } } = this.forms
      const { charges } = this.tables
      charge.isProcessing = true
      reset(charge)
      if(this.entryMode == "Add"){
        this.addCharge(fields)
          .then(({ data }) => {
            this.addRow(charges, this.paginations.charge, data)
            charge.isProcessing = false
            showNotification(this, "success", "Charge created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            charge.isProcessing = false
            validate(charge, errors)
          })
      }
      else {
        const { fields } = this.forms.charge
        this.updateCharge(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(charges, data)
            charge.isProcessing = false
            showNotification(this, "success", "Charge updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            charge.isProcessing = false
            validate(charge, errors)
          })
      }
    },
    onChargeDelete(){
      const { charge, charge: { fields: { id } } } = this.forms
      const { charges } = this.tables
      charge.isProcessing = true
      this.deleteCharge(id)
        .then(({ data }) => {
          this.deleteRow(charges, this.paginations.charge, id)
          charge.isProcessing = false
          showNotification(this, "success", "Charge deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          charge.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { charge, charge: { fields } } = this.forms
      charge.isLoading = true
      copyValue(row.item, fields)
      reset(charge)
      this.entryMode = "Edit"
      charge.isLoading = false
    },
    setCreate() {
      const { charge } = this.forms
      clearFields(charge)
      reset(charge)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.charge
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>