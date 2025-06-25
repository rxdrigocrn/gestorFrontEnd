"use client"

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Eye, Edit, Trash2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'active' | 'inactive' | 'pending';
  lastPayment: string;
  avatar?: string;
}

// Sample data - would come from API in production
const clients: Client[] = [
  {
    id: 'CL001',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(555) 123-4567',
    plan: 'Premium',
    status: 'active',
    lastPayment: '2023-04-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'CL002',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '(555) 234-5678',
    plan: 'Basic',
    status: 'active',
    lastPayment: '2023-04-10'
  },
  {
    id: 'CL003',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '(555) 345-6789',
    plan: 'Standard',
    status: 'inactive',
    lastPayment: '2023-03-28',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'CL004',
    name: 'Emma Davis',
    email: 'emma@example.com',
    phone: '(555) 456-7890',
    plan: 'Enterprise',
    status: 'active',
    lastPayment: '2023-04-13',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'CL005',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    phone: '(555) 567-8901',
    plan: 'Premium',
    status: 'pending',
    lastPayment: '2023-04-01'
  },
];

export function ClientsTable() {
  const [currentClients, setCurrentClients] = useState(clients);
  const router = useRouter();
  
  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };
  
  const handleRowClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentClients.map((client) => (
            <TableRow 
              key={client.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => {
                // Prevent row click when clicking on the actions menu
                if (!(e.target as HTMLElement).closest('.actions-menu')) {
                  handleRowClick(client.id);
                }
              }}
            >
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{client.plan}</TableCell>
              <TableCell>{getStatusBadge(client.status)}</TableCell>
              <TableCell>{client.lastPayment}</TableCell>
              <TableCell className="text-right">
                <div className="actions-menu">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}