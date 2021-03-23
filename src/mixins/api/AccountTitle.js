import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getAccountTitleList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/account-titles`, { params: params });
    },
    getAccountTitle(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/account-titles/${id}`);
    },
    addAccountTitle(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/account-titles`, data);
    },
    updateAccountTitle(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/account-titles/${id}`, data);
    },
    deleteAccountTitle(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/account-titles/${id}`);
    }
  }
}