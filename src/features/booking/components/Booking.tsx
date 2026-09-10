import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { SLOTS_API } from '../api';
import { type BookingContactFormValues, bookingContactSchema } from '../schema';

import type { CreateBookingRequestDto, CreateBookingResponseDto, SlotResponseDto } from '@/api/schema';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { TIME_UTILS } from '@/shared/utils/time.utils';
import type { TypedApiError } from '@/types/api-error';

const today = new Date().toLocaleDateString('en-CA');

function Booking() {
  const { slug = '' } = useParams<{ slug: string | undefined }>();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-CA'));
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [bookingCreated, setBookingCreated] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery<SlotResponseDto, TypedApiError>({
    queryKey: ['bookings', 'slots', slug, selectedDate],
    queryFn: () => SLOTS_API.getSlots(slug, selectedDate),
  });

  const {
    mutate,
    isPending,
    error: createApiError,
  } = useMutation<CreateBookingResponseDto, TypedApiError, CreateBookingRequestDto>({
    mutationFn: SLOTS_API.bookSlot,
    onSuccess: () => {
      setBookingCreated(true);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingContactFormValues>({
    resolver: zodResolver(bookingContactSchema),
  });

  const onDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const onSlotSelected = (index: number) => {
    setSelectedSlot((curr) => (curr === index ? null : index));
  };

  const onSubmit = (values: BookingContactFormValues) => {
    const payload: CreateBookingRequestDto = {
      clientName: values.clientName,
      date: selectedDate,
      slug,
      startTime: data!.slots[selectedSlot as number].startTime,
      endTime: data!.slots[selectedSlot as number].endTime,
    };

    if (values.clientEmail) {
      payload.clientEmail = values.clientEmail;
    }

    if (values.clientPhone) {
      payload.clientPhone = values.clientPhone;
    }

    mutate(payload);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage messages={error.messages} />;
  }

  if (!data) {
    return <div>Ooops... something went wrong</div>;
  }

  if (bookingCreated) {
    return <div>BOOKING CREATED!!!</div>;
  }

  return (
    <div>
      <h2>Booking</h2>

      <div>
        <span>DATE</span>
        <input type="date" value={selectedDate} min={today} onChange={(e) => onDateChange(e.target.value)} />
      </div>

      <div>
        <p>SLOTS</p>

        <ul>
          {data.slots.map((slot, i) => (
            <li key={slot.startTime} style={{ backgroundColor: i === selectedSlot ? 'pink' : 'transparent' }}>
              {slot.isLocked && <span>Not available</span>}

              <p>
                {TIME_UTILS.minutesToTimeString(slot.startTime)} - {TIME_UTILS.minutesToTimeString(slot.endTime)}
              </p>

              <button disabled={slot.isLocked} onClick={() => onSlotSelected(i)}>
                {i === selectedSlot ? 'Unselect' : 'Select'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedSlot !== null && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('clientName')} placeholder="Name" />
          {errors.clientName && <span>{errors.clientName.message}</span>}

          <input {...register('clientEmail')} type="email" placeholder="Email" />
          {errors.clientEmail && <span>{errors.clientEmail.message}</span>}

          <input {...register('clientPhone')} placeholder="Phone" />
          {errors.clientPhone && <span>{errors.clientPhone.message}</span>}

          <button disabled={isPending} type="submit">
            Save
          </button>
        </form>
      )}

      {createApiError && <ErrorMessage messages={createApiError.messages} />}
    </div>
  );
}

export default Booking;
