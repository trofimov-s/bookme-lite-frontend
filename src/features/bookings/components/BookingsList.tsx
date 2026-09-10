import { useQuery } from '@tanstack/react-query';

import { BOOKINGS_API } from '../api';
import BookingItem from './BookingItem';

import type { BookingItemResponseDto } from '@/api/schema';
import ErrorMessage from '@/shared/components/ErrorMessage';
import type { TypedApiError } from '@/types/api-error';

function BookingsList() {
  const {
    data: bookings = [],
    error,
    isLoading,
  } = useQuery<BookingItemResponseDto[], TypedApiError>({
    queryKey: ['bookings', 'my'],
    queryFn: BOOKINGS_API.getMyBookings,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage messages={error.messages} />;
  }

  if (!bookings.length) {
    return <div>You don't have any bookings yet.</div>;
  }

  return (
    <ul>
      {bookings.map((item) => (
        <BookingItem key={item.id} booking={item} />
      ))}
    </ul>
  );
}

export default BookingsList;
