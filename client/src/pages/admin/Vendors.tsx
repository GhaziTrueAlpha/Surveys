import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UserTable from '@/components/users/UserTable';

export default function AdminVendors() {
  return (
    <DashboardLayout title="Vendor Management">
      <UserTable role="vendor" />
    </DashboardLayout>
  );
}
