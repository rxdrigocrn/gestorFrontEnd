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

              {/* Dados do cliente */}
              <option value="{NOME}">{'{NOME} - Nome'}</option>
              <option value="{NOME_SOBRENOME}">{'{NOME_SOBRENOME} - Nome e sobrenome'}</option>
              <option value="{NOME_COMPLETO}">{'{NOME_COMPLETO} - Nome completo'}</option>
              <option value="{EMAIL}">{'{EMAIL} - Email'}</option>
              <option value="{TELEFONE}">{'{TELEFONE} - Telefone'}</option>
              <option value="{USUARIO}">{'{USUARIO} - Usuário'}</option>
              <option value="{SENHA}">{'{SENHA} - Senha'}</option>
              <option value="{MAC}">{'{MAC} - MAC Address'}</option>
              <option value="{OBSERVACAO}">{'{OBSERVACAO} - Observação'}</option>

              {/* Datas e horários */}
              <option value="{DATA_HOJE}">{'{DATA_HOJE} - Data de hoje'}</option>
              <option value="{DIA_HOJE}">{'{DIA_HOJE} - Dia de hoje'}</option>
              <option value="{HORA_AGORA}">{'{HORA_AGORA} - Hora atual'}</option>
              <option value="{TIME}">{'{TIME} - Data e hora completas'}</option>
              <option value="{DIA}">{'{DIA} - Dia'}</option>
              <option value="{HORA}">{'{HORA} - Hora'}</option>
              <option value="{MES_ATUAL}">{'{MES_ATUAL} - Mês atual'}</option>
              <option value="{ANIVERSARIO}">{'{ANIVERSARIO} - Aniversário'}</option>

              {/* Vencimento */}
              <option value="{VENCIMENTO}">{'{VENCIMENTO} - Data de vencimento'}</option>
              <option value="{VENCIMENTO_APLICATIVO}">{'{VENCIMENTO_APLICATIVO} - Vencimento app'}</option>
              <option value="{HORA_VENCIMENTO_APLICATIVO}">{'{HORA_VENCIMENTO_APLICATIVO} - Hora vencimento app'}</option>
              <option value="{DIA_VENCIMENTO_APLICATIVO}">{'{DIA_VENCIMENTO_APLICATIVO} - Dia vencimento app'}</option>
              <option value="{DIF_DIAS_VENCIMENTO_HOJE}">{'{DIF_DIAS_VENCIMENTO_HOJE} - Dif. dias vencimento'}</option>
              <option value="{DIF_DIAS_CADASTRO_HOJE}">{'{DIF_DIAS_CADASTRO_HOJE} - Dif. dias cadastro'}</option>

              {/* Plano e pagamento */}
              <option value="{PLANO}">{'{PLANO} - Plano'}</option>
              <option value="{PLANO_OBS}">{'{PLANO_OBS} - Obs. do plano'}</option>
              <option value="{VALOR}">{'{VALOR} - Valor'}</option>
              <option value="{PAGAMENTO}">{'{PAGAMENTO} - Forma de pagamento'}</option>
              <option value="{PIX}">{'{PIX} - Chave PIX'}</option>
              <option value="{URL_RENOVACAO}">{'{URL_RENOVACAO} - URL de renovação'}</option>

              {/* Aplicativo / Dispositivo */}
              <option value="{APLICATIVO}">{'{APLICATIVO} - Aplicativo'}</option>
              <option value="{DISPOSITIVO}">{'{DISPOSITIVO} - Dispositivo'}</option>
              <option value="{TELAS}">{'{TELAS} - Telas'}</option>
              <option value="{DEVICE_KEY_OTP_CODE}">{'{DEVICE_KEY_OTP_CODE} - Device Key OTP'}</option>
              <option value="{MINUTOS_TESTE}">{'{MINUTOS_TESTE} - Minutos de teste'}</option>

              {/* Servidor */}
              <option value="{SERVIDOR}">{'{SERVIDOR} - Servidor'}</option>
              <option value="{INFO_SERVIDOR}">{'{INFO_SERVIDOR} - Info servidor'}</option>
              <option value="{DNS_1}">{'{DNS_1} - DNS 1'}</option>
              <option value="{DNS_2}">{'{DNS_2} - DNS 2'}</option>
              <option value="{DNS_3}">{'{DNS_3} - DNS 3'}</option>
              <option value="{DNS_4}">{'{DNS_4} - DNS 4'}</option>

              {/* URLs / APIs */}
              <option value="{LINK_M3U}">{'{LINK_M3U} - Link M3U'}</option>
              <option value="{EPG}">{'{EPG} - EPG'}</option>
              <option value="{URL_API_XC}">{'{URL_API_XC} - API XC'}</option>
              <option value="{URL_API_SMARTERS}">{'{URL_API_SMARTERS} - API Smarters'}</option>

              {/* Apps */}
              <option value="{URL_APP_ANDROID}">{'{URL_APP_ANDROID} - App Android'}</option>
              <option value="{URL_APP_ANDROID_2}">{'{URL_APP_ANDROID_2} - App Android 2'}</option>
              <option value="{URL_APP_IOS}">{'{URL_APP_IOS} - App iOS'}</option>
              <option value="{URL_APP_SAMSUNG}">{'{URL_APP_SAMSUNG} - App Samsung'}</option>
              <option value="{URL_APP_LG}">{'{URL_APP_LG} - App LG'}</option>
              <option value="{URL_APP_ROKU}">{'{URL_APP_ROKU} - App Roku'}</option>

              {/* Indicados / métricas */}
              <option value="{CAPTACAO}">{'{CAPTACAO} - Captação'}</option>
              <option value="{LTV}">{'{LTV} - LTV'}</option>
              <option value="{NUM_INDICADOS}">{'{NUM_INDICADOS} - Nº indicados'}</option>
              <option value="{TOTAL_INDICADOS}">{'{TOTAL_INDICADOS} - Total indicados'}</option>
              <option value="{TOTAL_INDICADOS_MES}">{'{TOTAL_INDICADOS_MES} - Indicados no mês'}</option>
              <option value="{NOME_ULTIMO_INDICADO}">{'{NOME_ULTIMO_INDICADO} - Último indicado'}</option>

              {/* Fidelidade */}
              <option value="{PONTOS_FIDELIDADE}">{'{PONTOS_FIDELIDADE} - Pontos fidelidade'}</option>
              <option value="{PONTOS_NECESSARIOS}">{'{PONTOS_NECESSARIOS} - Pontos necessários'}</option>
              <option value="{PONTOS_RESTANTES}">{'{PONTOS_RESTANTES} - Pontos restantes'}</option>

              {/* Outros */}
              <option value="{SITUACAO}">{'{SITUACAO} - Situação'}</option>
              <option value="{SAUDACAO}">{'{SAUDACAO} - Saudação'}</option>
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