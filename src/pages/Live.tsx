import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Users, Bell } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Live = () => {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reminders, setReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadClasses = async () => {
      setIsLoading(true);
      try {
        const data = await api.getLiveClasses();
        setLiveClasses(data);
      } catch (error) {
        console.error("Error loading live classes:", error);
        toast.error("Failed to load live classes");
      } finally {
        setIsLoading(false);
      }
    };
    loadClasses();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadClasses, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinSession = async (sessionId: string) => {
    try {
      await api.joinLiveSession(sessionId);
      toast.success("Successfully joined the live session!");
      
      // Update attendees count
      setLiveClasses(prev => prev.map(cls => 
        cls.id === sessionId 
          ? { ...cls, attendees: (cls.attendees || 0) + 1 }
          : cls
      ));
    } catch (error: any) {
      toast.error(error.message || "Failed to join session");
    }
  };

  const handleSetReminder = async (sessionId: string) => {
    try {
      await api.setLiveSessionReminder(sessionId);
      toast.success("Reminder set successfully!");
      setReminders(new Set([...reminders, sessionId]));
    } catch (error: any) {
      toast.error(error.message || "Failed to set reminder");
    }
  };

  const liveNow = liveClasses.filter((c) => c.status === "live");
  const upcoming = liveClasses.filter((c) => c.status === "upcoming");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Live Classes</h1>
          <p className="text-muted-foreground">Join ongoing sessions or check upcoming schedules.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : liveNow.length > 0 ? (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
              <h2 className="text-2xl font-bold">Live Now</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {liveNow.map((liveClass) => (
                <Card key={liveClass.id} className="shadow-medium border-destructive/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{liveClass.title}</CardTitle>
                        <CardDescription className="text-base">{liveClass.instructor}</CardDescription>
                      </div>
                      <Badge variant="destructive" className="animate-pulse">
                        🔴 Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{liveClass.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{liveClass.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{liveClass.attendees || 0} students watching</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full gap-2"
                      onClick={() => handleJoinSession(liveClass.id)}
                    >
                      <Video className="h-4 w-4" />
                      Join Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <h2 className="text-2xl font-bold mb-6">Upcoming Classes</h2>
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No upcoming live classes scheduled.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((liveClass) => {
                const hasReminder = reminders.has(liveClass.id);
                
                return (
                  <Card key={liveClass.id} className="shadow-soft hover:shadow-medium transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{liveClass.title}</CardTitle>
                          <CardDescription>{liveClass.instructor}</CardDescription>
                        </div>
                        <Badge variant="secondary">Upcoming</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{liveClass.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{liveClass.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{liveClass.attendees || 0} registered</span>
                        </div>
                      </div>
                      <Button 
                        variant={hasReminder ? "default" : "outline"} 
                        className="w-full gap-2"
                        onClick={() => handleSetReminder(liveClass.id)}
                      >
                        <Bell className="h-4 w-4" />
                        {hasReminder ? "Reminder Set" : "Set Reminder"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Live;
