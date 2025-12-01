'use client'

import { useEffect, useState } from 'react'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import RevenueChart from '@/components/dashboard/revenue-chart'
import PaymentHistory from '@/components/dashboard/payment-history'
import SystemLogs from '@/components/dashboard/system-logs'
import ProfitProjections from '@/components/dashboard/profit-projections'
import { DashboardFilter } from '@/components/dashboard/dashboard-filter'
import { fetchAll } from '@/services/api-services'
import { DateRange } from 'react-day-picker'
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
    const [customDateFilter, setCustomDateFilter] = useState<DateRange | undefined>()

    const mapPeriodToDays = (period: string): number => {
        switch (period) {
            case '7d': return 7
            case '30d': return 30
            case '90d': return 90
            case '12m': return 365
            default: return 30
        }
    }

    const fetchDashboardData = (period: string, customDate?: DateRange) => {
        setLoading(true)
        setError('')

        let kpiUrl = ''
        let queryParams = new URLSearchParams()

        if (period === 'custom' && customDate?.from) {
            const from = customDate.from
            const to = customDate.to ?? customDate.from // se não tiver to, considera single-day

            const isSingleDay =
                from.toDateString() === to.toDateString()

            if (isSingleDay) {
                // DIA ÚNICO → /by-date?date=
                queryParams.set('date', from.toISOString())
                kpiUrl = `/dashboard/kpi-cards/by-date?${queryParams.toString()}`
            } else {
                // RANGE → /by-range?from=&to=
                queryParams.set('from', from.toISOString())
                queryParams.set('to', to.toISOString())
                kpiUrl = `/dashboard/kpi-cards/by-range?${queryParams.toString()}`
            }
        }
        else {
            // Período padrão
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


    const handlePeriodChange = (period: string, customDate?: DateRange) => {
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
    const isByDate = kpis?.dailyRevenue !== undefined && kpis?.overallTotalRevenue !== undefined
    const realDate = new Date(kpis.date);

    // Tratamento: pegar Y/M/D diretamente, ignorando shifts
    const yyyy = realDate.getUTCFullYear();
    const mm = (realDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const dd = realDate.getUTCDate().toString().padStart(2, '0');

    value: `${dd}/${mm}/${yyyy}`

    if (isByDate) {
        return [
            {
                title: 'Receita do Dia',
                value: `R$ ${(kpis.dailyRevenue ?? 0).toFixed(2).replace('.', ',')}`,
                description: `Acumulado total: R$ ${(kpis.overallTotalRevenue ?? 0).toFixed(2).replace('.', ',')}`,
                icon: <DollarSign className="h-5 w-5" />,
                trend: { value: '—', isPositive: true },
            },
            {
                title: 'Clientes Totais',
                value: (kpis.totalActiveClients ?? 0).toString(),
                description: 'Inscritos ativos',
                icon: <Users className="h-5 w-5" />,
            },
            {
                title: 'Novos Clientes no Dia',
                value: (kpis.newClientsToday ?? 0).toString(),
                description: 'Clientes adquiridos hoje',
                icon: <TrendingUp className="h-5 w-5" />,
            },
            {
                title: 'Data selecionada',
                value: (() => {
                    const d = new Date(kpis.date)
                    const yyyy = d.getUTCFullYear()
                    const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
                    const dd = String(d.getUTCDate()).padStart(2, "0")
                    return `${dd}/${mm}/${yyyy}`
                })(),
                description: 'Data da análise',
                icon: <Clock className="h-5 w-5" />,
            }

        ]
    }

    // ---- KPI POR RANGE / PERÍODO NORMAL ----

    const active =
        kpis.activeClients ??
        kpis.totalActiveClients ??
        0

    const inactive = kpis.inactiveClients ?? 0
    const archived = kpis.archivedClients ?? 0

    const totalClients =
        kpis.totalClients ??
        (active + inactive + archived)


    const totalRevenue = kpis.totalRevenue ?? 0
    const previousRevenue = kpis.previousPeriodRevenue ?? 0

    const trendPercent =
        previousRevenue > 0
            ? (((totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
            : '0'

    return [
        {
            title: 'Receita Total',
            value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`,
            description: `Período anterior: R$ ${previousRevenue.toFixed(2).replace('.', ',')}`,
            icon: <DollarSign className="h-5 w-5" />,
            trend: {
                value: `${trendPercent}%`,
                isPositive: Number(trendPercent) >= 0,
            },
        },
        {
            title: 'Clientes Totais',
            value: totalClients.toString(),
            description: 'Inscritos',
            extra: {
                active,
                inactive,
                total: totalClients,
            },
            icon: <Users className="h-5 w-5" />,
            trend: {
                value: `${(kpis.growthRate ?? 0).toFixed(1)}%`,
                isPositive: (kpis.growthRate ?? 0) >= 0,
            },
        },
        {
            title: 'Taxa de Crescimento',
            value: `${(kpis.growthRate ?? 0).toFixed(1)}%`,
            description: 'Crescimento mensal',
            icon: <TrendingUp className="h-5 w-5" />,
            trend: {
                value: `${(kpis.growthRate ?? 0).toFixed(1)}%`,
                isPositive: (kpis.growthRate ?? 0) >= 0,
            },
        },
        {
            title: 'Período Médio de Retenção',
            value: `${(kpis.retentionMonths ?? 9.2).toFixed(1)} meses`,
            description: 'Retenção média dos clientes',
            icon: <Clock className="h-5 w-5" />,
            trend: { value: '—', isPositive: true },
        },
    ]
}


