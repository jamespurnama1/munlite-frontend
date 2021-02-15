/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getAllConferences() {
  const resp = await request.get('/api/conference');
  return resp;
}

export async function getConference(id) {
  const resp = await request.get(`/api/conference/${id}`);
  return resp;
}

export async function createConference(data) {
  const resp = await request.post('/api/conference', data);
  return resp;
}

export async function updateConference(id, data) {
  const res = await request.patch(`/api/conference/${id}`, data);
  return res;
}

export async function addChairman(id, data) {
  const res = await request.post(`/api/conference/${id}/chairman`, data);
  return res;
}

export async function delConference(id) {
  const resp = await request.delete(`/api/conference/${id}`);
  return resp;
}

export async function delChairman(id, data) {
  const resp = await request.delete(`/api/conference/${id}/chairman`, { data });
  return resp;
}
