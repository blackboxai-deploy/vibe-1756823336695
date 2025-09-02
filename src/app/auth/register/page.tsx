'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    companyId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            RemoteTeam Analytics
          </h1>
          <p className="text-slate-600">
            Crie sua conta e comece a monitorar seu time
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="new-company" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new-company">Nova Empresa</TabsTrigger>
                <TabsTrigger value="join-company">Entrar em Empresa</TabsTrigger>
              </TabsList>

              <TabsContent value="new-company">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="João"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Silva"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="joao@empresa.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Minha Empresa Ltda"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="join-company">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="João"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Silva"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="joao@empresa.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyId">ID da Empresa</Label>
                    <Input
                      id="companyId"
                      name="companyId"
                      placeholder="123"
                      value={formData.companyId}
                      onChange={handleChange}
                      required
                      className="bg-white"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Entrar na empresa'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Entrar
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link 
                href="/" 
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Voltar para home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}