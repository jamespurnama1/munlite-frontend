/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getConference(id) {
  const resp = await request.get(`/api/conference/${id}`);
  return resp;
}

export async function createConference(data) {
  const res = await request.post('/api/conference', data);
  return res;
}

export async function getAllConference() {
  const resp = await request.get('/api/conference');
  return resp;
}
