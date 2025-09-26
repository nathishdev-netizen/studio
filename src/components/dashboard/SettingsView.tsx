"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ProfileForm } from '@/components/profile/profile-form';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import type { User } from '@/lib/types';

interface SettingsViewProps {
  onBack: () => void;
}

export function SettingsView({ onBack }: SettingsViewProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
          <ProfileForm user={user} />
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
