import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getClientList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/clients`, { params: params });
    },
    getClient(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/clients/${id}`);
    },
    addClient(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/clients`, data);
    },
    updateClient(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/clients/${id}`, data);
    },
    deleteClient(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/clients/${id}`);
    }
  }
}