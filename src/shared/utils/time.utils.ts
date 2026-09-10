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

export const TIME_UTILS = { minutesToTimeString, timeStringToMinutes };
