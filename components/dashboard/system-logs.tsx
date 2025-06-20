"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface LogEntry {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

// Sample data - would come from API in production
const logs: LogEntry[] = [
  {
    id: 1,
    type: 'success',
    message: 'System Update Completed',
    details: 'Successfully updated server configurations',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    user: {
      name: 'System Admin',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 2,
    type: 'warning',
    message: 'High CPU Usage Detected',
    details: 'Server ELITE-01 experiencing high load',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 3,
    type: 'error',
    message: 'Failed Login Attempt',
    details: 'Multiple failed login attempts from IP 192.168.1.100',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'info',
    message: 'Backup Completed',
    details: 'Daily backup completed successfully',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    user: {
      name: 'Backup Service',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  }
];

const getLogBadge = (type: LogEntry['type']) => {
  switch (type) {
    case 'success':
      return <Badge className="bg-green-500">Success</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-500">Warning</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    case 'info':
      return <Badge variant="outline">Info</Badge>;
    default:
      return null;
  }
};

export default function SystemLogs() {
  const router = useRouter();

  return (
    <Card >
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>Recent system events and activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-4">
            {log.user ? (
              <Avatar>
                <AvatarImage src={log.user.avatar} alt={log.user.name} />
                <AvatarFallback>{log.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>SYS</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{log.message}</p>
                  {getLogBadge(log.type)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{log.details}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/logs')}
        >
          View All Logs
        </Button>
      </CardFooter>
    </Card>
  );
}