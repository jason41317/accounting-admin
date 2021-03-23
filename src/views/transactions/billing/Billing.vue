<template>
  <div>
    <CustomCard
      header="BILLINGS" 
      subHeader="List of all registered billings.">
      <template #card-header-filter>
        <div class="month-filter">
          <span class="mr-2">Period: </span>
          <MonthPickerInput 
            input-pre-filled
            :default-month="defaultMonth"
            :default-year="defaultYear"
            :clearable="false"
            @input="onChangeDate" />
        </div>
      </template>
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.BillingPermissions.ADD.id)"
          placeholder="Search Here..."
          :isServerSide="true"
          @search="loadBillings()"
          @paginate="loadBillings()"
          :filter="filters.billing"
          :table="tables.billings"
          :pagination="paginations.billing"
          buttonLabel="Create New Billing">
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
                @click="onToggleDetails(data)">
                {{ data.detailsShowing ? 'Hide Details' : 'View Details' }}
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.BillingPermissions.EDIT.id)"
                @click="setUpdate(data.item)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.BillingPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
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

          <template v-slot:cell(billingNo)="data">
            <b-link @click="onToggleDetails(data)">{{ data.item.billingNo }}</b-link>
          </template>

          <template #row-details="data">
            <BillingRowDetail :billing="data.item" :loading="rowLoading" />
          </template>
        
        </Full>
      </template>
    </CustomCard>

    <BillingEntry 
      v-if="showModalEntry"
      :show="showModalEntry"
      @onBack="showModalEntry=false" 
      @save="onBillingEntry()"
      :mode="entryMode"
      :monthId="filters.billing.monthId"
      :year="filters.billing.year"
      :form="forms.billing" />

    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onBillingDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.billing.isProcessing"
      name="Billing" />
  </div>
</template>

<script>
import { CustomToolTip, CustomCard, DeleteConfirmation } from "../../components";
import BillingEntry from './BillingEntry'
import { MonthPickerInput } from 'vue-month-picker'
import { BillingApi } from '../../../mixins/api';
import { Months, BillingStatuses, BillingPermissions } from "../../../helpers/enum";
import Full from "../../components/Full";
import { clearFields, formatNumber, reset, showNotification, validate } from '../../../helpers/forms';
import { copyValue } from '../../../helpers/extractor';
import BillingRowDetail from '../../components/BillingRowDetail'
import Access from '../../../mixins/utils/Access'

const billingFields = {
  id: null,
  billingNo: null,
  clientId: null,
  client: null,
  contractId: null,
  billingDate: null,
  dueDate: null,
  year: null,
  monthId: null,
  charges: null,
  adjustmentCharges: null
}

export default {
  components: {
    Full,
    BillingEntry,
    MonthPickerInput,
    CustomToolTip,
    CustomCard,
    DeleteConfirmation,
    BillingRowDetail
  },
  mixins: [ BillingApi, Access ],
  BillingStatuses,
  Months,
  BillingPermissions,
  data() {
    return {
      rowLoading: false,
      showModalEntry: false,
      entryMode: 'Add',
      showModalConfirmation: false,
      forms: {
        billing: {
          isProcessing: false,
          fields: { ...billingFields },
          errors: { ...billingFields },
          states: { ...billingFields }      
        }
      },
      tables: {
        billings: {
          isBusy: false,
          fields: [
            {
              key: 'billingNo',
              label: 'Billing No',
              thClass: 'align-middle',
              thStyle: { minWidth: '150px' },
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
              key: 'billingDate',
              label: 'BILLING DATE',
              thClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'dueDate',
              label: 'DUE DATE',
              thClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'period',
              label: 'PERIOD',
              thClass: 'align-middle',
              thStyle: { width: '13%' },
            },
            {
              key: 'amount',
              label: 'AMOUNT',
              thClass: 'align-middle text-right',
              tdClass: 'text-right',
              thStyle: { width: '13%' },
              formatter: (value) => {
                return formatNumber(value)
              }
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
        billing: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        billing: {
          criteria: null,
          monthId: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }
      }
    }
  },
  created() {
    this.loadBillings()
  },
  methods: {
    loadBillings() {
      const { billings } = this.tables
      const { billing, billing: { perPage, page } } = this.paginations
      const { monthId, year, criteria } = this.filters.billing
      const params = { paginate: true, perPage, page, monthId, year, criteria }
      billings.isBusy = true
      this.getBillingList(params).then(( { data } ) => {
        billings.items = data.data
        billing.from = data.meta.from
        billing.to = data.meta.to
        billing.totalRows = data.meta.total
        billings.isBusy = false
      }) 
    },
    setCreate() {
      const { billing, billing: { fields } } = this.forms
      clearFields(billing)
      reset(billing)
      fields.adjustmentCharges = []
      fields.charges = []
      // fields.billingDate = new Date()
      // fields.dueDate = new Date()
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setUpdate(row) {
      const { billing, billing: { fields } } = this.forms
      clearFields(billing)
      reset(billing)
      fields.adjustmentCharges = []
      fields.charges = []
      this.getBilling(row.id).then(( { data }) => {
        copyValue(data, fields)
        this.entryMode = "Edit"
        this.showModalEntry = true
        // services.items = data.services
        // charges.items = data.charges
      })
    },
    setDelete(id) {
      const { fields } = this.forms.billing
      fields.id = id
      this.showModalConfirmation = true
    },
    onChangeDate(date) {
      const { billing } = this.filters
      billing.monthId = date.monthIndex
      billing.year = date.year
      this.loadBillings()
    },
    onBillingEntry() {
      const { 
        billing,
        billing: { 
          fields: {
            billingNo, 
            client,
            charges,
            adjustmentCharges,
            ...fields 
          }
        } 
      } = this.forms
      billing.isProcessing = true
      const { year, monthId } = this.filters.billing
      const adjustmentChargeData = adjustmentCharges.map(c => {
        return {
          chargeId: c.id,
          amount: c.pivot.amount,
          notes: c.pivot.notes
        }
      })
      const chargeData = charges.map(c => {
        return {
          chargeId: c.id,
          amount: c.pivot.amount,
          notes: c.pivot.notes
        }
      })
      const data = {
        ...fields,
        year,
        monthId,
        adjustmentCharges: adjustmentChargeData,
        charges: chargeData
      }
      reset(billing)
      if (this.entryMode === 'Add') {
        this.addBilling(data).then(({ data }) => {
          this.showModalEntry = false
          showNotification(this, "success", "Billing created successfully.")
          billing.isProcessing = false
          this.loadBillings()
        })
        .catch(error => {
          const errors = error.response.data.errors
          billing.isProcessing = false
          validate(billing, errors)
        })
      } else {
        this.updateBilling(data, fields.id).then(({ data }) => {
          billing.isProcessing = false
          this.showModalEntry = false
          showNotification(this, "success", "Billing updated successfully.")
          this.loadBillings()
        })
        .catch(error => {
          const errors = error.response.data.errors
          billing.isProcessing = false
          validate(billing, errors)
        })
      }
    },
    onBillingDelete() {
      const { billing, billing: { fields: { id } } } = this.forms
      billing.isProcessing = true
      this.deleteBilling(id)
        .then(({ data }) => {
          this.loadBillings()
          billing.isProcessing = false
          showNotification(this, "success", "Billing deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          billing.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    onToggleDetails(row) {
      const billingId = row.item.id
      if(!row.detailsShowing) {
        this.rowLoading = true
        this.getBilling(billingId).then(({ data }) => {
          copyValue(data, row.item)
          this.$set(row.item, 'charges', data.charges)
          this.$set(row.item, 'adjustmentCharges', data.adjustmentCharges)
          // this.$set(row.item, 'bank', data.bank)
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
</style>
