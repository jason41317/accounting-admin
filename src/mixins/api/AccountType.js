import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getAccountTypeList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/account-types`, { params: params });
    },
    getAccountType(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/account-types/${id}`);
    },
    addAccountType(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/account-types`, data);
    },
    updateAccountType(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/account-types/${id}`, data);
    },  
    deleteAccountType(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/account-types/${id}`);
    }
  }
}