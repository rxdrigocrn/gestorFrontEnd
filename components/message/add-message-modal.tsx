'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createMessageTemplateSchema, MessageTemplateFormData } from '@/schemas/messageTemplateSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { InfoIcon } from 'lucide-react'

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

  const insertTag = (tag: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    textarea.value = before + tag + after;
    textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    textarea.focus();

    // Dispara evento de change para o React Hook Form
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
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
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Conteúdo</Label>
            <div className="flex items-center text-xs text-muted-foreground">
              <InfoIcon size={14} className="mr-1" />
              Use tags dinâmicas para personalização
            </div>
          </div>

          <Textarea
            id="content"
            {...register('content')}
            placeholder="Conteúdo do template"
            className="min-h-[120px]"
          />

       

          <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
            <p className="font-medium mb-1">Como funcionam as tags:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">{"{{clientName}}"}</code> será substituído pelo nome do cliente</li>
              <li><code className="bg-gray-100 px-1 rounded">{"{{planName}}"}</code> será substituído pelo nome do plano do cliente</li>
            </ul>
          </div>

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