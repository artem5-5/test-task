import { type LoginCredentials, type AuthResponse, type TwoFACredentials } from '../../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!credentials.username || !credentials.password) {
      throw new Error("Fill in all the fields");
    }

    if (credentials.username === "admin" && credentials.password === "admin") {
      return {
        success: true,
        requiresTwoFA: true,
        tempToken: "temp_123",
        message: "Requires 2FA",
      };
    }

    throw new Error("Invalid credentials");
  },

  verifyTwoFA: async (credentials: TwoFACredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!credentials.code) {
      throw new Error('Введите код');
    }
    
    if (credentials.code.length !== 6 || !/^\d+$/.test(credentials.code)) {
      throw new Error('Код должен содержать 6 цифр');
    }
    
    if (credentials.code === '123456') {
      return {
        success: true,
        token: 'jwt_final_token_' + Date.now(),
        message: 'Вход выполнен успешно!'
      };
    }
    
    throw new Error('Invalid code');
  },
  requestNewCode: async (): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      message: 'Новый код отправлен в приложение Google Authenticator'
    };
  }
};