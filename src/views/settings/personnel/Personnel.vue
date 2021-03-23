<template>
  <div>
    <CustomCard
      header="Personnel"
      subHeader="List of all personnel.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.PersonnelPermissions.ADD.id)"
          placeholder="Search Personnel"
          buttonLabel="Create Personnel"
          :filter="filters.personnel"
          :table="tables.personnels"
          :pagination="paginations.personnel">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.PersonnelPermissions.EDIT.id, $options.PersonnelPermissions.DELETE.id])"
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.PersonnelPermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.PersonnelPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <PersonnelEntry
      @save="onPersonnelEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.personnel"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onUserDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.personnel.isProcessing"
      name="Personnel" />
  </div>
</template>
<script>
const userFields = {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  mobileNo: null,
  phoneNo: null,
  birthDate: null,
  user: {
    username: null,
    password: null,
    passwordConfirmation: null,
    userGroupId: null
  }
}
const userErrorFields = {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  mobileNo: null,
  phoneNo: null,
  birthDate: null,
  userUsername: null,
  userPassword: null,
  userUserGroupId: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import PersonnelEntry from './PersonnelEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { PersonnelApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import { PersonnelPermissions } from '../../../helpers/enum'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    PersonnelEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ PersonnelApi, tables, Access ],
  PersonnelPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        personnel: {
          isProcessing: false,
          fields: { ...userFields },
          states: { ...userErrorFields },
          errors: { ...userErrorFields },
        }
      },
      tables: {
        personnels: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              sortable: true,
            },
            {
              key: 'user.username',
              label: 'Username',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              sortable: true
            },
            {
              key: 'mobileNo',
              label: 'Mobile',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              sortable: true
            },
            {
              key: 'user.userGroup.name',
              label: 'User Group',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              sortable: true
            },
            {
              key: 'birthDate',
              label: 'Birthdate',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              sortable: true
            },
            {   
              key: 'action',
              label: '',
              thStyle: {width: '85px'},
              tdClass: 'text-center align-middle',
              thClass: 'align-middle'
            },
          ],
          items: []
        }
      },
      paginations: {
        personnel: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        personnel: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadPersonnel()
  },
  methods: {
    loadPersonnel() {
      const params = {
        paginate: false
      }
      const { personnels } = this.tables
      const { personnel } = this.paginations
      personnels.isBusy = true
      this.getPersonnelList(params)
      .then(({ data }) => {
        personnels.items = data
        personnel.totalRows = data.length
        this.recordDetails(personnel)
        personnels.isBusy = false
      })
    },
    onPersonnelEntry(){
      const { personnel, personnel: { fields } } = this.forms
      const { personnels } = this.tables
      personnel.isProcessing = true
      reset(personnel)
      if(this.entryMode == "Add"){
        this.addPersonnel(fields)
          .then(({ data }) => {
            this.addRow(personnels, this.paginations.personnel, data)
            personnel.isProcessing = false
            showNotification(this, "success", "Personnel created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            personnel.isProcessing = false
            console.log(errors)
            validate(personnel, errors)
          })
      }
      else {
        const { fields } = this.forms.personnel
        this.updatePersonnel(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(personnels, data)
            personnel.isProcessing = false
            showNotification(this, "success", "Personnel updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            personnel.isProcessing = false
            validate(personnel, errors)
          })
      }
    },
    onUserDelete(){
      const { personnel, personnel: { fields: { id } } } = this.forms
      const { personnels } = this.tables
      personnel.isProcessing = true
      this.deletePersonnel(id)
        .then(({ data }) => {
          this.deleteRow(personnels, this.paginations.personnel, id)
          personnel.isProcessing = false
          showNotification(this, "success", "Personnel deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          personnel.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { personnel, personnel: { fields } } = this.forms
      personnel.isLoading = true
      const { user: { id, ...user }, ...personnelData } = row.item
      copyValue({...personnelData, user}, fields)
      reset(personnel)
      this.entryMode = "Edit"
      personnel.isLoading = false
    },
    setCreate() {
      const { personnel } = this.forms
      clearFields(personnel)
      reset(personnel)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.personnel
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>