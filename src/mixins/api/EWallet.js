import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getEWalletList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/e-wallets`, { params: params });
    },
    getEWallet(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/e-wallets/${id}`);
    },
    addEWallet(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/e-wallets`, data);
    },
    updateEWallet(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/e-wallets/${id}`, data);
    },
    deleteEWallet(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/e-wallets/${id}`);
    }
  }
}