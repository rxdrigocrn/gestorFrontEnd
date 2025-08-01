'use client'

import { useEffect, useState } from 'react'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import RevenueChart from '@/components/dashboard/revenue-chart'
import PaymentHistory from '@/components/dashboard/payment-history'
import SystemLogs from '@/components/dashboard/system-logs'
import ProfitProjections from '@/components/dashboard/profit-projections'
import { DashboardFilter } from '@/components/dashboard/dashboard-filter'
import { fetchAll } from '@/services/api-services'
import { KpiResponse, KpiResponseByDate } from '@/types/dashboard'
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react'
import Loader from '@/components/loaders/loader'

export default function DashboardPage() {
    const [kpis, setKpis] = useState<KpiResponse | KpiResponseByDate | null>(null)
    const [chartData, setChartData] = useState<any>(null)
    const [recentPayments, setRecentPayments] = useState<any>(null)
    const [recentLogs, setRecentLogs] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [periodFilter, setPeriodFilter] = useState<string>('7d')
    const [customDateFilter, setCustomDateFilter] = useState<Date | undefined>()

    const mapPeriodToDays = (period: string): number => {
        switch (period) {
            case '7d': return 7
            case '30d': return 30
            case '90d': return 90
            case '12m': return 365
            default: return 30
        }
    }

    const fetchDashboardData = (period: string, customDate?: Date) => {
        setLoading(true)
        setError('')

        let kpiUrl = ''
        let queryParams = new URLSearchParams()

        if (period === 'custom' && customDate) {
            queryParams.set('date', customDate.toISOString())
            kpiUrl = `/dashboard/kpi-cards/by-date?${queryParams.toString()}`
        } else {
            const days = mapPeriodToDays(period)
            queryParams.set('period', days.toString())
            kpiUrl = `/dashboard/kpi-cards?${queryParams.toString()}`
        }

        Promise.all([
            fetchAll(kpiUrl),
            fetchAll(`/dashboard/revenue-expense-chart`),
            fetchAll(`/dashboard/recent-payments`),
            fetchAll(`/dashboard/recent-logs`),
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
    }

    const handlePeriodChange = (period: string, customDate?: Date) => {
        setPeriodFilter(period)
        setCustomDateFilter(customDate)
    }

    useEffect(() => {
        fetchDashboardData(periodFilter, customDateFilter)
    }, [periodFilter, customDateFilter])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[100vh] mb-[64px]">
                <Loader />
            </div>
        )
    }
    if (error) return <p>{error}</p>
    if (!kpis) return null

    const stats = transformKpisToStats(kpis)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <DashboardFilter
                    onPeriodChange={handlePeriodChange}
                    period={periodFilter}
                    date={customDateFilter}
                />
            </div>

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <ProfitProjections data={chartData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemLogs logs={recentLogs} />
                <PaymentHistory payments={recentPayments} />
            </div>
        </div>
    )
}

function transformKpisToStats(kpis: any) {
    const isByDate = kpis?.dailyRevenue !== undefined

    if (isByDate) {
        return [
            {
                title: 'Receita do Dia',
                value: `R$ ${kpis.dailyRevenue.toFixed(2).replace('.', ',')}`,
                description: `Acumulado: R$ ${kpis.overallTotalRevenue.toFixed(2).replace('.', ',')}`,
                icon: <DollarSign className="h-5 w-5" />,
                trend: {
                    value: 'N/A',
                    isPositive: true,
                },
            },
            {
                title: 'Clientes Ativos',
                value: kpis.totalActiveClients.toString(),
                description: 'Inscritos ativos',
                icon: <Users className="h-5 w-5" />,
                trend: {
                    value: 'N/A',
                    isPositive: true,
                },
            },
            {
                title: 'Novos Clientes no Dia',
                value: kpis.newClientsToday.toString(),
                description: 'Clientes adquiridos hoje',
                icon: <TrendingUp className="h-5 w-5" />,
                trend: {
                    value: 'N/A',
                    isPositive: true,
                },
            },
            {
                title: 'Data selecionada',
                value: new Date(kpis.date).toLocaleDateString('pt-BR'),
                description: 'Data da análise',
                icon: <Clock className="h-5 w-5" />,
                trend: {
                    value: '',
                    isPositive: true,
                },
            },
        ]
    }

    // Caso padrão (por período)
    return [
        {
            title: 'Receita Total',
            value: `R$ ${kpis.totalRevenue.toFixed(2).replace('.', ',')}`,
            description: `Antes: R$ ${kpis.previousPeriodRevenue.toFixed(2).replace('.', ',')}`,
            icon: <DollarSign className="h-5 w-5" />,
            trend: {
                value:
                    kpis.previousPeriodRevenue === 0
                        ? 'N/A'
                        : `${(
                            ((kpis.totalRevenue - kpis.previousPeriodRevenue) / kpis.previousPeriodRevenue) *
                            100
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

