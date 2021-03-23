<template>
  <div class="contract__main-container">
    <loading
      :can-cancel="false" 
      :is-full-page="false"
      :active.sync="isLoading"
      loader="dots"
      color="#0A76EC" >
    </loading>
    <Full
      placeholder="Search Here..."
      :filter="filters.contract"
      :table="tables.contracts"
      :pagination="paginations.contract"
      noCreateButton>
      <template v-slot:other-filter>
        <div class="status-filter__container">
          <label class="mr-2"> Status : </label>
          <v-select
            :options="options.contractStatus.items"
            label="name"
            :disable="options.contractStatus.isBusy"
            v-model="filters.contract.contractStatusId"
            :reduce="contractStatus => contractStatus.id"
            @input="loadContracts()"
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
            @click="setApprove(data.item.id)"
            :disabled="showApproval"
            v-if="data.item.contractStatusId === $options.ContractStatuses.PENDING.id">
            Approve
          </b-dropdown-item>
          <b-dropdown-item
            @click="onToggleDetails(data)"
            :disabled="showApproval">
            {{ data.detailsShowing ? 'Hide Details' : 'View Details' }}
          </b-dropdown-item>
        </b-dropdown>
      </template>
      <template v-slot:cell(company)="data">
        <b-link @click="onToggleDetails(data)">{{ data.item.tradeName }}</b-link>
        <div class="row__sub-label">{{ data.item.contractNo }}</div>
      </template>
      <template v-slot:cell(status)="data">
        <b-badge :variant="getContractStatusVariant(data.item.contractStatusId)">{{ data.item.contractStatus.name }}</b-badge>
      </template>
      <template v-slot:cell(contact)="data">
        <div>{{ data.item.contactPerson }}</div>
        <div class="row__sub-label">{{ data.item.contactNo }}</div>
      </template>
      <template v-slot:head(company) >
        <CustomToolTip id="company-icon" label="COMPANY">
          <template #body>
            <div>
              <div>Line 1 - Represents the tradename.</div>
              <div class="row__sub-label">Line 2 - Represents the contract no.</div>
            </div>
          </template>
        </CustomToolTip>
      </template>
      <template v-slot:head(contact) >
        <CustomToolTip id="contact-icon" label="CONTACT">
          <template #body>
            <div>
              <div>Line 1 - Represents the contact person</div>
              <div class="row__sub-label">Line 2 - Represents the contact no.</div>
            </div>
          </template>
        </CustomToolTip>
      </template>
      <template #row-details="data">
        <ContractRowDetail 
          :showApproval="true"
          :contract="data.item" 
          :loading="rowLoading" 
          @approve="setApprove($event)"/>
      </template>
    </Full>
    <CustomModal 
        :show="showApproval"
        size="sm"
        @closeModal="showApproval=false">
        <template #modal-header>
          Approving Contract
        </template>
        <template #modal-body>
          <b-form-group
            :state="forms.contract.states.assignedTo"
            :invalid-feedback="forms.contract.errors.assignedTo">
            <label class="required"> Assigned To:</label>
            <v-select
              :options="options.personnel.items"
              label="name"
              :disable="options.personnel.isBusy"
              :reduce="personnel => personnel.id"
              v-model="forms.contract.fields.assignedTo"  
              :class=" { 'is-invalid' : !!forms.contract.errors.assignedTo  }">
            </v-select>
          </b-form-group>
          <b-form-group>
            <label class="required">Notes</label>
            <b-form-textarea
              debounce="250"
              type="text"
              ref="name"
              rows="2" 
              v-model="forms.contract.fields.approvedNotes"
              :state="forms.contract.states.approvedNotes"/>
            <b-form-invalid-feedback>
              {{ forms.contract.errors.approvedNotes }}
            </b-form-invalid-feedback>
          </b-form-group>
        </template>
        <template #modal-footer>
          <div class="button-footer">
            <SaveButton @click="onApprove()" label="Approve" :disabled="forms.contract.isProcessing" :isProcessing="forms.contract.isProcessing" />
            <CloseButton @click="showApproval=false" class="ml-2"  :disabled="forms.contract.isProcessing"/>
          </div>
        </template>
    </CustomModal>
  </div>
</template>

<script>
import { ContractApi, PersonnelApi } from '../../mixins/api'
import CustomToolTip from '../components/CustomToolTip'
import Full from '../components/Full'
import CustomModal from '../components/CustomModal'
import CloseButton from '../components/CloseButton'
import SaveButton from '../components/SaveButton'
import { ContractStatuses } from '../../helpers/enum'
import ContractRowDetail from '../components/ContractRowDetail'
import { clearFields, formatNumber, reset, showNotification, validate } from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';

const contractFields = {
  id: null,
  contractId: null,
  approvedNotes: null,
  assignedTo: null,
  contractStatusId: null
}

export default {
  ContractStatuses,
  mixins: [ ContractApi, PersonnelApi ],
  components: {
    CustomToolTip,
    Full,
    CustomModal,
    CloseButton,
    SaveButton,
    ContractRowDetail
  },
  data() {
    return {
      isLoading: false,
      showApproval: false,
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
              thStyle: { width: '30%' },
            },
            {
              key: 'billingAddress',
              label: 'Billing Address',
              thClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'tin',
              label: 'TIN',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'contact',
              label: 'Contact',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'status',
              label: 'Status',
              thClass: 'align-middle text-center',
              tdClass: 'align-middle text-center',
              thStyle: { width: '10%' },
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
        personnel: {
          isBusy: false,
          items: []
        },
        contractStatus: {
          isBusy: false,
          items: this.$options.ContractStatuses.values
        }
      }
    }
  },
  created() {
    this.isLoading = true
   
    const { personnel } = this.options
    const params = { paginate: false }
    personnel.isBusy = true
  
    this.getPersonnelList(params).then(({ data }) => {
      personnel.items = data
      personnel.isBusy = false
    })

    this.loadContracts()
    
    this.isLoading = false  
  },
  methods: {
    setApprove(contractId) {
      const { contract, contract: { fields } } = this.forms
      const { ContractStatuses } = this.$options
      clearFields(contract)
      reset(contract)
      fields.id = contractId
      fields.contractStatusId = ContractStatuses.APPROVED.id
      this.showApproval = true
    },
    onApprove() {
      const { contract, contract: { fields: { id: contractId, approvedNotes, contractStatusId, assignedTo }} } = this.forms

      const data = { approvedNotes, contractStatusId, assignedTo }
      reset(contract)
      contract.isProcessing = true
      this.updateContract(data, contractId).then(({ data }) => {
        this.loadContracts()
        contract.isProcessing = false
        this.showApproval = false
      }).catch(error => {
        const errors = error.response.data.errors
        contract.isProcessing = false
        validate(contract, errors)
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
    loadContracts() {
      const { contracts } = this.tables
      const { contractStatusId } = this.filters.contract 
      const params = { paginate: false, contractStatusId }
      contracts.isBusy = true

      this.getContractList(params).then(({ data })=> {
        contracts.items = data
        contracts.isBusy = false
        
      })
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
  }
}
</script>

<style lang="scss" scoped>
  .contract__main-container {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .button-footer {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
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