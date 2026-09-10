import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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
            <Button variant="link" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login-form">
            <FieldGroup>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input {...field} id={field.name} placeholder="m@example.com" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input {...field} id={field.name} type="password" placeholder="Enter password" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            {error && <ErrorMessage classNames="mt-5" messages={error.messages} />}
          </form>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            form="login-form"
            className="w-full"
            type="submit"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
