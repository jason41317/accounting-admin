<template>
  <div>
    <CustomCard
      v-if="!showEntry"
      header="User Group"
      subHeader="List of all user group.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.UserGroupPermissions.ADD.id)"
          placeholder="Search User Group"
          buttonLabel="Create User Group"
          :filter="filters.userGroup"
          :table="tables.userGroups"
          :pagination="paginations.userGroup">
          <template v-slot:cell(action)="data">
            <b-dropdown 
              v-if="data.item.id !== UserGroups.SUPER_USER.id && isAccessible([$options.UserGroupPermissions.EDIT.id, $options.UserGroupPermissions.DELETE.id])" 
              boundary="window" 
              right 
              variant="link" 
              toggle-class="text-decoration-none" 
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.UserGroupPermissions.EDIT.id)"
                @click="setUpdate(data.item.id)"
                :disabled="showEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.UserGroupPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <UserGroupEntry
      @save="onUserGroupEntry()"
      @close="showEntry = false"
      :show="showEntry"
      :form="forms.userGroup"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onUserGroupDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.userGroup.isProcessing"
      name="User Group" />
  </div>
</template>
<script>
const userGroupFields = {
  id: null,
  name: null,
	description: null,
  permissions: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import UserGroupEntry from './UserGroupEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms'
import { UserGroups, UserGroupPermissions } from '../../../helpers/enum'
import { UserGroupApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
export default {
  components: {
    Full,
    UserGroupEntry,
    DeleteConfirmation,
    CustomCard
  },
  mixins: [ UserGroupApi, tables, Access ],
  UserGroupPermissions,
  data() {
    return {
      entryMode: 'Add',
      showPermissionEntry: false,
      showEntry: false,
      showModalConfirmation: false,
      UserGroups: UserGroups,
      forms: {
        userGroup: {
          isProcessing: false,
          fields: { ...userGroupFields },
          states: { ...userGroupFields },
          errors: { ...userGroupFields },
        }
      },
      tables: {
        userGroups: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              sortable: true,
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              sortable: true
            },
            {   
              key: 'action',
              label: '',
              thStyle: {width: '85px'},
              tdClass: 'text-center align-middle'
            },
          ],
          items: []
        }
      },
      paginations: {
        userGroup: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        userGroup: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadUserGroups()
  },
  methods: {
    loadUserGroups() {
      const params = {
        paginate: false
      }
      const { userGroups } = this.tables
      const { userGroup } = this.paginations
      userGroups.isBusy = true
      this.getUserGroupList(params)
      .then(({ data }) => {
        userGroups.items = data
        userGroup.totalRows = data.length
        this.recordDetails(userGroup)
        userGroups.isBusy = false
      })
    },
    onUserGroupEntry(){
      const { userGroup, userGroup: { fields: { permissions, ...fields } } } = this.forms
      const { userGroups } = this.tables
      const permissionIds = permissions.map(p => p.id) 
      const data = {
        ...fields,
        permissions: permissionIds
      }
      userGroup.isProcessing = true
      reset(userGroup)
      if(this.entryMode == "Add"){
        this.addUserGroup(data)
          .then(({ data }) => {
            this.addRow(userGroups, this.paginations.userGroup, data)
            userGroup.isProcessing = false
            showNotification(this, "success", "User Group created successfully.")
            this.showEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            userGroup.isProcessing = false
            validate(userGroup, errors)
          })
      }
      else {
        this.updateUserGroup(data, fields.id)
          .then(({ data }) => {
            this.updateRow(userGroups, data)
            userGroup.isProcessing = false
            showNotification(this, "success", "User Group updated successfully.")
            this.showEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            userGroup.isProcessing = false
            validate(userGroup, errors)
          })
      }
    },
    onUserGroupDelete(){
      const { userGroup, userGroup: { fields: { id } } } = this.forms
      const { userGroups } = this.tables
      userGroup.isProcessing = true
      this.deleteUserGroup(id)
        .then(({ data }) => {
          this.deleteRow(userGroups, this.paginations.userGroup, id)
          userGroup.isProcessing = false
          showNotification(this, "success", "User Group deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          userGroup.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(id){
      const { userGroup, userGroup: { fields } } = this.forms
      this.getUserGroup(id)
      .then(({ data }) => {
        copyValue(data, fields)
        reset(userGroup)
        this.entryMode = "Edit"
        this.showEntry = true
      })
    },
    setCreate() {
      const { userGroup } = this.forms
      clearFields(userGroup)
      reset(userGroup)
      userGroup.fields.permissions = []
      this.entryMode = "Add"
      this.showEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.userGroup
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>