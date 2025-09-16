
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          setError('Email o contraseña incorrectos');
        }
      } else {
        success = await register(email, password);
        if (!success) {
          setError('Error al registrar usuario. Verifica que el email no esté en uso y la contraseña tenga al menos 6 caracteres.');
        }
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Beautiful PurpOr gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-orange-400/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-300/15 via-transparent to-purple-700/15"></div>
      
      {/* Subtle abstract patterns */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/10 to-orange-300/10 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-l from-orange-400/10 to-purple-500/10 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-600/8 to-orange-400/8 blur-lg"></div>
      <div className="absolute bottom-1/3 right-1/3 w-36 h-36 rounded-full bg-gradient-to-l from-orange-300/8 to-purple-400/8 blur-xl"></div>

      {/* Login form card */}
      <div className="relative z-10 p-4 w-full max-w-md">
        <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-card/90 shadow-xl border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Ingresa a tu cuenta para ver tu malla curricular' 
                : 'Crea una cuenta para comenzar a crear tu malla curricular'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin 
                  ? '¿No tienes cuenta? Regístrate aquí' 
                  : '¿Ya tienes cuenta? Inicia sesión aquí'
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
