type PeriodType = 'DAYS' | 'MONTHS' | 'YEARS'

export type PlanBase = {
    name: string
    periodType: PeriodType
    periodValue: number
    creditsToRenew: number | null
    description?: string | null
}

export type PlanCreate = PlanBase

export type PlanUpdate = PlanBase & {
    id: string
}

export type PlanResponse = PlanBase & {
    id: string
    // createdAt: string
    // updatedAt: string
    organizationId: string
}

export type PlanList = PlanResponse[]

