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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addMonths, addYears, addDays } from "date-fns";
import { Switch } from "../ui/switch";
import { ClientPayment } from "@/types/client";

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
  onConfirm: (data: PaymentFormValues) => Promise<void> | void;
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
    defaultValues: getInitialValues(),
  });

  const { register, handleSubmit, watch, setValue, formState, reset } = form;
  const { errors } = formState;

  const { fetchItems: fetchPaymentMethods, items: paymentMethods } =
    usePaymentMethodStore();
  const { fetchItems: fetchPlans, items: plans } = usePlanStore();

  useEffect(() => {
    // Only fetch if we don't already have the items to avoid duplicate network calls
    if (!paymentMethods || paymentMethods.length === 0) {
      fetchPaymentMethods();
    }
    if (!plans || plans.length === 0) {
      fetchPlans();
    }
    // we intentionally include lengths to re-check if lists are cleared elsewhere
  }, [fetchPaymentMethods, fetchPlans, paymentMethods?.length, plans?.length]);

  useEffect(() => {
    if (open && defaultValues) {
      const vals = getInitialValues()
      reset(vals);
      // ensure select and numeric inputs reflect defaults immediately
      if (typeof vals.amount === 'number') setValue('amount', vals.amount)
      if (vals.paymentMethodId) setValue('paymentMethodId', vals.paymentMethodId)
    }
  }, [open, defaultValues, reset, setValue]);

  // ---- Funções auxiliares ----

  function getInitialValues(): PaymentFormValues {
    const now = new Date();

    // Corrige o timezone local (evita o "um dia antes")
    const expiresAt = defaultValues?.expiresAt
      ? convertUTCToLocal(new Date(defaultValues.expiresAt))
      : now;

    // Calcula a nova data de vencimento com base no período do plano
    const periodValue = defaultValues?.plan?.periodValue ?? 1; // padrão: 1 mês
    const dueDate = addMonths(expiresAt, periodValue);

    return {
      amount: defaultValues?.amount ?? 0,
      paidAt: formatDateTimeForInput(now),
      dueDate: formatDateTimeForInput(dueDate),
      paymentMethodId: defaultValues?.paymentMethodId ?? "",
      discount: defaultValues?.discount ?? 0,
      surcharge: defaultValues?.surcharge ?? 0,
      notes: defaultValues?.notes ?? "",
      sendReceipt: defaultValues?.sendReceipt ?? true,
      renewClient: defaultValues?.renewClient ?? false,
    };
  }

  // Corrige para exibir corretamente no input local
  function convertUTCToLocal(date: Date): Date {
    const local = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return local;
  }

  // Formata para exibição no input
  function formatDateTimeForInput(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function parseDateTimeFromInput(dateTimeString: string): Date {
    // volta para UTC
    const localDate = new Date(dateTimeString);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  }

  // ---- Submissão ----

  const onSubmit = async (data: PaymentFormValues) => {
    const paymentData = {
      ...data,
      paidAt: parseDateTimeFromInput(data.paidAt).toISOString(),
      dueDate: parseDateTimeFromInput(data.dueDate).toISOString(),
    };
    await onConfirm(paymentData);
  };

  // ---- Render ----

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Adicionar Pagamento"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* VENCIMENTO */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data/Hora de Vencimento</Label>
            <Input type="datetime-local" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>

          {/* PAGAMENTO */}
          <div className="space-y-2">
            <Label htmlFor="paidAt">Data/Hora do Pagamento</Label>
            <Input type="datetime-local" {...register("paidAt")} />
            {errors.paidAt && (
              <p className="text-sm text-red-500">{errors.paidAt.message}</p>
            )}
          </div>

          {/* VALOR */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input type="number" step="0.01" {...register("amount")} />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* FORMA DE PAGAMENTO */}
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

          {/* DESCONTO */}
          <div className="space-y-2">
            <Label htmlFor="discount">Desconto</Label>
            <Input type="number" step="0.01" {...register("discount")} />
          </div>

          {/* ACRÉSCIMO */}
          <div className="space-y-2">
            <Label htmlFor="surcharge">Acréscimo</Label>
            <Input type="number" step="0.01" {...register("surcharge")} />
          </div>
        </div>

        {/* OBSERVAÇÕES */}
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            {...register("notes")}
            placeholder="Observações adicionais..."
          />
        </div>

        {/* SWITCH - ENVIAR MENSAGEM */}
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
