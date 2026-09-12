import { CircleAlert } from 'lucide-react';

import { MONTHS } from '../constants/months.constant';
import { useBooking } from '../context/BookingContext';
import SlotsListItem from './SlotsListItem';

import ErrorMessage from '@/shared/components/ErrorMessage';
import Loader from '@/shared/components/Loader';

function SlotsList() {
  const { allSlots, isSlotsLoading, slotApiError, selectedDate, isSlotsFetching } = useBooking();
  const viewMonth = selectedDate.getMonth();
  const selectedDay = selectedDate.getDate();

  if (isSlotsLoading || isSlotsFetching) {
    return <Loader />;
  }

  if (slotApiError) {
    return <ErrorMessage messages={slotApiError.messages} />;
  }

  if (!allSlots) {
    return <p>Not available slots found for the selected date.</p>;
  }

  if (allSlots.length === 0) {
    return (
      <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-4">
          <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
            <CircleAlert size={15} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-snug">
              Master is off on {MONTHS[viewMonth]} {selectedDay}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              No sessions are available this day. Please pick another date.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <p className="text-xs font-medium text-muted-foreground mb-3 tracking-wide uppercase">
        Available times — {MONTHS[viewMonth]} {selectedDay}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {allSlots.map((slot, index) => (
          <SlotsListItem index={index} key={slot.startTime} slot={slot} />
        ))}
      </div>
    </div>
  );
}

export default SlotsList;
