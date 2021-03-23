<template>
  <div>
    <CustomCard
      header="Document Type"
      subHeader="List of all document type.">
      <template v-slot:body>
        <Full
          @create="setCreate()"
          :noCreateButton="!isAccessible($options.DocumentTypePermissions.ADD.id)"
          placeholder="Search Document Type"
          buttonLabel="Create Document Type"
          :filter="filters.documentType"
          :table="tables.documentTypes"
          :pagination="paginations.documentType">
          <template v-slot:cell(action)="data">
            <b-dropdown
              v-if="isAccessible([$options.DocumentTypePermissions.EDIT.id,$options.DocumentTypePermissions.DELETE.id])" 
              boundary="window"
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.DocumentTypePermissions.EDIT.id)"
                @click="setUpdate(data)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.DocumentTypePermissions.DELETE.id)"
                @click="setDelete(data.item.id)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </Full>
      </template>
    </CustomCard>
    <DocumentTypeEntry
      @save="onDocumentTypeEntry()"
      @close="showModalEntry = false"
      :show="showModalEntry"
      :form="forms.documentType"
      :mode="entryMode" />
    <DeleteConfirmation
      @close="showModalConfirmation = false"
      @yes="onDocumentTypeDelete()"
      :show="showModalConfirmation"
      :isProcessing="forms.documentType.isProcessing"
      name="Document Type" />
  </div>
</template>
<script>
const documentTypeFields = {
  id: null,
  name: null,
	description: null
}
import { CustomCard, DeleteConfirmation } from './../../components'
import Full from '../../components/Full'
import DocumentTypeEntry from './DocumentTypeEntry'
import { clearFields, reset, showNotification, validate } from '../../../helpers/forms' 
import { DocumentTypeApi } from '../../../mixins/api'
import tables from '../../../helpers/tables'
import { copyValue } from '../../../helpers/extractor'
import Access from '../../../mixins/utils/Access'
import { DocumentTypePermissions } from '../../../helpers/enum'
export default {
  components: {
    Full,
    DocumentTypeEntry,
    DeleteConfirmation,
    CustomCard,
  },
  mixins: [ DocumentTypeApi, tables, Access ],
  DocumentTypePermissions,
  data() {
    return {
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        documentType: {
          isProcessing: false,
          fields: { ...documentTypeFields },
          states: { ...documentTypeFields },
          errors: { ...documentTypeFields },
        }
      },
      tables: {
        documentTypes: {
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
        documentType: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        }
      },
      filters: {
        documentType: {
          criteria: null
        }
      }
    }
  },
  created() {
    this.loadDocumentType()
  },
  methods: {
    loadDocumentType() {
      const params = {
        paginate: false
      }
      const { documentTypes } = this.tables
      const { documentType } = this.paginations
      documentTypes.isBusy = true
      this.getDocumentTypeList(params)
      .then(({ data }) => {
        documentTypes.items = data
        documentType.totalRows = data.length
        this.recordDetails(documentType)
        documentTypes.isBusy = false
      })
    },
    onDocumentTypeEntry(){
      const { documentType, documentType: { fields } } = this.forms
      const { documentTypes } = this.tables
      documentType.isProcessing = true
      reset(documentType)
      if(this.entryMode == "Add"){
        this.addDocumentType(fields)
          .then(({ data }) => {
            this.addRow(documentTypes, this.paginations.documentType, data)
            documentType.isProcessing = false
            showNotification(this, "success", "Document Type created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            documentType.isProcessing = false
            validate(documentType, errors)
          })
      }
      else {
        const { fields } = this.forms.documentType
        this.updateDocumentType(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(documentTypes, data)
            documentType.isProcessing = false
            showNotification(this, "success", "Document Type updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            documentType.isProcessing = false
            validate(documentType, errors)
          })
      }
    },
    onDocumentTypeDelete(){
      const { documentType, documentType: { fields: { id } } } = this.forms
      const { documentTypes } = this.tables
      documentType.isProcessing = true
      this.deleteDocumentType(id)
        .then(({ data }) => {
          this.deleteRow(documentTypes, this.paginations.documentType, id)
          documentType.isProcessing = false
          showNotification(this, "success", "Document Type deleted successfully.")
          this.showModalConfirmation = false
        })
        .catch(error => {
          const errors = error.response.data.errors
          documentType.isProcessing = false
          if(errors.msg) {
            showNotification(this, "danger", errors.msg)
          }
        })
    },
    setUpdate(row){
      this.showModalEntry = true
      const { documentType, documentType: { fields } } = this.forms
      documentType.isLoading = true
      copyValue(row.item, fields)
      reset(documentType)
      this.entryMode = "Edit"
      documentType.isLoading = false
    },
    setCreate() {
      const { documentType } = this.forms
      clearFields(documentType)
      reset(documentType)
      this.entryMode = "Add"
      this.showModalEntry = true
    },
    setDelete(id) {
      const { fields } = this.forms.documentType
      fields.id = id
      this.showModalConfirmation = true
    },
  }
}
</script>