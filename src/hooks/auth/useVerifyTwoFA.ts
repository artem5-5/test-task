import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api/authApi';

export const useVerifyTwoFA = () => {
  return useMutation({
    mutationFn: authApi.verifyTwoFA,
    retry: false
  });
};