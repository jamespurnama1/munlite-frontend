/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getGSL(id) {
  const resp = await request.get(`/api/conference/${id}/gsl`);
  return resp;
}

export async function yieldGSL(id, data) {
  const resp = await request.patch(`/api/conference/${id}/gsl`, data);
  return resp;
}

export async function addTurn(id, data) {
  const res = await request.post(`/api/conference/${id}/gsl`, data);
  return res;
}

export async function getTurn(id, turn) {
  const resp = await request.get(`/api/conference/${id}/gsl/${turn}`);
  return resp;
}

export async function delTurn(id, turn) {
  const resp = await request.delete(`/api/conference/${id}/gsl/${turn}`);
  return resp;
}
