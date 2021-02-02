/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getAllDelegates(id) {
  const resp = await request.get(`/api/conference/${id}/delegates`);
  return resp;
}

export async function addDelegates(id, data) {
  const res = await request.post(`/api/conference/${id}/delegates`, data);
  return res;
}

export async function editDelegates(id, del, data) {
  const res = await request.patch(`/api/conference/${id}/delegates/${del}`, data);
  return res;
}

export async function deleteDelegates(id, del) {
  const res = await request.delete(`/api/conference/${id}/delegates/${del}`);
  return res;
}
