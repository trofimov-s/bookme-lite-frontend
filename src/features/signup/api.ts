import { apiClient } from '@/api/client';
import type { AuthResponseDto, SignUpRequestDto } from '@/api/schema';

async function signup(payload: SignUpRequestDto): Promise<AuthResponseDto> {
  const { data } = await apiClient.post<AuthResponseDto>('/auth/register', payload);

  return data;
}

export const SIGN_UP_API = {
  signup,
};
