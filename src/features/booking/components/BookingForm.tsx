import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { MONTHS } from '../constants/months.constant';
import { useBooking } from '../context/BookingContext';
import { type BookingContactFormValues, bookingContactSchema } from '../schema';
import type { BOOKING_STEPS_TYPE } from '../types/booking-steps';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { TIME_UTILS } from '@/shared/utils/time.utils';

type Props = { selectStep: (step: BOOKING_STEPS_TYPE) => void };

function BookingForm({ selectStep }: Props) {
  const {
    selectedDate,
    createBookingError,
    selectedSlot,
    selectedSlotIndex,
    onCreateBooking,
    isBookingPending,
    onResetSelectedSlot,
  } = useBooking();

  const dateStr = `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<BookingContactFormValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues: { clientName: '', clientEmail: '', clientPhone: '' },
    mode: 'onChange',
  });

  const onSubmit = (values: BookingContactFormValues) => {
    if (isBookingPending || selectedSlotIndex === null || !selectedDate) {
      return;
    }

    onCreateBooking(values);
  };

  const onResetSlot = () => {
    onResetSelectedSlot();
    selectStep('CALENDAR_AND_SLOTS');
  };

  let apiErrorMsg: React.ReactNode | null = null;

  if (createBookingError) {
    if (createBookingError.code === 409) {
      apiErrorMsg = (
        <div className="flex flex-col gap-y-3 mt-5">
          <p className="text-sm text-destructive">
            This time slot was just booked by someone else. Please choose another time.
          </p>
          <Button variant="outline" onClick={onResetSlot}>
            Choose another time
          </Button>
        </div>
      );
    } else {
      apiErrorMsg = <ErrorMessage classes="mt-5" messages={createBookingError.messages} />;
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        className="flex items-center gap-1.5 text-sm text-muted-foreground not-disabled:hover:text-foreground transition-colors mb-6"
        disabled={isBookingPending}
        onClick={() => selectStep('CALENDAR_AND_SLOTS')}
      >
        <ChevronLeft size={14} />
        Back
      </button>

      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground mb-1 tracking-widest uppercase">Step 2 of 2</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your details</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in your contact info to confirm the booking.</p>
      </div>

      {/* Booking summary */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/60 border border-border mb-6">
        <div className="w-8 h-8 rounded-md bg-foreground text-background flex items-center justify-center shrink-0">
          <Calendar size={14} />
        </div>
        <p className="text-sm font-medium text-foreground">
          {dateStr} · {selectedSlot && TIME_UTILS.minutesToTimeString(selectedSlot.startTime)}
        </p>
        <button
          className="ml-auto text-xs text-muted-foreground not-disabled:hover:text-foreground transition-colors underline underline-offset-2"
          disabled={isBookingPending}
          onClick={() => selectStep('CALENDAR_AND_SLOTS')}
        >
          Change
        </button>
      </div>

      {/* Contact form */}
      <form className="mb-6" id="create-booking-form">
        <FieldGroup>
          <Controller
            control={control}
            disabled={isBookingPending}
            name="clientName"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel required htmlFor={field.name}>
                  Full name
                </FieldLabel>
                <Input {...field} required placeholder="Alex Johnson" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            disabled={isBookingPending}
            name="clientEmail"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                <Input {...field} placeholder="m@example.com" type="email" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            disabled={isBookingPending}
            name="clientPhone"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Phone number</FieldLabel>
                <Input {...field} placeholder="+38 (000) 000-0000" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        {apiErrorMsg}
      </form>

      <Button
        className="w-full"
        disabled={isBookingPending || selectedSlotIndex === null || !isValid}
        form="create-booking-form"
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        {isBookingPending ? (
          <>
            <Loader2 className="animate-spin" />
            Booking…
          </>
        ) : (
          'Confirm booking'
        )}
      </Button>
    </div>
  );
}

export default BookingForm;
