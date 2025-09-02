'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                RemoteTeam Analytics
              </h1>
              <p className="text-slate-600">
                Dashboard de produtividade e bem-estar para times remotos
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg">
                  Acessar Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="lg">
                  Meu Perfil
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Produtividade</CardTitle>
                  <Badge variant="secondary">Ativo</Badge>
                </div>
                <CardDescription>
                  Métricas de produtividade em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <p className="text-sm text-slate-600">Score médio da semana</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Bem-estar</CardTitle>
                  <Badge variant="secondary">Monitorado</Badge>
                </div>
                <CardDescription>
                  Indicadores de bem-estar da equipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">7.8/10</div>
                <p className="text-sm text-slate-600">Satisfação geral</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Colaboração</CardTitle>
                  <Badge variant="secondary">Otimizada</Badge>
                </div>
                <CardDescription>
                  Score de colaboração da equipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
                <p className="text-sm text-slate-600">Engajamento do time</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Acesso Rápido
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/metrics" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <div className="w-6 h-6 bg-blue-600 rounded"></div>
                      </div>
                      <h3 className="font-semibold text-slate-900">Métricas</h3>
                      <p className="text-sm text-slate-600 mt-1">Ver produtividade</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/wellbeing" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <div className="w-6 h-6 bg-green-600 rounded"></div>
                      </div>
                      <h3 className="font-semibold text-slate-900">Bem-estar</h3>
                      <p className="text-sm text-slate-600 mt-1">Check-in diário</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/goals" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <div className="w-6 h-6 bg-purple-600 rounded"></div>
                      </div>
                      <h3 className="font-semibold text-slate-900">Objetivos</h3>
                      <p className="text-sm text-slate-600 mt-1">Metas e OKRs</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/reports" className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <div className="w-6 h-6 bg-orange-600 rounded"></div>
                      </div>
                      <h3 className="font-semibold text-slate-900">Relatórios</h3>
                      <p className="text-sm text-slate-600 mt-1">Análises detalhadas</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            RemoteTeam Analytics
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Dashboard inteligente que mede produtividade e bem-estar de times remotos 
            sem microgerenciamento
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="px-8">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">📊 Métricas Inteligentes</CardTitle>
              <CardDescription>
                Tracking automático de tempo e atividades não invasivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Produtividade por equipe</li>
                <li>• Análise de tempo de foco</li>
                <li>• Score de colaboração</li>
                <li>• Meeting overhead analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">💚 Bem-estar</CardTitle>
              <CardDescription>
                Surveys semanais automatizados e alertas preventivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Check-ins de bem-estar</li>
                <li>• Detecção de burnout</li>
                <li>• Alertas preventivos</li>
                <li>• Work-life balance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">🎯 Objetivos & OKRs</CardTitle>
              <CardDescription>
                Sistema integrado de metas com sugestões de otimização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Definição de OKRs</li>
                <li>• Tracking automático</li>
                <li>• Sugestões de otimização</li>
                <li>• Benchmarks da indústria</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Transforme a gestão do seu time remoto com insights baseados em dados
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="px-8">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}