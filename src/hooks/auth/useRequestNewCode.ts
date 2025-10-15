import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api/authApi';
import { type AuthError } from '../../types/auth';

export const useRequestNewCode = () => {
  return useMutation<
    { success: boolean; message: string },
    AuthError,
    string
  >({
    mutationFn: authApi.requestNewCode,
    retry: false
  });
};