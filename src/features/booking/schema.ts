import { z } from 'zod';

export const bookingContactSchema = z
  .object({
    clientName: z.string().min(2, 'Минимум 2 символа'),
    clientEmail: z.email('Некорректный email').optional().or(z.literal('')),
    clientPhone: z.string().optional(),
  })
  .refine((data) => !!data.clientEmail || !!data.clientPhone, {
    message: 'Укажи email или телефон',
    path: ['clientEmail'],
  });

export type BookingContactFormValues = z.infer<typeof bookingContactSchema>;
