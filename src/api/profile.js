/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getUserData() {
  const res = request.get('/user/me');
  return res;
}

export async function checkUser(data) {
  const res = request.post('/user/check', data);
  return res;
}
