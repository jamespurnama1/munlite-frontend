/* eslint-disable import/prefer-default-export */
import { motionsType } from '@/types/api';
import request from '@/utils/request';

export async function getMotionsLog(id: string) {
  const resp = await request.get(`/api/conference/${id}/motion/log`);
  return resp;
}

export async function getMotions(id: string) {
  const res = await request.get(`/api/conference/${id}/motion`);
  return res;
}

export async function addMotion(id: string, data: motionsType.addMotion) {
  const res = await request.post(
    `/api/conference/${id}/motion`,
    JSON.stringify(data),
  );
  return res;
}

export async function updateMotion(id: string, data: motionsType.updateMotion) {
  const res = await request.patch(
    `/api/conference/${id}/motion`,
    JSON.stringify(data),
  );
  return res;
}

export async function deleteMotion(id: string, motion: string) {
  const res = await request.delete(`/api/conference/${id}/motion/${motion}`);
  return res;
}

export async function startCaucus(id: string, data: motionsType.startCaucus) {
  const res = await request.post(
    `/api/conference/${id}/motion/start`,
    JSON.stringify(data),
  );
  return res;
}

export async function getCurrentMotion(id: string) {
  const res = await request.get(`/api/conference/${id}/motion/current`);
  return res;
}
