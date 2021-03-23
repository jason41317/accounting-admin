import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getDisbursementList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/disbursements`, { params: params });
    },
    getDisbursement(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/disbursements/${id}`);
    },
    addDisbursement(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/disbursements`, data);
    },
    updateDisbursement(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/disbursements/${id}`, data);
    },
    deleteDisbursement(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/disbursements/${id}`);
    }
  }
}