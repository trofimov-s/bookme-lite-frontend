import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';

import { SCHEDULE_API } from '../api';
import { type ScheduleDay, scheduleFormSchema, type ScheduleFormValues } from '../schema';
import ScheduleFormItem from './ScheduleFormItem';

import { queryClient } from '@/api/queryClient';
import type { ScheduleBatchRequestDto, ScheduleDayRequestDto, ScheduleResponseDto } from '@/api/schema';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { TIME_UTILS } from '@/shared/utils/time.utils';
import type { TypedApiError } from '@/types/api-error';

function buildDefaultDays(days: ScheduleResponseDto[]): ScheduleDay[] {
  const week: ScheduleDay[] = Array.from({ length: 7 }, (_, weekday: number) => {
    const day = days.find((item) => item.weekday === weekday);

    return {
      weekday,
      isActive: !!day,
      startTime: day ? TIME_UTILS.minutesToTimeString(day.startTime) : '09:00',
      endTime: day ? TIME_UTILS.minutesToTimeString(day.endTime) : '17:00',
    };
  });

  const sunday = week.shift();

  if (sunday) {
    week.push(sunday);
  }

  return week;
}

function convertToScheduleItemDto(value: ScheduleFormValues): ScheduleDayRequestDto[] {
  return value.days
    .filter(({ isActive }) => isActive)
    .map((day) => ({
      weekday: day.weekday,
      startTime: TIME_UTILS.timeStringToMinutes(day.startTime),
      endTime: TIME_UTILS.timeStringToMinutes(day.endTime),
    }));
}

type ScheduleFormProps = {
  schedule: ScheduleResponseDto[];
};

function ScheduleForm({ schedule }: ScheduleFormProps) {
  const { mutate, isPending, error } = useMutation<ScheduleResponseDto[], TypedApiError, ScheduleBatchRequestDto>({
    mutationFn: SCHEDULE_API.updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });

  const { handleSubmit, control, register } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: { days: buildDefaultDays(schedule) },
    disabled: isPending,
  });

  const { fields } = useFieldArray({
    name: 'days',
    control,
  });

  const onSubmit = (data: ScheduleFormValues) => {
    const payload = { items: convertToScheduleItemDto(data) };
    mutate(payload);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          {fields.map(({ id, weekday }, index) => (
            <ScheduleFormItem key={id} weekday={weekday} index={index} register={register} control={control} />
          ))}
        </ul>

        <button type="submit">Save</button>
      </form>

      {error && <ErrorMessage messages={error.messages} />}
    </>
  );
}

export default ScheduleForm;
