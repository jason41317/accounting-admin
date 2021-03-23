<template>
  <transition-group name="fade" appear >
    <div class="payment__main-container" id="payment__main-container" key="main" v-if="showModal">
      <loading
        :can-cancel="false" 
        :is-full-page="false"
        :active.sync="isLoading" >
      </loading>
      <div class="payment_header">
        <button class="back-button-container" @click="$emit('onBack')">
          <v-icon name="chevron-left" class="back-icon"/>
          Back
          </button>
        <div class="header-content-container">
          <!-- <div class="header-info">
            <div class="header-group client-info">

              <CustomToolTip id="client-icon__s" label="Client :">
                <template #body>
                  <div>
                    <div>Line 1 - Represents the tradename.</div>
                    <div class="row__sub-label">Line 2 - Represents the contract code.</div>
                  </div>
                </template>
              </CustomToolTip>

              <div class="header-label"> {{ form.fields.client ? form.fields.client.name : '[ Client ]' }} </div>
              <div class="header-label"> {{ form.fields.client ? form.fields.client.code : '[ Client Code ]' }} </div>
            </div>
          </div> -->
          <div class="header-info">
            <div class="header__title ">
              PAYMENT ENTRY
            </div>
            <div class="header__sub-title">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi magni at enim, debitis eaque sunt?
            </div>
          </div>
          <div class="header-options">
            <v-icon
              name="sync"
              spin
              v-if="form.isProcessing"
              class="loading-icon">
            </v-icon>
            <b-dropdown boundary="window" right variant="link" toggle-class="text-decoration-none" no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                @click="$emit('save')">
                Save
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="payment__content">
        <div class="left-pane">
          <div class="side-nav" >
            <a class="side-nav-item"
              :href="`#${nav.name}`"
              v-for="(nav, idx ) in navOptions" 
              :key="idx" 
              :class="{ active: activeIndex === idx}"
              v-smooth-scroll="{ duration: 500, offset: -130, container: '#payment__main-container', updateHistory: false}"
              @click.prevent="onSelectNav(idx)"> {{ nav.header }}</a>
          </div>
        </div>
        <div class="content-pane">
          <div class="content-section">
            <div class="section-item" :id="navOptions[0].name">
              <ActiveViewSectionHeader
                :sectionNumber="1"
                :sectionHeader="navOptions[0].header"
                :sectionSubHeader="navOptions[0].subHeader"  />
              <div class="section-content">
                <div class="client-info__wrapper">
                  <div class="client-info__left">
                    <b-form-group>
                      <label class="required"> Payment No</label>
                      <b-form-input 
                        disabled
                        :value="mode === 'Add' ? 'Auto Generated' : form.fields.paymentNo"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.paymentNo }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <CustomToolTip id="transaction-icon" label="Transaction No :" labelClass="required" >
                        <template #body>
                          <div>
                              Transaction no of the payment ex. OR # or AR #.
                          </div>
                        </template>
                      </CustomToolTip>
                      <b-form-input 
                        class="mt-2"
                        :state="form.states.transactionNo"
                        v-model="form.fields.transactionNo"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.transactionNo }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <div class="client-label__container">
                        <label class="required"> Client</label>
                        <label class="select-link" @click="showClientModal=true">Select Client</label>
                      </div>
                      <b-form-input
                        :state="form.states.clientId"
                        :value="form.fields.client ? form.fields.client.name : null" 
                        disabled />
                      <b-form-invalid-feedback>
                        {{ form.errors.clientId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Contract No</label>
                      <v-select
                        :options="form.fields.client && form.fields.client.contracts ? form.fields.client.contracts : []"
                        label="contractNo"
                        v-model="form.fields.contractId"
                        :reduce="contract => contract.id"
                        @input="onSelectContract"
                        :class="{ 'is-invalid' : !!form.errors.contractId}"
                        :disabled="mode === 'Edit'">
                        <template #option="option">
                          <div>{{ option.contractNo }}</div>
                          <div>{{ option.tradeName }}</div>
                        </template>
                      </v-select>
                      <b-form-invalid-feedback>
                        {{ form.errors.contractId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label> Trade Name</label>
                      <b-form-input
                        :value="form.fields.contractId && form.fields.client.contracts ? 
                          form.fields.client.contracts.find(c => c.id === form.fields.contractId).tradeName : null"
                        disabled/>
                    </b-form-group>
                  </div>
                  <div class="client-info__right">
                    <b-form-group
                      :state="form.states.amount"
                      :invalid-feedback="form.errors.amount">
                      <label class="required"> Amount</label>
                      <v-autonumeric
                        class="form-control text-right"
                        v-model="form.fields.amount"
                        :class="{ 'is-invalid': !!form.errors.amount }"
                        :options="{
                          minimumValue: '0',
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0
                        }"/>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Payment Date</label>
                      <b-form-datepicker 
                        v-model="form.fields.transactionDate"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.transactionDate }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Payment Type </label>
                      <v-select
                        :class="{ 'is-invalid' : !!form.errors.paymentTypeId }"
                        :options="options.paymentTypes.items"
                        label="name"
                        v-model="form.fields.paymentTypeId"
                        :reduce="paymentType => paymentType.id"
                        :clearable="false"
                        :searchable="false">
                      </v-select>
                      <b-form-invalid-feedback>
                        {{ form.errors.paymentTypeId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group
                      v-if="(form.fields.paymentTypeId === $options.PaymentTypes.CHEQUE.id || form.fields.paymentTypeId === $options.PaymentTypes.BANK_DEPOSIT.id)">
                      <label class="required"> Bank </label>
                      <v-select
                        :options="options.banks.items"
                        label="name"
                        v-model="form.fields.bankId"
                        :reduce="bank => bank.id"
                        :class="{ 'is-invalid' : !!form.errors.bankId }"
                        :disabled="!(form.fields.paymentTypeId === $options.PaymentTypes.CHEQUE.id || form.fields.paymentTypeId === $options.PaymentTypes.BANK_DEPOSIT.id)">
                      </v-select>
                      <b-form-invalid-feedback>
                        {{ form.errors.bankId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group
                      v-if="form.fields.paymentTypeId === $options.PaymentTypes.EWALLET.id">
                      <label class="required"> E Wallet Provider </label>
                      <v-select
                        :options="options.eWallets.items"
                        label="name"
                        :class="{ 'is-invalid' : !!form.errors.eWalletId }"
                        v-model="form.fields.eWalletId"
                        :reduce="eWallet => eWallet.id"
                        :disabled="!(form.fields.paymentTypeId === $options.PaymentTypes.EWALLET.id)">
                      </v-select>
                      <b-form-invalid-feedback>
                        {{ form.errors.eWalletId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group
                      v-if="!(form.fields.paymentTypeId === $options.PaymentTypes.CASH.id)">
                      <CustomToolTip 
                        id="reference-no-icon" 
                        label="Cheque/Bank Deposit/E-Wallet Txn #"
                        labelClass="required">
                        <template #body>
                          <div>
                            Cheque #, Bank Deposit #, E Wallet Transaction # of the payment.
                          </div>
                        </template>
                      </CustomToolTip>
                      <b-form-input 
                        :state="form.states.referenceNo"
                        class="mt-2"
                        v-model="form.fields.referenceNo"
                        :disabled="(form.fields.paymentTypeId === $options.PaymentTypes.CASH.id)"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.referenceNo }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group
                      v-if="!(form.fields.paymentTypeId === $options.PaymentTypes.CASH.id)">
                      <CustomToolTip 
                        id="reference-date-icon" 
                        label="Cheque/Bank Deposit/E-Wallet Txn Date"
                        labelClass="required">
                        <template #body>
                          <div>
                            Cheque, Bank Deposit, E Wallet Transaction date of the payment.
                          </div>
                        </template>
                      </CustomToolTip>
                      <b-form-datepicker 
                        :state="form.states.referenceDate"
                        class="mt-2"
                        v-model="form.fields.referenceDate"
                        :disabled="(form.fields.paymentTypeId === $options.PaymentTypes.CASH.id)"/>

                      <b-form-invalid-feedback>
                        {{ form.errors.referenceDate }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="section-item" :id="navOptions[1].name">
              <ActiveViewSectionHeader
                :sectionNumber="2"
                :sectionHeader="navOptions[1].header"
                :sectionSubHeader="navOptions[1].subHeader"  />
              <div class="section-content">
                <div class="charges__wrapper" ref="chargesWrapper">
                  <div class="charges__filters">
                    <b-button 
                      :disabled="!form.fields.contractId"
                      class="charges__button" 
                      variant="outline-primary" 
                      @click="showChargesModal = true">
                      Add Charges
                    </b-button>
                  </div>
                  <CustomTable
                    :table="tables.charges"
                    :filter="filters.charge"
                    isOtherItems
                    :items.sync="form.fields.charges">
                    <template v-slot:cell(amount)="{ item }">
                      <v-autonumeric
                        class="form-control text-right"
                        v-model="item.amount"
                        :options="{
                          minimumValue: '0',
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0
                        }"/>
                    </template>
                    <template v-slot:cell(action)="{index, item}">
                      <b-button
                        v-if="item.remainingBalance === 0"
                        size="sm"
                        variant="outline-danger"
                        @click="onRemoveCharge(index)">
                        <v-icon name="trash"/>
                      </b-button>
                    </template>
                  </CustomTable>
                  <b-form-group 
                    :state="form.states.charges"
                    :invalid-feedback="form.errors.charges"/>
                </div>
              </div>
            </div>
          </div>
          <div class="content_footer">
            <SaveButton @click="$emit('save')" :isProcessing="form.isProcessing"/>
            <CloseButton @click="$emit('onBack')" class="ml-2" :isProcessing="form.isProcessing"/>
          </div>
        </div>
        <div class="right-pane">
          <div class="summary-wrapper">
            <div>SUMMARY</div>
            <div class="summary-group">
              <div class="summary-label summary-link">TOTAL AMOUNT DUE</div>
              <div class="summary-amount">{{ $options.formatNumber(totalCharges) }}</div>
            </div>
            <div>PAYMENTS</div>
            <div class="summary-group">
              <div class="summary-label">TOTAL AMOUNT PAID</div>
              <div class="summary-amount">{{ $options.formatNumber(form.fields.amount) }}</div>
            </div>
          </div>
        </div>
      </div>

      <ClientsModal
        @clickClient="onSelectClient($event)"
        @close="showClientModal = false"
        :show="showClientModal"/>

      <ChargesModal
        @clickCharge="onAddCharge($event)"
        @close="showChargesModal = false"
        :show="showChargesModal"/>
    </div>
  </transition-group>
</template>

<script>
import { 
  ActiveViewSectionHeader,
  CustomTable,
  SaveButton,
  CloseButton,
  ClientsModal,
  ChargesModal } from "../../components";
import CustomToolTip from '../../components/CustomToolTip'
import { formatNumber, showNotification } from '../../../helpers/forms'
import { BankApi, BillingApi, ChargeApi, ClientApi, ContractApi, EWalletApi, ServiceApi } from "../../../mixins/api";
import { PaymentTypes } from "../../../helpers/enum";
import { createPopper } from '@popperjs/core';
import { format } from 'date-fns'

export default {
  format,
  formatNumber,
  PaymentTypes,
  components: {
    ActiveViewSectionHeader,
    CustomTable,
    CustomToolTip,
    ClientsModal,
    ChargesModal,
    SaveButton,
    CloseButton
  },
  props: {
    form: Object,
    show: Boolean,
    mode: { 
      type: String,
      default: 'Add' 
    },
    billingId: {
      type: Number,
      default: null
    },
    monthId: Number,
    year: Number
  },
  mixins: [ ContractApi, ServiceApi, ChargeApi, ClientApi, BillingApi, EWalletApi, BankApi ],
  data() {
    return {
      isLoading: false,
      activeIndex: 0,
      showServicesModal: false,
      showChargesModal: false,
      showClientModal: false,
      placement: 'bottom',
      chargeTable: null,
      selectedClient: {
        id: null,
        name: null,
      },
      navOptions: [
        {
          name: 'clientInfo',
          header: 'Client Information',
          subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          name: 'charges',
          header: 'Charges',
          subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
      ],
      tables: {
        charges: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Charge',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 30%'
            },
            {
              key: 'remainingBalance',
              label: 'Remaining Balance',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 25%',
              formatter: (value) => {
                return formatNumber(value)
              }
            },
            {
              key: 'amount',
              label: 'Amount Paid',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 25%'
            },
            {
              key: 'balance',
              label: 'Balance',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 20%',
              formatter: (value, key, item) => {
                return formatNumber(Number(item.remainingBalance) - Number(item.amount))
                // return formatNumber(value)
              }
            },
            {
              key: 'action',
              label: '',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: '{ width: 20px }'
            }
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
      options: {
        contracts: {
          isBusy: false,
          items: []
        },
        paymentTypes: {
          isBusy: false,
          items: this.$options.PaymentTypes.values
        },
        eWallets: {
          isBusy: false,
          items: []
        },
        banks: {
          isBusy: false,
          items: []
        }
      },
      filters: {
        charge: {
          criteria: null
        },
        client: {
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
        adjustmentCharge: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        client: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
    }
  },
  created() {
    // this.isLoading = true
    // const { charges, adjustmentCharges } = this.tables
    const { fields } = this.form
    fields.transactionDate = new Date()
    this.loadEWallets();
    this.loadBanks();
  },
  methods: {
    onSelectNav(idx) {
      this.activeIndex = idx
    },
    loadBanks() {
      const { banks } = this.options
      const params = { paginate: false }
      banks.isBusy = true
      this.getBankList(params).then(({ data }) => {
        banks.items = data
        banks.isBusy = false
      })
    },
    loadEWallets() {
      const { eWallets } = this.options
      const params = { paginate: false }
      eWallets.isBusy = true
      this.getEWalletList(params).then(({ data }) => {
        eWallets.items = data
        eWallets.isBusy = false
      })
    },
    loadClients() {
      const { clients } = this.tables
      const params = { paginate: false }
      clients.isBusy = true
      this.getClientList(params).then(({ data }) => {
        clients.items = data
        clients.isBusy = false
      })
    },
    onSelectClient(client) {
      const { fields } = this.form
      fields.clientId = client.id
      fields.client = client
      const { contracts } = this.options
      this.showClientModal = false
    },
    withPopper (dropdownList, component, {width}) {
      /**
       * We need to explicitly define the dropdown width since
       * it is usually inherited from the parent with CSS.
       */
      dropdownList.style.width = width;

      /**
       * Here we position the dropdownList relative to the $refs.toggle Element.
       *
       * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
       * the dropdownList overlap by 1 pixel.
       *
       * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
       * wrapper so that we can set some styles for when the dropdown is placed
       * above.
       */
      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: this.placement,
        modifiers: [
          {
            name: 'offset', options: {
              offset: [0, -1]
            }
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn ({state}) {
              component.$el.classList.toggle('drop-up', state.placement === 'top')
            },
          }]
      });

      /**
       * To prevent memory leaks Popper needs to be destroyed.
       * If you return function, it will be called just before dropdown is removed from DOM.
       */
      return () => popper.destroy();
    } ,
    onSelectContract(id) {
      const { fields } = this.form
      const { charges } = this.tables
      charges.isBusy = true
      
      if (!id) {
        charges.isBusy = false
        fields.charges = []
        return
      }
      this.getContract(id).then(( { data } ) => {
        fields.charges = data.chargeBalances
        charges.isBusy = false
      })
    },
    onAddCharge(charge) {
      const { fields } = this.form
      console.log(fields.charges)
      if(fields.charges.find(c => c.chargeId === charge.id)) {
        showNotification(this, 'danger', 'Charge already added.')
        return
      }
      fields.charges.push({
        chargeId: charge.id,
        name: charge.name,
        remainingBalance: 0,
        amount: 0
      })
    },
    onRemoveCharge(index) {
      const { fields } = this.form
      fields.charges.splice(index, 1)
    },
  },
  computed: {
    showModal: {
      get: function() {
        return this.show
      },
      set: function(newValue) {
        return newValue
      }
    },
    totalCharges() {
      // const { charges } = this.form.fields
      // if (charges) {
      //   return charges.reduce((total, charge) => total += Number(charge.pivot.amount), 0); 
      // }
      
      return 0
    },
    totalPayment() {
      const { charges } = this.form.fields
      // if (charges) {
      //   return charges.reduce((total, charge) => total += Number(charge.pivot.amount), 0); 
      // }
      
      return 0
    }
  },
  mounted() {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = 'hidden';
    }
  },
  beforeDestroy() {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = 'auto';
    }
  },
}
</script>

<style lang="scss" scoped>

  .payment__main-container {
    width: 100%;
    height: 100vh;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    // overflow-x: hidden;
    z-index: 1030;
  }

  .payment_header { 
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    height: 100px;
    background-color: whitesmoke;
    border-bottom: solid 1px lightgray;
    width: calc(100% - 15px);
    z-index: 199;

    .back-button-container {
      width: 200px;
      height: 100%;
      justify-content: center;
      align-items: center;
      border: none;
      font-size: 24pt;

      .back-icon {
        width: 35px;
        height: 35px;
      }

      &:hover {
        background-color: lightgray;
      }
    }

    .header-content-container {
      flex: 1;
      display: flex;
      height: 100%;
      align-items: center;

      .header-info {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        padding: 0 20px;
        flex-direction: column;
        height: 100%;
        // border: solid 1px;

        .header__title {
          font-size: 16pt;
          font-weight: bold;
        }

        .header__sub-title {
          font-size: 10pt;
          color: #a19e9e;
        }
      }

      .header-options {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        min-width: 100px;
        height: 100%;
        margin-right: 5px;;

        .loading-icon {
          margin-right: 10px;
        }
      }

      .header-group {
        width: 30%;
        display: flex;
        flex-direction: column
      }

      .header-label {
        font-size: 12pt;
        color: gray;
      }
    }
  }

  .left-pane {
    height: 100%;
    min-width: 200px;
    position: relative;
    padding: 10px;
    border-right: solid 1px lightgray;

    .side-nav {
      padding: 5px;
      display: flex;
      // align-items: center;
      position: sticky;
      top: 110px;
      flex-direction: column;

      .side-nav-item {
        font-size: 10.5pt;
        margin-bottom: 15px;
        padding: 0 5px;
        min-height: 30px;
        display: flex;
        align-items: center;
        text-decoration: none;


        &.active {
          background-color: lightblue;
          color: white;
          font-weight: bold;
          border-radius: 5px;
        }

        &:hover {
          cursor: pointer;
          background-color: lightgray;
        }
      }
    }
  }

  .right-pane {
    height: 100%;
    min-width: 250px;
    background-color: white;
    border-left: solid 1px lightgray;
    padding: 10px;
    position: relative;

    .summary-wrapper {
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 110px;
    }
  }

  .payment__content {
    display: flex;
    flex: 1;
    margin-top: 100px;
  }

  .content-pane {
    flex: 1;
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 30px;
    position: relative;

    .content-section {
      margin-bottom: 30px;
      width: 100%;
    }

    .content_footer {
      min-height: 60px;
      justify-content: flex-end;
      align-items: center;
      display: flex;
      background-color: white;
      position: sticky;
      bottom: 0;
      border-top: solid 1px lightgray;
      margin: 0;
    }

  }

  .section-item {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    margin-bottom: 30px;
    
    .section-content {
      width: 100%;
      padding-left: 40px;
      padding-top: 10px;
    }
  }

  .client-info__wrapper {
    display: flex;
    height: auto;
    width: 100%;
    // justify-content: space-between;

    .client-info__left {
      width: 50%;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
    }

    .client-info__right {
      width: 50%;
      display: flex;
      flex-direction: column;
    }
  }

  .services__wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;

    .services__filters {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      .services__button {
        width: auto;
      }

      .services__search {
        max-width: 300px;
      }
    }

    .service__code {
      font-size: 8pt;
      color: gray;
    }

  }

  .charges__wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;

    .charges__filters {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      .charges__button {
        width: auto;
      }

      .charges__search {
        max-width: 300px;
      }
    }
  }

  .documents__wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    height: auto;
    min-height: 350px;
  }

  .document-item {

    min-width: 170px;
    height: 200px;
    display: flex;
    flex-direction: column;
    border: solid 1px lightgray;
    margin-right: 10px;
    margin-bottom: 10px;
    transition: all 0.3s;
  
    .document-item__icon  {
      flex: 1;
      padding: 8px;
      display: flex;
      justify-content: center;
      align-items: center;

      .folder-icon {
        width: 100px;
        height: 100px;
      }
    }

    .document-item__info {
      height: 50px;
      border-top: solid 1px lightgray;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .document-item__title {
        font-size: 10pt;
        font-weight: bold;
      }

      .document-item__sub-title {
        font-size: 8pt;
        font-weight: bold;
      }

    }

    &:hover {
      -webkit-box-shadow: 0px 0px 8px 0.5px #757575;
      box-shadow: 0px 0px 8px 0.5px #757575;
      cursor: pointer;
      width: 180px;
      height: 210px;
    }
  }


  .button-footer {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      align-items: center;
  }

  .client-label__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-bar__container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;

    .search-bar {
      max-width: 250px!important;
    }
  }

  /* ---------------------------------- */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .4s linear;
    .billing-header,.billing-content {
      transition: transform 0.35s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.35s linear;
    }
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    .billing-header,.billing-content {
      // opacity: 0;
      transform: scale(0.3) translateY(-50%);
    }
  }
  
  .summary-group {
    margin: 10px 0;
    width: 100%;
    color: rgb(61, 60, 60);

    .summary-label {
      font-size: 12pt;
      font-weight: bold;
      width: 100%;
    }

    .summary-link {
      color: rgb(21, 30, 153);

      &:hover {
        color: rgb(77, 87, 221);
        cursor: pointer;
        text-decoration: underline;
      }
    }

    .summary-amount {
      font-size: 18pt;
      width: 100%;
      font-weight: 500;
      text-align: right;
    }
  }

  .row__sub-label {
    font-size: 8pt!important;
    color: gray!important;
  }

</style>
