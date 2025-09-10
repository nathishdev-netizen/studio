import { MatchCard } from "@/components/matches/match-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { matches } from "@/lib/data";

export default function MatchesPage() {
  const pendingMatches = matches.filter((m) => m.status === "pending");
  const acceptedMatches = matches.filter((m) => m.status === "accepted");

  return (
    <div className="container mx-auto px-0">
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-2 md:w-96">
          <TabsTrigger value="pending">New Matches</TabsTrigger>
          <TabsTrigger value="accepted">Connections</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          {pendingMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pendingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-xl bg-card border">
                <p className="text-lg font-semibold text-muted-foreground">No new matches yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Keep chatting with your AI to discover more people!</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="accepted" className="mt-6">
          {acceptedMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {acceptedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-xl bg-card border">
                <p className="text-lg font-semibold text-muted-foreground">No connections yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Accept a match request to start chatting.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
