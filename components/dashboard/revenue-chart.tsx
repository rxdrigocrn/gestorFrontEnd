'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchAll } from '@/services/api-services'

interface DataPoint {
  mês: string
  receita: number
  despesas: number
}



export default function RevenueChart() {
  const [abaAtiva, setAbaAtiva] = useState<'semanal' | 'mensal'>('mensal')
  const [data, setData] = useState<DataPoint[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Função para buscar dados do gráfico com base na aba
  const fetchChartData = (groupBy: 'week' | 'month', interval: number) => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    params.set('groupBy', groupBy)
    if (groupBy === 'week') {
      params.set('weeks', interval.toString())
    } else {
      params.set('months', interval.toString())
    }

    fetchAll(`/dashboard/revenue-expense-chart?${params.toString()}`)
      .then((response) => setData(response))
      .catch(() => setError('Erro ao carregar dados do gráfico'))
      .finally(() => setLoading(false))
  }

  // Atualiza o gráfico ao mudar aba
  useEffect(() => {
    if (abaAtiva === 'semanal') {
      fetchChartData('week', 1) // 1 semana
    } else {
      fetchChartData('month', 1) // 1 mês
    }
  }, [abaAtiva])

  if (loading) return <p>Carregando gráfico...</p>
  if (error) return <p>{error}</p>

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Receita vs Despesas</CardTitle>
            <CardDescription>Visão geral financeira</CardDescription>
          </div>
          <Tabs value={abaAtiva} onValueChange={(value) => setAbaAtiva(value as 'semanal' | 'mensal')} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="mensal">Mensal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mês" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="receita" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="despesas" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
