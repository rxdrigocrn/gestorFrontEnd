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

interface Activity {
  id: number;
  type: 'payment' | 'client' | 'server' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

// Sample data - would come from API in production
const activities: Activity[] = [
  {
    id: 1,
    type: 'payment',
    title: 'Payment Received',
    description: 'Client #1328 paid $89.99 for Premium Plan',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    user: {
      name: 'Maria Rodriguez',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 2,
    type: 'client',
    title: 'New Client Registered',
    description: 'Corporate client "ABC Company" registered and selected Enterprise plan',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    user: {
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 3,
    type: 'server',
    title: 'Server Maintenance',
    description: 'Scheduled maintenance completed on Server #003',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    user: {
      name: 'Tech Admin',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 4,
    type: 'alert',
    title: 'Bandwidth Warning',
    description: 'Server #002 reached 90% of allocated bandwidth',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    id: 5,
    type: 'payment',
    title: 'Payment Failed',
    description: 'Client #223 payment failed - credit card expired',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
    user: {
      name: 'Support Team',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  }
];

const getActivityBadge = (type: Activity['type']) => {
  switch (type) {
    case 'payment':
      return <Badge className="bg-green-500">Payment</Badge>;
    case 'client':
      return <Badge className="bg-blue-500">Client</Badge>;
    case 'server':
      return <Badge className="bg-purple-500">Server</Badge>;
    case 'alert':
      return <Badge variant="destructive">Alert</Badge>;
    default:
      return null;
  }
};

export default function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest system events and activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            {activity.user && (
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            {!activity.user && (
              <Avatar>
                <AvatarFallback>SYS</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {getActivityBadge(activity.type)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Activities
        </Button>
      </CardFooter>
    </Card>
  );
}