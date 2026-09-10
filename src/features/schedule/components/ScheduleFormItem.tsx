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
        <input {...register(`days.${index}.isActive`)} type="checkbox" id="isActive" />
      </label>

      <label htmlFor="startTime">
        <span>Start Time</span>
        <input {...register(`days.${index}.startTime`)} type="time" id="startTime" disabled={!isActive} />
      </label>

      <label htmlFor="endTime">
        <span>End Time</span>
        <input {...register(`days.${index}.endTime`)} type="time" id="endTime" disabled={!isActive} />
      </label>
    </li>
  );
}

export default ScheduleFormItem;
