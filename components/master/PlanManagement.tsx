"use client";

import React, { useEffect, useState } from 'react';
// Importa o tipo correto para os planos que vêm da API
import { SaaSPlanResponse } from '@/types/saasPlan'; 

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, CheckCircle, MoreVertical, Loader2 } from 'lucide-react';
import { PlanFormDialog } from './PlanFormDialog';
import { ConfirmationDialog } from '@/components/ui/confirmModal';
import { useSaasPlanStore } from '@/store/saasPlanStore';

export const PlanManagement = () => {
  // Renomeando 'items' para 'plans' para manter a legibilidade no JSX
  // Usando os métodos corretos da genericStore: fetchItems, deleteItem
  const { items: plans, fetchItems, deleteItem, isLoading } = useSaasPlanStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  // O estado agora armazena um plano do tipo SaaSPlanResponse
  const [selectedPlan, setSelectedPlan] = useState<SaaSPlanResponse | null>(null);

  useEffect(() => {
    // Chama o método correto para buscar os dados
    fetchItems(); 
  }, [fetchItems]);

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsFormOpen(true);
  };

  // O parâmetro 'plan' agora é do tipo SaaSPlanResponse
  const handleEdit = (plan: SaaSPlanResponse) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };
  
  // O parâmetro 'plan' agora é do tipo SaaSPlanResponse
  const handleDelete = (plan: SaaSPlanResponse) => {
    setSelectedPlan(plan);
    setIsDeleteAlertOpen(true);
  }

  const confirmDelete = async () => {
    if (selectedPlan) {
      // Chama o método correto para deletar
      await deleteItem(selectedPlan.id); 
      setIsDeleteAlertOpen(false);
      setSelectedPlan(null);
    }
  };

  // Melhora a experiência de carregamento com um spinner
  if (isLoading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2">Carregando planos...</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Planos do SaaS</CardTitle>
            <CardDescription>
              Gerencie os planos de assinatura disponíveis para seus clientes.
            </CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Novo Plano
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">R${plan.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500"> /mês</span>
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(plan)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(plan)} className="text-red-500 focus:bg-red-50 focus:text-red-600">Remover</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> <span>Até {plan.maxUsers} usuários</span></li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> <span>Até {plan.maxClients} clientes</span></li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Os modais de ação não precisam de alteração */}
      <PlanFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        plan={selectedPlan}
      />
      <ConfirmationDialog
        isOpen={isDeleteAlertOpen}
        onConfirm={confirmDelete}
        description='Deseja remover o Plano?'
     onOpenChange={() => setIsDeleteAlertOpen(false)}
          title='SaaS Plan'
      />
    </>
  );
};