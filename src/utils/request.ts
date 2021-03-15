/* eslint-disable no-param-reassign */
import axios from 'axios';
import NProgress from 'nprogress'; // loading progress bar
import router from '../router';
import store from '../store';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 7000,
});

const calculatePercentage = (loaded: number, total: number) => Math.floor(loaded * 1.0) / total;

service.interceptors.request.use(
  (config: any) => {
    config.onDownloadProgress = (e) => {
      const percentage = calculatePercentage(e.loaded, e.total);
      NProgress.set(percentage);
    };
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
        console.error(error);
      },
    );
    return temp;
  },
  (error) => {
    console.error(error, 'testerror'); // for debug
    return Promise.reject(error);
  },
);

// response interceptor to refresh token on receiving token expired error
service.interceptors.response.use(
  (response) => {
    NProgress.done(true);
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return store.dispatch('fetchJWT')
        .then(() => service(originalRequest));
    }
    console.error(error); // for debug
    if (error.response && error.response.status === 401) router.push('/login');
    store.commit('error', true);
    return Promise.reject(error);
  },
);

export default service;
