'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface EmployeeAnalytics {
  employee: {
    id: number;
    name: string;
    position: string;
  };
  summary: {
    avgProductivityScore: number;
    avgWellbeingScore: number;
    totalMetrics: number;
    period: string;
  };
  productivity: Array<{
    date: string;
    productivity_score: number;
    tasks_completed: number;
    active_hours: number;
    focus_time: number;
    collaboration_score: number;
  }>;
  wellbeing: Array<{
    date: string;
    overall_score: number;
    stress_level: number;
    satisfaction_level: number;
    work_life_balance: number;
    burnout_risk: 'low' | 'medium' | 'high';
  }>;
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<EmployeeAnalytics | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      // Set selected employee to current user for individual view
      if (user.role === 'employee') {
        setSelectedEmployee(user.id.toString());
      }
      fetchAnalytics();
    }
  }, [user, loading, router, period, selectedEmployee]);

  const fetchAnalytics = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem('token');
      const employeeParam = selectedEmployee || (user?.role === 'employee' ? user.id : '');
      
      const response = await fetch(`http://localhost:3001/api/analytics/employee/${employeeParam}?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getBurnoutRiskText = (risk: string) => {
    switch (risk) {
      case 'high': return 'Alto Risco';
      case 'medium': return 'Médio Risco';
      default: return 'Baixo Risco';
    }
  };

  // Format data for charts
  const productivityChartData = analytics?.productivity.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    })
  })) || [];

  const wellbeingChartData = analytics?.wellbeing.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    stress_level: 100 - item.stress_level // Invert stress for better visualization
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Detalhadas
          </h1>
          <p className="text-gray-600">
            Análise profunda de produtividade e bem-estar
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : analytics ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Funcionário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{analytics.employee.name}</div>
                  <p className="text-sm text-gray-600">{analytics.employee.position}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Produtividade Média
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.summary.avgProductivityScore}%</div>
                  <p className="text-sm text-gray-600">Últimos {period === '7d' ? '7' : period === '30d' ? '30' : '90'} dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Bem-estar Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.summary.avgWellbeingScore}%</div>
                  <p className="text-sm text-gray-600">Score de satisfação</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Pontos de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.summary.totalMetrics}</div>
                  <p className="text-sm text-gray-600">Registros coletados</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="productivity" className="space-y-6">
              <TabsList>
                <TabsTrigger value="productivity">Produtividade</TabsTrigger>
                <TabsTrigger value="wellbeing">Bem-estar</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="productivity" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Productivity Score Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Score de Produtividade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={productivityChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Produtividade']} />
                            <Line 
                              type="monotone" 
                              dataKey="productivity_score" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasks and Hours Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Atividade Diária</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={productivityChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="active_hours" 
                              stackId="1"
                              stroke="#10b981" 
                              fill="#10b981"
                              name="Horas Ativas"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="focus_time" 
                              stackId="1"
                              stroke="#f59e0b" 
                              fill="#f59e0b"
                              name="Tempo de Foco"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasks Completed */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tarefas Concluídas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={productivityChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => [value, 'Tarefas']} />
                            <Line 
                              type="monotone" 
                              dataKey="tasks_completed" 
                              stroke="#8b5cf6" 
                              strokeWidth={2}
                              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Collaboration Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Score de Colaboração</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={productivityChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Colaboração']} />
                            <Line 
                              type="monotone" 
                              dataKey="collaboration_score" 
                              stroke="#ec4899" 
                              strokeWidth={2}
                              dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="wellbeing" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Overall Wellbeing */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Geral de Bem-estar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={wellbeingChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Bem-estar']} />
                            <Area 
                              type="monotone" 
                              dataKey="overall_score" 
                              stroke="#10b981" 
                              fill="#10b981"
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stress vs Satisfaction */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Estresse vs Satisfação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={wellbeingChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="stress_level" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              name="Baixo Estresse"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="satisfaction_level" 
                              stroke="#22c55e" 
                              strokeWidth={2}
                              name="Satisfação"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work-Life Balance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Equilíbrio Vida-Trabalho</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={wellbeingChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Equilíbrio']} />
                            <Area 
                              type="monotone" 
                              dataKey="work_life_balance" 
                              stroke="#3b82f6" 
                              fill="#3b82f6"
                              fillOpacity={0.6}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Burnout Risk Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de Risco de Burnout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {wellbeingChartData.slice(-10).map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                            <span className="text-sm font-medium">{item.date}</span>
                            <Badge variant="outline" className={`${getBurnoutRiskColor(item.burnout_risk)} text-white`}>
                              {getBurnoutRiskText(item.burnout_risk)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <CardTitle>Insights e Recomendações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Performance Insights */}
                      <div>
                        <h3 className="font-semibold mb-3">📊 Análise de Performance</h3>
                        <div className="space-y-2">
                          {analytics.summary.avgProductivityScore >= 80 && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800">
                                ✅ Excelente performance! Produtividade consistentemente alta.
                              </p>
                            </div>
                          )}
                          {analytics.summary.avgProductivityScore < 60 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-yellow-800">
                                ⚠️ Performance abaixo do esperado. Considere revisar processos e carga de trabalho.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Wellbeing Insights */}
                      <div>
                        <h3 className="font-semibold mb-3">❤️ Análise de Bem-estar</h3>
                        <div className="space-y-2">
                          {analytics.summary.avgWellbeingScore >= 80 && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800">
                                ✅ Bem-estar excelente! Continue mantendo o equilíbrio.
                              </p>
                            </div>
                          )}
                          {analytics.summary.avgWellbeingScore < 60 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-800">
                                🚨 Atenção: Bem-estar baixo. Recomendamos conversa com RH ou gestão.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h3 className="font-semibold mb-3">💡 Recomendações</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Para Produtividade</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Estabeleça blocos de tempo focado</li>
                              <li>• Use técnicas de time blocking</li>
                              <li>• Minimize interrupções</li>
                            </ul>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Para Bem-estar</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Faça pausas regulares</li>
                              <li>• Pratique exercícios</li>
                              <li>• Mantenha horários definidos</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Nenhum dado disponível</h3>
                <p className="text-gray-600">
                  Comece a coletar dados para ver análises detalhadas aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}