"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiChatMessage } from "@/lib/types";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { useRouter } from "next/navigation";
import { getSuggestionsForText } from "@/lib/fictional-user";

export function AiChatView({ initialView = 'chat' }: { initialView?: 'chat' | 'matches' | 'profile' | 'settings' }) {
  // Mock user for now - replace with actual auth later
  const user = { 
    name: "User", 
    id: "1",
    profilePic: { imageUrl: "/api/placeholder/150/150", imageHint: "User" }
  };
  const signOut = () => {};
  const [messages, setMessages] = useState<AiChatMessage[]>(() => {
    // Persist messages in sessionStorage to prevent loss on navigation
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('ai-chat-messages');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [connectionSuggestion, setConnectionSuggestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'user'>('ai');
  const [connectedUser, setConnectedUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'matches' | 'profile' | 'settings'>(initialView);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSuggestion, setPendingSuggestion] = useState<any>(null);
  const [maybeConnections, setMaybeConnections] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('maybeConnections');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [interestedConnections, setInterestedConnections] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('interestedConnections');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState<'new' | 'connections'>('new');
  const [conversationStarters, setConversationStarters] = useState<string[]>([
    "How has your day been treating you?",
    "What's something that made you smile recently?",
    "Tell me about something you're excited about lately."
  ]);

  // Save messages to sessionStorage whenever messages change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save connections to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('maybeConnections', JSON.stringify(maybeConnections));
    }
  }, [maybeConnections]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('interestedConnections', JSON.stringify(interestedConnections));
    }
  }, [interestedConnections]);

  // AI Companion info
  const aiCompanion = {
    name: "Nathish",
    profilePic: {
      imageUrl: "/api/placeholder/150/150",
      imageHint: "Nathish - Your AI Companion"
    }
  };

  // Ensure suggested user objects always have name/age/profilePic defaults
  const ensureProfileData = (u: any) => {
    if (!u) return u;
    const ensuredProfilePic = u.profilePic?.imageUrl
      ? u.profilePic
      : { imageUrl: "/api/placeholder/150/150", imageHint: u.name || "Suggested Match", description: "Profile picture" };
    const ensuredName = u.name || u.profileSummary || 'Suggested Match';
    const ensuredAge = typeof u.age === 'number' ? u.age : 28;
    return { ...u, name: ensuredName, age: ensuredAge, profilePic: ensuredProfilePic };
  };

  // Initial conversation starters - could be personalized via API call later

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: AiChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Call the API route for AI response (keep LLM active)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          user: user,
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();

      // Dynamic suggestions from our fictional users library
      let suggestion = null as any;
      let shouldSuggestConnection = false;
      const suggestions = getSuggestionsForText(currentInput, 1);
      if (suggestions && suggestions.length > 0) {
        const s = suggestions[0];
        const ensuredProfilePic = s.user.profilePic?.imageUrl
          ? s.user.profilePic
          : { imageUrl: "/api/placeholder/150/150", imageHint: s.user.name || "Suggested Match", description: "Profile picture" };
        const ensuredName = s.user.name || s.user.profileSummary || 'Suggested Match';
        const ensuredAge = typeof s.user.age === 'number' ? s.user.age : 28;
        shouldSuggestConnection = true;
        suggestion = {
          shouldSuggestConnection: true,
          matchedUserId: s.user.id,
          matchedUser: { ...s.user, name: ensuredName, age: ensuredAge, profilePic: ensuredProfilePic, compatibility: s.compatibility, reason: s.reason },
          reason: s.reason,
          message: 'I found someone you might vibe with!'
        };
      }

      const aiMessage: AiChatMessage = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle conversation starters if provided
      if (result.conversationStarters) {
        setConversationStarters(result.conversationStarters);
      }

      // If we detected trigger words, show connection suggestion in chat
      if (shouldSuggestConnection && suggestion) {
        setTimeout(() => {
          handleConnectionSuggestionInChat(suggestion);
        }, 1000);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: AiChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartConversation = (starter: string) => {
    setInput(starter);
  };

  const readyToSendMessages = [
    "Hey there! 👋 How's your day going so far?",
    "What's something that made you smile recently?",
    "I'm curious - what's your favorite way to unwind after a long day?",
    "Tell me about something you're excited about lately!",
    "What's been the highlight of your week?",
    "I'd love to know - what hobby or interest are you most passionate about?",
    "How do you like to spend your free time?",
    "What's something new you've learned or tried recently?"
  ];

  const handleGeneratePrompt = () => {
    const randomMessage = readyToSendMessages[Math.floor(Math.random() * readyToSendMessages.length)];
    setInput(randomMessage);
  };

  const handleConnectionSuggestionInChat = (suggestion: any) => {
    // Add AI message asking about connection
    const aiMessage: AiChatMessage = {
      id: Date.now().toString(),
      text: `I found someone who might relate to your experience! Would you like me to show you their profile?`,
      sender: 'ai',
      timestamp: new Date(),
      hasConnectionQuestion: true,
      suggestionData: suggestion
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleViewProfile = (suggestionData?: any) => {
    if (suggestionData) {
      const normalized = suggestionData.matchedUser ? suggestionData.matchedUser : suggestionData;
      setConnectionSuggestion({ matchedUser: normalized });
    }
    setCurrentView('profile');
  };

  const handleConnectionAccept = (userId: string) => {
    console.log('Connecting with user:', userId);
    const matchedUser = connectionSuggestion?.matchedUser;
    if (matchedUser) {
      setConnectedUser(matchedUser);
      setChatMode('user');
      setCurrentView('chat');
      setMessages([{
        id: Date.now().toString(),
        text: `You're now connected with ${matchedUser.name}! Say hello! 👋`,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
    setConnectionSuggestion(null);
  };

  const handleConnectionDecline = () => {
    setConnectionSuggestion(null);
  };

  const handleShowConnectionSuggestion = (suggestionData: any, messageId: string) => {
    // Remove the question buttons and show popup
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, hasConnectionQuestion: false }
        : msg
    ));
    // Show connection suggestion popup
    const normalized = suggestionData?.matchedUser ? suggestionData.matchedUser : suggestionData;
    setConnectionSuggestion({ matchedUser: normalized });
  };

  const handleDeclineConnectionQuestion = (messageId: string) => {
    // Remove the question buttons
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, hasConnectionQuestion: false }
        : msg
    ));
  };

  const handleConnectionMaybeLater = (suggestionData: any) => {
    console.log('Adding to maybeConnections:', suggestionData);
    // Wrap suggestionData in matchedUser structure to match expected format
    const wrappedData = { matchedUser: suggestionData };
    setMaybeConnections(prev => {
      const updated = [...prev, wrappedData];
      console.log('Updated maybeConnections:', updated);
      return updated;
    });
    // Close the popup
    setConnectionSuggestion(null);
    // Remove the suggestion buttons by updating the message
    setMessages(prev => prev.map(msg => 
      msg.hasConnectionSuggestion && msg.suggestionData === suggestionData 
        ? { ...msg, hasConnectionSuggestion: false }
        : msg
    ));
    // Navigate to Matches -> New tab
    setActiveTab('new');
    setCurrentView('matches');
  };

  const handleConnectionInterested = (suggestionData: any) => {
    // Wrap suggestionData in matchedUser structure to match expected format
    const wrappedData = { matchedUser: suggestionData };
    setInterestedConnections(prev => [...prev, wrappedData]);
    // Remove the suggestion buttons by updating the message
    setMessages(prev => prev.map(msg => 
      msg.hasConnectionSuggestion && msg.suggestionData === suggestionData 
        ? { ...msg, hasConnectionSuggestion: false }
        : msg
    ));
  };

  if (!user) return null;

  // Show matches view
  if (currentView === 'matches') {
    
    // Debug logging
    console.log('Current maybeConnections:', maybeConnections);
    console.log('Current interestedConnections:', interestedConnections);
    console.log('Current view:', currentView);
    console.log('Active tab:', activeTab);
    
    // Extract profiles from maybeConnections
    const maybeProfiles = maybeConnections.map(conn => {
      console.log('Processing connection:', conn);
      if (conn.matchedUser) {
        console.log('Extracted matchedUser:', conn.matchedUser);
        return conn.matchedUser;
      }
      return conn;
    });
    
    console.log('Processed maybeProfiles:', maybeProfiles);
    
    // Build dynamic matches from recent chat context
    const recentText = messages.slice(-6).map(m => m.text).join(' ');
    const suggested = getSuggestionsForText(recentText, 4)
      .map(s => ({
        ...s.user,
        compatibility: s.compatibility,
        reason: s.reason,
        status: 'new',
        lastActive: 'Active now',
        distance: 'nearby'
      }));

    // Avoid duplicates between maybeProfiles and suggestions by id
    const seen = new Set(maybeProfiles.map((p: any) => p.id));
    const uniqueSuggestions = suggested.filter(u => !seen.has(u.id));

    const newMatches = [
      ...maybeProfiles, // "Maybe Later" profiles go to New Matches
      ...uniqueSuggestions
    ];

    const connections = [
      ...interestedConnections.map(conn => ({
        ...(conn.matchedUser || conn),
        status: 'connected',
        lastActive: '1 hour ago',
        distance: 'nearby'
      }))
    ];

    const currentMatches = activeTab === 'new' ? newMatches : connections;
    
    console.log('Final newMatches array:', newMatches);
    console.log('Final connections array:', connections);
    console.log('Current matches being displayed:', currentMatches);

    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-pink-50">

        <div className="flex-1 overflow-y-auto p-4">
          {/* Header with Tabs */}
          <div className="mb-6">
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">Matches</h2> */}
            
            {/* Tab Navigation */}
            <div className="flex bg-white rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('new')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'new'
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                New Matches ({newMatches.length})
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === 'connections'
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Connections ({connections.length})
              </button>
            </div>
          </div>

          {currentMatches.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{activeTab === 'new' ? '💫' : '💬'}</span>
              </div>
              <p className="text-gray-500 text-lg">
                {activeTab === 'new' ? 'No new matches yet' : 'No connections yet'}
              </p>
              <p className="text-gray-400 text-sm">
                {activeTab === 'new' 
                  ? 'Keep chatting with your AI companion to find connections!' 
                  : 'Connect with people from your matches to start conversations!'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMatches.map((match: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    const normalized = ensureProfileData(match);
                    setConnectionSuggestion({ matchedUser: normalized });
                    setCurrentView('profile');
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Profile Image */}
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                      <img 
                        src={match.profilePic?.imageUrl || "/api/placeholder/150/150"} 
                        alt={match.profilePic?.imageHint || match.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient avatar if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.className = "w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center flex-shrink-0 shadow-lg";
                            parent.innerHTML = `<span class="text-xl font-bold text-orange-600">${match.name.charAt(0)}</span>`;
                          }
                        }}
                      />
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{match.name}</h3>
                          <p className="text-sm text-gray-600">{match.age} years old • {match.distance}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-lg font-bold text-orange-600">{match.compatibility}%</span>
                            <span className="text-xs text-gray-500">match</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${match.lastActive === 'Active now' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                            <span className="text-xs text-gray-500">{match.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      {/* Compatibility Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-pink-400 h-2 rounded-full" 
                          style={{width: `${match.compatibility}%`}}
                        ></div>
                      </div>

                      {/* Connection Reason */}
                      <p className="text-sm text-gray-700 mb-3">{match.reason}</p>

                      {/* Interests */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {match.interests?.map((interest: string, idx: number) => (
                          <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                            {interest}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            const normalized = ensureProfileData(match);
                            setConnectionSuggestion({ matchedUser: normalized });
                            setCurrentView('profile');
                          }}
                          className="flex-1 h-10 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold rounded-xl text-sm"
                        >
                          View Profile
                        </Button>
                        {activeTab === 'new' ? (
                          <Button
                            variant="outline"
                            onClick={() => handleConnectionAccept(match)}
                            className="flex-1 h-10 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600 font-semibold rounded-xl text-sm"
                          >
                            Connect
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => {/* Handle message action */}}
                            className="flex-1 h-10 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 text-green-600 font-semibold rounded-xl text-sm"
                          >
                            Message
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* <Button 
            onClick={() => setCurrentView('chat')} 
            className="w-full mt-6 h-12 bg-white border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600 font-semibold rounded-xl"
          >
            Back to Chat
          </Button> */}
        </div>
        {/* <AppFooter /> */}
      </div>
    );
  }

  // Show profile view
  if (currentView === 'profile' && connectionSuggestion?.matchedUser) {
    const profile = connectionSuggestion.matchedUser;
    const aboutText = profile?.preferences?.description || profile?.reason || "A thoughtful person who values meaningful conversations and shared experiences.";
    const interestsList: string[] = (profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0)
      ? profile.interests
      : (profile?.preferences?.interests || ["Reading", "Music", "Outdoors"]);
    const traitsList: string[] = (profile?.personalityTraits && Array.isArray(profile.personalityTraits) && profile.personalityTraits.length > 0)
      ? profile.personalityTraits
      : ["Kind", "Curious", "Supportive"];
    const lookingForText: string = profile?.relationshipGoals || "Meaningful connection";
    const hobbiesList: string[] = (profile?.preferences?.hobbies && Array.isArray(profile.preferences.hobbies) && profile.preferences.hobbies.length > 0)
      ? profile.preferences.hobbies
      : [];
    const likesDislikes: string | undefined = profile?.preferences?.likesDislikes;
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-4">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mb-4 shadow-xl bg-gradient-to-br from-orange-200 to-pink-200">
                {profile?.profilePic?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profilePic.imageUrl}
                    alt={profile.profilePic.imageHint || profile.name || 'Profile picture'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = "w-32 h-32 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center mb-4 shadow-xl";
                        parent.innerHTML = `<span class='text-4xl font-bold text-orange-600'>${(profile.name || 'U').charAt(0)}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-4xl font-bold text-orange-600">{profile.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name || 'Suggested Match'}</h1>
              <p className="text-gray-600 mb-2">{profile.age ? `${profile.age} years old` : '—'}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Active now</span>
              </div>
            </div>

            {/* Match Compatibility */}
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">Compatibility Score</span>
                <span className="text-2xl font-bold text-orange-600">{profile.compatibility ?? 94}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-3 mb-2">
                <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-3 rounded-full" style={{width: `${profile.compatibility ?? 94}%`}}></div>
              </div>
              <p className="text-sm text-gray-600">{profile.reason || 'You both share similar interests and values!'}</p>
            </div>

            {/* About Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{aboutText}</p>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interestsList.map((interest: string, index: number) => (
                  <span key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Personality Traits */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personality</h3>
              <div className="flex flex-wrap gap-2">
                {traitsList.map((trait: string, index: number) => (
                  <span key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Relationship Goals */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Looking For</h3>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-3">{lookingForText}</p>
            </div>

            {/* Optional: Hobbies & Likes/Dislikes if available */}
            {(hobbiesList.length > 0 || likesDislikes) && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hobbiesList.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Hobbies</h4>
                    <div className="flex flex-wrap gap-2">
                      {hobbiesList.map((hobby: string, idx: number) => (
                        <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {likesDislikes && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Likes & Dislikes</h4>
                    <p className="text-sm text-gray-700">{likesDislikes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Shared Interests Highlight */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">What You Have in Common</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{interestsList[0] || 'Fitness'}</span>
                {interestsList[1] && (
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{interestsList[1]}</span>
                )}
                {traitsList[0] && (
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{traitsList[0]}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <Button
              onClick={() => handleConnectionAccept(profile)}
              className="w-full h-14 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Connect & Start Chatting
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleConnectionMaybeLater(profile)}
                className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl"
              >
                Maybe Later
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentView('chat')}
                className="flex-1 h-12 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600 font-semibold rounded-xl"
              >
                Back to Chat
              </Button>
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <AppHeader />
        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">Profile View</h2>
          <p>Profile details would go here</p>
          <Button onClick={() => setCurrentView('chat')} className="mt-4">
            Back to Chat
          </Button>
        </div>
        <AppFooter />
      </div>
    );
  }

  // Show settings view
  if (currentView === 'settings') {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <AppHeader />
        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <p>Settings would go here</p>
          <Button onClick={() => setCurrentView('chat')} className="mt-4">
            Back to Chat
          </Button>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <AppHeader />
    

    {/* Chat Container with curved layout */}
    <div className="flex-1 mx-4 mb-4 mt-2 bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-4 overflow-y-auto">
          <div className="space-y-4 py-4">
          {/* Conversation Starters - Show when no messages */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-600 text-sm mb-6">Choose a conversation starter or type your own message</p>
              </div>
              <div className="space-y-3 w-full max-w-sm mx-auto">
                {conversationStarters.map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-center h-auto py-3 px-4 text-sm text-gray-700 hover:bg-orange-50 hover:border-orange-200 whitespace-normal leading-relaxed"
                    onClick={() => handleStartConversation(starter)}
                  >
                    <span className="block text-center">{starter}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div
                className={cn(
                  "flex items-start space-x-3",
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                )}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage 
                    src={message.sender === "user" ? user.profilePic.imageUrl : aiCompanion.profilePic.imageUrl} 
                    alt={message.sender === "user" ? user.name : aiCompanion.name} 
                  />
                  <AvatarFallback className="text-xs">
                    {message.sender === "user" ? user.name.charAt(0) : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                    message.sender === "user"
                      ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  {message.text}
                </div>
              </div>
              
              {/* Connection Question - Yes/No options */}
              {message.hasConnectionQuestion && message.suggestionData && (
                <div className="ml-11 max-w-[75%]">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleShowConnectionSuggestion(message.suggestionData, message.id)}
                      className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
                    >
                      Yes, show me
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclineConnectionQuestion(message.id)}
                      className="hover:bg-gray-50"
                    >
                      Not now
                    </Button>
                  </div>
                </div>
              )}

            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={aiCompanion.profilePic.imageUrl} alt={aiCompanion.name} />
                <AvatarFallback className="text-xs">AI</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-900">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="relative">
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Type your message here..."
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSend()}
            className="w-full rounded-full border-gray-200 bg-gray-50 focus:bg-white pr-20 pl-12"
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGeneratePrompt}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white p-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <AppFooter />

    {/* Connection Suggestion Popup */}
    {connectionSuggestion && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/20 transform transition-all duration-300 scale-100">
          {/* Profile Section - Centered */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl font-bold text-orange-600">{connectionSuggestion.matchedUser?.name?.charAt(0)}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{connectionSuggestion.matchedUser?.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{connectionSuggestion.matchedUser?.age} years old</p>
            <p className="text-gray-700 text-sm leading-relaxed">{connectionSuggestion.matchedUser?.reason}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => handleConnectionAccept(connectionSuggestion.matchedUser)}
              className="w-full h-12 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
               Connect & Message
            </Button>
            <Button
              variant="outline"
              onClick={() => handleViewProfile(connectionSuggestion.matchedUser)}
              className="w-full h-12 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600 font-semibold rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              View Profile
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleConnectionMaybeLater(connectionSuggestion.matchedUser)}
                className="flex-1 h-11 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-medium rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
              >
                 Maybe Later
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConnectionSuggestion(null)}
                className="flex-1 h-11 text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-medium rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
