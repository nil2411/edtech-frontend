import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Video, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { currentTenant } = useTenant();
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!currentTenant) return;
      
      setIsLoading(true);
      try {
        const [coursesData, classesData, announcementsData, statsData] = await Promise.all([
          api.getCourses(currentTenant.id),
          api.getLiveClasses(),
          api.getAnnouncements(currentTenant.id),
          api.getStats(),
        ]);
        
        setCourses(coursesData.slice(0, 3));
        setLiveClasses(classesData.slice(0, 2));
        setAnnouncements(announcementsData);
        
        // Calculate completion rate from enrolled courses
        const enrolledCourses = coursesData.filter(c => c.progress > 0);
        const avgProgress = enrolledCourses.length > 0
          ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
          : 0;
        
        setStats([
          { label: "Active Courses", value: String(coursesData.length), icon: BookOpen, color: "text-primary" },
          { label: "Total Students", value: statsData.totalStudents.toLocaleString(), icon: Users, color: "text-accent" },
          { label: "Live Classes", value: String(statsData.activeLiveSessions), icon: Video, color: "text-success" },
          { label: "Completion Rate", value: `${avgProgress}%`, icon: TrendingUp, color: "text-warning" },
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentTenant]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-soft">
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat) => (
              <Card key={stat.label} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Link to="/courses">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {courses.length === 0 && !isLoading ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No courses available. Please contact your administrator.
                  </CardContent>
                </Card>
              ) : (
                courses.map((course) => (
                <Card key={course.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="shadow-soft">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{announcement.title}</CardTitle>
                      <Badge
                        variant={
                          announcement.priority === "high"
                            ? "destructive"
                            : announcement.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {announcement.priority}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{announcement.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Live Classes</h2>
            <Link to="/live">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {liveClasses.map((liveClass) => (
              <Card key={liveClass.id} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{liveClass.title}</h3>
                      <p className="text-sm text-muted-foreground">{liveClass.instructor}</p>
                    </div>
                    <Badge variant={liveClass.status === "live" ? "destructive" : "secondary"}>
                      {liveClass.status === "live" ? "🔴 Live" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {liveClass.date} • {liveClass.time}
                    </span>
                    <span className="text-muted-foreground">{liveClass.attendees} students</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
