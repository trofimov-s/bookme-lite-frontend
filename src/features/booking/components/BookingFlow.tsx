import { useCallback, useState } from 'react';

import { useBooking } from '../context/BookingContext';
import type { BOOKING_STEPS_TYPE } from '../types/booking-steps';
import BookingForm from './BookingForm';
import StepCalendarAndSlots from './StepCalendarAndSlots';
import SuccessBookingPage from './SuccessBookingPage';

const BOOKING_STEPS: BOOKING_STEPS_TYPE[] = ['CALENDAR_AND_SLOTS', 'BOOKING_FORM'];

function BookingFlow() {
  const { isBookingCreated } = useBooking();
  const [step, setStep] = useState<BOOKING_STEPS_TYPE>('CALENDAR_AND_SLOTS');

  const selectStep = useCallback((selectedStep: BOOKING_STEPS_TYPE) => {
    setStep(selectedStep);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-sm mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">Inveleo</span>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {BOOKING_STEPS.map((item) => (
              <div
                className="transition-all duration-300 rounded-full h-1.5"
                key={item}
                style={{
                  width: step === item ? 20 : 6,
                  backgroundColor: step === item ? 'var(--foreground)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          {isBookingCreated ? (
            <SuccessBookingPage />
          ) : (
            <>
              {step === 'CALENDAR_AND_SLOTS' && <StepCalendarAndSlots selectStep={selectStep} />}
              {step === 'BOOKING_FORM' && <BookingForm selectStep={selectStep} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default BookingFlow;
