import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string('Enter correct email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
