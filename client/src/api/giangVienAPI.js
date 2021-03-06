import axios from 'axios';
import * as Utils from '../utils/utils';

export const getGiangViens = () => {
  return axios.get('/giang-viens');
}

export const getGiangViensWithQuery = (search = '', pagingOptions = Utils.getNewPagingOptions(), filters = {}) => {
  var options = {
    search: search,
    pagingOptions: pagingOptions,
  };
  const filterStr = Utils.getFilterString(filters);
  return axios.post(`/giang-viens/q?${filterStr}`, options);
}

export const getGiangVienById = (id) => {
  return axios.get(`/giang-viens/${id}`);
}

export const getGiangVienByEmail = (giangVien) => {
  return axios.post('/giang-viens/get-by-email', giangVien);
}

export const deleteGiangVienById = (id) => {
  return axios.delete(`/giang-viens/${id}`);
}

export const upsertGiangViens = (giangViens) => {
  return axios.post('/giang-viens/upsert-many/', giangViens);
}

export const updateGiangVienById = (id, giangVien) => {
  return axios.post(`/giang-viens/${id}`, giangVien);
}
