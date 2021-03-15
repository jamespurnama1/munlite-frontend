/* eslint-disable import/prefer-default-export */
import { caucusType } from '@/types/api';
import request from '@/utils/request';

export async function caucusNumber(id: string) {
  const resp = await request.get(`/api/conference/${id}/caucus/current`);
  return resp;
}

export async function caucusLog(id: string) {
  const resp = await request.get(`/api/conference/${id}}/caucus/log`);
  return resp;
}

export async function createCaucus(id: string, data: caucusType.createCaucus) {
  const res = await request.post(
    `/api/conference/${id}/caucus`,
    JSON.stringify(data),
  );
  return res;
}

export async function currentCaucus(id: string) {
  const resp = await request.get(`/api/conference/${id}/caucus`);
  return resp;
}

export async function updateCaucus(id: string, data: caucusType.updateCaucus) {
  const resp = await request.patch(
    `/api/conference/${id}/caucus`,
    JSON.stringify(data),
  );
  return resp;
}

export async function addTurnCaucus(id: string, data: caucusType.addTurn) {
  const res = await request.post(
    `/api/conference/${id}/caucus/turn`,
    JSON.stringify(data),
  );
  return res;
}

export async function timeLeftCaucus(id: string, time: caucusType.timeLeft) {
  const res = await request.patch(
    `/api/conference/${id}/caucus/turn`,
    JSON.stringify(time),
  );
  return res;
}

export async function nextCaucus(id: string) {
  const res = await request.post(`/api/conference/${id}/caucus/next`);
  return res;
}

export async function delTurnCaucus(id: string, index: string | number) {
  const res = await request.delete(`/api/conference/${id}/caucus/turn/${index}`);
  return res;
}
