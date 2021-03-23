<template>
  <CustomModal 
    :show="showModal"
    size="lg"
     @closeModal="$emit('close')">
    <template #modal-header>
      Add Service
    </template>
    <template #modal-body>
      <Full
        :noCreateButton="true"
        :filter="filters.service"
        :table="tables.services"
        :pagination="paginations.service">
        <template v-slot:cell(action)="data">
          <b-button size="sm" variant="outline-primary" @click="$emit('clickService', data.item)"><v-icon name="plus"></v-icon></b-button>
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
import { ServiceApi } from '../../mixins/api'
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
  mixins: [ServiceApi, tables],
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      tables: {
        services: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Service',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 33%'
            },
            {
              key: 'description',
              label: 'Description',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 33%'
            },
            {
              key: 'serviceCategory.name',
              label: 'Category',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 33%'
            },
            {
              key: 'action',
              label: '',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: '{ width: 20px }'
            }
          ],
          items: [],
        },
      },
      filters: {
        service: {
          criteria: null
        }
      },
      paginations: {
        service: {
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
    this.loadServiceList()
  },
  methods: {
    loadServiceList() {
      const params = { paginate: false }
      const { services } = this.tables
      const { service } = this.paginations
      services.isBusy = true
      this.getServiceList(params).then(({ data }) => {
        services.items = data
        service.totalRows = data.length
        this.recordDetails(service)
        services.isBusy = false
      }).catch(error => {
        console.log(error)
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