<template>
  <div class="contract-row__detail-container">
    <loading
      :can-cancel="false" 
      :is-full-page="false"
      :active.sync="loading"
      loader="dots"
      color="#0A76EC" >
    </loading>
    <div class="contract-info">
      <div class="contract__header">Contract Info</div>
      <div class="contract__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <div class="contract__details">
        <div class="contract__details-group">
          <DetailGroup label="Contract No : " :value="contract.contractNo" />
          <DetailGroup label="Client : " :value="contract.client.name" />
          <DetailGroup label="Trade Name : " :value="contract.tradeName" />
          <DetailGroup label="Billing Address : " :value="contract.billingAddress" />
        </div>
        <div class="contract__details-group">
          <DetailGroup label="TIN : " :value="contract.tin" />
          <DetailGroup label="Contract Person : " :value="contract.contactPerson" />
          <DetailGroup label="Contact No : " :value="contract.contactNo" />
          <DetailGroup label="Date Started : " :value="$options.formatDate(new Date(contract.dateStarted), 'MMMM dd, yyyy')" />
        </div>
        <div class="contract__details-group">
          <DetailGroup label="Location : " :value="contract.location.name" />
          <DetailGroup label="RDO : " :value="contract.location.rdo.name" />
          <DetailGroup label="Tax Type : " :value="contract.taxType.name" />
          <DetailGroup label="Assigned To : " :value="contract.assignedPersonnel ? contract.assignedPersonnel.name : 'N/A'" />

          <!-- <DetailGroup label="Status: ">
            <template #extra-value>
              <b-badge
                class="contract__status"
                :variant="getContractStatusVariant(contract.contractStatusId)">
                {{ contract.contractStatus.name }}
              </b-badge>
            </template>
          </DetailGroup> -->
        </div>

        <div class="contract__details-group">
          <DetailGroup label="Status: ">
            <template #extra-value>
              <b-badge
                class="contract__status"
                :variant="getContractStatusVariant(contract.contractStatusId)">
                {{ contract.contractStatus.name }}
              </b-badge>
            </template>
          </DetailGroup>
          <DetailGroup label="Approved By : " :value="contract.approvedByPersonnel ? contract.approvedByPersonnel.name : 'N/A'" />
          <DetailGroup label="Approved At : " :value="contract.approvedAt ? $options.formatDate(new Date(contract.approvedAt), 'MMMM dd, yyyy') : 'N/A'" />
          <DetailGroup label="" v-if="contract.contractStatusId === $options.ContractStatuses.PENDING.id && showApproval">
            <template #extra-value>
              <b-button variant="success" class="approve-button" @click="$emit('approve', contract.id)">Approve</b-button>
            </template>
          </DetailGroup>
        </div>
      </div>
    </div>
    <div class="contract-info mt-4">
      <div class="contract__header">Services Info</div>
      <div class="contract__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <CustomTable
        :table="tables.services"
        :items="contract.services"
        :filter="filters.services"
        isOtherItems
        class="mt-3">
        <template v-slot:cell(name)="data">
          <div >{{ data.item.name }}</div>
          <div class="row__sub-label">{{ data.item.code }}</div>
        </template>
      </CustomTable>
    </div>

    <div class="contract-info mt-4">
      <div class="contract__header">Charges Info</div>
      <div class="contract__sub-header">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed sapiente voluptatibus nemo, porro optio atque?</div>
      <CustomTable
        :table="tables.charges"
        :items="contract.charges"
        :filter="filters.charges"
        isOtherItems
        class="mt-3">
        <template v-slot:cell(schedules)="data" >
          <div class="schedule-column">
            <div v-for="schedule in data.item.schedules" :key="schedule.id">
              <b-badge variant="info" pill class="schedule">{{ schedule.name }}</b-badge>
            </div>
          </div>
        </template>
        <template v-slot:cell(amount)="data">
          {{ $options.formatNumber(data.item.pivot.amount) }}
        </template>
        <template #custom-foot>
          <b-tr>
            <b-td></b-td>
            <b-td><div class="total-footer-label form-control">Total :</div></b-td>
            <b-td>
              <v-autonumeric
                class="form-control text-right"
                :value="totalChargeAmount"
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
import { ContractStatuses } from "../../helpers/enum"
import { formatNumber } from "../../helpers/forms"
import CustomTable from "./CustomTable"
import formatDate from 'date-fns/format'


export default {
  components: { DetailGroup, CustomTable },
  ContractStatuses,
  formatNumber,
  formatDate,
  props: {
    contract: {
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
        services: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Service',
              thClass: 'align-middle',
              thStyle: 'width: 33%'
            },
            {
              key: 'description',
              label: 'Description',
              thClass: 'align-middle',
              thStyle: 'width: 33%'
            },
            {
              key: 'serviceCategory.name',
              label: 'Category',
              thClass: 'align-middle',
              thStyle: 'width: 33%'
            },
          ],
          items: [],
          
        },
        charges: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Charge',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 33%'
            },
            {
              key: 'schedules',
              label: 'Schedules',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 50%'
            },
            {
              key: 'amount',
              label: 'Default Amount',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 17%',
              formatter: (value) => {
                return this.$options.formatNumber(value)
              }
            },
          ],
          items: []
        }
      },
      filters : {
        services: {
          criteria: null
        },
        charges: {
          criteria: null
        }
      },
      paginations: {
        service: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        charge: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      }
    }
  },
  methods: {
    getContractStatusVariant(contractStatusId) {
      if (contractStatusId === this.$options.ContractStatuses.PENDING.id) {
        return 'warning'
      }
      else if (contractStatusId === this.$options.ContractStatuses.APPROVED.id) {
        return 'success'
      }
      else {
        return 'danger'
      }
    },
  },
  computed: {
    totalChargeAmount() {
      const { charges } = this.contract
      if (charges.length > 0) {
        return charges.reduce((total, item) => total += Number(item.pivot.amount), 0); 
      }
      
      return 0
    },
  }
}
</script>

<style lang="scss" scoped>
  .contract-row__detail-container {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 20px;
    flex-direction: column;
    background-color: white;
    position: relative;
  }

  .contract-info {
    width: 100%;
  }

  .contract__header { 
    font-size: 14pt;
    font-weight: bold;
  }

  .contract__sub-header {
    font-size: 9pt;
    color: rgb(161, 158, 158);
  }

  .contract__details {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }

  .contract__details-group {
    width: 32%;
  }

  .contract__status {
    width: auto;
    max-width: 100px;
    margin-top: 3px;
  }

  .approve-button {
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

</style>