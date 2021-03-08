/* eslint-disable import/prefer-default-export */
import { profileType } from '@/types/api';
import request from '@/utils/request';

export async function getUserData() {
  const res = request.get('/user/me');
  return res;
}

export async function checkUser(data: {email: string}) {
  const res = request.post(
    '/user/check',
    data,
  );
  return res;
}
