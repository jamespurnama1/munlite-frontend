/* eslint-disable no-param-reassign */
import axios from 'axios';
import router from '../router';
import store from '../store';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 7000,
});

service.interceptors.request.use(
  (config) => {
    if (store.getters.jwt.length > 0) {
      store.dispatch('fetchJWT');
      config.headers.Authorization = `Bearer ${store.getters.jwt}`;
      config.headers['Content-Type'] = 'application/json';
      return config;
    }
    const temp = store.dispatch('fetchJWT').then(
      (response) => {
        config.headers.Authorization = `Bearer ${response.data.data.access_token}`;
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        console.log(error);
        router.push('/login');
      },
    );
    return temp;
  },
  (error) => {
    console.log(error); // for debug
    router.push('/login');
    return Promise.reject(error);
  },
);

export default service;
