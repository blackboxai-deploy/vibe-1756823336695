'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Team {
  id: number;
  name: string;
  memberCount: number;
  avgProductivityScore: number;
}

interface TeamPerformanceProps {
  teams: Team[];
}

export function TeamPerformance({ teams }: TeamPerformanceProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance das Equipes</CardTitle>
      </CardHeader>
      <CardContent>
        {teams.length > 0 ? (
          <div className="space-y-6">
            {teams.map((team) => (
              <div key={team.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{team.name}</h3>
                    <p className="text-sm text-gray-600">
                      {team.memberCount} membro{team.memberCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <Badge variant={getScoreVariant(team.avgProductivityScore)}>
                    {team.avgProductivityScore.toFixed(1)}% produtividade
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Produtividade da Equipe</span>
                    <span className={getScoreColor(team.avgProductivityScore)}>
                      {team.avgProductivityScore.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={team.avgProductivityScore} 
                    className="h-2" 
                  />
                </div>

                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <span>
                    {team.avgProductivityScore >= 80 ? '🟢 Excelente' :
                     team.avgProductivityScore >= 60 ? '🟡 Boa' : '🔴 Precisa melhorar'}
                  </span>
                  <span>
                    Meta: 75%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">Nenhuma equipe encontrada</p>
              <p className="text-sm">Crie equipes para ver a performance aqui</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}