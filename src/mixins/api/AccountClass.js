import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getAccountClassList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/account-classes`, { params: params });
    },
    getAccountClass(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/account-classes/${id}`);
    },
    addAccountClass(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/account-classes`, data);
    },
    updateAccountClass(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/account-classes/${id}`, data);
    },
    deleteAccountClass(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/account-classes/${id}`);
    }
  }
}