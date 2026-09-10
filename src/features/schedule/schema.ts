import { z } from 'zod';

const scheduleDaySchema = z.object({
  weekday: z.number(),
  isActive: z.boolean(),
  startTime: z.string(),
  endTime: z.string(),
});

export const scheduleFormSchema = z.object({
  days: z.array(scheduleDaySchema).length(7),
});

export type ScheduleDay = z.infer<typeof scheduleDaySchema>;

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
