import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { useParams } from 'react-router';

import { SLOTS_API } from '../api';
import type { BookingContactFormValues } from '../schema';

import type {
  CreateBookingRequestDto,
  CreateBookingResponseDto,
  SlotItemResponseDto,
  SlotResponseDto,
} from '@/api/schema';
import { TIME_UTILS } from '@/shared/utils/time.utils';
import type { TypedApiError } from '@/types/api-error';

function isToday(selectedDate: Date | string): boolean {
  const now = new Date();
  const date = new Date(selectedDate);

  const isToday =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();

  return isToday;
}

function isSlotPast(slot: SlotItemResponseDto): boolean {
  const now = new Date();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slot.startTime < currentMinutes;
}

type BookingContextValue = {
  selectedDate: Date;
  slug: string;
  selectedSlotIndex: number | null;
  selectedSlot: SlotItemResponseDto | undefined;

  isSlotsLoading: boolean;
  isSlotsFetching: boolean;
  slotApiError: TypedApiError | null;
  allSlots: SlotItemResponseDto[] | undefined;

  isBookingCreated: boolean;
  isBookingPending: boolean;
  createBookingError: TypedApiError | null;

  bookingData: CreateBookingRequestDto | null;

  onDateChange: (date: Date | undefined) => void;
  onSlotChange: (index: number) => void;
  onCreateBooking: (values: BookingContactFormValues) => void;
  onResetSelectedSlot: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const { slug = '' } = useParams<{ slug: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isBookingCreated, setIsBookingCreated] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<CreateBookingRequestDto | null>(null);

  const {
    data: slotsResponse,
    isPending: isSlotsLoading,
    isFetching: isSlotsFetching,
    error: slotApiError,
    refetch,
  } = useQuery<SlotResponseDto, TypedApiError>({
    queryKey: ['bookings', 'slots', slug, selectedDate],
    queryFn: () => SLOTS_API.getSlots(slug, TIME_UTILS.formatDate(selectedDate)),
    select: (slotsResponse): SlotResponseDto => {
      if (!isToday(slotsResponse.date)) {
        return slotsResponse;
      }

      const modified: SlotResponseDto = {
        date: slotsResponse.date,
        slots: slotsResponse.slots.map((slot) => {
          if (slot.isLocked) {
            return slot;
          }

          return {
            ...slot,
            isLocked: isSlotPast(slot),
          };
        }),
      };

      return modified;
    },
  });

  const {
    mutate: createBooking,
    isPending: isBookingPending,
    error: createBookingError,
  } = useMutation<CreateBookingResponseDto, TypedApiError, CreateBookingRequestDto>({
    mutationFn: SLOTS_API.bookSlot,
    onSuccess: () => setIsBookingCreated(true),
  });

  const onDateChange = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    setSelectedSlotIndex(null);
  };

  const onSlotChange = (index: number) => {
    setSelectedSlotIndex((prev) => (prev === index ? null : index));
  };

  const onCreateBooking = (values: BookingContactFormValues): void => {
    if (selectedSlotIndex === null || !slotsResponse) return;

    const payload: CreateBookingRequestDto = {
      clientName: values.clientName,
      date: TIME_UTILS.formatDate(selectedDate),
      slug,
      startTime: slotsResponse.slots[selectedSlotIndex].startTime,
      endTime: slotsResponse.slots[selectedSlotIndex].endTime,
    };

    if (values.clientEmail) payload.clientEmail = values.clientEmail;
    if (values.clientPhone) payload.clientPhone = values.clientPhone;

    setBookingData(payload);

    createBooking(payload);
  };

  const onResetSelectedSlot = (): void => {
    setSelectedSlotIndex(null);
    refetch();
  };

  const selectedSlot =
    selectedSlotIndex !== null && slotsResponse?.slots ? slotsResponse.slots[selectedSlotIndex] : undefined;

  const value: BookingContextValue = {
    selectedDate,
    slug,
    selectedSlotIndex,
    selectedSlot,

    isSlotsLoading,
    isSlotsFetching,
    slotApiError,
    allSlots: slotsResponse?.slots,

    isBookingCreated,
    isBookingPending,
    createBookingError,

    bookingData,

    onDateChange,
    onSlotChange,
    onCreateBooking,
    onResetSelectedSlot,
  };

  return <BookingContext value={value}>{children}</BookingContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }

  return context;
}
