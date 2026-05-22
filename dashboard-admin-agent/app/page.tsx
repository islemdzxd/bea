'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authenticateStaff } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authenticateStaff(matricule, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-[#001a52] p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Image
            src="/bank-logo.svg"
            alt="BEA"
            width={56}
            height={56}
            className="mx-auto mb-4 h-14 w-14 object-contain"
          />
          <h1 className="text-2xl font-bold text-foreground">
            Back-office BEA
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gestion des allocations touristiques et des demandes de crédit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Matricule</label>
            <Input
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="Votre matricule agent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          Connexion via la base <strong>bea-admin</strong> (PostgreSQL). Utilisez
          un matricule actif du tableau <code>users</code>.
        </p>
      </div>
    </div>
  );
}
