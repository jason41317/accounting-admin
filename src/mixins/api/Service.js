import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getServiceList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/services`, { params: params });
    },
    getService(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/services/${id}`);
    },
    addService(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/services`, data);
    },
    updateService(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/services/${id}`, data);
    },
    deleteService(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/services/${id}`);
    }
  }
}