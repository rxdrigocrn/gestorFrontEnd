'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { billingRuleSchema, BillingRuleFormData, BillingRuleType, AutomaticRuleType, BillingRuleClientStatus } from '@/lib/schemas/billingRulesSchema'

// UI Components
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { DayPicker, DateRange } from 'react-day-picker'

// Stores
import { useMessageStore } from '@/store/messageStore'
import { useDeviceStore } from '@/store/deviceStore'
import { useApplicationStore } from '@/store/applicationStore'
import { useServerStore } from '@/store/serverStore'
import { usePlanStore } from '@/store/planStore'
import { useLeadSourceStore } from '@/store/leadStore'

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

  // State para o range de dias
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Stores
  const { fetchItems: fetchMessageTemplates, items: messageTemplates } = useMessageStore();
  const { fetchItems: fetchDevices, items: devices } = useDeviceStore();
  const { fetchItems: fetchApplications, items: applications } = useApplicationStore();
  const { fetchItems: fetchServers, items: servers } = useServerStore();
  const { fetchItems: fetchPlans, items: plans } = usePlanStore();
  const { fetchItems: fetchLeadSources, items: leadSources } = useLeadSourceStore();

  useEffect(() => {
    if (open) {
      fetchMessageTemplates();
      fetchDevices();
      fetchApplications();
      fetchServers();
      fetchPlans();
      fetchLeadSources();
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
  } = useForm<BillingRuleFormData>({
    resolver: zodResolver(billingRuleSchema),
    defaultValues: {
      name: '',
      type: BillingRuleType.MANUAL,
      clientStatus: BillingRuleClientStatus.TODOS,
      ...defaultValues,
    },
  });

  // Watchers
  const ruleType = useWatch({ control, name: 'type' });
  const automaticType = useWatch({ control, name: 'automaticType' });

  useEffect(() => {
  if (dateRange?.from && dateRange?.to) {
    setValue('startDay', dateRange.from.getDate());
    setValue('endDay', dateRange.to.getDate());
  }
}, [dateRange, setValue]);

  useEffect(() => {
    if (open) {
      // Reset do form
      reset({
        name: '',
        type: BillingRuleType.MANUAL,
        clientStatus: BillingRuleClientStatus.TODOS,
        ...defaultValues,
      });

      if (defaultValues?.startDay && defaultValues?.endDay) {
        setDateRange({
          from: new Date(0, 0, defaultValues.startDay),
          to: new Date(0, 0, defaultValues.endDay),
        });
      } else {
        setDateRange(undefined);
      }
    }
  }, [open, defaultValues, reset]);


  useEffect(() => {
    console.log(dateRange)
  }, [dateRange])

  const onSubmit = async (data: BillingRuleFormData) => {
    let finalData = { ...data };

    console.log(finalData)
    console.log(dateRange)
    

    if (automaticType === AutomaticRuleType.MONTHLY_DAY_RANGE && dateRange?.from && dateRange?.to) {
      finalData = {
        ...data,
        startDay: dateRange.from.getDate(),
        endDay: dateRange.to.getDate(),
      };
    }

    await onConfirm(finalData);
  };

  const onInvalid = (errors: any) => {
    console.error('Form errors:', errors);
  };

  const renderMultiSelectFilter = (
    name: keyof BillingRuleFormData,
    label: string,
    placeholder: string,
    items: { id: string, name?: string, description?: string }[]
  ) => (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        control={control}
        name={name as any}
        render={({ field }) => (
          <Select onValueChange={(value) => field.onChange([value])}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name || item.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <p className="text-sm text-red-600">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <Modal open={open} title="Nova regra de cobrança" onOpenChange={onOpenChange} maxWidth="3xl">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-4 max-h-[80vh] overflow-y-auto">

        {/* --- Campos Principais --- */}
        <div className="space-y-1">
          <Label htmlFor="name">Nome da Regra</Label>
          <Input id="name" {...register('name')} placeholder="Ex: Lembrete de vencimento" />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* --- Filtros --- */}
        <div className="space-y-1">
          <Label htmlFor="clientStatus">Status do Cliente</Label>
          <Controller control={control} name="clientStatus" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Selecione o status do cliente" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={BillingRuleClientStatus.TODOS}>Todos</SelectItem>
                <SelectItem value={BillingRuleClientStatus.ATIVO}>Ativo</SelectItem>
                <SelectItem value={BillingRuleClientStatus.VENCE_HOJE}>Vence Hoje</SelectItem>
                <SelectItem value={BillingRuleClientStatus.VENCIDO}>Vencido</SelectItem>
              </SelectContent>
            </Select>
          )} />
          {errors.clientStatus && <p className="text-sm text-red-600">{errors.clientStatus.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderMultiSelectFilter('planIds', 'Planos', 'Filtrar por plano', plans)}
          {renderMultiSelectFilter('serverIds', 'Servidores', 'Filtrar por servidor', servers)}
          {renderMultiSelectFilter('applicationIds', 'Aplicações', 'Filtrar por aplicação', applications)}
          {renderMultiSelectFilter('deviceIds', 'Dispositivos', 'Filtrar por dispositivo', devices)}
          {renderMultiSelectFilter('leadSourceIds', 'Origens de Lead', 'Filtrar por origem', leadSources)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="type">Tipo de Regra</Label>
            <Controller control={control} name="type" render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={BillingRuleType.MANUAL}>Manual</SelectItem>
                  <SelectItem value={BillingRuleType.AUTOMATIC}>Automática</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="messageTemplateId">Template de Mensagem</Label>
            <Controller control={control} name="messageTemplateId" render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione um template" /></SelectTrigger>
                <SelectContent>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
            {errors.messageTemplateId && <p className="text-sm text-red-600">{errors.messageTemplateId.message}</p>}
          </div>
        </div>

        {/* --- Regras Automáticas --- */}
        {ruleType === BillingRuleType.AUTOMATIC && (
          <div className="p-4 border rounded-md bg-slate-50 space-y-4">
            <h3 className="font-semibold text-md">Configuração da Automação</h3>

            <div className="space-y-1">
              <Label htmlFor="automaticType">Tipo de Automação</Label>
              <Controller control={control} name="automaticType" render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo de automação" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AutomaticRuleType.DAYS_BEFORE_EXPIRATION}>Dias antes do vencimento</SelectItem>
                    <SelectItem value={AutomaticRuleType.MONTHLY_DAY_RANGE}>Intervalo de dias no mês</SelectItem>
                  </SelectContent>
                </Select>
              )} />
              {errors.automaticType && <p className="text-sm text-red-600">{errors.automaticType.message}</p>}
            </div>

            {automaticType === AutomaticRuleType.DAYS_BEFORE_EXPIRATION && (
              <div className="space-y-1">
                <Label htmlFor="days">Enviar quantos dias antes do vencimento?</Label>
                <Input id="days" type="number" {...register('days')} placeholder="Ex: 5" />
                {errors.days && <p className="text-sm text-red-600">{errors.days.message}</p>}
              </div>
            )}

            {automaticType === AutomaticRuleType.MONTHLY_DAY_RANGE && (
              <div className="space-y-2">
                <Label>Selecione o intervalo de dias</Label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (
                    <DayPicker
                      mode="range"
                      selected={dateRange}

                      onSelect={(range) => {
                        setDateRange(range)
                        field.onChange(range)
                      }}

                      fromMonth={new Date(new Date().getFullYear(), 0)}
                      toMonth={new Date(new Date().getFullYear(), 11)}
                    />
                  )}
                />
              </div>
            )}

          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando...' : 'Salvar Regra'}
        </Button>
      </form>
    </Modal>
  )
}
