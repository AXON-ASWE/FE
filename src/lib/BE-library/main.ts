import axios, { AxiosResponse } from "axios";
import {
  LoginPayload,
  PatientRegistrationPayload,
  AuthResponse,
  CreateDoctorPayload,
  DoctorResponse,
  CreateAppointmentPayload,
  RescheduleAppointmentPayload,
  AvailableTimeSlotsResponse,
  PatientAppointmentResponse,
  DoctorAppointmentResponse,
  AppointmentCreatedResponse,
  SymptomResponse,
  SuggestDepartmentPayload,
  DepartmentSuggestionResponse,
  ApiResponse
} from "./interfaces";


function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

const BASE_URL = 'http://localhost:8080';
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const handleApiError = (error: any, operation: string): ApiResponse => {
  console.error(`Error in ${operation}:`, error?.response?.data);
  return {
    success: false,
    message: error?.response?.data?.message || error?.message || "An error occurred",
    status: error?.response?.status,
    timestamp: error?.response?.data?.timestamp,
    error: error?.response?.data?.error,
  };
};


class AuthOperation {
  /**
   * Admin/Doctor Login
   * POST /api/auth/login
   */
  async adminLogin(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${BASE_URL}/api/auth/login`,
        payload
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Admin Login');
    }
  }

  /**
   * Patient Registration
   * POST /api/patient/auth/register
   */
  async patientRegister(payload: PatientRegistrationPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${BASE_URL}/api/patient/auth/register`,
        payload
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Patient Registration');
    }
  }
}


class DoctorOperation {
  /**
   * Get Doctors by Department
   * GET /doctor?departmentId={id}
   */
  async getDoctorsByDepartment(departmentId: number): Promise<ApiResponse<DoctorResponse[]>> {
    try {
      const response: AxiosResponse<DoctorResponse[]> = await apiClient.get(
        `/doctor?departmentId=${departmentId}`
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Get Doctors by Department');
    }
  }

  /**
   * Create Doctor Profile (Admin only)
   * POST /doctor/create
   */
  async createDoctor(payload: CreateDoctorPayload): Promise<ApiResponse<{ success: boolean; message: string }>> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post(
        '/doctor/create',
        payload
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Create Doctor');
    }
  }
}


class AppointmentOperation {
  /**
   * Get Available Time Slots (Patient only)
   * GET /appointment/available?doctorId={id}&date={yyyy-MM-dd}
   */
  async getAvailableTimeSlots(
    doctorId: number,
    date: string
  ): Promise<ApiResponse<AvailableTimeSlotsResponse>> {
    try {
      const response: AxiosResponse<AvailableTimeSlotsResponse> = await apiClient.get(
        `/appointment/available?doctorId=${doctorId}&date=${date}`
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Get Available Time Slots');
    }
  }

  /**
   * Get Patient Appointments (Patient only)
   * GET /appointment/patient
   */
  async getPatientAppointments(): Promise<ApiResponse<PatientAppointmentResponse[]>> {
    try {
      const response: AxiosResponse<PatientAppointmentResponse[]> = await apiClient.get(
        '/appointment/patient'
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Get Patient Appointments');
    }
  }

  /**
   * Get Doctor Appointments (Doctor only)
   * GET /appointment/doctor
   */
  async getDoctorAppointments(): Promise<ApiResponse<DoctorAppointmentResponse[]>> {
    try {
      const response: AxiosResponse<DoctorAppointmentResponse[]> = await apiClient.get(
        '/appointment/doctor'
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Get Doctor Appointments');
    }
  }

  /**
   * Create Appointment (Patient only)
   * POST /appointment/create
   */
  async createAppointment(payload: CreateAppointmentPayload): Promise<ApiResponse<AppointmentCreatedResponse>> {
    try {
      const response: AxiosResponse<AppointmentCreatedResponse> = await apiClient.post(
        '/appointment/create',
        payload
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Create Appointment');
    }
  }

  /**
   * Cancel Appointment
   * PUT /appointment/{id}/cancel
   */
  async cancelAppointment(appointmentId: number): Promise<ApiResponse<string>> {
    try {
      const response: AxiosResponse<string> = await apiClient.put(
        `/appointment/${appointmentId}/cancel`
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Cancel Appointment');
    }
  }

  /**
   * Reschedule Appointment
   * PUT /appointment/{id}/reschedule
   */
  async rescheduleAppointment(
    appointmentId: number,
    payload: RescheduleAppointmentPayload
  ): Promise<ApiResponse<string>> {
    try {
      const response: AxiosResponse<string> = await apiClient.put(
        `/appointment/${appointmentId}/reschedule`,
        payload
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Reschedule Appointment');
    }
  }

  /**
   * Get time slot display text
   * Helper function to convert time slot number to readable time
   */
  getTimeSlotDisplay(timeSlot: number): string {
    const timeSlots: { [key: number]: string } = {
      1: '08:00-08:30',
      2: '08:30-09:00',
      3: '09:00-09:30',
      4: '09:30-10:00',
      5: '10:00-10:30',
      6: '10:30-11:00',
      7: '11:00-11:30',
      8: '11:30-12:00',
      9: '13:00-13:30',
      10: '13:30-14:00',
      11: '14:00-14:30',
      12: '14:30-15:00',
      13: '15:00-15:30',
      14: '15:30-16:00',
      15: '16:00-16:30',
      16: '16:30-17:00',
    };
    return timeSlots[timeSlot] || 'Invalid time slot';
  }
}


class SymptomDepartmentOperation {
  /**
   * Get All Symptoms
   * GET /symptoms/names
   */
  async getAllSymptoms(): Promise<ApiResponse<SymptomResponse[]>> {
    try {
      const response: AxiosResponse<SymptomResponse[]> = await apiClient.get('/symptoms/names');

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Get All Symptoms');
    }
  }

  /**
   * Suggest Department by Symptoms
   * POST /department/suggest
   */
  async suggestDepartmentBySymptoms(
    payload: SuggestDepartmentPayload
  ): Promise<ApiResponse<DepartmentSuggestionResponse[]>> {
    try {
      const response: AxiosResponse<DepartmentSuggestionResponse[]> = await apiClient.post(
        '/department/suggest',
        payload
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return handleApiError(error, 'Suggest Department by Symptoms');
    }
  }
}


export class AxonHealthcareUtils {
  /**
   * Format date to yyyy-MM-dd format required by API
   */
  static formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Parse API date string to Date object
   */
  static parseAPIDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Check if user has required role
   */
  static hasRole(requiredRole: 'ADMIN' | 'DOCTOR' | 'PATIENT'): boolean {
    const token = getAccessToken();
    if (!token) return false;
    
    try {
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return payload.role === requiredRole;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user role from token
   */
  static getUserRole(): 'ADMIN' | 'DOCTOR' | 'PATIENT' | null {
    const token = getAccessToken();
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return payload.role;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(): boolean {
    const token = getAccessToken();
    if (!token) return true;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}


// Create instances for export
const authOperation = new AuthOperation();
const doctorOperation = new DoctorOperation();  
const appointmentOperation = new AppointmentOperation();
const symptomDepartmentOperation = new SymptomDepartmentOperation();

export {
  getAccessToken,
  apiClient,
  BASE_URL,
  authOperation,
  doctorOperation,
  appointmentOperation,
  symptomDepartmentOperation
};
