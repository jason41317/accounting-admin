<template>
  <div class="disbursement-row__detail-container">
    <loading
      :can-cancel="false" 
      :is-full-page="false"
      :active.sync="loading"
      loader="dots"
      color="#0A76EC" >
    </loading>
    <div class="disbursement-info">
      <div class="disbursement__header">Cheque Info</div>
      <div class="disbursement__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <div class="disbursement__details">
        <div class="disbursement__details-group">
          <DetailGroup label="Voucher No : " :value="disbursement.voucherNo" />
          <DetailGroup label="Payee : " :value="disbursement.payee" />
          <DetailGroup label="Address : " :value="disbursement.address" />
        </div>

        <div class="disbursement__details-group">
          <DetailGroup label="Bank : " :value="disbursement.bank.name" />
          <DetailGroup label="Cheque No : " :value="disbursement.chequeNo" />
          <DetailGroup label="Cheque Date : " :value="$options.formatDate(new Date(disbursement.chequeDate), 'MMMM dd, yyyy')" />
          <DetailGroup label="Cheque Date : " :value="$options.formatNumber(disbursement.chequeAmount)" />
        </div>

        <div class="disbursement__details-group">
          <DetailGroup label="Status: ">
            <template #extra-value>
              <b-badge
                class="disbursement__status"
                :variant="getDisbursementStatusVariant(disbursement.disbursementStatusId)">
                {{ disbursement.disbursementStatus.name }}
              </b-badge>
            </template>
          </DetailGroup>
          <DetailGroup label="Approved By : " :value="disbursement.approvedByPersonnel ? disbursement.approvedByPersonnel.name : 'N/A'" />
          <DetailGroup label="Approved At : " :value="disbursement.approvedAt ? $options.formatDate(new Date(disbursement.approvedAt), 'MMMM dd, yyyy') : 'N/A'" />
          <DetailGroup label="" v-if="disbursement.disbursementStatusId === $options.DisbursementStatuses.PENDING.id && showApproval">
            <template #extra-value>
              <b-button variant="success" class="approve-button" @click="$emit('approve', disbursement.id)">Approve</b-button>
            </template>
          </DetailGroup>
        </div>
      </div>
    </div>
    <div class="disbursement-info mt-4">
      <div class="disbursement__header">Particulars</div>
      <div class="disbursement__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <CustomTable
        :table="tables.disbursementDetails"
        :items="disbursement.disbursementDetails"
        :filter="filters.disbursementDetail"
        isOtherItems
        class="mt-3">
        <template #custom-foot>
          <b-tr>
            <b-td></b-td>
            <b-td><div class="total-footer-label form-control">Total :</div></b-td>
            <b-td>
              <v-autonumeric
                class="form-control text-right"
                :value="totalDisbursementDetailsAmount"
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
import { DisbursementStatuses } from "../../helpers/enum"
import { formatNumber } from "../../helpers/forms"
import CustomTable from "./CustomTable"
import  formatDate from 'date-fns/format'


export default {
  components: { DetailGroup, CustomTable },
  DisbursementStatuses,
  formatNumber,
  formatDate,
  props: {
    disbursement: {
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
        disbursementDetails: {
          isBusy: false,
          fields: [
            {
              key: 'particular',
              label: 'Particular',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 40%'
            },
            {
              key: 'accountTitle.name',
              label: 'Account Title',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 35%'
            },
            {
              key: 'amount',
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
        disbursementDetail: {
          criteria: null
        }
      },
      paginations: {
        disbursementDetail: {
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
  },
  computed: {
    totalDisbursementDetailsAmount() {
      const { disbursementDetails } = this.disbursement
      if (disbursementDetails.length > 0) {
        return disbursementDetails.reduce((total, item) => total += Number(item.amount), 0); 
      }
      
      return 0
    },
  }
}
</script>

<style lang="scss" scoped>
  .disbursement-row__detail-container {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 20px;
    flex-direction: column;
    background-color: white;
    position: relative;
  }

  .disbursement-info {
    width: 100%;
  }

  .disbursement__header { 
    font-size: 14pt;
    font-weight: bold;
  }

  .disbursement__sub-header {
    font-size: 9pt;
    color: rgb(161, 158, 158);
  }

  .disbursement__details {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }

  .disbursement__details-group {
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