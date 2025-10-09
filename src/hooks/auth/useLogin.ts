import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api/authApi';

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    retry: false
  });
};