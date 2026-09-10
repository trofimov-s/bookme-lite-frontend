import { apiClient } from '@/api/client';
import type { BookingItemResponseDto } from '@/api/schema';

async function getMyBookings() {
  const { data } = await apiClient.get<BookingItemResponseDto[]>('/bookings/my');

  return data;
}

async function cancelBooking(bookingId: string) {
  const { data } = await apiClient.patch<void>(`/bookings/${bookingId}/cancel`);

  return data;
}

export const BOOKINGS_API = {
  getMyBookings,
  cancelBooking,
};
