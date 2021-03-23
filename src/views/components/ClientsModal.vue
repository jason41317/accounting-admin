<template>
  <CustomModal 
    :show="showModal"
    size="xl"
    @closeModal="$emit('close')">
    <template #modal-header>
      Select Client
    </template>
    <template #modal-body>
      <Full
        :noCreateButton="true"
        isServerSide
        @search="loadClientList()"
        placeholder="Search Here..."
        :filter="filters.client"
        :table="tables.clients"
        :pagination="paginations.client">
        <template v-slot:cell(action)="data">
          <b-button size="sm" variant="outline-primary" @click="$emit('clickClient', data.item)"><v-icon name="plus"></v-icon></b-button>
        </template>
      </Full>
    </template>
    <template #modal-footer>
      <div class="button-footer">
        <!-- <SaveButton @click="$emit('save')" label="Add"/> -->
        <CloseButton @click="$emit('close')" class="ml-2 float-right"  />
      </div>
    </template>
  </CustomModal>
</template>
<script>
import tables from '../../helpers/tables'
import { ClientApi } from '../../mixins/api'
import { 
  CustomModal,
  CloseButton } from '../components'
import Full from '../components/Full'
export default {
  components: {
    CustomModal,
    Full,
    CloseButton
  },
  mixins: [ClientApi, tables],
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      tables: {
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
      filters: {
        client: {
          criteria: null
        }
      },
      paginations: {
        client: {
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
    this.loadClientList()
  },
  methods: {
    loadClientList() {
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