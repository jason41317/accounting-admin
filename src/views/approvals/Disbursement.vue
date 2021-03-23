<template>
  <div class="disbursement__main-container">
    <loading
      :can-cancel="false" 
      :is-full-page="false"
      :active.sync="isLoading"
      loader="dots"
      color="#0A76EC" >
    </loading>
    <Full
      @create="setCreate()"
      placeholder="Search Here..."
      :isServerSide="true"
      @search="loadDisbursements()"
      @paginate="loadDisbursements()"
      :filter="filters.disbursement"
      :table="tables.disbursements"
      :pagination="paginations.disbursement"
      buttonLabel="Create New Disbursement"
      noCreateButton>
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
            @click="setApproval(data.item.id)"
            :disabled="showApproval"
            v-if="data.item.disbursementStatusId === $options.DisbursementStatuses.PENDING.id">
            Approve
          </b-dropdown-item>
          <b-dropdown-item
            @click="setReject(data.item.id)"
            :disabled="showReject"
            v-if="data.item.disbursementStatusId === $options.DisbursementStatuses.PENDING.id">
            Reject
          </b-dropdown-item>
          <b-dropdown-item
            @click="onPrintDisbursement(data.item.id)"
            v-if="data.item.disbursementStatusId === $options.DisbursementStatuses.APPROVED.id">
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

      <template v-slot:cell(voucherNo)="data">
        <b-link @click="onToggleDetails(data)">{{ data.item.voucherNo }}</b-link>
      </template>

      <template #row-details="data">
        <DisbursementRowDetail 
          :disbursement="data.item" 
          :loading="rowLoading"
          :showApproval="true"
          @approve="setApproval($event)" />
      </template>

    </Full>
    <CustomModal 
        :show="showApproval"
        size="sm"
        @closeModal="showApproval=false">
        <template #modal-header>
          Approving Disbursement
        </template>
        <template #modal-body>
          <b-form-group>
            <label class="required">Notes</label>
            <b-form-textarea
              debounce="250"
              type="text"
              ref="name"
              rows="4" 
              v-model="forms.disbursement.fields.approvedNotes"
              :state="forms.disbursement.states.approvedNotes"/>
            <b-form-invalid-feedback>
              {{forms.disbursement.errors.approvedNotes}}
            </b-form-invalid-feedback>
          </b-form-group>
        </template>
        <template #modal-footer>
          <div class="button-footer">
            <SaveButton @click="onApprove()" label="Approve" :disabled="forms.disbursement.isProcessing" :isProcessing="forms.disbursement.isProcessing" />
            <CloseButton @click="showApproval=false" class="ml-2"  :disabled="forms.disbursement.isProcessing"/>
          </div>
        </template>
    </CustomModal>
    <CustomModal 
        :show="showReject"
        size="sm"
        @closeModal="showReject=false">
        <template #modal-header>
          Rejecting Disbursement
        </template>
        <template #modal-body>
          <b-form-group>
            <label class="required">Notes</label>
            <b-form-textarea
              debounce="250"
              type="text"
              ref="name"
              rows="4"
              v-model="forms.disbursement.fields.rejectedNotes"
              :state="forms.disbursement.states.rejectedNotes" />
            <b-form-invalid-feedback>
              {{forms.disbursement.errors.rejectedNotes}}
            </b-form-invalid-feedback>
          </b-form-group>
        </template>
        <template #modal-footer>
          <div class="button-footer">
            <SaveButton @click="onReject()" label="Reject" :disabled="forms.disbursement.isProcessing" :isProcessing="forms.disbursement.isProcessing" />
            <CloseButton @click="showReject=false" class="ml-2"  :disabled="forms.disbursement.isProcessing"/>
          </div>
        </template>
    </CustomModal>
  </div>
</template>

<script>

import { CustomToolTip, CustomModal, SaveButton, CloseButton } from "../components";
import { DisbursementApi } from '../../mixins/api';
import { DisbursementStatuses } from "../../helpers/enum";
import Full from "../components/Full";
import { clearFields, formatNumber, reset, showNotification, validate } from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
import { format } from 'date-fns'
import DisbursementRowDetail from '../components/DisbursementRowDetail';

const disbursementFields = {
  id: null,
  disbursementStatusId: null,
  approvedNotes: null,
  rejectedNotes: null
}

export default {
  components: {
    Full,
    CustomToolTip,
    CustomModal,
    SaveButton,
    CloseButton,
    DisbursementRowDetail
  },
  mixins: [ DisbursementApi ],
  DisbursementStatuses,
  format,
  data() {
    return {
      isLoading: false,
      showApproval: false,
      showReject: false,
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
              thClass: 'align-middle',
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
        personnels: {
          isBusy: false,
          items: []
        },
        disbursementStatuses: {
          isBusy: false,
          items: this.$options.DisbursementStatuses.values
        }
      }
    }
  },
  created() {
    this.isLoading = true
    this.loadDisbursements()
    this.isLoading = false
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
    setApproval(disbursementId) {
      const { disbursement, disbursement: { fields } } = this.forms
      const { DisbursementStatuses } = this.$options
      clearFields(disbursement)
      reset(disbursement)
      fields.id = disbursementId
      fields.disbursementStatusId = DisbursementStatuses.APPROVED.id
      this.showApproval = true
    },
    setReject(disbursementId) {
      const { disbursement, disbursement: { fields } } = this.forms
      const { DisbursementStatuses } = this.$options
      clearFields(disbursement)
      reset(disbursement)
      fields.id = disbursementId
      fields.disbursementStatusId = DisbursementStatuses.APPROVED.id
      this.showReject = true
    },
    onApprove() {
      const { disbursement, disbursement: { fields: { id: disburesmentId, approvedNotes, disbursementStatusId }} } = this.forms

      const data = { approvedNotes, disbursementStatusId }

      disbursement.isProcessing = true
      this.updateDisbursement(data, disburesmentId).then(({ data }) => {
        this.loadDisbursements()
        disbursement.isProcessing = false
        this.showApproval = false
      }).catch(error => {
        const errors = error.response.data.errors
        disbursement.isProcessing = false
        validate(disbursement, errors)
      })
    },
    onReject() {
      console.log('onReject')
    },
    onPrintDisbursement(disbursementId) {
      console.log('onPrintDisbursement')
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
  }
}
</script>

<style lang="scss">
  .disbursement__main-container {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .row__sub-label {
    font-size: 8pt!important;
    color: gray!important;
  }

  .status-filter__container {
    display: flex;
    align-items: center;
  }

  .status-filter {
    width: 200px;
  }
</style>