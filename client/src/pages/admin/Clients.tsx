import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UserTable from '@/components/users/UserTable';

export default function AdminClients() {
  return (
    <DashboardLayout title="Client Management">
      <UserTable role="client" />
    </DashboardLayout>
  );
}
