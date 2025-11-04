import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users } from "lucide-react";
import { api } from "@/lib/api";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Courses = () => {
  const { currentTenant } = useTenant();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (!currentTenant) return;
      
      setIsLoading(true);
      try {
        const data = await api.getCourses(currentTenant.id);
        
        // Load progress for each course
        const coursesWithProgress = await Promise.all(
          data.map(async (course: any) => {
            const progressData = await api.getCourseProgress(course.id);
            return {
              ...course,
              progress: progressData.progress,
              enrolled: progressData.enrolled,
            };
          })
        );
        
        setCourses(coursesWithProgress);
        setEnrolledCourses(new Set(coursesWithProgress.filter(c => c.enrolled).map(c => c.id)));
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    loadCourses();
  }, [currentTenant]);

  const handleEnroll = async (courseId: string) => {
    if (!currentTenant) return;
    
    try {
      await api.enrollInCourse(courseId, currentTenant.id);
      toast.success("Successfully enrolled in course!");
      setEnrolledCourses(new Set([...enrolledCourses, courseId]));
      
      // Update course progress
      const course = courses.find(c => c.id === courseId);
      if (course) {
        course.enrolled = true;
        course.progress = 0;
        setCourses([...courses]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in course");
    }
  };

  const handleContinueLearning = async (courseId: string) => {
    if (!currentTenant) return;
    
    try {
      // Simulate progress update (in real app, this would be based on actual learning)
      const course = courses.find(c => c.id === courseId);
      if (!course) return;
      
      const newProgress = Math.min(100, course.progress + 10);
      await api.updateCourseProgress(courseId, newProgress);
      
      course.progress = newProgress;
      setCourses([...courses]);
      toast.success("Progress updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update progress");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">Track your learning progress across all courses.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="shadow-soft">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : courses.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center text-muted-foreground">
                No courses available for this tenant.
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => {
              const isEnrolled = enrolledCourses.has(course.id) || course.enrolled;
              
              return (
                <Card key={course.id} className="shadow-soft hover:shadow-medium transition-all overflow-hidden group">
                  <div className="h-48 bg-gradient-primary relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-20 w-20 text-white/80" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/40">
                        {course.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students?.toLocaleString() || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    {isEnrolled && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-primary">{course.progress || 0}%</span>
                        </div>
                        <Progress value={course.progress || 0} className="h-2" />
                      </div>
                    )}
                    {isEnrolled ? (
                      <Button 
                        className="w-full" 
                        onClick={() => handleContinueLearning(course.id)}
                      >
                        Continue Learning
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleEnroll(course.id)}
                      >
                        Enroll Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;
