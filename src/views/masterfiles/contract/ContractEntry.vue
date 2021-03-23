<template>
  <transition-group name="fade" appear >
    <div class="contract__main-container" id="contract__main-container" key="main" v-show="showModal">
      <div class="contract_header">
        <button class="back-button-container" @click="$emit('onBack')">
          <v-icon name="chevron-left" class="back-icon"/>
          Back
        </button>
        <div class="header-content-container">
          <!-- <div class="header-info">
            <div class="header-group">
              <div class="header-label"> header info 2-1 </div>
              <div class="header-label"> header info 2-2 </div>
            </div>
            <div class="header-group ml-2" >
              <div class="header-label"> header info 2-1 </div>
              <div class="header-label"> header info 2-2 </div>
            </div>
          </div> -->
          <div class="header-info">
            <div class="header__title ">
              CONTRACT ENTRY
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
              <b-dropdown-item
                @click="$emit('onBack')">
                Close
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="contract_content">
        <div class="left-pane">
          <div class="side-nav" >
            <a class="side-nav-item"
              :href="`#${nav.name}`"
              v-for="(nav, idx ) in navOptions" 
              :key="idx" 
              :class="{ active: activeIndex === idx}"
              v-smooth-scroll="{ duration: 500, offset: -130, container: '#contract__main-container', updateHistory: false}"
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
                      <label class="required"> Contract No</label>
                      <b-form-input
                        disabled
                        :value="mode === 'Add' ? 'Auto Generated' : form.fields.contractNo"/>
                    </b-form-group>
                    <b-form-group>
                      <div class="client-label__container">
                        <label class="required"> Client</label>
                        <label class="select-link" @click="showClientModal=true">Select Client</label>
                      </div>
                      <b-form-input
                        :state="form.states.clientId" 
                        v-model="form.fields.client.name"
                        disabled/>
                      <b-form-invalid-feedback>
                        {{ form.errors.clientId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Tradename</label>
                      <b-form-textarea rows="2"
                        :state="form.states.tradeName"
                        v-model="form.fields.tradeName"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.tradeName }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Billing Address</label>
                      <b-form-textarea rows="2" 
                        :state="form.states.billingAddress"
                        v-model="form.fields.billingAddress"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.billingAddress }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                  <div class="client-info__middle">
                    <b-form-group>
                      <label class="required"> TIN</label>
                      <b-form-input
                        :state="form.states.tin"
                        v-model="form.fields.tin"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.tin }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Contact Person</label>
                      <b-form-input 
                        :state="form.states.contactPerson"
                        v-model="form.fields.contactPerson"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.contactPerson }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Contact No</label>
                      <b-form-input
                        :state="form.states.contactNo"
                        v-model="form.fields.contactNo"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.contactNo }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="required"> Date Started</label>
                      <b-form-datepicker
                        :state="form.states.dateStarted"
                        v-model="form.fields.dateStarted"/>
                      <b-form-invalid-feedback>
                        {{ form.errors.dateStarted }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>
                  <div class="client-info__right">
                    <b-form-group
                      :invalid-feedback="form.errors.locationId"
                      :state="form.states.locationId">
                      <label class="required">Location</label>
                      <v-select
                        :options="options.locations.items"
                        label="name"
                        :disabled="options.locations.isBusy"
                        v-model="form.fields.locationId"
                        :reduce="location => location.id"
                        :class=" { 'is-invalid' : !!form.errors.locationId  }"
                        :loading="options.locations.isBusy"
                      >
                        <template #spinner="{ loading }">
                          <div v-if="loading" style="border-left-color: rgba(88,151,251,0.71)" class="vs__spinner" />
                        </template>
                      </v-select>
                    </b-form-group>
                    <b-form-group>
                      <label> RDO</label>
                      <b-form-input 
                        disabled
                        :value="form.fields.locationId && options.locations.items.length > 0 ? 
                          options.locations.items.find(l => l.id === form.fields.locationId).rdo.name : null" />
                    </b-form-group>
                    <b-form-group
                      :state="form.states.taxTypeId"
                      :invalid-feedback="form.errors.taxTypeId">
                      <label class="required">Tax Type</label>
                      <v-select
                        v-model="form.fields.taxTypeId"
                        :options="options.taxTypes.items"
                        label="name"
                        :reduce="item => item.id"
                        appendToBody
                      />
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
                <div class="services__wrapper">
                  <div class="services__filters">
                    <b-button class="services__button" variant="outline-primary" @click="showServicesModal = true">Add Services</b-button>
                  </div>
                  <CustomTable
                    :table="tables.services"
                    :items="form.fields.services"
                    isOtherItems
                    :filter="filters.contractService">
                    <template v-slot:cell(name)="data">
                      <div >{{ data.item.name }}</div>
                      <div class="service__code">{{ data.item.code }}</div>
                    </template>
                    <template v-slot:cell(action)="{ index }">
                      <b-btn
                        @click="onRemoveService(index)" 
                        size="sm"
                        variant="danger">
                        <v-icon name="trash" />
                      </b-btn>
                    </template>
                  </CustomTable>
                </div>
              </div>
            </div>
            <div class="section-item" :id="navOptions[2].name">
              <ActiveViewSectionHeader
                :sectionNumber="3"
                :sectionHeader="navOptions[2].header"
                :sectionSubHeader="navOptions[2].subHeader"  />
              <div class="section-content">
                <div class="charges__wrapper" ref="chargesWrapper">
                  <div class="charges__filters">
                    <b-button class="charges__button" variant="outline-primary" @click="showChargesModal=true">Add Charges</b-button>
                  </div>
                  <CustomTable
                    :table="tables.charges"
                    :items="form.fields.charges"
                    isOtherItems
                    :filter="filters.contractCharge">
                    <template v-slot:cell(action)="{ index }">
                      <b-btn
                        @click="onRemoveCharge(index)" 
                        size="sm"
                        variant="danger">
                        <v-icon name="trash" />
                      </b-btn>
                    </template>
                    <template v-slot:cell(schedules)="data" >
                      <v-select
                        v-model="data.item.schedules"
                        :options="Months.values"
                        label="name"
                        multiple
                        appendToBody
                        :calculate-position="withPopper"
                      />
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
        </div>
      </div>
     
      <ClientsModal
        @clickClient="onSelectClient($event)"
        @close="showClientModal = false"
        :show="showClientModal"/>

      <ServicesModal
        @clickService="onAddService($event)"
        @close="showServicesModal = false"
        :show="showServicesModal"/>

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
  ServicesModal,
  ClientsModal } from "../../components";
import Folder from '../../../assets/svg/Folder.svg'
import AddFile from '../../../assets/svg/AddFile.svg'
import { formatNumber, showNotification, validate } from '../../../helpers/forms'
import { ChargeApi, ClientApi, ContractApi, LocationApi, ServiceApi, TaxTypeApi } from "../../../mixins/api";
import { Months } from "../../../helpers/enum";
import { createPopper } from '@popperjs/core';
import tables from '../../../helpers/tables';
import { copyValue } from '../../../helpers/extractor';

export default {
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
    ChargesModal,
    ServicesModal,
    ClientsModal,
  },
  props: {
    show: Boolean,
    mode: { 
      type: String,
      default: 'Add' 
    },
    contractId: {
      type: Number,
      default: null
    },
    form: {
      type: Object
    }
  },
  mixins: [ ContractApi, ServiceApi, ChargeApi, ClientApi, LocationApi, TaxTypeApi, tables ],
  data() {
    return {
      activeIndex: 0,
      showServicesModal: false,
      showChargesModal: false,
      showClientModal: false,
      Months: Months,
      placement: 'bottom',
      navOptions: [
        {
          name: 'clientInfo',
          header: 'Client Information',
          subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          name: 'services',
          header: 'Services',
          subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          name: 'charges',
          header: 'Charges',
          subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        // {
        //   name: 'contractDocuments',
        //   header: 'Documents',
        //   subHeader: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        // },
      ],
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
            {
              key: 'action',
              label: '',
              thClass: 'align-middle',
              thStyle: '{ width: 20px }'
            }
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
              key: 'pivot.amount',
              label: 'Default Amount',
              thClass: 'align-middle',
              tdClass: 'text-right align-middle',
              thStyle: 'width: 17%',
              formatter: (value) => {
                return formatNumber(value)
              }
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: '{ width: 20px }'
            }
          ],
          items: []
        }
      },
      options: {
        documents: {
          isBusy: false,
          items: []
        },
        locations: {
          isBusy: false,
          items: []
        },
        taxTypes: {
          items: []
        }
      },
      filters: {
        contractService: {
          criteria: null
        },
        contractCharge: {
          criteria: null
        },
      },
      paginations: {
        contractService: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        contractCharge: {
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
    this.loadLocations()
    this.loadTaxTypes()
  },
  methods: {
    loadLocations(){
      const { locations } = this.options
      locations.isBusy = true
      this.getLocationList({ paginate: false }).then(({ data }) => {
        locations.items = data
        locations.isBusy = false
      }).catch(error => {
        console.log(error)
        locations.isBusy = false
      })
    },
    loadTaxTypes(){
      const { taxTypes } = this.options
      this.getTaxTypeList({ paginate: false }).then(({ data }) => {
        taxTypes.items = data
      }).catch(error => {
        console.log(error)
      })
    },
    onSelectNav(idx) {
      this.activeIndex = idx
    },
    onAddService(service) {
      const { fields } = this.form
      if(fields.services.find(s => s.id === service.id)) {
        showNotification(this, 'danger', 'Service already added.')
        return
      }
      fields.services.push({
        id: service.id,
        name: service.name,
        description: service.description,
        code: service.code,
        serviceCategoryId: service.serviceCategoryId,
        serviceCategory: { ...service.serviceCategory }
      })
    },
    onRemoveService(index) {
      const { fields } = this.form
      fields.services.splice(index, 1)
    },
    onSelectClient(client) {
      const { fields } = this.form
      fields.clientId = client.id
      fields.client.name = client.name
      this.showClientModal = false
    },
    onAddCharge(charge) {
      const { fields } = this.form
      if(fields.charges.find(c => c.id === charge.id)) {
        showNotification(this, 'danger', 'Charge already added.')
        return
      }
      fields.charges.push({
        ...charge,
        schedules: [],
        pivot: {
          amount: 0
        }
      })
    },
    onRemoveCharge(index) {
      const { fields } = this.form
      fields.charges.splice(index, 1)
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
    }
  },
  mounted() {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = 'hidden!important';
    }
  },
  beforeDestroy() {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = 'auto!important';
    }
  },
}
</script>

<style lang="scss" scoped>

  .contract__main-container {
    width: 100%;
    height: 100vh;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    z-index: 1030;
  }

  .contract_header { 
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
    display: none;
  }


  .contract_content {
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
    flex-direction: column;

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
      width: 32%;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
    }

    .client-info__middle {
      width: 32%;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
    }

    .client-info__right {
      width: 32%;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
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
    .contract-header,.contract-content {
      transition: transform 0.35s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.35s linear;
    }
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    .contract-header,.contract-content {
      // opacity: 0;
      transform: scale(0.3) translateY(-50%);
    }
  }
  
  
</style>
