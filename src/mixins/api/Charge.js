import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getChargeList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/charges`, { params: params });
    },
    getCharge(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/charges/${id}`);
    },
    addCharge(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/charges`, data);
    },
    updateCharge(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/charges/${id}`, data);
    },
    deleteCharge(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/charges/${id}`);
    }
  }
}