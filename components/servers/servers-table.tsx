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
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Settings, Trash2, PowerOff, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Server {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'maintenance';
  type: string;
  location: string;
  cpu: number;
  memory: number;
  storage: number;
  clients: number;
}

// Sample data - would come from API in production
const servers: Server[] = [
  {
    id: 'SRV001',
    name: 'Main Router',
    ip: '192.168.1.1',
    status: 'online',
    type: 'Router',
    location: 'Data Center 1',
    cpu: 45,
    memory: 60,
    storage: 42,
    clients: 324
  },
  {
    id: 'SRV002',
    name: 'Primary DNS',
    ip: '192.168.1.2',
    status: 'online',
    type: 'DNS Server',
    location: 'Data Center 1',
    cpu: 35,
    memory: 40,
    storage: 28,
    clients: 512
  },
  {
    id: 'SRV003',
    name: 'Backup Server',
    ip: '192.168.1.3',
    status: 'online',
    type: 'Backup',
    location: 'Data Center 2',
    cpu: 25,
    memory: 30,
    storage: 72,
    clients: 0
  },
  {
    id: 'SRV004',
    name: 'Proxy Server',
    ip: '192.168.1.4',
    status: 'maintenance',
    type: 'Proxy',
    location: 'Data Center 1',
    cpu: 0,
    memory: 0,
    storage: 45,
    clients: 0
  },
  {
    id: 'SRV005',
    name: 'Media Cache',
    ip: '192.168.1.5',
    status: 'offline',
    type: 'Cache',
    location: 'Data Center 3',
    cpu: 0,
    memory: 0,
    storage: 89,
    clients: 0
  },
];

export function ServersTable() {
  const [currentServers, setCurrentServers] = useState(servers);
  const router = useRouter();
  
  const getStatusBadge = (status: Server['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>;
      default:
        return null;
    }
  };
  
  const getProgressColor = (value: number) => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-yellow-500';
    return '';
  };

  const handleRowClick = (serverId: string) => {
    router.push(`/servers/${serverId}`);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Server</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Load</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentServers.map((server) => (
            <TableRow 
              key={server.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => {
                // Prevent row click when clicking on the actions menu
                if (!(e.target as HTMLElement).closest('.actions-menu')) {
                  handleRowClick(server.id);
                }
              }}
            >
              <TableCell>
                <div>
                  <p className="font-medium">{server.name}</p>
                  <p className="text-xs text-muted-foreground">{server.ip}</p>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(server.status)}</TableCell>
              <TableCell>{server.type}</TableCell>
              <TableCell>{server.location}</TableCell>
              <TableCell>
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>CPU: {server.cpu}%</span>
                    <span>RAM: {server.memory}%</span>
                  </div>
                  <Progress 
                    value={Math.max(server.cpu, server.memory)} 
                    className={`h-2 ${getProgressColor(Math.max(server.cpu, server.memory))}`}
                  />
                </div>
              </TableCell>
              <TableCell>{server.clients}</TableCell>
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
                      <DropdownMenuItem onClick={() => router.push(`/servers/${server.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Restart Server
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PowerOff className="mr-2 h-4 w-4" />
                        {server.status === 'online' ? 'Shutdown' : 'Start Server'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Server
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