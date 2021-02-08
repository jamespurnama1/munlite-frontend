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

export async function getUserConference() {
  const resp = await request.get('/api/conference/me');
  return resp;
}

export async function updateConference(id, data) {
  const resp = await request.patch(`/api/conference/${id}`, data);
  return resp;
}

export async function delConference(id) {
  const resp = await request.delete(`/api/conference/${id}`);
  return resp;
}

export async function addChairman(id, data) {
  const resp = await request.pos(`/api/conference/${id}/chairman`, data);
  return resp;
}

export async function delChairman(id, data) {
  const resp = await request.pos(`/api/conference/${id}/chairman`, data);
  return resp;
}
