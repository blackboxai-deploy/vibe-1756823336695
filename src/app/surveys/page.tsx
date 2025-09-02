'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Header } from '@/components/layout/Header';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WellbeingSurvey {
  overall_score: number;
  stress_level: number;
  satisfaction_level: number;
  work_life_balance: number;
  energy_level: number;
  motivation_level: number;
  burnout_risk: 'low' | 'medium' | 'high';
  survey_responses: {
    workload_manageable: string;
    team_support: string;
    communication_quality: string;
    recognition_received: string;
    growth_opportunities: string;
    additional_comments: string;
  };
}

export default function SurveysPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [surveyData, setSurveyData] = useState<WellbeingSurvey>({
    overall_score: 75,
    stress_level: 30,
    satisfaction_level: 75,
    work_life_balance: 70,
    energy_level: 70,
    motivation_level: 75,
    burnout_risk: 'low',
    survey_responses: {
      workload_manageable: '',
      team_support: '',
      communication_quality: '',
      recognition_received: '',
      growth_opportunities: '',
      additional_comments: ''
    }
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  const calculateBurnoutRisk = (data: WellbeingSurvey): 'low' | 'medium' | 'high' => {
    const stressWeight = data.stress_level * 0.3;
    const satisfactionWeight = (100 - data.satisfaction_level) * 0.25;
    const workLifeWeight = (100 - data.work_life_balance) * 0.25;
    const energyWeight = (100 - data.energy_level) * 0.2;
    
    const riskScore = stressWeight + satisfactionWeight + workLifeWeight + energyWeight;
    
    if (riskScore > 60) return 'high';
    if (riskScore > 35) return 'medium';
    return 'low';
  };

  const calculateOverallScore = (data: WellbeingSurvey): number => {
    const stressScore = 100 - data.stress_level;
    return Math.round((stressScore + data.satisfaction_level + data.work_life_balance + data.energy_level + data.motivation_level) / 5);
  };

  const handleSliderChange = (field: keyof WellbeingSurvey, value: number[]) => {
    const newData = {
      ...surveyData,
      [field]: value[0]
    };
    
    newData.overall_score = calculateOverallScore(newData);
    newData.burnout_risk = calculateBurnoutRisk(newData);
    
    setSurveyData(newData);
  };

  const handleResponseChange = (field: string, value: string) => {
    setSurveyData(prev => ({
      ...prev,
      survey_responses: {
        ...prev.survey_responses,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/analytics/wellbeing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao enviar pesquisa');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setSubmitting(false);
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-medium mb-2">Pesquisa Enviada!</h3>
                <p className="text-gray-600">
                  Obrigado por compartilhar seu feedback. Redirecionando...
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getBurnoutRiskText = (risk: string) => {
    switch (risk) {
      case 'high': return 'Alto Risco de Burnout';
      case 'medium': return 'Risco Moderado de Burnout';
      default: return 'Baixo Risco de Burnout';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pesquisa de Bem-estar Semanal
            </h1>
            <p className="text-gray-600">
              Compartilhe como você está se sentindo para ajudarmos a manter um ambiente de trabalho saudável.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Burnout Risk Indicator */}
          <Card className={`mb-6 border-2 ${getBurnoutRiskColor(surveyData.burnout_risk)}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{getBurnoutRiskText(surveyData.burnout_risk)}</h3>
                  <p className="text-sm opacity-75">
                    Score geral: {surveyData.overall_score}%
                  </p>
                </div>
                <div className="text-2xl">
                  {surveyData.burnout_risk === 'high' ? '🔴' : 
                   surveyData.burnout_risk === 'medium' ? '🟡' : '🟢'}
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Well-being Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Como você se sente esta semana?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Nível de Estresse: {surveyData.stress_level}%
                  </Label>
                  <Slider
                    value={[surveyData.stress_level]}
                    onValueChange={(value) => handleSliderChange('stress_level', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Muito baixo</span>
                    <span>Muito alto</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Satisfação no Trabalho: {surveyData.satisfaction_level}%
                  </Label>
                  <Slider
                    value={[surveyData.satisfaction_level]}
                    onValueChange={(value) => handleSliderChange('satisfaction_level', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Muito insatisfeito</span>
                    <span>Muito satisfeito</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Equilíbrio Vida-Trabalho: {surveyData.work_life_balance}%
                  </Label>
                  <Slider
                    value={[surveyData.work_life_balance]}
                    onValueChange={(value) => handleSliderChange('work_life_balance', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Muito desequilibrado</span>
                    <span>Muito equilibrado</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Nível de Energia: {surveyData.energy_level}%
                  </Label>
                  <Slider
                    value={[surveyData.energy_level]}
                    onValueChange={(value) => handleSliderChange('energy_level', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Muito baixa</span>
                    <span>Muito alta</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Motivação: {surveyData.motivation_level}%
                  </Label>
                  <Slider
                    value={[surveyData.motivation_level]}
                    onValueChange={(value) => handleSliderChange('motivation_level', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Muito desmotivado</span>
                    <span>Muito motivado</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Sua carga de trabalho é gerenciável?
                  </Label>
                  <RadioGroup
                    value={surveyData.survey_responses.workload_manageable}
                    onValueChange={(value) => handleResponseChange('workload_manageable', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="workload-sim" />
                      <Label htmlFor="workload-sim">Sim, totalmente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parcialmente" id="workload-parcial" />
                      <Label htmlFor="workload-parcial">Parcialmente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="workload-nao" />
                      <Label htmlFor="workload-nao">Não, está excessiva</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Como está o suporte da sua equipe?
                  </Label>
                  <RadioGroup
                    value={surveyData.survey_responses.team_support}
                    onValueChange={(value) => handleResponseChange('team_support', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excelente" id="support-excelente" />
                      <Label htmlFor="support-excelente">Excelente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bom" id="support-bom" />
                      <Label htmlFor="support-bom">Bom</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="support-regular" />
                      <Label htmlFor="support-regular">Regular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ruim" id="support-ruim" />
                      <Label htmlFor="support-ruim">Precisa melhorar</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar Pesquisa'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}