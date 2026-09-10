import { useMutation } from '@tanstack/react-query';

import { BOOKINGS_API } from '../api';

import { queryClient } from '@/api/queryClient';
import type { BookingItemResponseDto } from '@/api/schema';
import type { TypedApiError } from '@/types/api-error';

const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString('ru-RU', {
    // day: '2-digit',
    // month: '2-digit',
    // year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

type BookingItemProps = {
  booking: BookingItemResponseDto;
};

function BookingItem({ booking }: BookingItemProps) {
  const { mutate, isPending } = useMutation<void, TypedApiError, string>({
    mutationFn: BOOKINGS_API.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'my'] });
    },
  });

  const onCancelBooking = () => {
    mutate(booking.id);
  };

  return (
    <li>
      <p>
        Time: {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
      </p>
      <p>Client Name: {booking.clientName}</p>

      <p>Status: {booking.status}</p>

      {booking.status === 'ACTIVE' && (
        <button disabled={isPending} onClick={onCancelBooking}>
          Cancel Booking
        </button>
      )}
    </li>
  );
}

export default BookingItem;
