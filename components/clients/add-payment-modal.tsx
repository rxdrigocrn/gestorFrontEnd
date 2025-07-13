"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePaymentMethodStore } from "@/store/paymentMethodStore";
import { usePlanStore } from "@/store/planStore";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClientPayment } from "@/types/client";
import { format, parseISO } from "date-fns";
import { Switch } from "../ui/switch";

const paymentSchema = z.object({
  amount: z.coerce.number().positive("Informe um valor"),
  paidAt: z.string().min(1, "Data/hora do pagamento é obrigatória"),
  dueDate: z.string().min(1, "Data/hora de vencimento é obrigatória"),
  paymentMethodId: z.string().uuid("Selecione uma forma de pagamento"),
  discount: z.coerce.number().min(0).optional().default(0),
  surcharge: z.coerce.number().min(0).optional().default(0),
  notes: z.string().optional().default(""),
  sendReceipt: z.coerce.boolean(),
  renewClient: z.coerce.boolean(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: ClientPayment) => Promise<void> | void;
  defaultValues?: Partial<ClientPayment>;
}

export function AddPaymentModal({
  open,
  onOpenChange,
  onConfirm,
  defaultValues,
}: AddPaymentModalProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultValues?.amount ?? 0,
      paidAt: defaultValues?.paidAt
        ? formatDateTimeForInput(new Date(defaultValues.paidAt))
        : formatDateTimeForInput(new Date()),
      dueDate: defaultValues?.dueDate
        ? formatDateTimeForInput(new Date(defaultValues.dueDate))
        : formatDateTimeForInput(new Date()),
      paymentMethodId: defaultValues?.paymentMethodId ?? "",
      discount: defaultValues?.discount ?? 0,
      surcharge: defaultValues?.surcharge ?? 0,
      notes: defaultValues?.notes ?? "",
      sendReceipt: defaultValues?.sendReceipt ?? true,
      renewClient: defaultValues?.renewClient ?? false,
    },
  });

  function formatDateTimeForInput(date: Date): string {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  }

  function parseDateTimeFromInput(dateTimeString: string): Date {
    return parseISO(dateTimeString);
  }

  const { register, handleSubmit, watch, setValue, formState, reset } = form;
  const { errors } = formState;

  const { fetchItems: fetchPaymentMethods, items: paymentMethods } =
    usePaymentMethodStore();
  const { fetchItems: fetchPlans } = usePlanStore();

  useEffect(() => {
    fetchPaymentMethods();
    fetchPlans();
  }, [fetchPaymentMethods, fetchPlans]);

  useEffect(() => {
    if (open && defaultValues) {
      reset({
        amount: defaultValues.amount ?? 0,
        paidAt: defaultValues.paidAt
          ? formatDateTimeForInput(new Date(defaultValues.paidAt))
          : formatDateTimeForInput(new Date()),
        dueDate: defaultValues.dueDate
          ? formatDateTimeForInput(new Date(defaultValues.dueDate))
          : formatDateTimeForInput(new Date()),
        paymentMethodId: defaultValues.paymentMethodId ?? "",
        discount: defaultValues.discount ?? 0,
        surcharge: defaultValues.surcharge ?? 0,
        notes: defaultValues.notes ?? "",
        sendReceipt: defaultValues.sendReceipt ?? true,
        renewClient: defaultValues.renewClient ?? false,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = async (data: PaymentFormValues) => {
    const paymentData = {
      ...data,
      paidAt: parseDateTimeFromInput(data.paidAt).toISOString(),
      dueDate: parseDateTimeFromInput(data.dueDate).toISOString(),
    };
    await onConfirm(paymentData);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Adicionar Pagamento"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data/Hora de Vencimento</Label>
            <Input
              type="datetime-local"
              {...register("dueDate")}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidAt">Data/Hora do Pagamento</Label>
            <Input
              type="datetime-local"
              {...register("paidAt")}
            />
            {errors.paidAt && (
              <p className="text-sm text-red-500">{errors.paidAt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              type="number"
              step="0.01"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select
              onValueChange={(value) => setValue("paymentMethodId", value)}
              defaultValue={defaultValues?.paymentMethodId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethodId && (
              <p className="text-sm text-red-500">
                {errors.paymentMethodId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Desconto</Label>
            <Input
              type="number"
              step="0.01"
              {...register("discount")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surcharge">Acréscimo</Label>
            <Input
              type="number"
              step="0.01"
              {...register("surcharge")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            {...register("notes")}
            placeholder="Observações adicionais..."
          />
        </div>

        <div className="flex items-center justify-between space-y-2">
          <Label htmlFor="renewClient">Atualizar dados do cliente</Label>
          <Switch
            id="renewClient"
            checked={watch("renewClient")}
            onCheckedChange={(checked) => setValue("renewClient", checked)}
          />
        </div>

        <div className="flex items-center justify-between space-y-2">
          <Label htmlFor="sendReceipt">Enviar mensagem</Label>
          <Switch
            id="sendReceipt"
            checked={watch("sendReceipt")}
            onCheckedChange={(checked) => setValue("sendReceipt", checked)}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar Pagamento</Button>
        </div>
      </form>
    </Modal>
  );
}