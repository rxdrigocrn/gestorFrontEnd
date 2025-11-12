"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface ChartDataPoint {
  label: string; 
  revenue: number;
  expenses: number;
}

interface ProfitProjectionsProps {
  data: ChartDataPoint[];
}

const meses = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function proximoMes(mes: string): string {
  const idx = meses.indexOf(mes);
  return meses[(idx + 1) % 12];
}

function gerarDadosProjecao(
  data: ChartDataPoint[],
  filtro: "mensal" | "trimestral",
  crescimentoMensal = 0.05
) {
  if (!data || data.length === 0) return [];

  const lucros = data.map(({ label, revenue, expenses }) => ({
    label,
    lucro: revenue - expenses,
  }));

  const ultimoMes = lucros[lucros.length - 1];
  let lucroBase = ultimoMes.lucro;
  let mesAtual = ultimoMes.label;

  if (filtro === "mensal") {
    const mesProj = proximoMes(mesAtual);
    const proj = lucroBase * (1 + crescimentoMensal);

    return [
      {
        month: mesAtual,
        projected: lucroBase,
        actual: lucroBase,
      },
      {
        month: mesProj,
        projected: proj,
        actual: null,
      },
    ];
  } else {
    const resultado = [];

    const ultimos3 = lucros.slice(-3);
    const currentYear = new Date().getFullYear();

    ultimos3.forEach(({ label, lucro }) => {
      const idx = meses.indexOf(label);
      const trimestre = `T${Math.floor(idx / 3) + 1} ${currentYear}`;
      resultado.push({
        quarter: trimestre,
        projected: lucro,
        actual: lucro,
      });
    });


    const lastIndex = meses.indexOf(ultimoMes.label);
    for (let i = 1; i <= 3; i++) {
      const idx = (lastIndex + i) % 12;
      const year = currentYear + Math.floor((lastIndex + i) / 12);
      const mes = meses[idx];
      lucroBase = lucroBase * (1 + crescimentoMensal);

      const trimestre = `T${Math.floor(idx / 3) + 1} ${year}`;
      resultado.push({
        quarter: trimestre,
        projected: lucroBase,
        actual: null,
      });
    }

    return resultado;
  }
}

export default function ProjecoesLucro({ data }: ProfitProjectionsProps) {
  const [abaAtiva, setAbaAtiva] = useState<"mensal" | "trimestral">("mensal");
  const dadosProjecao = gerarDadosProjecao(data, abaAtiva);
  const xKey = abaAtiva === "mensal" ? "month" : "quarter";

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projeções de Lucro</CardTitle>
            <CardDescription>Estimativas futuras vs reais</CardDescription>
          </div>
          <Tabs
            value={abaAtiva}
            onValueChange={(value) => setAbaAtiva(value as "mensal" | "trimestral")}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mensal">Mensal</TabsTrigger>
              <TabsTrigger value="trimestral">Trimestral</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dadosProjecao} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Projetado"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Real"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
