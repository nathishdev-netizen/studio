"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, X, MessageCircle } from 'lucide-react';
import type { User } from '@/lib/types';

interface ConnectionSuggestionProps {
  suggestion: {
    shouldSuggestConnection: boolean;
    matchedUserId?: string;
    matchedUser?: User;
    matchReason?: string;
    reason?: string;
    connectionType?: string;
    suggestionMessage?: string;
    message?: string;
  };
  onAccept: (userId: string) => void;
  onDecline: () => void;
  onViewProfile?: () => void;
}

export function ConnectionSuggestion({ suggestion, onAccept, onDecline, onViewProfile }: ConnectionSuggestionProps) {
  const [isVisible, setIsVisible] = useState(true);

  console.log('ConnectionSuggestion received:', suggestion);
  console.log('Should suggest:', suggestion.shouldSuggestConnection);
  console.log('Has matched user:', !!suggestion.matchedUser);
  console.log('Is visible:', isVisible);

  if (!suggestion.shouldSuggestConnection || !suggestion.matchedUser || !isVisible) {
    console.log('ConnectionSuggestion returning null');
    return null;
  }

  const { matchedUser, matchReason, reason, connectionType, suggestionMessage, message } = suggestion;

  const handleAccept = () => {
    onAccept(matchedUser.id);
    setIsVisible(false);
  };

  const handleDecline = () => {
    onDecline();
    setIsVisible(false);
  };

  const getConnectionIcon = () => {
    switch (connectionType) {
      case 'shared_challenge':
        return <Heart className="h-5 w-5 text-[#FF7F50]" />;
      case 'common_interest':
        return <Users className="h-5 w-5 text-[#C3ACCE]" />;
      default:
        return <MessageCircle className="h-5 w-5 text-[#FF7F50]" />;
    }
  };

  console.log('ConnectionSuggestion rendering card');
  
  return (
    <Card className="border-2 border-[#FF7F50] bg-white shadow-xl mb-4 relative z-10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <CardTitle className="text-lg text-[#FF7F50]">Connection Suggestion</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecline}
            className="h-8 w-8 p-0 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-sm">
          {suggestionMessage || message || "I found someone who might relate to your experience!"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={matchedUser.profilePic.imageUrl} 
              alt={matchedUser.name}
            />
            <AvatarFallback>{matchedUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="font-semibold text-gray-900">{matchedUser.name}</h4>
              <p className="text-sm text-gray-600">{matchedUser.age} years old</p>
            </div>
            
            <p className="text-sm text-gray-700">{matchReason || reason}</p>
            
            {matchedUser.interests && matchedUser.interests.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {matchedUser.interests.slice(0, 4).map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-[#C3ACCE]/20 text-[#C3ACCE] hover:bg-[#C3ACCE]/30"
                  >
                    {interest}
                  </Badge>
                ))}
                {matchedUser.interests.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{matchedUser.interests.length - 4} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <Button 
            onClick={() => onViewProfile && onViewProfile()}
            variant="outline"
            className="border-[#FF7F50] text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white"
          >
            View Profile
          </Button>
          <Button 
            onClick={() => onAccept(suggestion.matchedUserId || suggestion.matchedUser?.id || '')}
            className="bg-[#FF7F50] hover:bg-[#FF6B35] text-white"
          >
            Connect
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            Maybe Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
