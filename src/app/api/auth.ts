import axios from 'axios';
import { LoginPayload, SignUpPayload } from '@/lib/BE-library/interfaces';

const BASE_URL = 'http://localhost:8000/api/v1/auth';

export const signup = async (payload: SignUpPayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, payload, {
      withCredentials: true,
    });
    return { status: response.status, data: response.data }; // Return status and data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Signup failed');
  }
};

// export const signin = async (payload: LoginPayload) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/signin`, payload, {
//       withCredentials: true,
//     });
//     return { status: response.status, data: response.data }; // Return status and data
//   } catch (error: any) {
//     throw new Error(error?.response?.data?.message || "Signin failed");
//   }
// };
export const signin = async ({ email, password }: LoginPayload) => {
  const demo: Record<string, 'user' | 'doctor' | 'admin'> = {
    'patient@example.com': 'user',
    'doctor@example.com': 'doctor',
    'admin@example.com': 'admin',
  };

  if (!demo[email] || password !== '12345678') {
    throw new Error('Sai tài khoản hoặc mật khẩu');
  }

  return {
    access_token: 'mock_access',
    refresh_token: 'mock_refresh',
    user: {
      id: '123',
      email,
      name: email.split('@')[0],
      role: demo[email],
    },
  };
};

export const logout = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return { status: response.status, data: response.data }; // Return status and data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Logout failed');
  }
};
