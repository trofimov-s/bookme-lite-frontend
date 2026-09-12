import { type Control, type UseFormRegister, useWatch } from 'react-hook-form';

import type { ScheduleFormValues } from '../schema';

const WEEK = ['Sunday', 'Monday', 'Tuersday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type ScheduleFormItemProps = {
  weekday: number;
  register: UseFormRegister<ScheduleFormValues>;
  control: Control<ScheduleFormValues>;
  index: number;
};

function ScheduleFormItem({ index, weekday, register, control }: ScheduleFormItemProps) {
  const isActive = useWatch({
    control,
    name: `days.${index}.isActive`,
  });

  return (
    <li>
      <h3>{WEEK[weekday]}</h3>

      <label htmlFor="isActive">
        <span>Is Workday?</span>
        <input {...register(`days.${index}.isActive`)} id="isActive" type="checkbox" />
      </label>

      <label htmlFor="startTime">
        <span>Start Time</span>
        <input {...register(`days.${index}.startTime`)} disabled={!isActive} id="startTime" type="time" />
      </label>

      <label htmlFor="endTime">
        <span>End Time</span>
        <input {...register(`days.${index}.endTime`)} disabled={!isActive} id="endTime" type="time" />
      </label>
    </li>
  );
}

export default ScheduleFormItem;
