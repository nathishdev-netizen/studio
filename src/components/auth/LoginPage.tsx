"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles, Users } from 'lucide-react';

export function LoginPage() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2D7D9] via-[#FFE5E7] to-[#E8D5F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#FF7F50] p-3 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PulseChat</h1>
          <p className="text-gray-600">Your AI companion for meaningful connections</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-[#FF7F50]" />
            <div>
              <h3 className="font-semibold text-gray-900">AI Companion</h3>
              <p className="text-sm text-gray-600">Chat with Nathish, your personal AI friend</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
            <Users className="h-6 w-6 text-[#C3ACCE]" />
            <div>
              <h3 className="font-semibold text-gray-900">Smart Matching</h3>
              <p className="text-sm text-gray-600">Connect with people who share your interests</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue your journey with PulseChat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-[#FF7F50] hover:bg-[#FF6B35] text-white font-semibold py-3 rounded-lg transition-colors"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
