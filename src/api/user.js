import axios from 'axios';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 7000,
});

export async function login(data) {
  const res = service.post('/login', data);
  return res;
}

export async function signup(data) {
  const res = service.post('/user', data);
  return res;
}

export async function getJWT() {
  const res = service.post('/refresh', {
    withCredentials: true,
  });
  return res;
}

export async function logout() {
  const res = service.post('/logout');
  return res;
}
