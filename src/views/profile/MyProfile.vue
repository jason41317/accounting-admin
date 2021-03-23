<template>
  <div class="profile__main-container">
    <div class="profile__body-container">
      <div class="profile__left-pane">
        <Avatar text="JD" :height="80" :width="80" :text-size="24"/>
        <div class="profile-name">JDEV OFFICE SOLUTION</div>
        <div class="profile-username">admin@jdev.com</div>
        <div class="profile-usergroup">Super User</div>

        <ul class="profile-nav">
          <li class="profile-nav-item" :class="{ active: selectedIndex === index}" v-for="(nav, index) in profileNavs" :key="index" @click="selectedIndex=index" >
            <div><v-icon :name="nav.icon" class="profile-nav-item-icon"/>{{ nav.title }}</div>
          </li>
        </ul>
      </div>
      <div class="profile__right-pane">
        <div class="profile__nav-title" :key="title">{{ profileNavs[selectedIndex].title }}</div>
        <div class="profile__nav-sub-title" :key="subTitle">{{ profileNavs[selectedIndex].subTitle }}</div>
        <div class="profile__section" :key="1" v-if="selectedIndex === 0">
          <b-row>
            <b-col md=4>
              <b-form-group>
                <label class="required">Lastname : </label>
                <b-form-input></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md=4>
              <b-form-group>
                <label class="required">Firstname : </label>
                <b-form-input></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md=4>
              <b-form-group>
                <label class="required">Middlename : </label>
                <b-form-input></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md=4>
              <b-form-group>
                <label class="required">Birthdate : </label>
                <b-form-datepicker></b-form-datepicker>
              </b-form-group>
            </b-col>
            <b-col md=4>
              <b-form-group>
                <label class="required">Mobile No: </label>
                <b-form-input></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md=4>
              <b-form-group>
                <label class="required">Phone No : </label>
                <b-form-input></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md=12>
              <b-form-group>
                <label class="required">Address : </label>
                  <b-form-textarea rows=4>

                  </b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <div class="profile__section" :key="2" v-if="selectedIndex === 1">
          <b-row>
            <b-col md=6>
              <!-- <div class="account-header">Change Username</div> -->
              <b-form-group>
                <label class="required">Username : </label>
                <b-form-input></b-form-input>
              </b-form-group>
              <b-form-group>
                <label class="required">Old Password : </label>
                <b-form-input></b-form-input>
              </b-form-group>
              <b-form-group>
                <label class="required">New Password : </label>
                <b-form-input></b-form-input>
              </b-form-group>
              <b-form-group>
                <label class="required">Confirm Password : </label>
                <b-form-input></b-form-input>
              </b-form-group>
              <!-- <div class="account-button-container">
                <SaveButton class="account-update-button" label="Update Username" />
              </div> -->
            </b-col>
          </b-row>
          <!-- <b-row>
            <b-col md=6>
              <div class="account-header">Change Password</div>
              <b-form-group>
                <label class="required">Old Password : </label>
                <b-form-input></b-form-input>
              </b-form-group>
              <b-form-group>
                <label class="required">New Password : </label>
                <b-form-input></b-form-input>
              </b-form-group>
              <b-form-group>
                <label class="required">Confirm Password : </label>
                <b-form-input></b-form-input>
              </b-form-group>
              <div class="account-button-container">
                <SaveButton class="account-update-button" label="Change Password" />
              </div>
            </b-col>
          </b-row> -->
        </div>
        <div class="profile__section" :key="3" v-if="selectedIndex === 2">
          <CustomTable
            :table="tables.contracts"
            :pagination="paginations.contract"
            :filter="filters.contract"
          >
            <template v-slot:cell(company)="data">
              <b-link @click="onContractToggleDetails(data)">{{ data.item.tradeName }}</b-link>
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
          </CustomTable>
        </div>
        <div class="profile__section" :key="4" v-if="selectedIndex === 3">
          <Maintenance />
        </div>
        <!-- <div class="profile__footer">
          <SaveButton label="Update"></SaveButton>
        </div> -->
      </div>
      
    </div>
  </div>
</template>

<script>
import Avatar from '../components/Avatar'
import SaveButton from '../components/SaveButton'
import CustomTable from '../components/CustomTable'
import CustomToolTip from '../components/CustomToolTip'
import ContractRowDetail from '../components/ContractRowDetail'
import { copyValue } from '../../helpers/extractor';
import { PersonnelApi,ContractApi } from '../../mixins/api'
import { ContractStatuses } from '../../helpers/enum'
import Maintenance from '../components/Maintenance'


export default {
  components: {
    Avatar,
    SaveButton,
    CustomTable,
    CustomToolTip,
    ContractRowDetail,
    Maintenance
  },
  ContractStatuses,
  mixins:[ ContractApi, PersonnelApi ],
  data() {
    return {
      selectedIndex: 0,
      profileNavs: [
        {
          title: 'Profile',
          subTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium neque nulla, qui dolorum repellat vero?',
          icon: 'user'
        },
        {
          title: 'Account',
          subTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium neque nulla, qui dolorum repellat vero?',
          icon: 'address-card'
        },
        {
          title: 'Clients',
          subTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium neque nulla, qui dolorum repellat vero?',
          icon: 'rss'
        },
        {
          title: 'Settings',
          subTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium neque nulla, qui dolorum repellat vero?',
          icon: 'cogs'
        },
      ],
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
        }
      },
    }
  },
  methods: {
    onContractToggleDetails(row) {
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
    },
    loadContracts() {
      const { contracts } = this.tables
      const { contract, contract: { perPage, page } } = this.paginations
      const { criteria } = this.filters.contract

      const params = {
        paginate: true,
        perPage,
        page,
        criteria,
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
  created() {
    this.loadContracts()
  }
}
</script>

<style lang="scss" scoped>

  .profile__main-container {
    height: 100%;
    width: 100%;
    border: solid 1px lightgray;
    margin-bottom: 20px;
    background-color: white;
    -webkit-box-shadow: 0px 0px 8px 0.5px #757575;
    box-shadow: 0px 0px 8px 0.5px #757575;
    position: relative;
  }

  .profile__body-container {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: white;
    position: relative;
    

    .profile__left-pane {
      min-width: 250px;
      background-color: rgb(247, 236, 236);
      min-height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 10px 10px;
      color: gray;

      .profile-name {
        font-size: 14pt;
        font-weight: bold;
        margin-top: 10px;
      }

      .profile-username, .profile-usergroup {
        font-size: 10pt;
        margin-top: 4px;
      }

    }

    .profile__right-pane {
      flex: 1;
      height: 100%;
      padding: 30px 25px;
      position: relative;

      .profile__nav-title {
        font-size: 15pt;
        font-weight: bold;
        color: gray;
      }

      .profile__nav-sub-title {
        font-size: 10pt;
        color: rgb(197, 194, 194);
      }

      .profile__footer {
        position: sticky;
        bottom: 0;
        height: 60px;
        background-color: white;
        border: sold 1px;
      }
    }
  }

  .profile-nav {
    padding: 0;
    margin-top: 10px;
    list-style: none;
    width: 100%;

    .profile-nav-item {
      padding: 0 20px;
      width: 100%;
      margin: 5px 0;
      font-size: 14pt;
      height: 48px;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;

      .profile-nav-item-icon {
        margin-right: 8px;
      }

      &.active {
        border-left: solid 10px rgb(98, 190, 221);
        background-color: white;
        font-weight: bold;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  .profile__section {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    
    .profile__row-section {
      display: flex;
      width: 100%;
      height: auto;
      margin-bottom: 10px;
      border:solid 1px;
    }
  }

  .account-header {
    font-weight: bold;
    font-size: 14pt;
    margin-bottom: 10px;
  }

  .account-update-button {
    margin-bottom: 10px;
  }

  .account-button-container {
    display: flex;
    justify-content: flex-end;
  }
  

  // .slide-leave-active,
  // .slide-enter-active {
  //   transition: 1s;
  //   height: 0;
  //   opacity: 0;

  // }
  // .slide-enter {
  //   transform: translate(-100%, 0);
    
  // }
  // .slide-leave-to {
  //   transform: translate(100%, 0);
  //   opacity: 0.5;
  // }
</style>