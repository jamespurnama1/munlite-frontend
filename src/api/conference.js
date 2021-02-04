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
  const res = await request.post('/api/conference', data);
  return res;
}

export async function deleteConference(id) {
  const res = await request.delete(`/api/conference/${id}`);
  return res;
}

export async function updateConference(id, data) {
  const res = await request.patch(`/api/conference/${id}`, data);
  return res;
}

export async function addChairman(id, data) {
  const res = await request.post(`/api/conference/${id}/chairman`, data);
  return res;
}

export async function removeChairman(id, data) {
  const res = await request.delete(`/api/conference/${id}/chairman`, data);
  return res;
}

export async function getUserConference() {
  const resp = await request.get('/api/conference/me');
  return resp;
}
