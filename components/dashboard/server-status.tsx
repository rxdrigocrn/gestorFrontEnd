"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ServerStatusProps {
  name: string;
  status: 'online' | 'warning' | 'offline';
  load: number;
}

// Sample data - would come from API in production
const servers: ServerStatusProps[] = [
  { name: 'Main Router', status: 'online', load: 68 },
  { name: 'Primary DNS', status: 'online', load: 35 },
  { name: 'Secondary DNS', status: 'online', load: 42 },
  { name: 'Backup Server', status: 'warning', load: 89 },
  { name: 'Proxy Server', status: 'offline', load: 0 },
];

function ServerStatusRow({ name, status, load }: ServerStatusProps) {
  const statusColor = {
    online: 'bg-green-500',
    warning: 'bg-yellow-500',
    offline: 'bg-red-500',
  };

  const statusIcon = {
    online: <CheckCircle className="h-4 w-4 text-green-500" />,
    warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    offline: <XCircle className="h-4 w-4 text-red-500" />,
  };

  return (
    <div className="flex items-center justify-between space-x-4 py-2">
      <div className="flex items-center space-x-2">
        {statusIcon[status]}
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center space-x-2 w-1/2">
        <Progress value={load} className="h-2" />
        <Badge variant={status === 'online' ? 'outline' : status === 'warning' ? 'default' : 'destructive'}>
          {load}%
        </Badge>
      </div>
    </div>
  );
}

export default function ServerStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Status</CardTitle>
        <CardDescription>Current server health and load</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {servers.map((server, index) => (
          <ServerStatusRow key={index} {...server} />
        ))}
      </CardContent>
    </Card>
  );
}