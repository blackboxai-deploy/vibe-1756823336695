'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock data for demonstration
const productivityData = [
  { day: 'Mon', score: 85, focus: 6.5, meetings: 2.1 },
  { day: 'Tue', score: 92, focus: 7.2, meetings: 1.8 },
  { day: 'Wed', score: 78, focus: 5.8, meetings: 3.2 },
  { day: 'Thu', score: 88, focus: 6.8, meetings: 2.5 },
  { day: 'Fri', score: 95, focus: 7.5, meetings: 1.5 },
  { day: 'Sat', score: 45, focus: 2.1, meetings: 0.5 },
  { day: 'Sun', score: 30, focus: 1.2, meetings: 0.2 },
];

const wellbeingData = [
  { name: 'Excelente', value: 25, color: '#10B981' },
  { name: 'Bom', value: 45, color: '#3B82F6' },
  { name: 'Regular', value: 25, color: '#F59E0B' },
  { name: 'Ruim', value: 5, color: '#EF4444' },
];

const teamMetrics = [
  { name: 'Desenvolvimento', productivity: 89, wellbeing: 8.2, members: 8 },
  { name: 'Design', productivity: 92, wellbeing: 8.7, members: 4 },
  { name: 'Marketing', productivity: 76, wellbeing: 7.1, members: 6 },
  { name: 'Vendas', productivity: 84, wellbeing: 7.8, members: 5 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-slate-900">
                RemoteTeam Analytics
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/metrics" className="text-slate-600 hover:text-slate-900">
                  Métricas
                </Link>
                <Link href="/wellbeing" className="text-slate-600 hover:text-slate-900">
                  Bem-estar
                </Link>
                <Link href="/goals" className="text-slate-600 hover:text-slate-900">
                  Objetivos
                </Link>
                <Link href="/reports" className="text-slate-600 hover:text-slate-900">
                  Relatórios
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Olá, {user?.firstName}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo ao seu Dashboard
          </h1>
          <p className="text-slate-600">
            Aqui está um resumo da sua produtividade e bem-estar desta semana
          </p>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-700">
              💡 <strong>Insight da semana:</strong> Suas horas de foco aumentaram 15% comparado à semana anterior. Continue assim!
            </AlertDescription>
          </Alert>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Score de Produtividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">87%</div>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  +5%
                </Badge>
              </div>
              <Progress value={87} className="mt-3" />
              <p className="text-xs text-slate-600 mt-2">vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Bem-estar Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">8.2/10</div>
                <Badge variant="secondary" className="text-slate-700 bg-slate-100">
                  Estável
                </Badge>
              </div>
              <Progress value={82} className="mt-3" />
              <p className="text-xs text-slate-600 mt-2">Média da equipe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Horas de Foco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">32.5h</div>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  +15%
                </Badge>
              </div>
              <Progress value={65} className="mt-3" />
              <p className="text-xs text-slate-600 mt-2">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Reuniões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-600">12.5h</div>
                <Badge variant="secondary" className="text-red-700 bg-red-100">
                  25%
                </Badge>
              </div>
              <Progress value={25} className="mt-3" />
              <p className="text-xs text-slate-600 mt-2">Do tempo total</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="productivity" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="productivity">Produtividade</TabsTrigger>
            <TabsTrigger value="wellbeing">Bem-estar</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="productivity">
            <Card>
              <CardHeader>
                <CardTitle>Produtividade Semanal</CardTitle>
                <CardDescription>
                  Score de produtividade, horas de foco e tempo em reuniões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={productivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name="Score (%)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="focus" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Foco (h)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="meetings" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        name="Reuniões (h)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellbeing">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Bem-estar</CardTitle>
                <CardDescription>
                  Como a equipe está se sentindo nesta semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wellbeingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {wellbeingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Equipe</CardTitle>
                <CardDescription>
                  Comparação de produtividade e bem-estar entre equipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="productivity" fill="#3B82F6" name="Produtividade (%)" />
                      <Bar dataKey="wellbeing" fill="#10B981" name="Bem-estar (x10)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/wellbeing/checkin">
            <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span>Check-in de Bem-estar</span>
            </Button>
          </Link>

          <Link href="/goals/new">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
              <span>Criar Nova Meta</span>
            </Button>
          </Link>

          <Link href="/reports/weekly">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
              <span>Relatório Semanal</span>
            </Button>
          </Link>

          <Link href="/settings">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <div className="w-6 h-6 bg-slate-600 rounded-full"></div>
              <span>Configurações</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}