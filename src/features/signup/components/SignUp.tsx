import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { SIGN_UP_API } from '../api';
import { type SignUpFormValues, signUpSchema } from '../schema';

import type { AuthResponseDto } from '@/api/schema';
import ErrorMessage from '@/shared/components/ErrorMessage';
import { useAuthStore } from '@/shared/store/auth.store';
import type { TypedApiError } from '@/types/api-error';

function SignUp() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} type="email" placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}

        <input {...register('password')} type="password" placeholder="Password" />
        {errors.password && <span>{errors.password.message}</span>}

        <input {...register('name')} placeholder="Name" />
        {errors.name && <span>{errors.name.message}</span>}

        <input {...register('slug')} placeholder="Slug" />
        {errors.slug && <span>{errors.slug.message}</span>}

        <button type="submit" disabled={isPending}>
          {isPending ? 'Entering...' : 'Sign Up'}
        </button>

        {error && <ErrorMessage messages={error.messages} />}
      </form>

      <Link to="/login">Login</Link>
    </>
  );
}

export default SignUp;
