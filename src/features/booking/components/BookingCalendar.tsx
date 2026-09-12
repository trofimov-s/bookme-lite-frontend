import { cn } from 'cn';
import { useState } from 'react';

import { DAYS } from '../constants/days.constant';
import { MONTHS } from '../constants/months.constant';
import { useBooking } from '../context/BookingContext';

import { TIME_UTILS } from '@/shared/utils/time.utils';

function BookingCalendar() {
  const { selectedDate: selected, onDateChange } = useBooking();

  const selectedDate = selected.getDate();
  const selectedDateMonth = selected.getMonth();
  const selectedDateYear = selected.getFullYear();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = TIME_UTILS.getFirstDayOfWeek(viewYear, viewMonth);
  const daysInMonth = TIME_UTILS.getDaysInMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isPast = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);

    return date < today;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 mb-4 shadow-sm">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={prevMonth}
        >
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={nextMonth}
        >
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((day) => (
          <div className="text-center text-[11px] font-medium text-muted-foreground py-1" key={day}>
            {day}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={idx} />;
          }

          const past = isPast(day);
          const isSelected = day === selectedDate && viewMonth === selectedDateMonth && viewYear === selectedDateYear;
          const isToday = day === todayDate && viewMonth === todayMonth && viewYear === todayYear;

          return (
            <button
              disabled={past}
              key={idx}
              className={cn(
                'mx-auto w-9 h-9 rounded-lg text-sm font-medium transition-all duration-100 flex items-center justify-center relative',
                isSelected ? 'bg-foreground text-background' : 'text-foreground hover:bg-accent',
                past && 'text-muted-foreground/30 cursor-not-allowed',
              )}
              onClick={() => !past && onDateChange(new Date(viewYear, viewMonth, day))}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BookingCalendar;
