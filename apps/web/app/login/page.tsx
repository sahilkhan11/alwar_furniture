'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../lib/store';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../../lib/firebase';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone Auth state
  const [phone, setPhone] = useState('+91'); // Default to India prefix
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Initialize Recaptcha when component mounts
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setAuth(data.token, data.user);
        router.push(data.user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setShowOtpInput(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Check phone format.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setLoading(true);
    setError('');
    try {
      // 1. Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      // 2. Exchange Firebase token for our backend JWT
      const res = await fetch('http://localhost:5000/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (res.ok) {
        setAuth(data.token, data.user);
        router.push(data.user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        setError(data.error || 'Backend verification failed');
      }
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif font-bold text-brand-dark mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Alwar Furniture account.</p>
        </div>

        <div className="flex mb-6 border-b">
          <button 
            className={`flex-1 py-2 font-medium ${loginMethod === 'phone' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}
            onClick={() => { setLoginMethod('phone'); setShowOtpInput(false); setError(''); }}
          >
            Phone & OTP
          </button>
          <button 
            className={`flex-1 py-2 font-medium ${loginMethod === 'email' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}
            onClick={() => { setLoginMethod('email'); setError(''); }}
          >
            Email
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}

        {loginMethod === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <Input 
              label="Email Address"
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <div>
            <div id="recaptcha-container"></div>
            {!showOtpInput ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <Input 
                  label="Phone Number"
                  type="tel" 
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Button type="submit" fullWidth size="lg" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <p className="text-sm text-gray-600">Enter the 6-digit code sent to {phone}</p>
                <Input 
                  label="OTP Code"
                  type="text" 
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <Button type="submit" fullWidth size="lg" disabled={loading || otp.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </Button>
                <button 
                  type="button" 
                  className="w-full text-center text-sm text-brand-primary hover:underline mt-2"
                  onClick={() => setShowOtpInput(false)}
                >
                  Change phone number
                </button>
              </form>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-primary hover:underline font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
