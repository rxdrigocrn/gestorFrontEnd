"use client";

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
  amount: number;
  netAmount: number;
  discount: number;
  surcharge: number;
  createdAt: string;
  paidAt: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  paymentMethodId: string;
  client: {
    name: string;
  };
}

interface Props {
  payments: Payment[];
}

const getStatusBadge = (status: Payment['status']) => {
  switch (status) {
    case 'PAID':
      return <Badge className="bg-green-500">Pago</Badge>;
    case 'PENDING':
      return <Badge variant="outline">Pendente</Badge>;
    case 'FAILED':
      return <Badge variant="destructive">Falhou</Badge>;
    default:
      return null;
  }
};

export default function PaymentHistory({ payments }: Props) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
        <CardDescription>Transações recentes de clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="px-4 py-2 border rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{payment.client.name}</div>
                <div className="text-right font-semibold">
                  R$ {payment.amount.toFixed(2)}{" "}
                  <span className="text-muted-foreground text-sm">
                    (Líquido: R$ {payment.netAmount.toFixed(2)})
                  </span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Criado em: {format(new Date(payment.createdAt), 'dd/MM/yyyy \'às\' HH:mm')}<br />
                Pago em: {format(new Date(payment.paidAt), 'dd/MM/yyyy \'às\' HH:mm')} <br />
              </div>

              {(payment.discount > 0 || payment.surcharge > 0) && (
                <div className="text-sm text-muted-foreground">
                  {payment.discount > 0 && <>Desconto: R$ {payment.discount.toFixed(2)}</>}
                  {payment.discount > 0 && payment.surcharge > 0 && <> | </>}
                  {payment.surcharge > 0 && <>Acréscimo: R$ {payment.surcharge.toFixed(2)}</>}
                </div>
              )}

              <div className="flex justify-end">{getStatusBadge(payment.status)}</div>
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
          Ver todos os pagamentos
        </Button>
      </CardFooter>
    </Card>
  );
}
