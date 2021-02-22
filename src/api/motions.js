/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getMotionsLog(id) {
  const resp = await request.get(`/api/conference/${id}/motion/log`);
  return resp;
}

export async function getMotions(id) {
  const res = await request.get(`/api/conference/${id}/motion`);
  return res;
}

export async function addMotion(id, data) {
  const res = await request.post(`/api/conference/${id}/motion`, data);
  return res;
}

export async function updateMotion(id, data) {
  const res = await request.patch(`/api/conference/${id}/motion`, data);
  return res;
}

export async function deleteMotion(id, motion) {
  const res = await request.delete(`/api/conference/${id}/motion/${motion}`);
  return res;
}

export async function startCaucus(id, data) {
  const res = await request.post(`/api/conference/${id}/motion/start`, data);
  return res;
}

export async function getCurrentMotion(id) {
  const res = await request.get(`/api/conference/${id}/motion/current`);
  return res;
}
