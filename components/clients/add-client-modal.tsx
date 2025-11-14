'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientFormSchema, ClientFormData } from '@/schemas/clientFormSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { format } from "date-fns"
import { isValid } from "date-fns"
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarIcon, Eye, EyeOff } from 'lucide-react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { Modal } from '@/components/ui/modal'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { usePlanStore } from '@/store/planStore'
import { useDeviceStore } from '@/store/deviceStore'
import { useApplicationStore } from '@/store/applicationStore'
import { usePaymentMethodStore } from '@/store/paymentMethodStore'
import { useLeadSourceStore } from '@/store/leadStore'
import { useServerStore } from '@/store/serverStore'
import { formatPhoneToE164 } from '@/utils/phone'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import { useSimpleToast } from '@/hooks/use-toast'

interface AddClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: ClientFormData) => void
  defaultValues?: Partial<ClientFormData>
}

export function AddClientModal({ open, onOpenChange, onConfirm, defaultValues }: AddClientModalProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      screens: 1,
      ...defaultValues
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const { items: plans, fetchItems: fetchPlans } = usePlanStore()
  const { items: paymentMethods, fetchItems: fetchPaymentMethods } = usePaymentMethodStore()
  const { items: devices, fetchItems: fetchDevices } = useDeviceStore()
  const { items: applications, fetchItems: fetchApplications } = useApplicationStore()
  const { items: leadSources, fetchItems: fetchLeadSources } = useLeadSourceStore()
  const { items: servers, fetchItems: fetchServers } = useServerStore()
  const { showToast } = useSimpleToast()

  useEffect(() => {
    fetchPlans()
    fetchPaymentMethods()
    fetchDevices()
    fetchApplications()
    fetchLeadSources()
    fetchServers()
  }, [])

  const onSubmit = (data: ClientFormData) => {
    if (!data.email || (typeof data.email === 'string' && data.email.trim() === '')) {
      ; (data as any).email = null
    }

    if (data.expiresAt) {
      data.expiresAt = new Date(data.expiresAt).toISOString()
    }

    onConfirm(data)
  }


  const onInvalid = (errors: any) => {
    console.error('Form validation errors:', errors)

    const flattenErrors = (errObj: any, prefix = ''): string[] => {
      if (!errObj) return []
      const msgs: string[] = []
      for (const key of Object.keys(errObj)) {
        const val = errObj[key]
        const path = prefix ? `${prefix}.${key}` : key
        if (val && typeof val === 'object' && 'message' in val && val.message) {
          msgs.push(`${path.replace(/\./g, ' → ')}: ${String(val.message)}`)
        } else if (val && typeof val === 'object') {
          msgs.push(...flattenErrors(val, path))
        }
      }
      return msgs
    }

    const msgs = flattenErrors(errors)
    const description = msgs.length ? msgs.join('\n') : 'Existem campos inválidos no formulário.'

    try {
      showToast('error', 'Erros no formulário', { description })
    } catch (e) {
      // ignore toast errors
    }
  }

  useEffect(() => {
    if (open && defaultValues) {
      const incomingToInput = (val?: string) => {
        if (!val) return ""
        try {
          const d = new Date(val)
          if (!isValid(d)) return ""

          d.setMinutes(d.getMinutes() + d.getTimezoneOffset())

          const pad = (n: number) => String(n).padStart(2, '0')
          const yyyy = d.getFullYear()
          const mm = pad(d.getMonth() + 1)
          const dd = pad(d.getDate())

          return `${yyyy}-${mm}-${dd}`
        } catch {
          return ""
        }
      }

      reset({
        ...defaultValues,
        phone: defaultValues.phone ? formatPhoneToE164(defaultValues.phone) : "",
        phone2: defaultValues.phone2 ? formatPhoneToE164(defaultValues.phone2) : "",
        expiresAt: incomingToInput(defaultValues.expiresAt),
        screens: defaultValues.screens ?? 0,
      })
    }
  }, [open, defaultValues, reset])


  useEffect(() => {
    if (open && defaultValues) {
      const incomingToInput = (val?: string) => {
        if (!val) return ''
        try {
          const d = new Date(val)
          if (!isValid(d)) return ''
          const tomorrow = new Date(d.getTime() + 24 * 60 * 60 * 1000)
          const pad = (n: number) => String(n).padStart(2, '0')
          const yyyy = tomorrow.getFullYear()
          const mm = pad(tomorrow.getMonth() + 1)
          const dd = pad(tomorrow.getDate())
          return `${yyyy}-${mm}-${dd}`
        } catch (e) {
          return ''
        }
      }

      reset({
        ...defaultValues, phone: defaultValues.phone ? formatPhoneToE164(defaultValues.phone) : '',
        phone2: defaultValues.phone2 ? formatPhoneToE164(defaultValues.phone2) : '',
        expiresAt: incomingToInput(defaultValues.expiresAt),
        screens: defaultValues.screens ?? 0,
      })
    }
  }, [open, defaultValues, reset])

  const selectedServerId = watch('serverId')
  const paidValue = watch('paidValue') || 0
  const selectedPlanId = watch('planId')
  const screens = watch('screens') || 0
  const clientCost = watch('clientCost')

  const selectedServer = useMemo(() => servers.find((s) => s.id === selectedServerId), [servers, selectedServerId])
  const selectedPlan = useMemo(() => plans.find((p) => p.id === selectedPlanId), [plans, selectedPlanId])

  const serverCost = selectedServer?.cost ?? 0
  const planCredits = selectedPlan?.creditsToRenew ?? 0

  const custoServidor = screens * serverCost
  const custoPlano = planCredits * custoServidor
  const lucroLiquido = clientCost ? clientCost - custoServidor : 0

  useEffect(() => {
    setValue('clientCost', Number(custoServidor ?? 0))
  }, [custoServidor, setValue])

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Adicionar Novo Cliente" maxWidth="3xl">
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger className="py-1 px-2 sm:px-3 text-xs sm:text-sm" value="personal">
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger className="py-1 px-2 sm:px-3 text-xs sm:text-sm" value="payment">
              Pagamento
            </TabsTrigger>
            <TabsTrigger className="py-1 px-2 sm:px-3 text-xs sm:text-sm" value="info">
              Informações Adicionais
            </TabsTrigger>
          </TabsList>


          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  autoComplete="off"
                  placeholder="Nome completo"
                  {...register('name')}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="off"
                  placeholder="Username"
                  {...register('username')}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha (Opcional)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    autoComplete="off"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    {...register('password')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="off"
                  placeholder="Email"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>


              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone Principal</Label>
                    <PhoneInput
                      id="phone"
                      defaultCountry='BR'
                      international
                      withCountryCallingCode
                      placeholder="+55 (85) 99876-5432"
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputComponent={Input}
                      inputProps={{ autoComplete: 'off' }}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="phone2"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="phone2">Telefone Secundario</Label>
                    <PhoneInput
                      id="phone2"
                      defaultCountry="BR"
                      international
                      withCountryCallingCode
                      placeholder="+55 (85) 99876-5432"
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputComponent={Input}
                      inputProps={{ autoComplete: 'off' }}
                    />
                    {errors.phone2 && (
                      <p className="text-sm text-red-500">{errors.phone2.message}</p>
                    )}
                  </div>
                )}
              />

              <div className="space-y-2">

                <Label>Data de Expiração</Label>
                <Input
                  type="date"
                  autoComplete="off"
                  {...register('expiresAt')}
                  className="w-full"
                />
                {errors.expiresAt && (
                  <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  autoComplete="off"
                  placeholder="Localização"
                  {...register('location')}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  autoComplete="off"
                  placeholder="Time"
                  {...register('time')}
                />
                {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                autoComplete="off"
                placeholder="Notas adicionais..."
                {...register('notes')}
              />
              {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inputs mantidos com a mesma estilização */}
              <div className="space-y-2">
                <Label htmlFor="serverId">Servidor</Label>
                <Controller
                  name="serverId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar servidor" />
                      </SelectTrigger>
                      <SelectContent>
                        {servers.map(server => (
                          <SelectItem key={server.id} value={server.id}>
                            {server.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.serverId && <p className="text-sm text-red-500">{errors.serverId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="planId">Plano</Label>
                <Controller
                  name="planId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map(plan => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.planId && <p className="text-sm text-red-500">{errors.planId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethodId">Método de Pagamento</Label>
                <Controller
                  name="paymentMethodId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar método de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentMethodId && <p className="text-sm text-red-500">{errors.paymentMethodId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="screens">Número de Telas</Label>
                <Input
                  id="screens"
                  type="number"
                  autoComplete="off"
                  min="1"
                  {...register('screens', { valueAsNumber: true })}
                />
                {errors.screens && <p className="text-sm text-red-500">{errors.screens.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidValue">Valor pago pelo Cliente</Label>
                <NumericFormat
                  id="paidValue"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale
                  placeholder="R$ 0,00"
                  customInput={Input}
                  onValueChange={(values: NumberFormatValues) =>
                    setValue('paidValue', values.floatValue ?? 0)
                  }
                  value={watch('paidValue') || ''}
                />
                {errors.paidValue && <p className="text-sm text-red-500">{errors.paidValue.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCost">Custo do Cliente</Label>
                <NumericFormat
                  id="clientCost"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale
                  placeholder="R$ 0,00"
                  customInput={Input}
                  onValueChange={(values: NumberFormatValues) => {
                    setValue('clientCost', values.floatValue ?? 0)
                  }}
                  value={watch('clientCost') || ''}
                  disabled
                />
                {errors.clientCost && <p className="text-sm text-red-500">{errors.clientCost.message}</p>}
              </div>
              <div className="col-span-1 sm:col-span-2">
                <div className="bg-card border rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Resumo Financeiro
                  </h3>

                  <div className="space-y-2">
                    {/* Custo Total = plano x custo do credito x qtde telas */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Custo Total</span>
                      <div className="text-right">
                        <span className="text-foreground font-medium">R$ {custoPlano.toFixed(2)}</span>
                        <p className="text-xs text-muted-foreground">
                          {planCredits} créditos × R$ {serverCost.toFixed(2)} × {screens} telas
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Lucro Líquido</span>
                        <span className={`text-lg font-semibold ${paidValue - custoPlano > 0
                          ? 'text-green-600 dark:text-green-400'
                          : paidValue - custoPlano < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-foreground'
                          }`}>
                          R$ {(paidValue - custoPlano).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadSourceId">Captação</Label>
                <Controller
                  name="leadSourceId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar Captação" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadSources.map(source => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referredBy">Indicado Por</Label>
                <Input
                  id="referredBy"
                  {...register('referredBy')}
                />
                {errors.referredBy && <p className="text-sm text-red-500">{errors.referredBy.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceId">Dispositivo</Label>
                <Controller
                  name="deviceId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar dispositivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map(device => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationId">Aplicativo</Label>
                <Controller
                  name="applicationId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar aplicativo" />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.map(app => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Expiração do App</Label>
                <Controller
                  name="appDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date)}
                          initialFocus
                        />

                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="m3u">M3U Link</Label>
                <Input
                  id="m3u"
                  autoComplete="off"
                  {...register('m3u')}
                />
                {errors.m3u && <p className="text-sm text-red-500">{errors.m3u.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mac">Endereço MAC</Label>
                <Input
                  id="mac"
                  autoComplete="off"
                  {...register('mac')}
                />
                {errors.mac && <p className="text-sm text-red-500">{errors.mac.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceKey">Chave do Dispositivo/OTP Code</Label>
                <Input
                  id="deviceKey"
                  autoComplete="off"
                  {...register('deviceKey')}
                />
                {errors.deviceKey && <p className="text-sm text-red-500">{errors.deviceKey.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  autoComplete="off"
                  {...register('birthDate')}
                />
                {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Cliente</Button>
        </div>
      </form>
    </Modal>
  )
}