<template>
  <transition-group name="fade" appear >
    <div class="disbursement__main-container" id="disbursement__main-container" key="main" v-if="showModal">
      <loading
        :can-cancel="false" 
        :is-full-page="false"
        :active.sync="isLoading" >
      </loading>
      <div class="disbursement__header">
        <button class="back-button-container" @click="$emit('onBack')">
          <v-icon name="chevron-left" class="back-icon"/>
          Back
          </button>
        <div class="header-content-container">
          <div class="header-info">
            <div class="header__title ">
              DISBURSEMENT ENTRY
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
                @click="onSave()">
                Save
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="disbursement__content">
        <div class="left-pane">
          <div class="side-nav" >
            <a class="side-nav-item"
              :href="`#${nav.name}`"
              v-for="(nav, idx ) in navOptions" 
              :key="idx" 
              :class="{ active: activeIndex === idx}"
              v-smooth-scroll="{ duration: 500, offset: -130, container: '#disbursement__main-container', updateHistory: false}"
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
                <div class="cheque-info__wrapper">
                  <div class="cheque-info__left">
                    <b-form-group>
                      <label class="required"> Voucher No</label>
                      <b-form-input
                        v-model="form.fields.voucherNo"
                        :state="form.states.voucherNo"
                        ref="voucherNo"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.voucherNo }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Payee</label>
                      <b-form-input
                        v-model="form.fields.payee"
                        :state="form.states.payee"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.payee }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Address</label>
                      <b-form-textarea rows="5" 
                        :state="form.states.address"
                        v-model="form.fields.address"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.address }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                  <div class="cheque-info__right">
                    <b-form-group
                      :state="form.states.bankId"
                      :invalid-feedback="form.errors.bankId">
                      <label class="required">Bank</label>
                      <v-select
                        v-model="form.fields.bankId"
                        :options="options.banks.items"
                        label="name"
                        :reduce="bank => bank.id"
                        appendToBody
                        :class=" { 'is-invalid' : !!form.errors.bankId  }"
                        :loading="options.banks.isBusy"
                      />
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Cheque No</label>
                      <b-form-input rows="2" 
                        :state="form.states.chequeNo"
                        v-model="form.fields.chequeNo"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.chequeNo }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Cheque Date</label>
                      <b-form-datepicker 
                        v-model="form.fields.chequeDate"
                        :state="form.states.chequeDate"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.chequeDate }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Cheque Amount</label>
                      <v-autonumeric
                        class="form-control text-right"
                        v-model="form.fields.chequeAmount"
                        :class=" { 'is-invalid' : !!form.errors.chequeAmount  }"
                        :state="form.states.chequeAmount"
                        :options="{
                          minimumValue: '0',
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0
                        }"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.chequeAmount }}
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
                    <b-button class="charges__button" 
                      variant="outline-primary" 
                      @click="onAddParticular()">Add Particular</b-button>
                  </div>
                  <CustomTable
                    :table="tables.disbursementDetails"
                    :filter="filters.disbursementDetail"
                    :items="form.fields.disbursementDetails"
                    isOtherItems>
                    <template #cell(particular)="data">
                      <b-form-input
                        v-model="data.item.particular"
                        debounce="500"
                        :style="particularStyle(data.item.particular)"
                        class="row-field">

                      </b-form-input>
                    </template>
                    <template #cell(amount)="data">
                      <v-autonumeric
                        class="form-control text-right row-field"
                        :style="ammountStyle(data.item.amount)"
                        v-model="data.item.amount"
                        :options="{
                          minimumValue: '0',
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0
                        }"
                        debounce="500"/>
                    </template>
                    <template #cell(accountTitle)="data" >
                      <v-select
                        v-model="data.item.accountTitleId"
                        :style="accountTitleStyle(data.item.accountTitleId)"
                        :options="options.accountTitles.items"
                        label="name"
                        appendToBody
                        :reduce="accountTitle => accountTitle.id"
                        :calculate-position="withPopper"
                        class="row-field"
                      />
                    </template>
                    <template #cell(action)="{index}">
                      <b-button
                        size="sm"
                        variant="outline-danger"
                        @click="onRemoveParticular(index)">
                        <v-icon name="trash"/>
                      </b-button>
                    </template>
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
                        <b-td></b-td>
                      </b-tr>
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
        <!-- <div class="right-pane">
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
        </div> -->
      </div>
    </div>
  </transition-group>
</template>

<script>
import { 
  ActiveViewSectionHeader,
  CustomTable,
  SaveButton,
  CloseButton } from "../../components";
import CustomToolTip from '../../components/CustomToolTip'
import { formatNumber, showNotification } from '../../../helpers/forms'
import { AccountTitleApi, BankApi, DisbursementApi } from "../../../mixins/api";
import { DisbursementStatuses } from "../../../helpers/enum";
import { createPopper } from '@popperjs/core';
import { copyValue } from '../../../helpers/extractor';
import { format } from 'date-fns'

export default {
  format,
  formatNumber,
  components: {
    ActiveViewSectionHeader,
    CustomTable,
    CustomToolTip,
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
    disbursementId: {
      type: Number,
      default: null
    },
  },
  DisbursementStatuses,
  mixins: [ DisbursementApi, AccountTitleApi, BankApi ],
  data() {
    return {
      isLoading: false,
      activeIndex: 0,
      showServicesModal: false,
      showChargesModal: false,
      showClientModal: false,
      placement: 'bottom',
      chargeTable: null,
      navOptions: [
        {
          name: 'chequeInfo',
          header: 'Cheque Information',
          subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          name: 'disbursementDetails',
          header: 'Particulars',
          subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
      ],
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
              key: 'accountTitle',
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
      },
      options: {
        accountTitles: {
          isBusy: false,
          items: []
        },
        banks: {
          isBusy: false,
          items: []
        }
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
  created() {
    // this.isLoading = true
    // const { charges, disbursementDetails } = this.tables
    // const { fields } = this.form
    
    this.loadAccountTitles()
    this.loadBanks()
  },
  methods: {
    onSelectNav(idx) {
      this.activeIndex = idx
    },
    loadAccountTitles() {
      const { accountTitles } = this.options
      const params = { paginate: false }
      accountTitles.isBusy = true
      this.getAccountTitleList(params).then(({ data }) => {
        accountTitles.items = data
        accountTitles.isBusy = false
      })    
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
    onAddParticular() {
      const { disbursementDetails } = this.form.fields
      disbursementDetails.push({
        id: null,
        particular: '',
        accountTitleId : null,
        amount: 0
      })
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
    onRemoveParticular(index) {
      const { fields } = this.form
      fields.disbursementDetails.splice(index, 1)
    },
    onSave() {
      this.$emit('save')
    },
    particularStyle(value) {
      if(value === '' || value === null) {
        return { '--border' : 'solid 1px #f7706c' }
      }
      return { '--border' : 'solid 1px #ced4da' }
    },
    accountTitleStyle(value) {
      if(value === '' || value === null) {
        return { '--border' : 'solid 1px #f7706c' }
      }
      return { '--border' : 'none' }
    },
    ammountStyle(value) {
      if(value === 0 || value === null) {
        return { '--border' : 'solid 1px #f7706c' }
      }
      return { '--border' : 'solid 1px #ced4da' }
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
    totalDisbursementDetailsAmount() {
      const { disbursementDetails } = this.form.fields
      if (disbursementDetails.length > 0) {
        return disbursementDetails.reduce((total, item) => total += Number(item.amount), 0); 
      }
      
      return 0
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

  .disbursement__main-container {
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
    z-index: 9995;
  }

  .disbursement__header { 
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

  .disbursement__content {
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

  .cheque-info__wrapper {
    display: flex;
    height: auto;
    width: 100%;
    // justify-content: space-between;

    .cheque-info__left {
      width: 33%;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
    }

    .cheque-info__right {
      width: 33%;
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

  .row-field {
    border: var(--border);
  }

</style>
