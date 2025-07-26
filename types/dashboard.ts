export type KpiResponse = {
    activeClients: number
    currentPeriodRevenue: number
    growthRate: number
    previousPeriodRevenue: number
    totalRevenue: number
}


export type KpiResponseByDate = {
    activeClients: number
    currentPeriodRevenue: number
    growthRate: number
    overallTotalRevenue: number
    dailyRevenue: number
}


