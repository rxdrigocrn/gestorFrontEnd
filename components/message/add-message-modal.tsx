'use client'

import { useEffect, useState } from 'react'
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    // if defaultValues contain imageUrl (string), show it as preview
    if (defaultValues?.imageUrl && typeof defaultValues.imageUrl === 'string') {
      setPreviewUrl(defaultValues.imageUrl)
    } else {
      setPreviewUrl(undefined)
    }
    setSelectedFile(null)
  }, [defaultValues, open])

  const onSubmit = async (data: MessageTemplateFormData) => {
    // If a file was selected, build FormData and send file under `imageFile`
    if (selectedFile) {
      const fd = new FormData()
      if (data.id) fd.append('id', String(data.id))
      fd.append('name', data.name)
      fd.append('content', data.content)
      fd.append('imageFile', selectedFile, selectedFile.name)
      await onConfirm(fd as unknown as MessageTemplateFormData)
      return
    }

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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Conteúdo</Label>
            <div className="flex items-center text-xs text-muted-foreground">
              <InfoIcon size={14} className="mr-1" />
              Use tags dinâmicas para personalização
            </div>
          </div>
          <div className="flex justify-between items-center gap-2 mt-2">
            <label className="text-sm text-muted-foreground">Inserir tag:</label>
            <select
              className="border bg-card rounded px-2 py-1 text-sm"
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value
                if (v) insertTag(v)
                e.currentTarget.value = ''
              }}
            >
              <option value="" disabled>Selecionar...</option>
              <option value="{{clientName}}">{'{{clientName}} - Nome do cliente'}</option>
              <option value="{{planName}}">{'{{planName}} - Nome do plano'}</option>
            </select>
          </div>



          <Textarea
            id="content"
            {...register('content')}
            placeholder="Conteúdo do template"
            className="min-h-[120px]"
          />



          <div className="mt-2 p-3 bg-card text-muted-foreground rounded-md text-sm">
            <p className="font-medium mb-1">Como funcionam as tags:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><code className="bg-primary px-1 py-0.5 rounded text-black">{"{{clientName}}"}</code> será substituído pelo nome do cliente</li>
              <li><code className="bg-primary px-1 py-0.5 rounded text-black">{"{{planName}}"}</code> será substituído pelo nome do plano do cliente</li>
            </ul>
          </div>

          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">URL da Imagem (Opcional) — ou envie um arquivo</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl')}
            placeholder="URL da imagem"
            disabled={!!selectedFile}
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
          )}

          <div className="pt-2">
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setSelectedFile(file)
                  const url = URL.createObjectURL(file)
                  setPreviewUrl(url)
                } else {
                  setPreviewUrl(defaultValues?.imageUrl as string | undefined)
                }
              }}
            />
          </div>

          {previewUrl && (
            <div className="mt-2">
              <Label>Preview</Label>
              <div className="mt-1">
                <img src={previewUrl} alt="preview" className="max-h-40 rounded-md" />
              </div>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}