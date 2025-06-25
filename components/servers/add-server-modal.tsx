'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Modal } from '@/components/ui/modal'
import { ServerCreate } from '@/types/server'
import { serverSchema } from '@/lib/schemas/serverFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AddServerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: ServerCreate) => void
}

export function AddServerModal({ open, onOpenChange, onConfirm }: AddServerModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ServerCreate>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      whatsappSession: 'no',
      credits: null,
      androidAppUrl: null,
      androidAppUrlSec: null,
      iosAppUrl: null,
      samsungAppUrl: null,
      lgAppUrl: null,
      rokuAppUrl: null,
    }
  })

  const onSubmit = (data: ServerCreate) => {
    onConfirm(data)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Adicionar Novo Servidor"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data">Dados</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
          </TabsList>

          <TabsContent value="data">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome*</Label>
                <Input
                  id="name"
                  placeholder="Nome do servidor"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Valor do Crédito*</Label>
                <Input
                  id="cost"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  {...register('cost', { valueAsNumber: true })}
                />
                {errors.cost && (
                  <p className="text-sm text-red-500">{errors.cost.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="credits">Créditos (Opcional)</Label>
                <Input
                  id="credits"
                  placeholder="0"
                  type="number"
                  {...register('credits', { valueAsNumber: true })}
                />
                {errors.credits && (
                  <p className="text-sm text-red-500">{errors.credits.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Sessão WhatsApp</Label>
                <RadioGroup
                  defaultValue="no"
                  onValueChange={(value) => setValue('whatsappSession', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="whatsapp-yes" />
                    <Label htmlFor="whatsapp-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="whatsapp-no" />
                    <Label htmlFor="whatsapp-no">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="panelLink">Link do Painel*</Label>
                <Input
                  id="panelLink"
                  placeholder="https://"
                  {...register('panelLink')}
                />
                {errors.panelLink && (
                  <p className="text-sm text-red-500">{errors.panelLink.message}</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apps">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="androidAppUrl">Android App URL (Opcional)</Label>
                <Input
                  id="androidAppUrl"
                  placeholder="https://"
                  {...register('androidAppUrl')}
                />
                {errors.androidAppUrl && (
                  <p className="text-sm text-red-500">{errors.androidAppUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="androidAppUrlSec">Android App URL Secundária (Opcional)</Label>
                <Input
                  id="androidAppUrlSec"
                  placeholder="https://"
                  {...register('androidAppUrlSec')}
                />
                {errors.androidAppUrlSec && (
                  <p className="text-sm text-red-500">{errors.androidAppUrlSec.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iosAppUrl">iOS App URL (Opcional)</Label>
                <Input
                  id="iosAppUrl"
                  placeholder="https://"
                  {...register('iosAppUrl')}
                />
                {errors.iosAppUrl && (
                  <p className="text-sm text-red-500">{errors.iosAppUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="samsungAppUrl">Samsung App URL (Opcional)</Label>
                <Input
                  id="samsungAppUrl"
                  placeholder="https://"
                  {...register('samsungAppUrl')}
                />
                {errors.samsungAppUrl && (
                  <p className="text-sm text-red-500">{errors.samsungAppUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lgAppUrl">LG App URL (Opcional)</Label>
                <Input
                  id="lgAppUrl"
                  placeholder="https://"
                  {...register('lgAppUrl')}
                />
                {errors.lgAppUrl && (
                  <p className="text-sm text-red-500">{errors.lgAppUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rokuAppUrl">Roku App URL (Opcional)</Label>
                <Input
                  id="rokuAppUrl"
                  placeholder="https://"
                  {...register('rokuAppUrl')}
                />
                {errors.rokuAppUrl && (
                  <p className="text-sm text-red-500">{errors.rokuAppUrl.message}</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Servidor</Button>
        </div>
      </form>
    </Modal>
  )
}