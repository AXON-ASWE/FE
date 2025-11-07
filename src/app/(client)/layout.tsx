import { PatientRoute } from '@/components/guards/RouteGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export const metadata = {
  title: 'Patient Dashboard | AXON Healthcare',
  description: 'Patient portal for managing appointments, medical records, and health information',
};

export default function ClientLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <PatientRoute>
        {children}
        {modal}
    </PatientRoute>
  );
}