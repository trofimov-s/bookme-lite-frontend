import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, MoveRightIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { SIGN_UP_API } from '../api';
import { type SignUpFormValues, signUpSchema } from '../schema';

import type { AuthResponseDto } from '@/api/schema';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { useAuthStore } from '@/shared/store/auth.store';
import type { TypedApiError } from '@/types/api-error';

function SignUp() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', name: '', slug: '' },
  });
  const { mutate, isPending, error } = useMutation<AuthResponseDto, TypedApiError, SignUpFormValues>({
    mutationFn: SIGN_UP_API.signup,
    onSuccess: (data: AuthResponseDto) => {
      setAccessToken(data.accessToken);
      navigate('/schedule');
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>

          <CardDescription>Create an account</CardDescription>

          <CardAction>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
              <MoveRightIcon data-icon="inline-end" />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form id="signup-form">
            <FieldGroup>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required htmlFor={field.name}>
                      Email
                    </FieldLabel>
                    <Input {...field} required id={field.name} placeholder="m@example.com" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required htmlFor={field.name}>
                      Password
                    </FieldLabel>
                    <Input {...field} required id={field.name} type="password" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required htmlFor={field.name}>
                      Name
                    </FieldLabel>
                    <Input {...field} required id={field.name} placeholder="Enter your name" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="slug"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                    <Input {...field} id={field.name} placeholder="Enter a slug" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            {error && <ErrorMessage classes="mt-5" messages={error.messages} />}
          </form>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            disabled={isPending}
            form="signup-form"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? <Loader2 className="animate-spin" /> : 'Sign Up'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
