import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getContractList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/contracts`, { params: params });
    },
    getContract(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/contracts/${id}`);
    },
    addContract(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/contracts`, data);
    },
    updateContract(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/contracts/${id}`, data);
    },
    deleteContract(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/contracts/${id}`);
    }
  }
}