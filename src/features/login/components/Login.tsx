import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, MoveRightIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { LOGIN_API } from '../api';
import { type LoginFormValues, loginSchema } from '../schema';

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

function Login() {
  const { setAccessToken } = useAuthStore();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending, error } = useMutation<AuthResponseDto, TypedApiError, LoginFormValues>({
    mutationFn: LOGIN_API.login,
    onSuccess({ accessToken }) {
      setAccessToken(accessToken);
      navigate('/bookings');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>

          <CardDescription>Enter your email below to login to your account</CardDescription>

          <CardAction>
            <Button variant="ghost" onClick={() => navigate('/signup')}>
              Sign up
              <MoveRightIcon area-icon="inline-end" />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form id="login-form">
            <FieldGroup>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel required htmlFor={field.name}>
                      Email
                    </FieldLabel>
                    <Input {...field} required id={field.name} />
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
                    <Input {...field} required id={field.name} placeholder="Enter password" type="password" />
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
            form="login-form"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? <Loader2 className="animate-spin" /> : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
