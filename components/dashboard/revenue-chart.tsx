'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchAll } from '@/services/api-services'

interface DataPoint {
  label: string
  revenue: number
  expenses: number
  profit?: number
}

export default function RevenueChart() {
  const [abaAtiva, setAbaAtiva] = useState<'semanal' | 'mensal'>('mensal')
  const [data, setData] = useState<DataPoint[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchChartData = (groupBy: 'week' | 'month', interval: number) => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    params.set('groupBy', groupBy)
    params.set(groupBy === 'week' ? 'weeks' : 'months', interval.toString())

    fetchAll(`/dashboard/revenue-expense-chart?${params.toString()}`)
      .then((response) => {
        const mapped = (response || []).map((item: any) => {
          const revenue = item.revenue ?? item.receita ?? 0
          const expenses = item.expenses ?? item.despesas ?? 0
          return {
            label: item.label ?? item.mês ?? item.mes ?? item.month ?? '',
            revenue,
            expenses,
            profit: revenue - expenses,
          }
        })
        setData(mapped)
      })
      .catch(() => setError('Erro ao carregar dados do gráfico'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchChartData(abaAtiva === 'semanal' ? 'week' : 'month', 1)
  }, [abaAtiva])

  if (loading) return <p>Carregando gráfico...</p>
  if (error) return <p>{error}</p>

  // 💰 Tooltip customizado com destaque de lucro/prejuízo
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const revenue = payload.find((p: any) => p.dataKey === 'revenue')?.value ?? 0
      const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value ?? 0
      const profit = revenue - expenses
      const profitColor = profit >= 0 ? '#16a34a' : '#dc2626'

      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-green-600">Receita: R$ {revenue.toFixed(2)}</p>
          <p className="text-red-600">Despesas: R$ {expenses.toFixed(2)}</p>
          <p className="mt-1 font-medium" style={{ color: profitColor }}>
            {profit >= 0 ? 'Lucro' : 'Prejuízo'}: R$ {profit.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Receita vs Despesas</CardTitle>
            <CardDescription>Visão financeira geral</CardDescription>
          </div>
          <Tabs
            value={abaAtiva}
            onValueChange={(value) =>
              setAbaAtiva(value as 'semanal' | 'mensal')
            }
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="mensal">Mensal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="h-[320px]">
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Receita (verde) */}
              <Line
                type="monotone"
                dataKey="revenue"
                name="Receita"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

              {/* Despesas (vermelho) */}
              <Line
                type="monotone"
                dataKey="expenses"
                name="Despesas"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

              {/* Lucro líquido (linha tracejada opcional) */}
              <Line
                type="monotone"
                dataKey="profit"
                name="Lucro Líquido"
                stroke="#2563eb"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
