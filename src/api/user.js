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
  const jwtrequest = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 7000,
    withCredentials: true,
  });
  const res = jwtrequest.post('/refresh');
  return res;
}

export async function fetchJWT() {
  return fetch(`${process.env.VUE_APP_BASE_API}/refresh`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
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
