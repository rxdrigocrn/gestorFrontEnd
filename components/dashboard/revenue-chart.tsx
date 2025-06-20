"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

// Sample data - would come from API in production
const monthlyData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 1200 },
  { name: 'Apr', revenue: 2780, expenses: 1908 },
  { name: 'May', revenue: 1890, expenses: 1200 },
  { name: 'Jun', revenue: 2390, expenses: 1700 },
  { name: 'Jul', revenue: 3490, expenses: 2100 },
  { name: 'Aug', revenue: 3490, expenses: 2100 },
  { name: 'Sep', revenue: 2490, expenses: 1800 },
  { name: 'Oct', revenue: 3290, expenses: 2300 },
  { name: 'Nov', revenue: 3890, expenses: 2700 },
  { name: 'Dec', revenue: 4490, expenses: 3100 },
];

const weeklyData = [
  { name: 'Mon', revenue: 890, expenses: 600 },
  { name: 'Tue', revenue: 760, expenses: 550 },
  { name: 'Wed', revenue: 820, expenses: 590 },
  { name: 'Thu', revenue: 930, expenses: 670 },
  { name: 'Fri', revenue: 970, expenses: 720 },
  { name: 'Sat', revenue: 680, expenses: 450 },
  { name: 'Sun', revenue: 540, expenses: 380 },
];

export default function RevenueChart() {
  const [activeTab, setActiveTab] = useState('monthly');
  const data = activeTab === 'monthly' ? monthlyData : weeklyData;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Financial overview</CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
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
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--chart-1))" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}