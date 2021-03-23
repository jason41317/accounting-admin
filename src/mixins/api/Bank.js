import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getBankList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/banks`, { params: params });
    },
    getBank(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/banks/${id}`);
    },
    addBank(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/banks`, data);
    },
    updateBank(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/banks/${id}`, data);
    },
    deleteBank(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/banks/${id}`);
    }
  }
}