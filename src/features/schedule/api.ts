import { apiClient } from '@/api/client';
import type { ScheduleBatchRequestDto, ScheduleResponseDto } from '@/api/schema';

async function getMySchedule() {
  const { data } = await apiClient.get<ScheduleResponseDto[]>('/schedule');

  return data;
}

async function updateSchedule(payload: ScheduleBatchRequestDto) {
  const { data } = await apiClient.put<ScheduleResponseDto[]>('/schedule', payload);

  return data;
}

export const SCHEDULE_API = {
  getMySchedule,
  updateSchedule,
};
