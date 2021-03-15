import { conferenceType } from '@/types/api';
import request from '@/utils/request';

export async function getAllConferences() {
  const resp = await request.get('/api/conference');
  return resp;
}

export async function getMyConferences() {
  const resp = await request.get('/api/conference/me');
  return resp;
}

export async function getConference(id: string) {
  const resp = await request.get(`/api/conference/${id}`);
  return resp;
}

export async function createConference(data: conferenceType.createConference) {
  const resp = await request.post(
    '/api/conference',
    JSON.stringify(data),
  );
  return resp;
}

export async function updateConference(id: string, data: conferenceType.updateConference) {
  const res = await request.patch(
    `/api/conference/${id}`,
    JSON.stringify(data),
  );
  return res;
}

export async function addChairman(id: string, data: {email: string}) {
  const res = await request.post(
    `/api/conference/${id}/chairman`,
    JSON.stringify(data),
  );
  return res;
}

export async function delConference(id: string) {
  const resp = await request.delete(`/api/conference/${id}`);
  return resp;
}

export async function delChairman(id: string, data: { email: string }) {
  const resp = await request.delete(
    `/api/conference/${id}/chairman`,
    { data: JSON.stringify(data) },
  );
  return resp;
}
