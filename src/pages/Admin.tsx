import { useState } from "react";
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

const Admin = () => {
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  const handleAddCourse = () => {
    toast.success("Course added successfully!");
    setIsAddingCourse(false);
  };

  const stats = [
    { label: "Total Tenants", value: "4", icon: Building2, color: "text-primary" },
    { label: "Total Courses", value: "48", icon: BookOpen, color: "text-accent" },
    { label: "Active Students", value: "8,547", icon: Users, color: "text-success" },
    { label: "Live Sessions", value: "24", icon: Video, color: "text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage courses, tenants, and platform settings.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
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
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Add, edit, or remove courses</CardDescription>
                </div>
                <Button onClick={() => setIsAddingCourse(!isAddingCourse)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAddingCourse ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddCourse();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input id="title" placeholder="e.g., Introduction to AI" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input id="instructor" placeholder="e.g., Dr. Jane Smith" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 12 weeks" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Course description..." rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Save Course
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingCourse(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {["Introduction to Computer Science", "Advanced Mathematics", "Web Development Fundamentals"].map(
                    (course, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="font-medium">{course}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
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
                <Select defaultValue="university-1">
                  <SelectTrigger id="tenant" className="bg-popover">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="university-1">University One</SelectItem>
                    <SelectItem value="university-2">University Two</SelectItem>
                    <SelectItem value="college-1">College Alpha</SelectItem>
                    <SelectItem value="school-1">School Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 pt-4">
                <h4 className="font-medium text-sm text-muted-foreground">Tenant Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Students</span>
                    <span className="font-medium">2,156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Courses</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instructors</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-success">Active</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Tenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
