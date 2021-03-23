<template>
  <div>
    <CustomCard
      header="Payments" 
      subHeader="List of all registered payments.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.PaymentPermissions.ADD.id)"
          placeholder="Search Here..."
          :isServerSide="true"
          @search="loadPayments()"
          @paginate="loadPayments()"
          :filter="filters.payment"
          :table="tables.payments"
          :pagination="paginations.payment"
          buttonLabel="Create New Payment">

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
              <!-- <b-dropdown-item
                @click="setUpdate(data.item)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item> -->
              <b-dropdown-item
                @click="onToggleDetails(data)">
                {{ data.detailsShowing ? 'Hide Details' : 'View Details' }}
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.PaymentPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Cancel
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

          <template #row-details="data">
            <PaymentRowDetail :payment="data.item" :loading="rowLoading" />
          </template>

          <template v-slot:cell(status)="data">
            <b-badge :variant="getPaymentStatusVariant(data.item.paymentStatusId)">
                {{ data.item.paymentStatus.name }}</b-badge>
          </template>

          <template v-slot:cell(paymentNo)="data">
            <b-link @click="onToggleDetails(data)">{{ data.item.paymentNo }}</b-link>
          </template>
        
        </Full>
      </template>
    </CustomCard>

    <PaymentEntry 
      v-if="showModalEntry"
      :show="showModalEntry"
      @onBack="showModalEntry=false" 
      @save="onPaymentEntry()"
      :mode="entryMode"
      :monthId="filters.payment.monthId"
      :year="filters.payment.year"
      :form="forms.payment" />

    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onPaymentDelete()"
      deleteLabel="Cancel"
      :show="showModalConfirmation"
      :isProcessing="forms.payment.isProcessing"
      name="Payment" />
  </div>
</template>

<script>
import { CustomToolTip, CustomCard, DeleteConfirmation } from "../../components";
import PaymentEntry from './PaymentEntry'
import { PaymentApi } from '../../../mixins/api';
import { Months, PaymentTypes, PaymentStatuses, PaymentPermissions } from "../../../helpers/enum";
import Full from "../../components/Full";
import { clearFields, formatNumber, reset, showNotification, validate } from '../../../helpers/forms';
import { copyValue } from '../../../helpers/extractor';
import PaymentRowDetail from '../../components/PaymentRowDetail'
import Access from '../../../mixins/utils/Access';

const paymentFields = {
  id: null,
  paymentNo: null,
  transactionNo: null,
  clientId: null,
  client: null,
  contractId: null,
  transactionDate: null,
  paymentTypeId: null,
  bankId: null,
  eWalletId: null,
  referenceNo: null,
  referenceDate: null,
  amount: null,
  charges: null,
  paymentStatusId: null,
}

export default {
  components: {
    Full,
    PaymentEntry,
    CustomToolTip,
    CustomCard,
    DeleteConfirmation,
    PaymentRowDetail
  },
  mixins: [ PaymentApi, Access ],
  Months,
  PaymentTypes,
  PaymentStatuses,
  PaymentPermissions,
  data() {
    return {
      showModalEntry: false,
      entryMode: 'Add',
      showModalConfirmation: false,
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
    this.loadPayments()
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
    setCreate() {
      const { payment, payment: { fields } } = this.forms
      clearFields(payment)
      reset(payment)
      fields.paymentTypeId = this.$options.PaymentTypes.CASH.id 
      fields.paymentStatusId = this.$options.PaymentStatuses.PENDING.id 
      fields.charges = []
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.payment
      fields.id = id
      this.showModalConfirmation = true
    },
    onChangeDate(date) {
      const { payment } = this.filters
      payment.monthId = date.monthIndex
      payment.year = date.year
      this.loadPayments()
    },
    onPaymentEntry() {
      const { 
        payment,
        payment: { 
          fields: {
            paymentNo, 
            client,
            charges,
            ...fields 
          }
        } 
      } = this.forms
      payment.isProcessing = true
      
      let chargeAmount = 0
      charges.map(charge => {
        chargeAmount += Number(charge.amount)
      })
      if (fields.amount !== Number(chargeAmount)) {
        showNotification(this, 'danger', 'The sum of amount paid in charges must be equal to amount.')
        setTimeout(() => {
          payment.isProcessing = false
          return
        }, 1000); 
      }

      const chargeData = charges.map(c => {
        return {
          chargeId: c.chargeId,
          amount: c.amount,
        }
      })
      const data = {
        ...fields,
        charges: chargeData
      }
      reset(payment)
      if (this.entryMode === 'Add') {
        this.addPayment(data).then(({ data }) => {
          this.showModalEntry = false
          showNotification(this, "success", "Payment created successfully.")
          payment.isProcessing = false
          this.loadPayments()
        })
        .catch(error => {
          const errors = error.response.data.errors
          payment.isProcessing = false
          validate(payment, errors)
        })
      } else {
        this.updatePayment(data, fields.id).then(({ data }) => {
          this.showModalEntry = false
          showNotification(this, "success", "Payment updated successfully.")
          payment.isProcessing = false
          this.loadPayments()
        })
        .catch(error => {
          const errors = error.response.data.errors
          payment.isProcessing = false
          validate(payment, errors)
        })
      }
    },
    onPaymentDelete() {
      const { payment, payment: { fields: { id } } } = this.forms
      payment.isProcessing = true
      this.deletePayment(id)
        .then(({ data }) => {
          this.loadPayments()
          payment.isProcessing = false
          showNotification(this, "success", "Payment cancelled successfully.")
          this.showModalConfirmation = false
        })
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
  },
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
