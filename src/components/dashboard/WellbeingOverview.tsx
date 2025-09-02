'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface WellbeingOverviewProps {
  burnoutRisks: {
    low: number;
    medium: number;
    high: number;
  };
}

export function WellbeingOverview({ burnoutRisks }: WellbeingOverviewProps) {
  const data = [
    {
      name: 'Baixo Risco',
      value: burnoutRisks.low,
      color: '#22c55e'
    },
    {
      name: 'Médio Risco',
      value: burnoutRisks.medium,
      color: '#eab308'
    },
    {
      name: 'Alto Risco',
      value: burnoutRisks.high,
      color: '#ef4444'
    }
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} funcionário{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const total = burnoutRisks.low + burnoutRisks.medium + burnoutRisks.high;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risco de Burnout</CardTitle>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              {data.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">Sem dados de bem-estar</p>
              <p className="text-sm">Complete pesquisas de bem-estar para ver os dados aqui</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}