"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DataPoint {
  mês: string
  receita: number
  despesas: number
}

interface RevenueChartProps {
  data: DataPoint[] | null
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [abaAtiva, setAbaAtiva] = useState('mensal')

  if (!data) return <p>Carregando gráfico...</p>

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Receita vs Despesas</CardTitle>
            <CardDescription>Visão geral financeira</CardDescription>
          </div>
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="semanal" disabled>Semanal</TabsTrigger>
              <TabsTrigger value="mensal">Mensal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mês" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="receita" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} strokeWidth={2} />
            <Line type="monotone" dataKey="despesas" stroke="hsl(var(--chart-2))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

