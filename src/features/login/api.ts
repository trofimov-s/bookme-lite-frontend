import { apiClient } from '@/api/client';
import type { AuthResponseDto, LoginRequestDto } from '@/api/schema';

async function login(payload: LoginRequestDto): Promise<AuthResponseDto> {
  const { data } = await apiClient.post<AuthResponseDto>('/auth/login', payload);

  return data;
}

export const LOGIN_API = {
  login,
};
