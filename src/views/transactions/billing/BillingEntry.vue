<template>
  <transition-group name="fade" appear >
    <div class="billing__main-container" id="billing__main-container" key="main" v-if="showModal">
      <loading
        :can-cancel="false" 
        :is-full-page="false"
        :active.sync="isLoading" >
      </loading>
      <div class="billing_header">
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
            <div class="header-group" >
              <span class="header-label">Billing Date :</span>
              <div class="header-label"> {{ form.fields.billingDate ? $options.format(new Date(form.fields.billingDate), 'MM/dd/yyyy') : '[ Billing Date ]' }} </div>
            </div>
            <div class="header-group" >
              <span class="header-label">Due Date :</span>
              <div class="header-label"> {{ form.fields.dueDate ? $options.format(new Date(form.fields.dueDate), 'MM/dd/yyyy') : '[ Due Date ]'}} </div>
            </div>
          </div> -->
          <div class="header-info">
            <div class="header__title ">
              BILLING ENTRY
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
      <div class="billing_content">
        <div class="left-pane">
          <div class="side-nav" >
            <a class="side-nav-item"
              :href="`#${nav.name}`"
              v-for="(nav, idx ) in navOptions" 
              :key="idx" 
              :class="{ active: activeIndex === idx}"
              v-smooth-scroll="{ duration: 500, offset: -130, container: '#billing__main-container', updateHistory: false}"
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
                      <label class="required"> Billing No</label>
                      <b-form-input 
                        disabled
                        :value="mode === 'Add' ? 'Auto Generated' : form.fields.billingNo"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.billingNo }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <div class="client-label__container">
                        <label class="required"> Client</label>
                        <label class="select-link" @click="showClientModal=true">Select Client</label>
                      </div>
                      <b-form-input 
                        :value="form.fields.client ? form.fields.client.name : null"
                        :state="form.states.clientId"
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
                        :class="{'is-invalid' : !!form.errors.contractId}"
                        v-model="form.fields.contractId"
                        :reduce="contract => contract.id"
                        @input="onSelectContract"
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
                    <b-form-group>
                      <label class="required"> Billing Date</label>
                      <b-form-datepicker
                        :state="form.states.billingDate"
                        v-model="form.fields.billingDate"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.billingDate }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Due Date</label>
                      <b-form-datepicker 
                        :state="form.states.dueDate"
                        v-model="form.fields.dueDate"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.dueDate }}
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
                    <b-button class="charges__button" variant="outline-primary" @click="setAddCharge('charge')">Add Charges</b-button>
                    <!-- <b-form-input 
                      class="charges__search"
                      placeholder="Search Here..."></b-form-input> -->
                  </div>
                  <CustomTable
                    :table="tables.charges"
                    :filter="filters.charge"
                    isOtherItems
                    :items="form.fields.charges">
                    <template v-slot:cell(remarks)="data">
                      <b-form-input
                        v-model="data.item.pivot.notes">

                      </b-form-input>
                    </template>
                    <template v-slot:cell(pivot.amount)="data">
                      <v-autonumeric
                        class="form-control text-right"
                        v-model="data.item.pivot.amount"
                        :options="{
                          minimumValue: '0',
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0
                        }"/>
                    </template>
                    <template v-slot:cell(action)="{index}">
                      <b-button
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
            <div class="section-item" :id="navOptions[2].name">
              <ActiveViewSectionHeader
                :sectionNumber="2"
                :sectionHeader="navOptions[2].header"
                :sectionSubHeader="navOptions[2].subHeader"  />
              <div class="section-content">
                <div class="charges__wrapper" ref="chargesWrapper">
                  <div class="charges__filters">
                    <b-button class="charges__button" variant="outline-primary" @click="setAddCharge('adjustment')">Add Charges</b-button>
                    <!-- <b-form-input 
                      class="charges__search"
                      placeholder="Search Here..."></b-form-input> -->
                  </div>
                  <CustomTable
                    :table="tables.adjustmentCharges"
                    :filter="filters.adjustmentCharge"
                    isOtherItems
                    :items="form.fields.adjustmentCharges">
                    <template v-slot:cell(remarks)="data">
                      <b-form-input
                        v-model="data.item.pivot.notes"/>
                    </template>
                    <template v-slot:cell(pivot.amount)="data">
                      <v-autonumeric
                        class="form-control text-right"
                        v-model="data.item.pivot.amount"
                        :options="{
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0
                        }"/>
                    </template>
                    <template v-slot:cell(action)="{ index }">
                      <b-button
                        size="sm" 
                        variant="outline-danger"
                        @click="onRemoveAdjustmentCharge(index)">
                        <v-icon name="trash"/>
                      </b-button>
                    </template>
                  </CustomTable>
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
              <div class="summary-label summary-link">PREVIOUS BALANCE</div>
              <div class="summary-amount">0.00</div>
            </div>

            <div>CURRENT CHARGES</div>
            <div class="summary-group">
              <div class="summary-label">CHARGES</div>
              <div class="summary-amount">{{ $options.formatNumber(totalCharges) }}</div>
            </div>

            <div class="summary-group">
              <div class="summary-label">ADJUSTMENT</div>
              <div class="summary-amount">{{ $options.formatNumber(totalAdjustmentCharges) }}</div>
            </div>

            <div>TOTAL</div>
            <div class="summary-group">
              <div class="summary-label">TOTAL AMOUNT DUE</div>
              <div class="summary-amount">{{ $options.formatNumber(totalAmountDue) }}</div>
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
  CustomModal,
  SaveButton, 
  CloseButton, 
  SearchBar, 
  CustomPagination, 
  ChargesModal,
  ClientsModal } from "../../components";
import CustomToolTip from '../../components/CustomToolTip'
import Folder from '../../../assets/svg/Folder.svg'
import AddFile from '../../../assets/svg/AddFile.svg'
import { formatNumber, showNotification } from '../../../helpers/forms'
import { BillingApi, ChargeApi, ClientApi, ContractApi, ServiceApi } from "../../../mixins/api";
import { Months } from "../../../helpers/enum";
import { createPopper } from '@popperjs/core';
import { copyValue } from '../../../helpers/extractor';
import { format } from 'date-fns'

export default {
  format,
  formatNumber,
  components: {
    ActiveViewSectionHeader,
    CustomTable,
    Folder,
    AddFile,
    CustomModal,
    SaveButton,
    CloseButton,
    SearchBar,
    CustomPagination,
    CustomToolTip,
    ChargesModal,
    ClientsModal
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
    year: Number,
  },
  mixins: [ ContractApi, ServiceApi, ChargeApi, ClientApi, BillingApi ],
  data() {
    return {
      isLoading: false,
      activeIndex: 0,
      showServicesModal: false,
      showChargesModal: false,
      showClientModal: false,
      Months: Months,
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
        {
          name: 'billingAdjustments',
          header: 'Adjustments',
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
        documents: {
          items: []
        },
        charges: {
          items: []
        },
        services: {
          items: []
        },
        contracts: {
          isBusy: false,
          items: []
        }
      },
      filters: {
        charge: {
          criteria: null
        },
        adjustmentCharge: {
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
    // const { fields } = this.form
  },
  methods: {
    onSelectNav(idx) {
      this.activeIndex = idx
    },
    loadServices() {
      const { services } = this.tables
      const params = { paginate: false }
      services.isBusy = true
      this.getServiceList(params).then(({ data }) => {
        services.items = data
        services.isBusy = false
      })    
    },
    loadCharges() {
      const { charges } = this.tables
      const params = { paginate: false }
      charges.isBusy = true
      this.getChargeList(params).then(({ data }) => {
        charges.items = data
        charges.isBusy = false
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
    setAddCharge(table) {
      this.chargeTable = table
      this.showChargesModal = true
    },
    onAddCharge(charge) {
      const { fields } = this.form
      if (this.chargeTable === 'charge') {
        if(fields.charges.find(c => c.id === charge.id)) {
          showNotification(this, 'danger', 'Charge already added.')
          return
        }
        fields.charges.push({
          ...charge,
          pivot: {
            amount: 0,
            notes: ''
          }
        })
      }
      else {
        if(fields.adjustmentCharges.find(c => c.id === charge.id)) {
          showNotification(this, 'danger', 'Charge already added.')
          return
        }
        fields.adjustmentCharges.push({
          ...charge,
          schedules: [],
          pivot: {
            amount: 0,
            notes: ''
          }
        })
      }
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
    onRemoveCharge(index) {
      const { fields } = this.form
      fields.charges.splice(index, 1)
    },
    onRemoveAdjustmentCharge(index) {
      const { fields } = this.form
      fields.adjustmentCharges.splice(index, 1)
    },
    onSelectContract(id) {
      const { fields } = this.form
      const { charges } = this.tables
      charges.isBusy = true
      
      if (!id) {
        charges.isBusy = false
        fields.charges = []
        return
      }

      this.getContract(id).then(( { data }) => {
        if(this.mode === 'Add') {
          const charges = data.charges.filter(
            charge => charge.schedules.some(s => s.id === this.monthId))
          fields.charges = charges.map(charge => {
            const { schedules, pivot, ...chargeData } = charge
            return {
              ...chargeData,
              pivot: {
                ...pivot,
                notes: ''
              }
            }
          })
        }
        charges.isBusy = false
      })
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
      const { charges } = this.form.fields
      if (charges) {
        return charges.reduce((total, charge) => total += Number(charge.pivot.amount), 0); 
      }
      
      return 0
    },
    totalAdjustmentCharges() {
      const { adjustmentCharges } = this.form.fields
      if (adjustmentCharges) {
        return adjustmentCharges.reduce((total, charge) => total += Number(charge.pivot.amount), 0); 
      }

      return 0
    },
    totalAmountDue() {
      //todo need to add the previous balance
      return Number(this.totalCharges) + Number(this.totalAdjustmentCharges) 
    },

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

  .billing__main-container {
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

  .billing_header { 
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

  .billing_content {
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
