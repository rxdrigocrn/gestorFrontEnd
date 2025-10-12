"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

import { useSaasPlanStore } from '@/store/saasPlanStore';
import { SaaSPlanResponse, SaaSPlanCreate, SaaSPlanUpdate } from '@/types/saasPlan'; 

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const planSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  price: z.coerce.number().min(0, "Preço deve ser positivo."),
  maxClients: z.coerce.number().int().min(1, "Máx. de clientes deve ser no mínimo 1."),
  maxUsers: z.coerce.number().int().min(1, "Máx. de usuários deve ser no mínimo 1."),
  stripePriceId: z.string().nullable().optional().transform(val => val === '' ? undefined : val),
  abacatePayPlanId: z.string().nullable().optional().transform(val => val === '' ? undefined : val),
});

type PlanFormValues = z.infer <typeof planSchema>;

interface PlanFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SaaSPlanResponse | null; 
}

export const PlanFormDialog = ({ isOpen, onClose, plan }: PlanFormDialogProps) => {
  const isEditing = !!plan;
  const { createItem, updateItem, isLoading } = useSaasPlanStore();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      price: 0,
      maxClients: 100,
      maxUsers: 5,
      stripePriceId: '',
      abacatePayPlanId: '',
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset(plan);
    } else {
      form.reset({
        name: '', price: 0, maxClients: 100, maxUsers: 5, stripePriceId: '', abacatePayPlanId: '',
      });
    }
  }, [plan, form, isOpen]);

  const onSubmit = async (data: SaaSPlanCreate) => {
    try {
      if (isEditing && plan) {
        await updateItem(plan.id, data as SaaSPlanUpdate); 
      } else {
        await createItem(data);
      }
      onClose();
    } catch (error) {
      console.error("Falha ao salvar o plano:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Plano' : 'Criar Novo Plano'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} placeholder="Plano Pro" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="price" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Preço (R$)</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="49.90" /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField name="maxUsers" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Máximo de Usuários</FormLabel><FormControl><Input type="number" {...field} placeholder="5" /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField name="maxClients" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Máximo de Clientes</FormLabel><FormControl><Input type="number" {...field} placeholder="100" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="stripePriceId" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Stripe Price ID (Opcional)</FormLabel><FormControl><Input {...field} placeholder="price_123..."/></FormControl><FormMessage /></FormItem>
            )} />
             <FormField name="abacatePayPlanId" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>AbacatePay Plan ID (Opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};