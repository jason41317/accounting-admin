<template>
  <div>
    <CustomCard
      header="CLIENTS"
      subHeader="List of all registered clients.">
      <template v-slot:body>
        <Full
          :isServerSide="true"
          @search="loadClients()"
          @paginate="loadClients()"
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.ClientPermissions.ADD.id)"
          placeholder="Search Here..."
          :filter="filters.client"
          :table="tables.clients"
          :pagination="paginations.client"
          buttonLabel="Create New Client">
          <template v-slot:cell(name)="row">
            <div>{{ row.item.name }}</div>
            <div class="row__client-code">{{ row.item.code }}</div>
          </template>
          <template v-slot:cell(contact)="row">
            <div>{{ row.item.email }}</div>
            <div class="row__client-code">{{ row.item.contactNo }}</div>
          </template>
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.ClientPermissions.EDIT.id, $options.ClientPermissions.DELETE.id])" 
              boundary="window"
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.ClientPermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.ClientPermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <ClientEntry
      @save="onClientEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.client"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onClientDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.client.isProcessing"
      name="Client" />
  </div>
</template>

<script>
import { CustomCard, DeleteConfirmation } from '../../components'
import Full from '../../components/Full'
import ClientEntry from './ClientEntry'
import { ClientPermissions } from '../../../helpers/enum' 
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { copyValue } from '../../../helpers/extractor'
import { ClientApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import Access from '../../../mixins/utils/Access'

const clientFields = {
  id: null,
  name: null,
  code: null,
  officeAddress: null,
  owner: null,
  contactNo: null,
  // rdoNo: null,
  // secDtiNo: null,
  businessTypeId: null,
  businessStyleId: null,
  email: null
}

export default {
  components: {
    Full,
    ClientEntry,
    DeleteConfirmation,
    CustomCard
  },
  mixins: [ tables, ClientApi, Access ],
  ClientPermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      showNewModal: false,
      forms: {
        client: {
          isProcessing: false,
          fields: { ...clientFields },
          states: { ...clientFields },
          errors: { ...clientFields },
        }
      },
      tables:{ 
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
              label: 'CONTACT DETAILS',
              
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
      paginations: {
        client: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        client: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadClients()
  },
  methods: {
    setCreate() {
      const { client } = this.forms
      clearFields(client)
      reset(client)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    onClientEntry() {
      const { client, client: { fields } } = this.forms
      const { clients } = this.tables
      client.isProcessing = true
      reset(client)
      if(this.entryMode == "Add"){
        this.addClient(fields)
          .then(({ data }) => {
            this.addRow(clients, this.paginations.client, data)
            client.isProcessing = false
            showNotification(this, "success", "Client created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            client.isProcessing = false
            validate(client, errors)
          })
      }
      else {
        const { fields } = this.forms.client
        this.updateClient(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(clients, data)
            client.isProcessing = false
            showNotification(this, "success", "Client updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            client.isProcessing = false
            validate(client, errors)
          })
      }
    },
    loadClients() {
      const { clients } = this.tables
      const { client, client: { perPage, page } } = this.paginations
      const { criteria } = this.filters.client

      const params = {
        paginate: true,
        perPage,
        page,
        criteria
      }

      clients.isBusy = true

      this.getClientList(params)
      .then(({ data }) => {
        clients.items = data.data
        client.from = data.meta.from
        client.to = data.meta.to
        client.totalRows = data.meta.total
        clients.isBusy = false
      })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { client, client: { fields } } = this.forms
      client.isLoading = true
      copyValue(row.item, fields)
      reset(client)
      this.entryMode = "Edit"
      client.isLoading = false
    },
    setDelete(id) {
      const { fields } = this.forms.client
      fields.id = id
      this.showModalConfirmation = true
    },
    onClientDelete(){
      const { client, client: { fields: { id } } } = this.forms
      const { clients } = this.tables
      client.isProcessing = true
      this.deleteClient(id)
        .then(({ data }) => {
          this.deleteRow(clients, this.paginations.client, id)
          client.isProcessing = false
          showNotification(this, "success", "Client deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          client.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
  },
  
}
</script>

<style lang="scss">
  .row__client-code {
    font-size: 8pt!important;
    color: gray!important;
  }
</style>