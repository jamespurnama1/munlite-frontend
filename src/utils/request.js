/* eslint-disable no-param-reassign */
import axios from 'axios';
import store from '../store';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 7000,
});

service.interceptors.request.use(
  (config) => {
    if (store.getters.jwt.length > 0) {
      config.headers.Authorization = `Bearer ${store.getters.jwt}`;
      config.headers['Content-Type'] = 'application/json';
      return config;
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  },
);

export default service;
