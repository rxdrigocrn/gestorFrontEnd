const clientData = {
  id: "CL001",
  name: "Daniel Da Cruz Santana",
  username: "559591325610",
  dueDate: "23 de Maio de 2025 - 20:00",
  source: "Planilha",
  server: "ELITE",
  phone: "+559991325610 | Roraima - Brasil",
  device: "Tv Smart LG",
  application: "quickplayer",
  plan: "Mensal",
  amount: "49.90",
  paymentMethod: "PIX",
  screens: "1",
  registrationDate: "23 de Abril de 2025",
  status: "Ativo",
  mac: "74:F6:B8:3F:F7:8A",
  deviceKey: "128163",
  notes: "",
  stats: {
    livValue: "R$ 49,90",
    livIndicados: "R$ 0,00",
    indicados: "0",
    clientAge: "7 dias",
    daysUntilDue: "23 dias",
    cost: "R$ 13,00"
  }
}

// Define all possible client IDs for static generation
export function generateStaticParams() {
  return [
    { id: 'CL001' },
    { id: 'CL003' }
  ]
}

import { ClientDetails } from '@/components/clients/client-details'

export default function ClientDetailsPage() {
  return <ClientDetails clientData={clientData} />
}