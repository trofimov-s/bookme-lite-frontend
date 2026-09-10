import { useQuery } from '@tanstack/react-query';

import { SCHEDULE_API } from '../api';
import ScheduleForm from './ScheduleForm';

import type { ScheduleResponseDto } from '@/api/schema';
import ErrorMessage from '@/shared/components/ErrorMessage';
import type { TypedApiError } from '@/types/api-error';

function Schedule() {
  const {
    data: schedule,
    isLoading,
    error,
  } = useQuery<ScheduleResponseDto[], TypedApiError>({
    queryKey: ['schedule'],
    queryFn: SCHEDULE_API.getMySchedule,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage messages={error.messages} />;
  }

  if (!schedule) {
    return <div>Schedule not found</div>;
  }

  return <ScheduleForm schedule={schedule} />;
}

export default Schedule;
