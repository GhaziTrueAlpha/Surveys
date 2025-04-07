import React, { useState } from 'react';
import { User, SURVEY_CATEGORIES, SurveyCategory } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UserTableProps {
  role: 'vendor' | 'client';
}

export default function UserTable({ role }: UserTableProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all');
  
  // Fetch users based on role
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: [`/api/users?role=${role}${approvalFilter !== 'all' ? `&flag=${approvalFilter}` : ''}`],
  });
  
  const handleApproveUser = async (userId: string, category: SurveyCategory) => {
    try {
      await apiRequest('PATCH', `/api/users/${userId}`, {
        flag: 'yes',
        category,
      });
      
      // Invalidate queries to refetch users
      queryClient.invalidateQueries({ queryKey: [`/api/users`] });
      
      toast({
        title: 'Success!',
        description: `${role === 'vendor' ? 'Vendor' : 'Client'} approved successfully.`,
      });
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to approve ${role}`,
        variant: 'destructive'
      });
    }
  };
  
  // Filter users by search term
  const filteredUsers = users ? users.filter((user: User) => {
    const searchFields = [
      user.name,
      user.email,
      user.company_name,
      user.city
    ].filter(Boolean).join(' ').toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  }) : [];
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load users. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 flex space-x-2">
            <div className="max-w-xs">
              <label htmlFor="approval-filter" className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
              <Select 
                onValueChange={(value) => setApprovalFilter(value)}
                defaultValue={approvalFilter}
              >
                <SelectTrigger id="approval-filter" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Approved</SelectItem>
                  <SelectItem value="no">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-w-xs flex-grow">
              <label htmlFor="search-users" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="search-users"
                  type="text"
                  placeholder={`Search ${role}s...`}
                  className="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-gray-500">No {role}s found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company_name}</TableCell>
                  <TableCell>{user.category || '-'}</TableCell>
                  <TableCell>
                    {user.flag === 'yes' ? (
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.flag === 'no' ? (
                      <div className="flex items-center space-x-2 justify-end">
                        <Select onValueChange={(value) => handleApproveUser(user.id, value as SurveyCategory)}>
                          <SelectTrigger className="w-[180px] text-xs">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {SURVEY_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-green-600 text-white hover:bg-green-700"
                          disabled
                        >
                          Approve
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {}}
                      >
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
