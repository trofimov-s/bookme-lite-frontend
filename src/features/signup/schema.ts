import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.email('Enter correct email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  name: z.string(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/)
    .optional(),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
