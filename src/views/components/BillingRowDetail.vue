<template>
  <div class="billing-row__detail-container">
    <loading
      :can-cancel="false" 
      :is-full-page="false"
      :active.sync="loading"
      loader="dots"
      color="#0A76EC" >
    </loading>
    <div class="billing-info">
      <div class="billing__header">Billing Info</div>
      <div class="billing__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <div class="disbursement__details">
        <div class="billing__details-group">
          <DetailGroup label="Voucher No : " :value="billing.billingNo" />
          <DetailGroup label="Client : " :value="billing.client.name" />
          <DetailGroup label="Contract No : " :value="billing.contract.contractNo" />
          <DetailGroup label="Trade Name : " :value="billing.contract.tradeName" />
          
        </div>

        <div class="billing__details-group">
          <DetailGroup label="Billing Date : " :value="$options.formatDate(new Date(billing.billingDate), 'MMMM dd, yyyy')" />
          <DetailGroup label="Due Date : " :value="$options.formatDate(new Date(billing.dueDate), 'MMMM dd, yyyy')" />
          
        </div>

        <div class="billing__details-group">
          <DetailGroup label="Total Charges : " :value="$options.formatNumber(totalChargesAmount)" />
          <DetailGroup label="Total Adjustment Charges : " :value="$options.formatNumber(totalAdjustmentChargesAmount)" />
        </div>

        <!-- <div class="billing__details-group">
          <DetailGroup label="Status: ">
            <template #extra-value>
              <b-badge
                class="disbursement__status"
                :variant="getBillingStatusVariant(billing.billingStatusId)">
                {{ $options.BillingStatuses.getName(billing.billingStatusId) }}
              </b-badge>
            </template>
          </DetailGroup>
          <DetailGroup label="" v-if="billing.billingStatusId === $options.BillingStatuses.PENDING.id && showApproval">
            <template #extra-value>
              <b-button variant="success" class="approve-button" @click="$emit('approve', billing.id)">Approve</b-button>
            </template>
          </DetailGroup>
        </div> -->
      </div>
    </div>
    <div class="billing-info mt-4">
      <div class="billing__header">Charges</div>
      <div class="billing__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <CustomTable
        :table="tables.charges"
        :items="billing.charges"
        :filter="filters.charge"
        isOtherItems
        class="mt-3">
        <template #custom-foot>
          <b-tr>
            <b-td></b-td>
            <b-td><div class="total-footer-label form-control">Total :</div></b-td>
            <b-td>
              <v-autonumeric
                class="form-control text-right"
                :value="totalChargesAmount"
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
    <div class="billing-info mt-4">
      <div class="billing__header">Adjustment  Charges</div>
      <div class="billing__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <CustomTable
        :table="tables.adjustmentCharges"
        :items="billing.adjustmentCharges"
        :filter="filters.adjustmentCharge"
        isOtherItems
        class="mt-3">
        <template #custom-foot>
          <b-tr>
            <b-td></b-td>
            <b-td><div class="total-footer-label form-control">Total :</div></b-td>
            <b-td>
              <v-autonumeric
                class="form-control text-right"
                :value="totalAdjustmentChargesAmount"
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
import { BillingStatuses } from "../../helpers/enum"
import { formatNumber } from "../../helpers/forms"
import CustomTable from "./CustomTable"
import  formatDate from 'date-fns/format'


export default {
  components: { DetailGroup, CustomTable },
  BillingStatuses,
  formatNumber,
  formatDate,
  props: {
    billing: {
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
              thStyle: 'width: 40%'
            },
            {
              key: 'remarks',
              label: 'Remarks',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 35%'
            },
            {
              key: 'pivot.amount',
              label: 'Amount',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 20%',
              formatter: (value) => {
                return formatNumber(value)
              }
            },
          ],
          items: []
        },
        adjustmentCharges: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Charge',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 40%'
            },
            {
              key: 'remarks',
              label: 'Remarks',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 35%'
            },
            {
              key: 'pivot.amount',
              label: 'Amount',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 20%',
              formatter: (value) => {
                return formatNumber(value)
              }
            },
          ],
          items: []
        },
      },
      filters: {
        charge: {
          criteria: null
        },
        adjustmentCharge: {
          criteria: null
        },
      },
      paginations: {
        charge: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        adjustmentCharge: {
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
    getBillingStatusVariant(billingStatusId) {
      const { BillingStatuses } = this.$options
      if (billingStatusId === BillingStatuses.PENDING.id) {
        return 'warning'
      }
      else if (billingStatusId === BillingStatuses.APPROVED.id) {
        return 'success'
      }
      else {
        return 'danger'
      }
    },
  },
  computed: {
    totalChargesAmount() {
      const { charges } = this.billing
      if (charges && charges.length > 0) {
        return charges.reduce((total, item) => total += Number(item.pivot.amount), 0); 
      }
      
      return 0
    },
    totalAdjustmentChargesAmount() {
      const { adjustmentCharges } = this.billing
      if (adjustmentCharges && adjustmentCharges.length > 0) {
        return adjustmentCharges.reduce((total, item) => total += Number(item.pivot.amount), 0); 
      }
      
      return 0
    },
  }
}
</script>

<style lang="scss" scoped>
  .billing-row__detail-container {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 20px;
    flex-direction: column;
    background-color: white;
    position: relative;
  }

  .billing-info {
    width: 100%;
  }

  .billing__header { 
    font-size: 14pt;
    font-weight: bold;
  }

  .billing__sub-header {
    font-size: 9pt;
    color: rgb(161, 158, 158);
  }

  .disbursement__details {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }

  .billing__details-group {
    width: 32%;
  }

  .disbursement__status {
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