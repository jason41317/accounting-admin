<template>
  <CustomModal
    :show="showModal"
    size="lg"
    @closeModal="$emit('close')">
    <template #modal-header>
      Add Charge
    </template>
    <template #modal-body>
      <Full
        :noCreateButton="true"
        :filter="filters.charge"
        :table="tables.charges"
        :pagination="paginations.charge">
        <template v-slot:cell(action)="data">
          <b-button size="sm" variant="outline-primary" @click="$emit('clickCharge', data.item)"><v-icon name="plus"></v-icon></b-button>
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
import { ChargeApi } from '../../mixins/api'
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
  mixins: [ChargeApi, tables],
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      tables: {
        charges: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Charge',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 30%'
            },
            {
              key: 'description',
              label: 'Description',
              thClass: 'align-middle',
              tdClass: 'align-middle',
              thStyle: 'width: 70%'
            },
            {
              key: 'action',
              label: '',
              thClass: 'align-middle',
              thStyle: '{ width: 20px }'
            }
          ],
          items: []
        },
      },
      filters: {
        charge: {
          criteria: null
        }
      },
      paginations: {
        charge: {
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
    this.loadChargeList()
  },
  methods: {
    loadChargeList() {
      const params = { paginate: false }
      const { charges } = this.tables
      const { charge } = this.paginations
      charges.isBusy = true
      this.getChargeList(params).then(({ data }) => {
        charges.items = data
        charge.totalRows = data.length
        this.recordDetails(charge)
        charges.isBusy = false
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