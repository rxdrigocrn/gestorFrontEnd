"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClientPaymentResponse, PaymentStatus } from "@/types/client";

interface PaymentDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payment: ClientPaymentResponse | null;
}

export function PaymentDetailsModal({
    open,
    onOpenChange,
    payment,
}: PaymentDetailsModalProps) {
    const formatDate = (dateString: string) => {
        return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR,
        });
    };

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID:
                return <Badge variant="default">Pago</Badge>;
            case PaymentStatus.PENDING:
                return <Badge variant="secondary">Pendente</Badge>;
            case PaymentStatus.OVERDUE:
                return <Badge variant="destructive">Vencido</Badge>;
            case PaymentStatus.CANCELED:
                return <Badge variant="destructive">Cancelado</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    if (!payment) {
        return null;
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Detalhes do Pagamento"
            maxWidth="2xl"
        >
            <div className="space-y-6">
                {/* Cabeçalho com status e valor */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                        {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">Valor Total</p>
                        <p className="text-2xl font-bold text-primary">
                            {payment.amount.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </p>
                    </div>
                </div>

                {/* Grid de informações principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card de Datas */}
                    <div className="p-4 border rounded-lg bg-white">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Datas</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">Pagamento</p>
                                <p className="font-medium">{formatDate(payment.paidAt)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Vencimento</p>
                                <p className="font-medium">
                                    {payment.dueDate ? formatDate(payment.dueDate) : "Não informado"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card de Método de Pagamento */}
                    <div className="p-4 border rounded-lg bg-white">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Método de Pagamento</h3>
                        <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                                {payment.paymentMethod.name.toLowerCase()}
                            </span>
                            {payment.paymentMethod.feePercentage && (
                                <Badge variant="outline">
                                    Taxa: {payment.paymentMethod.feePercentage}%
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Card de Valores */}
                    <div className="p-4 border rounded-lg bg-white md:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Detalhes Financeiros</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-2 bg-primary/10 rounded">
                                <p className="text-xs text-gray-500">Desconto</p>
                                <p className="font-medium text-blue-600">
                                    {payment.discount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            </div>
                            <div className="text-center p-2 bg-primary/10 rounded">
                                <p className="text-xs text-gray-500">Acréscimo</p>
                                <p className="font-medium text-purple-600">
                                    {payment.surcharge.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            </div>
                            <div className="text-center p-2 bg-primary/10 rounded">
                                <p className="text-xs text-primary">Valor Líquido</p>
                                <p className="font-bold text-primary">
                                    {payment.netAmount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card de Configurações */}
                    <div className="p-4 border rounded-lg bg-white">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Configurações</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">Recibo Enviado</p>
                                <Badge variant={payment.sendReceipt ? "default" : "secondary"}>
                                    {payment.sendReceipt ? "Sim" : "Não"}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">Renovação</p>
                                <Badge variant={payment.renewClient ? "default" : "secondary"}>
                                    {payment.renewClient ? "Sim" : "Não"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Card de Observações (se existir) */}
                    {payment.notes && (
                        <div className="p-4 border rounded-lg bg-white">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Observações</h3>
                            <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md">
                                {payment.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Rodapé */}
                <div className="flex justify-end pt-2">
                    <Button 
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="min-w-[120px]"
                    >
                        Fechar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}