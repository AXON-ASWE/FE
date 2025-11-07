import { SymptomResponse, DepartmentSuggestionResponse, DoctorResponse } from './BE-library/interfaces';

export interface AppointmentData {
  selectedSymptoms: SymptomResponse[];
  selectedDepartments: DepartmentSuggestionResponse[];
  selectedDoctor: DoctorResponse;
  timestamp: string;
}

const STORAGE_KEY = 'appointmentData';

/**
 * Lưu thông tin đặt lịch vào localStorage
 */
export const saveAppointmentData = (data: AppointmentData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Appointment data saved to localStorage:', data);
    return true;
  } catch (error) {
    console.error('Error saving appointment data to localStorage:', error);
    return false;
  }
};

/**
 * Lấy thông tin đặt lịch từ localStorage
 */
export const getAppointmentData = (): AppointmentData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsedData = JSON.parse(data) as AppointmentData;
    
    // Kiểm tra dữ liệu có hợp lệ không (không quá cũ - 24h)
    const timestamp = new Date(parsedData.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      // Xóa dữ liệu cũ
      clearAppointmentData();
      return null;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error retrieving appointment data from localStorage:', error);
    return null;
  }
};

/**
 * Xóa thông tin đặt lịch từ localStorage
 */
export const clearAppointmentData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Appointment data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing appointment data from localStorage:', error);
  }
};

/**
 * Kiểm tra có dữ liệu đặt lịch trong localStorage không
 */
export const hasAppointmentData = (): boolean => {
  return getAppointmentData() !== null;
};
