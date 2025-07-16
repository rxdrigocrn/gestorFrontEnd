'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { billingRuleSchema, BillingRuleFormData } from '@/lib/schemas/billingRulesSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useMessageStore } from '@/store/messageStore'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'

interface AddBillingRuleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: BillingRuleFormData) => Promise<void> | void
  defaultValues?: Partial<BillingRuleFormData>
}

export function AddBillingRuleModal({
  open,
  onOpenChange,
  onConfirm,
  defaultValues,
}: AddBillingRuleModalProps) {
  const { fetchItems: fetchMessageTemplates, items: messageTemplates } = useMessageStore();

  useEffect(() => {
    fetchMessageTemplates();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<BillingRuleFormData>({
    resolver: zodResolver(billingRuleSchema),
    defaultValues: {
      name: '',
      minIntervalDays: 0,
      maxIntervalDays: 0,
      messageTemplateId: '',
      clientStatus: 'PAID',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        minIntervalDays: 0,
        maxIntervalDays: 0,
        messageTemplateId: '',
        clientStatus: 'PAID',
        ...defaultValues,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = async (data: BillingRuleFormData) => {
    await onConfirm(data);
  };

  const onInvalid = (errors: any) => {
    console.error('Form errors:', errors);
  };

  return (
    <Modal open={open} title="Nova regra de cobrança" onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Nome da regra de cobrança"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="minIntervalDays">Mínimo de dias</Label>
          <Input
            id="minIntervalDays"
            {...register('minIntervalDays')}
            type="number"
            placeholder="Mínimo de dias"
          />
          {errors.minIntervalDays && (
            <p className="text-sm text-red-600">{errors.minIntervalDays.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="maxIntervalDays">Máximo de dias</Label>
          <Input
            id="maxIntervalDays"
            {...register('maxIntervalDays')}
            type="number"
            placeholder="Máximo de dias"
          />
          {errors.maxIntervalDays && (
            <p className="text-sm text-red-600">{errors.maxIntervalDays.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="messageTemplateId">Template de mensagem</Label>
          <Controller
            control={control}
            name="messageTemplateId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.messageTemplateId && (
            <p className="text-sm text-red-600">{errors.messageTemplateId.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="clientStatus">Status do cliente</Label>
          <Controller
            control={control}
            name="clientStatus"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Pago</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="OVERDUE">Atrasado</SelectItem>
                  <SelectItem value="CANCELED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.clientStatus && (
            <p className="text-sm text-red-600">{errors.clientStatus.message}</p>
          )}

        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  );
}
