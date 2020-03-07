import axios from "axios";
//
export default {
  getCateList(params) {
    return axios({
      method: "get",
      url: "/categories",
      params: params
    });
  },
  addCate(params) {
    return axios({
      method: "post",
      url: "/categories",
      data: params
    });
  },
  getCateById(id) {
    return axios({
      method: "get",
      url: `categories/${id}`,
    });
  },
  editCate(id, params) {
    return axios({
      method: "put",
      url: `categories/${id}`,
      data: params
    });
  },
  deleteCateById(id) {
    return axios({
      method: "delete",
      url: `categories/${id}`,
    });
  },
  getAttributes(id, params) {
    return axios({
      method: "get",
      url: `categories/${id}/attributes`,
      params: params
    });
  },
  addParam(id, params) {
    return axios({
      method: "post",
      url: `categories/${id}/attributes`,
      data: params
    });
  },
  editParam(id, params) {
    return axios({
      method: "put",
      url: `categories/${id}/attributes/${params.attr_id}`,
      data: params
    });
  },
  getParamById(id, attrId, params) {
    return axios({
      method: "get",
      url: `categories/${id}/attributes/${attrId}`,
      params: params
    });
  },
  deleteParamById(id, attrId) {
    return axios({
      method: "delete",
      url: `categories/${id}/attributes/${attrId}`,
    });
  },
};
