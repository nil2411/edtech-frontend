import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, BookOpen, Video, Building2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useTenant } from "@/contexts/TenantContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Admin = () => {
  const { currentTenant, tenants } = useTenant();
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    duration: "12 weeks",
    description: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [coursesData, statsData] = await Promise.all([
          currentTenant ? api.getCourses(currentTenant.id) : Promise.resolve([]),
          api.getStats(),
        ]);

        setCourses(coursesData);
        setStats([
          { label: "Total Tenants", value: String(statsData.totalTenants), icon: Building2, color: "text-primary" },
          { label: "Total Courses", value: String(statsData.totalCourses), icon: BookOpen, color: "text-accent" },
          { label: "Active Students", value: statsData.totalStudents.toLocaleString(), icon: Users, color: "text-success" },
          { label: "Live Sessions", value: String(statsData.activeLiveSessions), icon: Video, color: "text-warning" },
        ]);
      } catch (error) {
        console.error("Error loading admin data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentTenant]);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) {
      toast.error("Please select a tenant");
      return;
    }

    try {
      const result = await api.createCourse({
        title: formData.title,
        instructor: formData.instructor,
        tenantId: currentTenant.id,
        duration: formData.duration,
        description: formData.description,
      });

      toast.success("Course created successfully!");
      setCourses([...courses, result.course]);
      setIsAddingCourse(false);
      setFormData({ title: "", instructor: "", duration: "12 weeks", description: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create course");
    }
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !editingCourse) return;

    try {
      const result = await api.updateCourse(editingCourse.id, {
        title: formData.title,
        instructor: formData.instructor,
        tenantId: currentTenant.id,
        duration: formData.duration,
        description: formData.description,
      });

      toast.success("Course updated successfully!");
      setCourses(courses.map(c => c.id === editingCourse.id ? result.course : c));
      setEditingCourse(null);
      setFormData({ title: "", instructor: "", duration: "12 weeks", description: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!currentTenant) return;
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.deleteCourse(courseId, currentTenant.id);
      toast.success("Course deleted successfully!");
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course");
    }
  };

  const openEditDialog = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      instructor: course.instructor,
      duration: course.duration || "12 weeks",
      description: course.description || "",
    });
  };

  const closeEditDialog = () => {
    setEditingCourse(null);
    setFormData({ title: "", instructor: "", duration: "12 weeks", description: "" });
  };

  const currentTenantDetails = currentTenant 
    ? tenants.find(t => t.id === currentTenant.id)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage courses, tenants, and platform settings.</p>
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>
                    {currentTenant ? `Manage courses for ${currentTenant.name}` : "Select a tenant to manage courses"}
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsAddingCourse(!isAddingCourse)} 
                  size="sm"
                  disabled={!currentTenant}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAddingCourse ? (
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Introduction to AI" 
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input 
                      id="instructor" 
                      placeholder="e.g., Dr. Jane Smith" 
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input 
                      id="duration" 
                      placeholder="e.g., 12 weeks" 
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Course description..." 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Save Course
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingCourse(false);
                        setFormData({ title: "", instructor: "", duration: "12 weeks", description: "" });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {isLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : courses.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No courses available. Add a new course to get started.
                    </div>
                  ) : (
                    courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <span className="font-medium">{course.title}</span>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Tenant Management</CardTitle>
              <CardDescription>Manage institutional tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant">Active Tenant</Label>
                <Select value={currentTenant?.id || ""} disabled>
                  <SelectTrigger id="tenant" className="bg-popover">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Use the tenant selector in the navbar to change tenants
                </p>
              </div>
              {currentTenantDetails && (
                <div className="space-y-3 pt-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Tenant Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Students</span>
                      <span className="font-medium">{currentTenantDetails.students?.toLocaleString() || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Courses</span>
                      <span className="font-medium">{currentTenantDetails.courses || courses.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Instructors</span>
                      <span className="font-medium">{currentTenantDetails.instructors || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCourse} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Course Title</Label>
              <Input 
                id="edit-title" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instructor">Instructor</Label>
              <Input 
                id="edit-instructor" 
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration</Label>
              <Input 
                id="edit-duration" 
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditDialog}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
