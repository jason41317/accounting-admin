import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getBusinessStyleList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/business-styles`, { params: params });
    },
    getBusinessStyle(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/business-styles/${id}`);
    },
    addBusinessStyle(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/business-styles`, data);
    },
    updateBusinessStyle(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/business-styles/${id}`, data);
    },
    deleteBusinessStyle(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/business-styles/${id}`);
    }
  }
}