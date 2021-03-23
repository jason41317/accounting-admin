import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getServiceCategoryList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/service-categories`, { params: params });
    },
    getServiceCategory(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/service-categories/${id}`);
    },
    addServiceCategory(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/service-categories`, data);
    },
    updateServiceCategory(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/service-categories/${id}`, data);
    },
    deleteServiceCategory(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/service-categories/${id}`);
    }
  }
}