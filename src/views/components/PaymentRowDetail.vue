<template>
  <div class="payment-row__detail-container">
    <loading
      :can-cancel="false" 
      :is-full-page="false"
      :active.sync="loading"
      loader="dots"
      color="#0A76EC" >
    </loading>
    <div class="payment-info">
      <div class="payment__header">Cheque Info</div>
      <div class="payment__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <div class="payment__details">
        <div class="payment__details-group">
          <DetailGroup label="Payment No : " :value="payment.paymentNo" />
          <DetailGroup label="Transaction : " :value="payment.transactionNo" />
          <DetailGroup label="Client : " :value="payment.client.name" />
          <DetailGroup label="Contract No : " :value="payment.contract.contractNo" />
          <DetailGroup label="Trade Name : " :value="payment.contract.tradeName" />
          <!-- <DetailGroup label="Address : " :value="payment.address" /> -->
        </div>

        <div class="payment__details-group">
          <DetailGroup label="Amount : " :value="$options.formatNumber(payment.amount)" />
          <DetailGroup label="Payment Date : " :value="$options.formatDate(new Date(payment.transactionDate), 'MMMM dd, yyyy')" />
          <DetailGroup label="Payment Type : " :value="payment.paymentType.name" />
          <DetailGroup v-if="payment.paymentTypeId === $options.PaymentTypes.CHEQUE.id || payment.paymentTypeId === $options.PaymentTypes.BANK_DEPOSIT.id" label="Bank : " :value="payment.bank? payment.bank.name :''" />
          <DetailGroup v-if="payment.paymentTypeId === $options.PaymentTypes.EWALLET.id" label="EWallet Provider : " :value="payment.eWallet ? payment.eWallet.name : ''" />
          <DetailGroup v-if="payment.paymentTypeId !== $options.PaymentTypes.CASH.id" label="Cheque/Bank Deposit/E-Wallet Txn # : " :value="payment.referenceNo" />
          <DetailGroup v-if="payment.paymentTypeId !== $options.PaymentTypes.CASH.id" label="Cheque/Bank Deposit/E-Wallet Txn Date : " :value="$options.formatDate(new Date(payment.referenceDate), 'MMMM dd, yyyy')" />
        </div>

        <div class="payment__details-group">
          <DetailGroup label="Status: ">
            <template #extra-value>
              <b-badge
                class="payment__status"
                :variant="getPaymentStatusVariant(payment.paymentStatusId)">
                {{ $options.PaymentStatuses.getName(payment.paymentStatusId) }}
              </b-badge>
            </template>
          </DetailGroup>
          <DetailGroup label="Approved By : " :value="payment.approvedByPersonnel ? payment.approvedByPersonnel.name : 'N/A'" />
          <DetailGroup label="Approved At : " :value="payment.approvedAt ? $options.formatDate(new Date(payment.approvedAt), 'MMMM dd, yyyy') : 'N/A'" />
          <DetailGroup label="" v-if="payment.paymentStatusId === $options.PaymentStatuses.PENDING.id && showApproval">
            <template #extra-value>
              <b-button variant="success" class="approve-button" @click="$emit('approve', payment.id)">Approve</b-button>
            </template>
          </DetailGroup>
        </div>
      </div>
    </div>
    <div class="payment-info mt-4">
      <div class="payment__header">Particulars</div>
      <div class="payment__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <CustomTable
        :table="tables.charges"
        :items="payment.charges"
        :filter="filters.charge"
        isOtherItems
        class="mt-3">
        <template #custom-foot>
          <b-tr>
            <b-td><div class="total-footer-label form-control">Total :</div></b-td>
            <b-td>
              <v-autonumeric
                class="form-control text-right"
                :value="totalPaymentDetailsAmount"
                disabled
                :options="{
                  minimumValue: '0',
                  modifyValueOnWheel: false,
                  emptyInputBehavior: 0
                }"
                debounce="500"/>
            </b-td>
          </b-tr>
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<script>

import DetailGroup  from "./DetailGroup";
import { PaymentStatuses, PaymentTypes } from "../../helpers/enum"
import { formatNumber } from "../../helpers/forms"
import CustomTable from "./CustomTable"
import  formatDate from 'date-fns/format'


export default {
  components: { DetailGroup, CustomTable },
  PaymentStatuses,
  PaymentTypes,
  formatNumber,
  formatDate,
  props: {
    payment: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    showApproval: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tables: {
        charges: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Charge',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 75%'
            },
            {
              key: 'pivot.amount',
              label: 'Amount Paid',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 25%'
            },
          ],
          items: []
        },
        clients: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'NAME',
              
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'officeAddress',
              label: 'OFFICE ADDRESS',
              
              thClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'owner',
              label: 'OWNER',
              
              thClass: 'align-middle',
              thStyle: { width: '10%' },
            },
            {
              key: 'contact',
              label: 'CONTACT',
              
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'businessStyle.name',
              label: 'BUSINESS STYLE',
              
              thClass: 'align-middle',
              thStyle: { width: '14%' },
            },
            {
              key: 'businessType.name',
              label: 'BUSINESS TYPE',
              
              thClass: 'align-middle',
              thStyle: { width: '14%' }
            },
            {
              key: 'action',
              label: '',
              thClass: 'align-middle',
            },
          ],
          items: []
        }
      },
      filters: {
        charge: {
          criteria: null
        }
      },
      paginations: {
        charge: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
    }
  },
  methods: {
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
  computed: {
    totalPaymentDetailsAmount() {
      const { charges } = this.payment
      if (charges && charges.length > 0) {
        return charges.reduce((total, item) => total += Number(item.pivot.amount), 0); 
      }
      
      return 0
    },
  }
}
</script>

<style lang="scss" scoped>
  .payment-row__detail-container {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 20px;
    flex-direction: column;
    background-color: white;
    position: relative;
  }

  .payment-info {
    width: 100%;
  }

  .payment__header { 
    font-size: 14pt;
    font-weight: bold;
  }

  .payment__sub-header {
    font-size: 9pt;
    color: rgb(161, 158, 158);
  }

  .payment__details {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }

  .payment__details-group {
    width: 32%;
  }

  .payment__status {
    width: auto;
    max-width: 100px;
    margin-top: 3px;
  }
  
  .schedule-column {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .schedule {
    height: 24px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }

  .total-footer-label{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border: none;
    font-weight: bold;
    font-size: 14pt;
  }

  .approve-button {
    width: auto;
    max-width: 100px;
    margin-top: 3px;
  }

</style>