"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Settings, Edit } from 'lucide-react';
import { ProfileForm } from '@/components/profile/profile-form';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import type { User } from '@/lib/types';

interface ProfileViewProps {
  user: User;
  onBack: () => void;
  onConnect: () => void;
  isOwnProfile?: boolean;
}

export function ProfileView({ user, onBack, onConnect, isOwnProfile = false }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  // If editing own profile, show the existing ProfileForm
  if (isOwnProfile && isEditing) {
    return (
      <div className="flex flex-col h-screen">
        <AppHeader />
        
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Profile</span>
              </Button>
            </div>
            <ProfileForm user={user} />
          </div>
        </div>
        
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />

      {/* Profile Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back Button and Edit */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            {isOwnProfile && (
              <Button variant="ghost" onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Profile Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profilePic.imageUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-lg">{user.age} years old</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* About */}
          {user.preferences?.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{user.preferences.description}</p>
            </div>
          )}

          {/* Relationship Goals */}
          {user.relationshipGoals && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Looking For</h3>
              <Badge variant="secondary" className="bg-[#FF7F50]/10 text-[#FF7F50]">
                {user.relationshipGoals}
              </Badge>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-[#C3ACCE]/20 text-[#C3ACCE] hover:bg-[#C3ACCE]/30"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Personality Traits */}
          {user.personalityTraits && user.personalityTraits.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Personality</h3>
              <div className="flex flex-wrap gap-2">
                {user.personalityTraits.map((trait, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-[#FF7F50] text-[#FF7F50]"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {user.preferences?.hobbies && user.preferences.hobbies.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {user.preferences.hobbies.map((hobby, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                  >
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Connect Button */}
          <div className="pt-4">
            <Button 
              onClick={onConnect}
              className="w-full bg-[#FF7F50] hover:bg-[#FF6B35] text-white flex items-center justify-center space-x-2"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Start Conversation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
