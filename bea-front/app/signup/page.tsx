'use client';

import React, { useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

type RegisterResponse = {
  token: string;
  nom: string;
  prenom: string;
  cli: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.dateOfBirth
    ) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError('You must be at least 18 years old');
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL ?? 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
        }),
      });

      if (!response.ok) {
        let message = 'Account creation failed.';
        try {
          const text = await response.text();
          if (text.trim()) {
            message = text;
          }
        } catch {
          // Keep fallback message.
        }
        throw new Error(message);
      }

      const data = (await response.json()) as RegisterResponse;
      if (!data.token) {
        throw new Error('Authentication token was not returned by the server.');
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('bea_client_token', data.token);
      localStorage.setItem(
        'bea_client_profile',
        JSON.stringify({
          cli: data.cli,
          nom: data.nom,
          prenom: data.prenom,
          email: formData.email,
        })
      );
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
        })
      );

      globalThis.window.dispatchEvent(new Event('bea-auth-changed'));
      router.push('/dashboard');
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Account creation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
              <span className="text-2xl font-bold text-white">BA</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Banque Algérie</h1>
            <p className="text-muted-foreground">Create your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-3">
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="signup-first-name" className="text-sm font-medium text-foreground">First Name</label>
                <Input
                  id="signup-first-name"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-last-name" className="text-sm font-medium text-foreground">Last Name</label>
                <Input
                  id="signup-last-name"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</label>
              <Input
                id="signup-email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-phone" className="text-sm font-medium text-foreground">Phone</label>
              <Input
                id="signup-phone"
                type="tel"
                name="phone"
                placeholder="+213 555 123456"
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-date-of-birth" className="text-sm font-medium text-foreground">Date of Birth</label>
              <Input
                id="signup-date-of-birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-confirm-password" className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-blue-900 text-white font-semibold py-2 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
