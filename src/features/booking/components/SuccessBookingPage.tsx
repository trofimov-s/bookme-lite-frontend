import { useEffect, useState } from 'react';

import { MONTHS } from '../constants/months.constant';
import { useBooking } from '../context/BookingContext';

import { Button } from '@/components/ui/button';
import { TIME_UTILS } from '@/shared/utils/time.utils';

function SuccessBookingPage() {
  const { bookingData: data, selectedDate } = useBooking();

  const [showCheck, setShowCheck] = useState(false);

  const dateStr = data
    ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : undefined;

  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(true), 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Icon */}
      <div className="relative mb-6 mt-4">
        <div className="absolute inset-0 -m-3 rounded-full border-2 border-foreground/10 animate-in zoom-in duration-700" />

        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-foreground animate-in zoom-in duration-500">
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
            <path
              d="M5 13l5 5L19 7"
              stroke="white"
              strokeDasharray="28"
              strokeDashoffset={showCheck ? 0 : 28}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              style={{
                transition: 'stroke-dashoffset 0.45s ease',
              }}
            />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">You're booked!</h1>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">We look forward to seeing you.</p>

      {/* Summary card */}
      <div className="w-full rounded-xl border border-border bg-card shadow-sm mb-6 overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Booking summary</p>
        </div>
        <ul className="divide-y divide-border">
          {[
            { label: 'Name', value: data?.clientName },
            { label: 'Date', value: dateStr ?? '' },
            { label: 'Time', value: data?.startTime ? TIME_UTILS.minutesToTimeString(data.startTime) : '' },
            { label: 'Email', value: data?.clientEmail ?? '-' },
            { label: 'Phone', value: data?.clientPhone ?? '-' },
          ].map(({ label, value }) => (
            <li className="flex items-center justify-between px-4 py-3" key={label}>
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button className="px-6" variant="outline" onClick={() => window.location.reload()}>
        Book another session
      </Button>
    </div>
  );
}

export default SuccessBookingPage;
