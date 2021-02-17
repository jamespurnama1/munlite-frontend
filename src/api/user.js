import axios from 'axios';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 7000,
});

const serviceCred = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 7000,
  withCredentials: true,
});

export async function login(data) {
  const res = serviceCred.post('/login', data);
  return res;
}

export async function signup(data) {
  const res = service.post('/user', data);
  return res;
}

export async function getJWT() {
  const res = serviceCred.post('/refresh');
  return res;
}

export async function logout() {
  const res = serviceCred.post('/logout');
  return res;
}
