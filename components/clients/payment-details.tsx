// "use client";

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { usePaymentMethodStore } from "@/store/paymentMethodStore";
// import { usePlanStore } from "@/store/planStore";
// import { Modal } from "@/components/ui/modal";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { ClientPayment } from "@/types/client";
// import { format, parseISO } from "date-fns";
// import { Switch } from "../ui/switch";

// const paymentSchema = z.object({
//     amount: z.coerce.number().positive("Informe um valor"),
//     paidAt: z.string().min(1, "Data/hora do pagamento é obrigatória"),
//     dueDate: z.string().min(1, "Data/hora de vencimento é obrigatória"),
//     paymentMethodId: z.string().uuid("Selecione uma forma de pagamento"),
//     discount: z.coerce.number().min(0).optional().default(0),
//     surcharge: z.coerce.number().min(0).optional().default(0),
//     notes: z.string().optional().default(""),
//     sendReceipt: z.coerce.boolean(),
//     renewClient: z.coerce.boolean(),
// });

// type PaymentFormValues = z.infer<typeof paymentSchema>;

// interface AddPaymentModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     onConfirm: (data: ClientPayment) => Promise<void> | void;
//     defaultValues?: Partial<ClientPayment>;
// }

// export function AddPaymentModal({
//     open,
//     onOpenChange,
//     onConfirm,
//     defaultValues,
// }: AddPaymentModalProps) {
//     const { data: paymentMethods } = usePaymentMethodStore();
//     const { data: plans } = usePlanStore();
//     const {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors },
//     } = useForm<PaymentFormValues>({
//         resolver: zodResolver(paymentSchema),
//         defaultValues,
//     });

//     useEffect(() => {
//         if (defaultValues) {
//             Object.keys(defaultValues).forEach((key) =>
//                 setValue(key, defaultValues[key])
//             );
//         }
//     }, [defaultValues, setValue]);

//     const onSubmit = async (data: PaymentFormValues) => {
//         await onConfirm(data);
//         onOpenChange(false);
//     };

//     return (
//         <Modal
//             open={open}
//             onOpenChange={onOpenChange}
//             title="Adicionar Pagamento"
//             maxWidth="2xl"
//             onSubmit={handleSubmit(onSubmit)}
//         >


//         </Modal>
//     );
// }
