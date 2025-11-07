// Authentication interfaces
export interface LoginPayload {
    email: string;
    password: string;
}

export interface PatientRegistrationPayload {
    email: string;
    password: string;
    fullName: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    expiration: number;
}

// Doctor interfaces
export interface CreateDoctorPayload {
    doctorName: string;
    departmentId: number;
    experience?: number;
    doctorEmail: string;
    doctorPhone: string;
    password: string;
}

export interface DoctorResponse {
    id: number;
    doctorName: string;
    departmentId: number;
    departmentName: string;
    experience: number;
    doctorEmail: string;
    doctorPhone: string;
}

// Appointment interfaces
export interface CreateAppointmentPayload {
    doctorId: number;
    date: string; // yyyy-MM-dd format
    timeSlot: number; // 1-16
    notes?: string;
}

export interface RescheduleAppointmentPayload {
    appointmentDate: string; // yyyy-MM-dd format
    timeSlot: number; // 1-16
}

export interface AvailableTimeSlotsResponse {
    listOfAvailableTimeSlots: number[];
}

export interface PatientAppointmentResponse {
    appointmentId: number;
    doctorName: string;
    appointmentDate: string;
    departmentName: string;
    timeSlot: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    doctorId: number;
}

export interface DoctorAppointmentResponse {
    appointmentId: number;
    timeSlot: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    appointmentDate: string;
}

export interface AppointmentCreatedResponse {
    id: number;
    doctorName: string;
    patientName: string;
    appointmentDate: string;
    timeSlot: number;
    status: 'SCHEDULED';
}

// Department and Symptom interfaces
export interface SymptomResponse {
    id: number;
    name: string;
}

export interface SuggestDepartmentPayload {
    symptomIds: number[];
}

export interface DepartmentSuggestionResponse {
    departmentId: number;
    departmentName: string;
}

// Common response interface
export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    data?: T;
    status?: number;
    timestamp?: string;
    error?: string;
}
