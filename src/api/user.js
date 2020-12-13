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

export async function fetchJWT() {
  return fetch(`${process.env.VUE_APP_BASE_API}/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err.response);
    });
}

export async function logout() {
  const res = service.post('/logout');
  return res;
}
