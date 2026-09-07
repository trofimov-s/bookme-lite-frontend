import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { LOGIN_API } from '../api';
import { type LoginFormValues, loginSchema } from '../schema';

import type { AuthResponseDto } from '@/api/schema';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { useAuthStore } from '@/shared/store/auth.store';
import type { TypedApiError } from '@/types/api-error';

function Login() {
  const { setAccessToken } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Entering...' : 'Login'}
      </button>

      {error && <ErrorMessage messages={error.messages} />}
    </form>
  );
}

export default Login;
