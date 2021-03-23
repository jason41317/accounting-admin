<template>
  <div >
    <CustomCard
      header="Disbursements" 
      subHeader="List of all registered disbursements.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.DisbursementPermissions.ADD.id)"
          placeholder="Search Here..."
          :isServerSide="true"
          @search="loadDisbursements()"
          @paginate="loadDisbursements()"
          :filter="filters.disbursement"
          :table="tables.disbursements"
          :pagination="paginations.disbursement"
          buttonLabel="Create New Disbursement">

          <template v-slot:other-filter>
            <div class="status-filter__container">
              <label class="mr-2"> Status : </label>
              <v-select
                :options="options.disbursementStatuses.items"
                label="name"
                :disable="options.disbursementStatuses.isBusy"
                v-model="filters.disbursement.disbursementStatusId"
                :reduce="disbursementStatus => disbursementStatus.id"
                @input="loadDisbursements()"
                class="status-filter">
              </v-select>
            </div>
          </template>

          <template v-slot:cell(action)="data">
            <b-dropdown boundary="window" right variant="link" toggle-class="text-decoration-none" no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                @click="onToggleDetails(data)">
                {{ data.detailsShowing ? 'Hide Details' : 'View Details' }}
              </b-dropdown-item>
              <b-dropdown-item
                @click="setUpdate(data.item)"
                :disabled="showModalEntry"
                v-if="data.item.disbursementStatusId !== $options.DisbursementStatuses.APPROVED.id && isAccessible($options.DisbursementPermissions.EDIT.id)">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation"
                v-if="data.item.disbursementStatusId !== $options.DisbursementStatuses.APPROVED.id">
                Delete
              </b-dropdown-item>
              <b-dropdown-item
                @click="onPrintDisbursement(data.item.id)"
                v-if="data.item.disbursementStatusId === $options.DisbursementStatuses.APPROVED.id && isAccessible($options.DisbursementPermissions.DELETE.id)">
                Print
              </b-dropdown-item>
            </b-dropdown>
          </template>

          <template v-slot:head(client) >
            <CustomToolTip id="client-icon" label="CLIENT">
              <template #body>
              <div>
                <div>Line 1 - Represents the client name.</div>
                <div class="row__sub-label">Line 2 - Represents the client code.</div>
              </div>
              </template>
            </CustomToolTip>
          </template>
          
          <template v-slot:head(cheque) >
            <CustomToolTip id="contract-icon" label="CHEQUE">
              <template #body>
                <div>
                  <div>Line 1 - Represents the bank.</div>
                  <div class="row__sub-label">Line 2 - Represents the cheque no / cheque date.</div>
                </div>
              </template>
            </CustomToolTip>
          </template>

          <template v-slot:head(payee) >
            <CustomToolTip id="payment-info-icon" label="PAYEE">
              <template #body>
                <div>
                  <div>Line 1 - Represents the payee.</div>
                  <div class="row__sub-label">Line 2 - Represents the payee address.</div>
                </div>
              </template>
            </CustomToolTip>
          </template>

          <template v-slot:cell(payee)="data">
            <div>{{ data.item.payee }}</div>
            <div class="row__sub-label">{{ data.item.address }}</div>
          </template>
          
          <template v-slot:cell(cheque)="data">
            <div>{{ data.item.bank.name }}</div>
            <div class="row__sub-label">{{ `${data.item.chequeNo} / ${$options.format(new Date(data.item.chequeDate),'MMM dd yyyy')}` }}</div>
          </template>

          <template v-slot:cell(status)="data">
            <b-badge :variant="getDisbursementStatusVariant(data.item.disbursementStatusId)">
                {{ data.item.disbursementStatus.name }}</b-badge>
          </template>

          <template #row-details="data">
            <DisbursementRowDetail :disbursement="data.item" :loading="rowLoading" />
          </template>

          <template v-slot:cell(voucherNo)="data">
            <b-link @click="onToggleDetails(data)">{{ data.item.voucherNo }}</b-link>
          </template>
        
        </Full>
      </template>
    </CustomCard>

    <DisbursementEntry 
      v-if="showModalEntry"
      :show="showModalEntry"
      @onBack="showModalEntry=false" 
      @save="onDisbursementEntry()"
      :mode="entryMode"
      :form="forms.disbursement" />

    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onDisbursementDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.disbursement.isProcessing"
      name="Disbursement" />
  </div>
</template>

<script>

import { CustomToolTip, CustomCard, DeleteConfirmation } from "../../components";
import DisbursementEntry from './DisbursementEntry'
import { DisbursementApi } from '../../../mixins/api';
import { DisbursementStatuses, DisbursementPermissions } from "../../../helpers/enum";
import Full from "../../components/Full";
import { clearFields, formatNumber, reset, showNotification, validate } from '../../../helpers/forms';
import { copyValue } from '../../../helpers/extractor';
import { format } from 'date-fns'
import DisbursementRowDetail from '../../components/DisbursementRowDetail';
import Access from '../../../mixins/utils/Access';

const disbursementFields = {
  id: null,
  voucherNo: null,
  payee: null,
  address: null,
  bankId: null,
  chequeNo: null,
  chequeDate: null,
  chequeAmount: null,
  disbursementStatusId: null,
  disbursementDetails: null
}

export default {
  components: {
    Full,
    DisbursementEntry,
    CustomToolTip,
    CustomCard,
    DeleteConfirmation,
    DisbursementRowDetail
  },
  mixins: [ DisbursementApi, Access ],
  DisbursementStatuses,
  format,
  DisbursementPermissions,
  data() {
    return {
      showModalEntry: false,
      entryMode: 'Add',
      showModalConfirmation: false,
      rowLoading: false,
      forms: {
        disbursement: {
          isProcessing: false,
          fields: { ...disbursementFields },
          errors: { ...disbursementFields },
          states: { ...disbursementFields }      
        }
      },
      tables: {
        disbursements: {
          isBusy: false,
          fields: [
            {
              key: 'voucherNo',
              label: 'VOUCHER NO',
              thClass: 'align-middle',
              thStyle: { maxWidth: '20%' },
            },
            {
              key: 'payee',
              label: 'PAYEE',
              thClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'cheque',
              label: 'CHEQUE',
              thClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'chequeAmount',
              label: 'AMOUNT',
              thClass: 'align-middle text-right',
              tdClass: 'text-right',
              thStyle: { width: '15%' },
              formatter: (value) => {
                return formatNumber(value)
              }
            },
            {
              key: 'status',
              label: 'STATUS',
              thClass: 'align-middle text-center',
              tdClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'action',
              label: '',
              thStyle: { maxWidth: '20px', width:'20px' },
              thClass: 'align-middle',
            },
          ],
          items: []
        }
      },
      paginations: {
        disbursement: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        disbursement: {
          criteria: null,
          disbursementStatusId: this.$options.DisbursementStatuses.PENDING.id
        }
      },
      options: {
        disbursementStatuses: {
          isBusy: false,
          items: this.$options.DisbursementStatuses.values
        }
      }
    }
  },
  created() {
    this.loadDisbursements()
  },
  methods: {
    loadDisbursements() {
      const { disbursements } = this.tables
      const { disbursement, disbursement: { perPage, page } } = this.paginations
      const { disbursementStatusId } = this.filters.disbursement
      const params = { paginate: true, perPage, page, disbursementStatusId }
      disbursements.isBusy = true
      this.getDisbursementList(params).then(( { data } ) => {
        disbursements.items = data.data
        disbursement.from = data.meta.from
        disbursement.to = data.meta.to
        disbursement.totalRows = data.meta.total
        disbursements.isBusy = false
      }) 
    },
    setCreate() {
      const { disbursement, disbursement: { fields } } = this.forms
      const { DisbursementStatuses } = this.$options
      clearFields(disbursement)
      reset(disbursement)
      fields.disbursementStatusId = DisbursementStatuses.PENDING.id
      fields.disbursementDetails = []
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setUpdate(row) {
      const { disbursement, disbursement: { fields } } = this.forms
      clearFields(disbursement)
      reset(disbursement)
      fields.disbursementDetails = []
      this.getDisbursement(row.id).then(( { data }) => {
        copyValue(data, fields)
        this.entryMode = "Edit"
        this.showModalEntry = true
        // services.items = data.services
        // charges.items = data.charges
      })
    },
    setDelete(id) {
      const { fields } = this.forms.disbursement
      fields.id = id
      this.showModalConfirmation = true
    },
    onDisbursementEntry() {
      const { 
        disbursement,
        disbursement: { 
          fields: {
            disbursementDetails,
            ...fields 
          }
        } 
      } = this.forms

      disbursement.isProcessing = true

      const data = {
        ...fields,
        disbursementDetails: disbursementDetails,

      }

      //front end validation
      const validationResult = this.validateParticulars()
      if (!validationResult.validation) {
        showNotification(this, 'danger', validationResult.message, 1000 )
        setTimeout(() => {
          disbursement.isProcessing = false
          return
        }, 1000); 
      }

      reset(disbursement)
      
      if (this.entryMode === 'Add') {
        this.addDisbursement(data).then(({ data }) => {
          this.showModalEntry = false
          showNotification(this, "success", "Disbursement created successfully.")
          disbursement.isProcessing = false
          this.loadDisbursements()
        })
        .catch(error => {
          const errors = error.response.data.errors
          disbursement.isProcessing = false
          validate(disbursement, errors)
        })
      } else {
        
        this.updateDisbursement(data, fields.id).then(({ data }) => {
          this.showModalEntry = false
          showNotification(this, "success", "Disbursement updated successfully.")
          disbursement.isProcessing = false
          this.loadDisbursements()
        })
        .catch(error => {
          const errors = error.response.data.errors
          disbursement.isProcessing = false
          validate(disbursement, errors)
        })
      }
    },
    onDisbursementDelete() {
      const { disbursement, disbursement: { fields: { id } } } = this.forms
      disbursement.isProcessing = true
      this.deleteDisbursement(id)
        .then(({ data }) => {
          this.loadDisbursements()
          disbursement.isProcessing = false
          showNotification(this, "success", "Disbursement deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          disbursement.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    getDisbursementStatusVariant(disbursementStatusId) {
      const { DisbursementStatuses } = this.$options
      if (disbursementStatusId === DisbursementStatuses.PENDING.id) {
        return 'warning'
      }
      else if (disbursementStatusId === DisbursementStatuses.APPROVED.id) {
        return 'success'
      }
      else {
        return 'danger'
      }
    },
    validateParticulars(){
      const { disbursementDetails, chequeAmount } = this.forms.disbursement.fields

      if(disbursementDetails.length === 0) {
        return { validation: false, message: 'Unable to save, atleast 1 particular is required. Please make sure you inputted the correct data.'}
      }

      const result = disbursementDetails.find(d => {
        return d.particular === '' || d.particular === null
      })

      if(result) {
        //found invalid row
        return { validation: false, message: 'Unable to save, there are invalid rows. Please make sure you inputted the correct data.'}
      }

   

      const totalParticulars = disbursementDetails.reduce((total, item) => total += Number(item.amount), 0); 
      if(totalParticulars !== chequeAmount) {
        //found invalid row
        return { validation: false, message: 'Unable to save, cheque amount and total amount of particulars must be equal.'}
      }

      return { validation: true, message: '' };
    },
    onToggleDetails(row) {
      const disbursementId = row.item.id
      if(!row.detailsShowing) {
        this.rowLoading = true
        this.getDisbursement(disbursementId).then(({ data }) => {
          copyValue(data, row.item)
          this.$set(row.item, 'approvedByPersonnel', data.approvedByPersonnel)
          this.$set(row.item, 'disbursementDetails', data.disbursementDetails)
          this.$set(row.item, 'bank', data.bank)
          this.rowLoading = false 
        })
      }
      row.toggleDetails()
    }
  },
  computed: {
    defaultMonth() {
      return new Date().getMonth() + 1
    },
    defaultYear() {
      return new Date().getFullYear()
    }
  }
}   
</script>

<style lang="scss" scoped>
  .month-filter {
    display: flex;
    align-items: center;
  }

  .row__sub-label {
    font-size: 8pt!important;
    color: gray!important;
  }

  .status-filter__container {
    display: flex;
    align-items: center;
    margin: 0 10px;
    justify-content: flex-end;
  }

  .status-filter {
    width: 200px;
  }
</style>
