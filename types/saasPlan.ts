// Interface para a resposta da API (o que vem do banco)
export interface SaaSPlanResponse {
  id: string;
  name: string;
  price: number;
  maxClients: number;
  maxUsers: number;
  stripePriceId?: string | null;
  abacatePayPlanId?: string | null;
  createdAt: string; // ou Date, dependendo de como a API serializa
  features?: string[];

  popular?: boolean;
}

// Interface para criar um novo plano (o que vai no corpo da requisição POST)
export interface SaaSPlanCreate {
  name: string;
  price: number;
  maxClients: number;
  maxUsers: number;
  stripePriceId?: string;
  abacatePayPlanId?: string;
}

// Interface para atualizar um plano (o que vai no corpo da requisição PATCH/PUT)
// Geralmente, os campos são opcionais para permitir atualizações parciais
export type SaaSPlanUpdate = Partial<SaaSPlanCreate>;