import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getRdoList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/rdos`, { params: params });
    },
    getRdo(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/rdos/${id}`);
    },
    addRdo(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/rdos`, data);
    },
    updateRdo(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/rdos/${id}`, data);
    },
    deleteRdo(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/rdos/${id}`);
    }
  }
}