<template>
  <div>
    <CustomCard
      header="CONTRACTS"
      subHeader="List of all registered contracts.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.ContractPermissions.ADD.id)"
          placeholder="Search Here..."
          :isServerSide="true"
          @search="loadContracts()"
          @paginate="loadContracts()"
          :filter="filters.contract"
          :table="tables.contracts"
          :pagination="paginations.contract"
          buttonLabel="Create New Contract">
          <template v-slot:other-filter>
            <div class="status-filter__container">
              <label class="mr-2"> Status : </label>
              <v-select
                :options="options.contractStatuses.items"
                label="name"
                :disable="options.contractStatuses.isBusy"
                v-model="filters.contract.contractStatusId"
                :reduce="contractStatus => contractStatus.id"
                @input="loadContracts()"
                class="status-filter">
              </v-select>
            </div>
          </template>
          <template v-slot:cell(action)="data">
            <b-dropdown 
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                @click="onToggleDetails(data)"
                :disabled="showModalConfirmation">
                {{ data.detailsShowing ? 'Hide Details' : 'View Details' }}
              </b-dropdown-item>
              <b-dropdown-item
                @click="setUpdate(data)"
                :disabled="showModalEntry"
                v-if="data.item.contractStatusId === $options.ContractStatuses.PENDING.id && isAccessible($options.ContractPermissions.EDIT.id)">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation"
                v-if="data.item.contractStatusId === $options.ContractStatuses.PENDING.id && isAccessible($options.ContractPermissions.DELETE.id)">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:cell(company)="data">
            <b-link @click="onToggleDetails(data)">{{ data.item.tradeName }}</b-link>
            <div class="row__contract-no">{{ data.item.contractNo }}</div>
          </template>
          <template v-slot:cell(contact)="data">
            <div>{{ data.item.contactPerson }}</div>
            <div class="row__contract-no">{{ data.item.contactNo }}</div>
          </template>
           <template v-slot:cell(tin)="{ item }">
            <div>{{ item.tin }}</div>
            <div class="row__contract-no">{{ `${item.taxType ? item.taxType.name : ''}${item.location ? ` / ${item.location.name} - ${item.location.rdo.name}` : ''}` }}</div>
          </template>
          <template v-slot:head(company) >
            <CustomToolTip id="company-icon" label="COMPANY">
              <template #body>
                <div>
                  <div>Line 1 - Represents the tradename.</div>
                  <div class="row__contract-no">Line 2 - Represents the contract no.</div>
                </div>
              </template>
            </CustomToolTip>
          </template>
          <template v-slot:head(contact) >
            <CustomToolTip id="contact-icon" label="CONTACT">
              <template #body>
                <div>
                  <div>Line 1 - Represents the contact person</div>
                  <div class="row__contract-no">Line 2 - Represents the contact no.</div>
                </div>
              </template>
            </CustomToolTip>
          </template>
          <template v-slot:head(tin) >
            <CustomToolTip id="tin-icon" label="TIN">
              <template #body>
                <div>
                  <div>Line 1 - Represents the TIN</div>
                  <div class="row__contract-no">Line 2 - Represents the tax type and RDO.</div>
                </div>
              </template>
            </CustomToolTip>
          </template>
          <template v-slot:cell(status)="data">
            <b-badge :variant="getContractStatusVariant(data.item.contractStatusId)">{{ data.item.contractStatus.name }}</b-badge>
          </template>
          <template #row-details="data">
            <ContractRowDetail :contract="data.item" :loading="rowLoading" />
          </template>
        </Full>
      </template>
    </CustomCard>
    <ContractEntry 
      v-if="showModalEntry"
      :show="showModalEntry"
      @onBack="showModalEntry=false" 
      :mode="entryMode"
      :form="forms.contract"
      @save="onContractEntry()" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onContractDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.contract.isProcessing"
      name="Contract" />
  </div>
</template>

<script>
import { copyValue } from '../../../helpers/extractor';
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms';
import { ContractApi } from '../../../mixins/api';
import { CustomCard, CustomToolTip, DeleteConfirmation } from "../../components";
import Full from '../../components/Full'
import ContractEntry from './ContractEntry'
import { ContractStatuses, ContractPermissions } from '../../../helpers/enum'
import ContractRowDetail from '../../components/ContractRowDetail'
import Access from '../../../mixins/utils/Access';

const contractFields = {
  id: null,
  contractNo: null,
  clientId: null,
  client: {
    name: null
  },
  dateStarted: null,
  tin: null,
  tradeName: null,
  billingAddress: null,
  contactPerson: null,
  contactNo: null,
  locationId: null,
  taxTypeId: null,
  charges: null,
  services: null,
  contractStatusId: null
}

export default {
  components: {
    Full,
    CustomCard,
    ContractEntry,
    CustomToolTip,
    DeleteConfirmation,
    ContractRowDetail
  },
  ContractStatuses,
  mixins: [ ContractApi, Access ],
  ContractPermissions,
  data() {
    return {
      showModalEntry: false,
      showModalConfirmation: false,
      selectedContractId: null,
      entryMode: 'Add',
      rowLoading: false,
      forms: {
        contract: {
          isProcessing: false,
          fields: { ...contractFields },
          errors: { ...contractFields },
          states: { ...contractFields }      
        }
      },
      tables: {
        contracts: {
          isBusy: false,
          fields: [
            {
              key: 'company',
              label: 'Company',
              thClass: 'align-middle',
              thStyle: { width: '27%' },
            },
            {
              key: 'billingAddress',
              label: 'Billing Address',
              thClass: 'align-middle',
              thStyle: { width: '27%' },
            },
            {
              key: 'tin',
              label: 'TIN',
              thClass: 'align-middle',
              thStyle: { width: '24%' },
            },
            {
              key: 'contact',
              label: 'Contact',
              thClass: 'align-middle',
              thStyle: { width: '14%' },
            },
            {
              key: 'status',
              label: 'Status',
              thClass: 'align-middle text-center',
              tdClass: 'align-middle text-center',
              thStyle: { width: '8%' },
            },
            {
              key: 'action',
              label: '',
              thClass: 'align-middle',
              thStyle: { maxWidth: '20px' },
            },
          ],
          items: []
        }
      },
      paginations: {
        contract: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        contract: {
          criteria: null,
          contractStatusId: this.$options.ContractStatuses.PENDING.id
        }
      },
      options: {
        contractStatuses: {
          isBusy: false,
          items: this.$options.ContractStatuses.values
        }
      }
    }
  },
  methods: {
    onContractEntry() {
      const { contract, contract: { fields: { client, charges, services, ...fields } } } = this.forms
      contract.isProcessing = true
      const serviceIds = services.map(s => s.id);
      const chargeData = charges.map(c => {
        return {
          chargeId: c.id,
          amount: c.pivot.amount,
          schedules: c.schedules.map(s => {
            return {
              monthId: s.id
            }
          })
        }
      })
      const data = {
        ...fields,
        services: serviceIds,
        charges: chargeData
      }
      reset(contract)
      if (this.entryMode === 'Add') {
        this.addContract(data).then(({ data }) => {
          this.showModalEntry = false
          showNotification(this, "success", "Contract created successfully.")
          contract.isProcessing = false
          this.loadContracts()
        })
        .catch(error => {
          const errors = error.response.data.errors
          contract.isProcessing = false
          validate(contract, errors)
        })
      } else {
        this.updateContract(data, fields.id).then(({ data }) => {
          this.showModalEntry = false
          showNotification(this, "success", "Contract updated successfully.")
          contract.isProcessing = false
          this.loadContracts()
        })
        .catch(error => {
          const errors = error.response.data.errors
          contract.isProcessing = false
          validate(contract, errors)
        })
      }
    },
    setCreate() {
      const { contract, contract: { fields } } = this.forms
      clearFields(contract)
      reset(contract)
      fields.services = []
      fields.charges = []
      fields.contractStatusId = this.$options.ContractStatuses.PENDING.id
      this.entryMode = "Add"
      this.showModalEntry = true
      // this.selectedContractId = null
    },
    setUpdate(data) {
      const { contract, contract: { fields } } = this.forms
      clearFields(contract)
      reset(contract)
      fields.services = []
      fields.charges = []
      this.getContract(data.item.id).then(( { data }) => {
        copyValue(data, fields)
        this.entryMode = "Edit"
        this.showModalEntry = true
        // services.items = data.services
        // charges.items = data.charges
      })
    },
    loadContracts() {
      const { contracts } = this.tables
      const { contract, contract: { perPage, page } } = this.paginations
      const { criteria, contractStatusId } = this.filters.contract

      const params = {
        paginate: true,
        perPage,
        page,
        criteria,
        contractStatusId
      }

      contracts.isBusy = true

      this.getContractList(params)
      .then(({ data }) => {
        contracts.items = data.data
        contract.from = data.meta.from
        contract.to = data.meta.to
        contract.totalRows = data.meta.total
        contracts.isBusy = false
      })
    },
    setDelete(id) {
      const { fields } = this.forms.contract
      fields.id = id
      this.showModalConfirmation = true
    },
    onContractDelete(){
      const { contract, contract: { fields: { id } } } = this.forms
      const { contracts } = this.tables
      contract.isProcessing = true
      this.deleteContract(id)
        .then(({ data }) => {
          this.loadContracts()
          contract.isProcessing = false
          showNotification(this, "success", "Contract deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          contract.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
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
    onToggleDetails(row) {
      const contractId = row.item.id
      if(!row.detailsShowing) {
        this.rowLoading = true
        this.getContract(contractId).then(({ data }) => {
          copyValue(data, row.item)
          this.$set(row.item, 'services', data.services)
          this.$set(row.item, 'charges', data.charges)
          this.$set(row.item, 'location', data.location)
          this.$set(row.item, 'taxType', data.taxType)
          this.$set(row.item, 'assignedPersonnel', data.assignedPersonnel)
          this.$set(row.item, 'approvedByPersonnel', data.approvedByPersonnel)
          this.rowLoading = false 
        })
      }
      row.toggleDetails()
    }
  },
  created() {
    this.loadContracts()
  }
  
}
</script>

<style lang="scss" scoped>
  .row__contract-no {
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