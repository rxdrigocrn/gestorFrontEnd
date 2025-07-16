'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createMessageTemplateSchema, MessageTemplateFormData } from '@/lib/schemas/messageTemplateSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface AddMessageTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: MessageTemplateFormData) => Promise<void> | void
  defaultValues?: Partial<MessageTemplateFormData>
}

export function AddMessageTemplateModal({
  open,
  onOpenChange,
  onConfirm,
  defaultValues,
}: AddMessageTemplateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MessageTemplateFormData>({
    resolver: zodResolver(createMessageTemplateSchema),
    defaultValues: {
      name: '',
      content: '',
      imageUrl: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        content: '',
        imageUrl: '',
        ...defaultValues,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = async (data: MessageTemplateFormData) => {
    const sanitizedData = {
      ...data,
      imageUrl: data.imageUrl?.trim() === '' ? undefined : data.imageUrl,
    };
    await onConfirm(sanitizedData);

  }

  const onInvalid = (errors: any) => {
    console.error('Form errors:', errors)
  }

  return (
    <Modal open={open} title="Novo template de mensagem" onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Nome do template"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea
            id="content"
            {...register('content')}
            placeholder="Conteúdo do template"
          />
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl')}
            placeholder="URL da imagem"
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}

