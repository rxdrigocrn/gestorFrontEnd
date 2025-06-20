import DashboardStats from '@/components/dashboard/dashboard-stats';
import RevenueChart from '@/components/dashboard/revenue-chart';
import ClientDistribution from '@/components/dashboard/client-distribution';
import PaymentHistory from '@/components/dashboard/payment-history';
import SystemLogs from '@/components/dashboard/system-logs';
import ProfitProjections from '@/components/dashboard/profit-projections';
import { DashboardFilter } from '@/components/dashboard/dashboard-filter';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <DashboardFilter />
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <ProfitProjections />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemLogs />
                <PaymentHistory />
            </div>
        </div>
    );
}