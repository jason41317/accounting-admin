<template>
  <div>
    <b-modal 
      v-model="showModal"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      @close="$emit('close')"
      @shown="$refs.firstName.focus()">
      <div slot="modal-title">
        Personnel Entry - {{mode}}
      </div>
      <b-form autocomplete="off">
        <b-row>
          <b-col md="6">
            <b-form-group>
              <label class="required">First Name</label>
              <b-form-input
                v-model="form.fields.firstName"
                :state="form.states.firstName"
                debounce="250"
                type="text"
                ref="firstName" />
              <b-form-invalid-feedback>
                {{form.errors.firstName}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label>Middle Name</label>
              <b-form-input
                v-model="form.fields.middleName"
                :state="form.states.middleName"
                debounce="250"
                type="text"
                ref="middleName" />
              <b-form-invalid-feedback>
                {{form.errors.middleName}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label class="required">Last Name</label>
              <b-form-input
                v-model="form.fields.lastName"
                :state="form.states.lastName"
                debounce="250"
                type="text"
                ref="lastName" />
              <b-form-invalid-feedback>
                {{form.errors.lastName}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label class="required">Birthdate</label>
              <b-form-input
                type="date"
                ref="birthDate"
                v-model="form.fields.birthDate"
                :state="form.states.birthDate"
                debounce="250" />
              <b-form-invalid-feedback>
                {{form.errors.birthDate}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label>Mobile No.</label>
              <b-form-input
                v-model="form.fields.mobileNo"
                :state="form.states.mobileNo"
                debounce="250"
                type="text"
                ref="mobileNo" />
              <b-form-invalid-feedback>
                {{form.errors.mobileNo}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label>Phone No.</label>
              <b-form-input
                v-model="form.fields.phoneNo"
                :state="form.states.phoneNo"
                debounce="250"
                type="text"
                ref="phoneNo" />
              <b-form-invalid-feedback>
                {{form.errors.phoneNo}}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group>
              <label class="required">Username</label>
              <b-form-input
                v-model="form.fields.user.username"
                :state="form.states.userUsername"
                debounce="250"
                type="text"
                ref="username" />
              <b-form-invalid-feedback>
                {{form.errors.userUsername}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label class="required">Password</label>
              <b-form-input
                v-model="form.fields.user.password"
                :state="form.states.userPassword"
                debounce="250"
                type="password"
                ref="password" />
              <b-form-invalid-feedback>
                {{form.errors.userPassword}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label class="required">Confirm Password</label>
              <b-form-input
                v-model="form.fields.user.passwordConfirmation"
                debounce="250"
                type="password"
                ref="passwordConfirmation" />
            </b-form-group>
            <b-form-group>
              <label class="required">User Group</label>
              <b-form-select
                  v-model="form.fields.user.userGroupId"
                  :state="form.states.userUserGroupId">
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled>-- Select User Group --</b-form-select-option>
                  </template>
                  <b-form-select-option 
                    v-for="userGroup in options.userGroups.items"
                    :key="userGroup.id"
                    :value="userGroup.id">
                    {{userGroup.name}}
                  </b-form-select-option>
                </b-form-select>
                <b-form-invalid-feedback>
                  {{form.errors.userUserGroupId}}
                </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div slot="modal-footer">
        <SaveButton @click="$emit('save')" :isProcessing="form.isProcessing"/>
        <CloseButton @click="$emit('close')" class="ml-2" :isProcessing="form.isProcessing"/>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { UserGroupApi } from '../../../mixins/api'
import { SaveButton, CloseButton } from '../../components'
export default {
  components: {
    SaveButton,
    CloseButton
  },
  props: {
    show: Boolean,
    form: Object,
    mode: String
  },
  mixins: [UserGroupApi],
  data() {
    return {
      options: {
        userGroups: {
          items: []
        }
      }
    }
  },
  created() {
    this.loadUserGroups()
  },
  methods: {
    loadUserGroups() {
      const params = { paginate: false }
      const { userGroups } = this.options
      this.getUserGroupList(params).then(({ data }) => {
        userGroups.items = data
      })
    }
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
  }
}
</script>