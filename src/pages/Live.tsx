import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Users } from "lucide-react";
import { api } from "@/lib/api";

const Live = () => {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);

  useEffect(() => {
    const loadClasses = async () => {
      const data = await api.getLiveClasses();
      setLiveClasses(data);
    };
    loadClasses();
  }, []);

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

        {liveNow.length > 0 && (
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
                        <span>{liveClass.attendees} students watching</span>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <Video className="h-4 w-4" />
                      Join Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">Upcoming Classes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((liveClass) => (
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
                      <span>{liveClass.attendees} registered</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Live;
