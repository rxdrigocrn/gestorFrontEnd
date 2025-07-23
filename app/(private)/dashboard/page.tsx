'use client'

import { useEffect, useState } from 'react'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import RevenueChart from '@/components/dashboard/revenue-chart'
import PaymentHistory from '@/components/dashboard/payment-history'
import SystemLogs from '@/components/dashboard/system-logs'
import ProfitProjections from '@/components/dashboard/profit-projections'
import { DashboardFilter } from '@/components/dashboard/dashboard-filter'
import { fetchAll } from '@/services/api-services'
import { KpiResponse } from '@/types/dashboard'
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
    const [kpis, setKpis] = useState<KpiResponse | null>(null)
    const [chartData, setChartData] = useState<any>(null)
    const [recentPayments, setRecentPayments] = useState<any>(null)
    const [recentLogs, setRecentLogs] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        setLoading(true)
        setError('')

        Promise.all([
            fetchAll('/dashboard/kpi-cards'),
            fetchAll('/dashboard/revenue-expense-chart'),
            fetchAll('/dashboard/recent-payments'),
            fetchAll('/dashboard/recent-logs'),
        ])
            .then(([kpisData, chartData, payments, logs]) => {
                setKpis(kpisData)
                setChartData(chartData)
                setRecentPayments(payments)
                setRecentLogs(logs)
            })
            .catch((err) => {
                console.error(err)
                setError('Erro ao carregar dados do dashboard.')
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Carregando dashboard...</p>
    if (error) return <p>{error}</p>
    if (!kpis) return null

    const stats = transformKpisToStats(kpis)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <DashboardFilter />
            </div>

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={chartData} />
                <ProfitProjections />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemLogs logs={recentLogs} />
                <PaymentHistory payments={recentPayments} />
            </div>
        </div>
    )
}

function transformKpisToStats(kpis: KpiResponse) {
    return [
        {
            title: 'Receita Total',
            value: `R$ ${kpis.totalRevenue.toFixed(2).replace('.', ',')}`,
            description: `Antes: R$ ${kpis.previousPeriodRevenue.toFixed(2).replace('.', ',')}`,
            icon: <DollarSign className="h-5 w-5" />,
            trend: {
                value: kpis.previousPeriodRevenue === 0
                    ? 'N/A'
                    : `${(
                        ((kpis.totalRevenue - kpis.previousPeriodRevenue) / kpis.previousPeriodRevenue) * 100
                    ).toFixed(1)}%`,
                isPositive: kpis.totalRevenue >= kpis.previousPeriodRevenue,
            },
        },
        {
            title: 'Clientes Ativos',
            value: kpis.activeClients.toString(),
            description: 'Inscritos ativos',
            icon: <Users className="h-5 w-5" />,
            trend: {
                value: `${kpis.growthRate.toFixed(1)}%`,
                isPositive: kpis.growthRate >= 0,
            },
        },
        {
            title: 'Taxa de Crescimento',
            value: `${kpis.growthRate.toFixed(1)}%`,
            description: 'Crescimento mensal',
            icon: <TrendingUp className="h-5 w-5" />,
            trend: {
                value: `${kpis.growthRate.toFixed(1)}%`,
                isPositive: kpis.growthRate >= 0,
            },
        },
        {
            title: 'Período Médio de Retenção',
            value: '9,2 meses',
            description: 'Período médio de retenção dos clientes',
            icon: <Clock className="h-5 w-5" />,
            trend: {
                value: '5,5%',
                isPositive: true,
            },
        },
    ]
}

