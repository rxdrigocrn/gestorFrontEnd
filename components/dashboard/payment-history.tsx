"use client"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Payment {
  id: string;
  clientName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  date: Date;
}

// Sample data - would come from API in production
const payments: Payment[] = [
  {
    id: 'PAY001',
    clientName: 'John Doe',
    amount: 49.99,
    status: 'completed',
    method: 'PIX',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'PAY002',
    clientName: 'Jane Smith',
    amount: 29.99,
    status: 'pending',
    method: 'Credit Card',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: 'PAY003',
    clientName: 'Mike Johnson',
    amount: 99.99,
    status: 'completed',
    method: 'PIX',
    date: new Date(Date.now() - 8 * 60 * 60 * 1000)
  },
  {
    id: 'PAY004',
    clientName: 'Sarah Williams',
    amount: 79.99,
    status: 'failed',
    method: 'Credit Card',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];

const getStatusBadge = (status: Payment['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500">Completed</Badge>;
    case 'pending':
      return <Badge variant="outline">Pending</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return null;
  }
};

export default function PaymentHistory() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Recent payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{payment.clientName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(payment.date, 'PPp')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">R$ {payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{payment.method}</p>
                </div>
                {getStatusBadge(payment.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/payments')}
        >
          View All Payments
        </Button>
      </CardFooter>
    </Card>
  );
}