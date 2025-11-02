'use client'

import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface MensagensSectionProps {
  form: any
  messageTemplates: { id: string; name: string }[]
}

export const MensagensSection = ({ form, messageTemplates }: MensagensSectionProps) => {
  return (
    <div className="space-y-4 p-2">
      <h3 className="text-lg font-semibold">Templates de Mensagens</h3>

      {['paymentMessageTemplateId', 'resellerCreditMessageTemplateId', 'trialCreatedMessageTemplateId'].map((field) => (
        <div key={field}>
          <Label>{field.replace(/([A-Z])/g, ' $1')}</Label>
          <select
            className="w-full border rounded-md p-2 mb-2"
            value={form.watch(field) || ''}
            onChange={(e) => form.setValue(field, e.target.value || '')}
          >
            <option value="">Selecione um template</option>
            {messageTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <Input {...form.register(field)} type="hidden" className="hidden" readOnly />
        </div>
      ))}
    </div>
  )
}
