import { delegatesType } from '@/types/api';
import request from '@/utils/request';

export async function getAllDelegates(id: string) {
  const resp = await request.get(`/api/conference/${id}/delegates`);
  return resp;
}

export async function addDelegates(id: string, data: delegatesType.addDelegates[]) {
  const res = await request.post(
    `/api/conference/${id}/delegates`,
    JSON.stringify(data),
  );
  return res;
}

export async function editDelegates(id: string, del: string, data: delegatesType.editDelegates) {
  const res = await request.patch(
    `/api/conference/${id}/delegates/${del}`,
    JSON.stringify(data),
  );
  return res;
}

export async function deleteDelegates(id: string, del: string) {
  const res = await request.delete(`/api/conference/${id}/delegates/${del}`);
  return res;
}
