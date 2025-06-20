"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

// Sample data - would come from API in production
const monthlyProjections = [
  { month: 'May', projected: 5200, actual: 5100 },
  { month: 'Jun', projected: 5800, actual: 5600 },
  { month: 'Jul', projected: 6500, actual: 6300 },
  { month: 'Aug', projected: 7200, actual: null },
  { month: 'Sep', projected: 8000, actual: null },
  { month: 'Oct', projected: 8800, actual: null },
];

const quarterlyProjections = [
  { quarter: 'Q2 2024', projected: 15600, actual: 15200 },
  { quarter: 'Q3 2024', projected: 19500, actual: null },
  { quarter: 'Q4 2024', projected: 24000, actual: null },
  { quarter: 'Q1 2025', projected: 28000, actual: null },
];

export default function ProfitProjections() {
  const [activeTab, setActiveTab] = useState('monthly');
  const data = activeTab === 'monthly' ? monthlyProjections : quarterlyProjections;
  const xKey = activeTab === 'monthly' ? 'month' : 'quarter';

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profit Projections</CardTitle>
            <CardDescription>Future profit estimates vs actual</CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip 
              formatter={(value) => `R$ ${value}`}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="projected" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Projected"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}