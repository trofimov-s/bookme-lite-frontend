import { cn } from 'cn';

import { useBooking } from '../context/BookingContext';
import type { BOOKING_STEPS_TYPE } from '../types/booking-steps';
import BookingCalendar from './BookingCalendar';
import SlotsList from './SlotsList';

import { Button } from '@/components/ui/button';

type Props = { selectStep: (step: BOOKING_STEPS_TYPE) => void };

function StepCalendarAndSlots({ selectStep }: Props) {
  const { selectedSlotIndex } = useBooking();

  const isSlotSelected = selectedSlotIndex !== null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Heading */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground mb-1 tracking-widest uppercase">Step 1 of 2</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Choose a date</h1>
        <p className="text-sm text-muted-foreground mt-1">Select a day and then pick an available time slot.</p>
      </div>

      <BookingCalendar />

      <SlotsList />

      <Button
        disabled={!isSlotSelected}
        className={cn(
          'w-full h-11 rounded-lg text-sm font-semibold transition-all duration-150',
          isSlotSelected
            ? 'bg-foreground text-background hover:bg-foreground/90 shadow-sm'
            : 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
        onClick={() => selectStep('BOOKING_FORM')}
      >
        Continue
      </Button>
    </div>
  );
}

export default StepCalendarAndSlots;
