import { format } from 'date-fns';

function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');

  return `${hours}:${mins}`;
}

function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Returns the number of days in the specified month.
 *
 * @param year - The year.
 * @param month - The month, using zero-based indexing (0 = January, 11 = December).
 * @returns The number of days in the month.
 */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();

  return day === 0 ? 6 : day - 1;
}

export const TIME_UTILS = { minutesToTimeString, timeStringToMinutes, formatDate, getDaysInMonth, getFirstDayOfWeek };
