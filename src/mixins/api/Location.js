import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getLocationList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/locations`, { params: params });
    },
    getLocation(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/locations/${id}`);
    },
    addLocation(data) {
      return this.$authHttp.post(`${apiPrefix}/${apiVersion}/locations`, data);
    },
    updateLocation(data, id) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/locations/${id}`, data);
    },
    deleteLocation(id) {
      return this.$authHttp.delete(`${apiPrefix}/${apiVersion}/locations/${id}`);
    }
  }
}