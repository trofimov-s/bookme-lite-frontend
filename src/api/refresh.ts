import axios from 'axios';

import type { AuthResponseDto } from './schema';

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export async function refreshSession() {
  const { data } = await refreshClient.post<AuthResponseDto>('/auth/refresh', null);

  return data;
}
