import { gslType } from '@/types/api';
import request from '@/utils/request';

export async function getGSL(id: string) {
  const resp = await request.get(`/api/conference/${id}/gsl`);
  return resp;
}

export async function yieldGSL(id: string, data: gslType.yieldGSL) {
  const resp = await request.patch(
    `/api/conference/${id}/gsl`,
    JSON.stringify(data),
  );
  return resp;
}

export async function addTurn(id: string, data: gslType.addTurn) {
  const res = await request.post(
    `/api/conference/${id}/gsl`,
    JSON.stringify(data),
  );
  return res;
}

export async function getTurn(id: string, turn: string | number) {
  const resp = await request.get(`/api/conference/${id}/gsl/${turn}`);
  return resp;
}

export async function delTurn(id: string, turn: string | number) {
  const resp = await request.delete(`/api/conference/${id}/gsl/${turn}`);
  return resp;
}

export async function nextGSL(id: string) {
  const res = await request.patch(`/api/conference/${id}/gsl/next`);
  return res;
}

export async function timeLeftGSL(id: string, time: gslType.timeLeft) {
  const res = await request.patch(
    `/api/conference/${id}/gsl/time`,
    JSON.stringify(time),
  );
  return res;
}
