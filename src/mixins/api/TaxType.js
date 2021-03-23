import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getTaxTypeList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/tax-types`, { params: params });
    },
    getTaxType(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/tax-types/${id}`);
    },
    addTaxType(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/tax-types`, data);
    },
    updateTaxType(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/tax-types/${id}`, data);
    },
    deleteTaxType(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/tax-types/${id}`);
    }
  }
}