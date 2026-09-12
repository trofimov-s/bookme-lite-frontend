import { BookingProvider } from '../context/BookingContext';
import BookingFlow from './BookingFlow';

function Booking() {
  return (
    <BookingProvider>
      <BookingFlow />
    </BookingProvider>
  );
}

export default Booking;
