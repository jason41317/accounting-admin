<template>
  <div class="collection__main-container">
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
      @search="loadPayments()"
      @paginate="loadPayments()"
      :filter="filters.payment"
      :table="tables.payments"
      :pagination="paginations.payment"
      buttonLabel="Create New Payment"
      noCreateButton>
      <template v-slot:other-filter>
        <div class="status-filter__container">
          <label class="mr-2"> Status : </label>
          <v-select
            :options="options.paymentStatuses.items"
            label="name"
            :disable="options.paymentStatuses.isBusy"
            v-model="filters.payment.paymentStatusId"
            :reduce="paymentStatus => paymentStatus.id"
            @input="loadPayments()"
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
            v-if="data.item.paymentStatusId === $options.PaymentStatuses.PENDING.id">
            Approve
          </b-dropdown-item>
          <!-- <b-dropdown-item
            @click="setReject(data.item.id)"
            :disabled="showReject"
            v-if="data.item.disbursementStatusId === $options.DisbursementStatuses.PENDING.id">
            Reject
          </b-dropdown-item> -->
          <!-- <b-dropdown-item
            @click="onPrintDisbursement(data.item.id)"
            v-if="data.item.disbursementStatusId === $options.DisbursementStatuses.APPROVED.id">
            Print
          </b-dropdown-item> -->
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

      <template v-slot:head(contract) >
        <CustomToolTip id="contract-icon" label="CONTRACT">
          <template #body>
            <div>
              <div>Line 1 - Represents the tradename.</div>
              <div class="row__sub-label">Line 2 - Represents the contract code.</div>
            </div>
          </template>
        </CustomToolTip>
      </template>

      <template v-slot:head(paymentInfo) >
        <CustomToolTip id="payment-info-icon" label="PAYMENT INFO">
          <template #body>
            <div>
              <div>Line 1 - Represents the payment type.</div>
              <div class="row__sub-label">Line 2 - Represents the payment date.</div>
            </div>
          </template>
        </CustomToolTip>
      </template>

      <template v-slot:cell(paymentInfo)="data">
        <div>{{ data.item.paymentType.name }}</div>
        <div class="row__sub-label">{{ data.item.transactionDate }}</div>
      </template>

      <template v-slot:cell(client)="data">
        <div>{{ data.item.client.name }}</div>
        <div class="row__sub-label">{{ data.item.client.code }}</div>
      </template>
      
      <template v-slot:cell(contract)="data">
        <div>{{ data.item.contract.tradeName }}</div>
        <div class="row__sub-label">{{ data.item.contract.contractNo }}</div>
      </template>

      <template v-slot:cell(period)="data">
        <div>{{ `${$options.Months.getName(data.item.monthId)} ${data.item.year}` }}</div>
      </template>

      <template v-slot:cell(paymentNo)="data">
        <b-link @click="onToggleDetails(data)">{{ data.item.paymentNo }}</b-link>
      </template>

      <template #row-details="data">
        <PaymentRowDetail 
          :payment="data.item" 
          :loading="rowLoading"
          :showApproval="true"
          @approve="setApproval($event)" />
      </template>

      <template v-slot:cell(status)="data">
        <b-badge :variant="getPaymentStatusVariant(data.item.paymentStatusId)">
            {{ data.item.paymentStatus.name }}</b-badge>
      </template>
    </Full>
    <CustomModal 
        :show="showApproval"
        size="sm"
        @closeModal="showApproval=false">
        <template #modal-header>
          Approving Payment
        </template>
        <template #modal-body>
          <b-form-group>
            <label class="required">Notes</label>
            <b-form-textarea
              debounce="250"
              type="text"
              ref="name"
              rows="4" 
              v-model="forms.payment.fields.approvedNotes"
              :state="forms.payment.states.approvedNotes"/>
            <b-form-invalid-feedback>
              {{forms.payment.errors.approvedNotes}}
            </b-form-invalid-feedback>
          </b-form-group>
        </template>
        <template #modal-footer>
          <div class="button-footer">
            <SaveButton 
              @click="onApprove()" label="Approve" :disabled="forms.payment.isProcessing" :isProcessing="forms.payment.isProcessing" />
            <CloseButton @click="showApproval=false" class="ml-2"  :disabled="forms.payment.isProcessing"/>
          </div>
        </template>
    </CustomModal>
  </div>
</template>

<script>

import { CustomToolTip, CustomModal, SaveButton, CloseButton } from "../components";
import { PaymentApi } from '../../mixins/api';
import { PaymentStatuses } from "../../helpers/enum";
import Full from "../components/Full";
import { clearFields, formatNumber, reset, showNotification, validate } from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
import { format } from 'date-fns'
import PaymentRowDetail from '../components/PaymentRowDetail';

const paymentFields = {
  id: null,
  paymentStatusId: null,
  approvedNotes: null,
}

export default {
  components: {
    Full,
    CustomToolTip,
    CustomModal,
    SaveButton,
    CloseButton,
    PaymentRowDetail
  },
  mixins: [ PaymentApi ],
  PaymentStatuses,
  format,
  data() {
    return {
      isLoading: false,
      showApproval: false,
      showReject: false,
      rowLoading: false,
      forms: {
        payment: {
          isProcessing: false,
          fields: { ...paymentFields },
          errors: { ...paymentFields },
          states: { ...paymentFields }      
        }
      },
      tables: {
        payments: {
          isBusy: false,
          fields: [
            {
              key: 'paymentNo',
              label: 'Payment No',
              thClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'transactionNo',
              label: 'TXN No',
              thClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'client',
              label: 'CLIENT',
              thClass: 'align-middle',
              thStyle: { width: '18%' },
            },
            {
              key: 'contract',
              label: 'CONTRACT',
              thClass: 'align-middle',
              thStyle: { width: '18%' },
            },
            {
              key: 'paymentInfo',
              label: 'PAYMENT INFO',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'amount',
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
              thStyle: { maxWidth: '50px' },
              thClass: 'align-middle',
            },
          ],
          items: []
        }
      },
      paginations: {
        payment: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        payment: {
          criteria: null,
          monthId: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          paymentStatusId: this.$options.PaymentStatuses.PENDING.id
        }
      },
      options: {
        paymentStatuses: {
          isBusy: false,
          items: this.$options.PaymentStatuses.values
        }
      }
    }
  },
  created() {
    this.isLoading = true
    this.loadPayments()
    this.isLoading = false
  },
  methods: {
    loadPayments() {
      const { payments } = this.tables
      const { payment, payment: { perPage, page } } = this.paginations
      const { criteria, paymentStatusId } = this.filters.payment
      const params = { paginate: true, perPage, page, criteria, paymentStatusId }
      payments.isBusy = true
      this.getPaymentList(params).then(( { data } ) => {
        payments.items = data.data
        payment.from = data.meta.from
        payment.to = data.meta.to
        payment.totalRows = data.meta.total
        payments.isBusy = false
      }) 
    },
    onChangeDate(date) {
      const { payment } = this.filters
      payment.monthId = date.monthIndex
      payment.year = date.year
      this.loadPayments()
    },
    onToggleDetails(row) {
      const paymentId = row.item.id
      if(!row.detailsShowing) {
        this.rowLoading = true
        this.getPayment(paymentId).then(({ data }) => {
          copyValue(data, row.item)
          this.$set(row.item, 'charges', data.charges)
          this.$set(row.item, 'bank', data.bank)
          this.$set(row.item, 'eWallet', data.eWallet)
          this.$set(row.item, 'approvedByPersonnel', data.approvedByPersonnel)
          this.rowLoading = false 
        })
      }
      row.toggleDetails()
    },
    getPaymentStatusVariant(paymentStatusId) {
      const { PaymentStatuses } = this.$options
      if (paymentStatusId === PaymentStatuses.PENDING.id) {
        return 'warning'
      }
      else if (paymentStatusId === PaymentStatuses.APPROVED.id) {
        return 'success'
      }
      else {
        return 'danger'
      }
    },
    setApproval(paymentId) {
      const { payment, payment: { fields } } = this.forms
      const { PaymentStatuses } = this.$options
      clearFields(payment)
      reset(payment)
      fields.id = paymentId
      fields.paymentStatusId = PaymentStatuses.APPROVED.id
      this.showApproval = true
    },
    onApprove() {
      const { payment, payment: { fields: { id: paymentId, approvedNotes, paymentStatusId }} } = this.forms

      const data = { approvedNotes, paymentStatusId }

      payment.isProcessing = true 
      this.updatePayment(data, paymentId).then(({ data }) => {
        this.loadPayments()
        payment.isProcessing = false
        this.showApproval = false
      }).catch(error => {
        const errors = error.response.data.errors
        payment.isProcessing = false
        validate(payment, errors)
      })
    },
  }
}
</script>

<style lang="scss">
  .collection__main-container {
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