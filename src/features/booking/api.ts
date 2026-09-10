import { apiClient } from '@/api/client';
import type { CreateBookingRequestDto, CreateBookingResponseDto, SlotResponseDto } from '@/api/schema';

async function getSlots(slug: string, date: string) {
  const { data } = await apiClient.get<SlotResponseDto>('/bookings', { params: { slug, date } });

  return data;
}

async function bookSlot(payload: CreateBookingRequestDto) {
  const { data } = await apiClient.post<CreateBookingResponseDto>('/bookings', payload);

  return data;
}

export const SLOTS_API = {
  getSlots,
  bookSlot,
};
