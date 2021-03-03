/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function caucusNumber(id) {
  const resp = await request.get(`/api/conference/${id}/caucus/current`);
  return resp;
}

export async function caucusLog(id) {
  const resp = await request.get(`/api/conference/${id}}/caucus/log`);
  return resp;
}

export async function createCaucus(id, data) {
  const res = await request.post(`/api/conference/${id}/caucus`, data);
  return res;
}

export async function currentCaucus(id) {
  const resp = await request.get(`/api/conference/${id}/caucus`);
  return resp;
}

export async function updateCaucus(id, data) {
  const resp = await request.patch(`/api/conference/${id}/caucus`, data);
  return resp;
}

export async function addTurn(id, data) {
  const res = await request.post(`/api/conference/${id}/caucus/turn`, data);
  return res;
}

export async function timeLeft(id, time) {
  const res = await request.patch(`/api/conference/${id}/caucus/turn`, time);
  return res;
}

export async function nextCaucus(id) {
  const res = await request.post(`/api/conference/${id}/caucus/next`);
  return res;
}

export async function delTurn(id, index) {
  const res = await request.delete(`/api/conference/${id}/caucus/turn/${index}`);
  return res;
}
