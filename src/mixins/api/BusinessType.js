import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getBusinessTypeList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/business-types`, { params: params });
    },
    getBusinessType(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/business-types/${id}`);
    },
    addBusinessType(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/business-types`, data);
    },
    updateBusinessType(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/business-types/${id}`, data);
    },
    deleteBusinessType(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/business-types/${id}`);
    }
  }
}