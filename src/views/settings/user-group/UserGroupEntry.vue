<template>
  <div v-if="show">
    <CustomCard
      :header="`User Group Entry - ${mode}`">
      <template v-slot:body>
        <div class="entry">
          <div class="left-entry">
            <div class="form-header">Details</div>
            <b-form-group>
              <label class="required">Name</label>
              <b-form-input
                v-model="form.fields.name"
                :state="form.states.name"
                debounce="250"
                type="text"
                ref="name" />
              <b-form-invalid-feedback>
                {{form.errors.name}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label>Description</label>
              <b-form-input
                ref="description"
                v-model="form.fields.description"
                :state="form.states.description"
                debounce="250"
                type="text" />
              <b-form-invalid-feedback>
                {{form.errors.description}}
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div class="right-entry">
            <div class="form-header">Permissions</div>
            <div
              class="group"
              v-for="group in permissionGroups"
              :key="group.id">
              <div class="group__header">{{group.name}}</div>
              <div
                class="permission"
                v-for="permission in group.permissions"
                :key="permission.id">
                <div class="permission-left">
                  <div class="permission__name">{{permission.name}}</div>
                  <div class="permission__description">{{permission.description}}</div>
                </div>
                <div class="permission-right">
                  <b-form-checkbox 
                    :checked="checkIfAllowed(permission.id)"
                    :unchecked-value="0"
                    :value="1"
                    @input="toggledPermission($event, permission)"
                    switch
                    size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="buttons">
          <SaveButton @click="$emit('save')" :isProcessing="form.isProcessing"/>
          <CloseButton @click="$emit('close')" class="ml-2" :isProcessing="form.isProcessing"/>
        </div>
      </template>
    </CustomCard>
  </div>
</template>
<script>
import { PermissionGroupApi } from '../../../mixins/api'
import { SaveButton, CloseButton, CustomCard } from '../../components'
export default {
  components: {
    SaveButton, CloseButton, CustomCard
  },
  mixins: [PermissionGroupApi],
  props: {
    show: Boolean,
    form: Object,
    mode: String
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
  data() {
    return {
      permissionGroups: [],
      isLoading: false
    }
  },
  created() {
    this.loadPermissionGroups()
  },
  methods: {
    loadPermissionGroups() {
      this.isLoading = true
      const params = { paginate: false }
      this.getPermissionGroupList(params)
      .then(({ data }) => {
        this.permissionGroups = data
        this.isLoading = false
      })
    },
    toggledPermission(isChecked, permission) {
      const { fields } = this.form
      if (isChecked) {
        fields.permissions.push(permission)
      } else {
        const index = fields.permissions.findIndex(p => p.id === permission.id)
        fields.permissions.splice(index, 1);
      }
    },
    checkIfAllowed(permissionId) {
      const { fields } = this.form
      const permissionIds = fields.permissions.map(p => p.id)
      if (permissionIds.includes(permissionId)) {
        return 1
      }
      return 0
    }
  }
}
</script>
<style lang="scss" scoped>
  .entry {
    display: flex;
    width: 100%;

    .form-header {
      font-weight: bold;
      border-bottom: 1px solid lightgray;
      margin-bottom: 10px;
    }

    .left-entry {
      width: 250px;
    }

    .right-entry {
      flex: 1;
      margin-left: 10px;
      padding-left: 10px;
      border-left: 1px solid lightgray;
    }

    .permission {
      height: 100%;
      display: flex;
      border-bottom: 1px solid lightgray;
    }
    .permission-left {
      min-width: 200px;
      display: flex;
      flex-direction: column;
      padding: 10px;
    }
    .permission-right {
      flex: 1;
      padding: 15px;
      text-align: right;
    }

    .permission__name {
      font-size: 15pt;
      font-weight: 500;
    }

    .permission__description {
      font-size: 10pt;
      padding-left: 5px;
    }

    .group > div:last-child {
      border: none;
    }

    .group__header {
      font-size: 18pt;
      font-weight: bold;
      padding: 5px 0;
    }
  }
  .buttons {
    background: white;
    width: 100%;
    height: 60px;
    position: sticky;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 5px 0;
    text-align: right;
    z-index: 500
  }
</style>
