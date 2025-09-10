"use client";

import Image from 'next/image';
import type { Match } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, MessageSquare, X } from "lucide-react";

type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
  const { user, status, sharedInterests } = match;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl animate-in fade-in-50 zoom-in-95">
      <CardHeader className="p-0 relative">
        <Image
          src={user.profilePic.imageUrl}
          alt={`Profile picture of ${user.name}`}
          width={400}
          height={400}
          className="aspect-square object-cover w-full"
          data-ai-hint={user.profilePic.imageHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-lg font-bold">{user.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
          {user.profileSummary}
        </p>
        {sharedInterests.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">SHARED INTERESTS</h4>
            <div className="flex flex-wrap gap-1.5">
              {sharedInterests.map((interest) => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {status === "pending" && (
          <div className="w-full grid grid-cols-2 gap-2">
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
            <Button>
              <Check className="mr-2 h-4 w-4" />
              Accept
            </Button>
          </div>
        )}
        {status === "accepted" && (
          <Button className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
