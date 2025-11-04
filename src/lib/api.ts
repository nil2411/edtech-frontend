const API_BASE_URL = "http://localhost:5000/api";

export const api = {
  async login(email: string, password: string) {
    // Mock implementation - replace with actual API call
    return {
      success: true,
      user: { id: "1", email, name: "John Doe", role: "student" },
      token: "mock-jwt-token",
    };
  },

  async getTenants() {
    // Mock data - replace with actual API call
    return [
      { id: "university-1", name: "University One" },
      { id: "university-2", name: "University Two" },
      { id: "college-1", name: "College Alpha" },
      { id: "school-1", name: "School Beta" },
    ];
  },

  async getCourses() {
    // Mock data - replace with actual API call
    return [
      {
        id: "1",
        title: "Introduction to Computer Science",
        instructor: "Dr. Sarah Johnson",
        progress: 65,
        thumbnail: "/placeholder.svg",
        students: 1250,
        duration: "12 weeks",
      },
      {
        id: "2",
        title: "Advanced Mathematics",
        instructor: "Prof. Michael Chen",
        progress: 40,
        thumbnail: "/placeholder.svg",
        students: 890,
        duration: "10 weeks",
      },
      {
        id: "3",
        title: "Data Structures & Algorithms",
        instructor: "Dr. Emily Rodriguez",
        progress: 80,
        thumbnail: "/placeholder.svg",
        students: 2100,
        duration: "14 weeks",
      },
      {
        id: "4",
        title: "Web Development Fundamentals",
        instructor: "Alex Martinez",
        progress: 30,
        thumbnail: "/placeholder.svg",
        students: 3200,
        duration: "8 weeks",
      },
    ];
  },

  async getLiveClasses() {
    // Mock data - replace with actual API call
    return [
      {
        id: "1",
        title: "CS101 - Introduction to Programming",
        instructor: "Dr. Sarah Johnson",
        time: "2:00 PM - 3:30 PM",
        date: "Today",
        status: "live",
        attendees: 234,
      },
      {
        id: "2",
        title: "MATH301 - Calculus III",
        instructor: "Prof. Michael Chen",
        time: "4:00 PM - 5:30 PM",
        date: "Today",
        status: "upcoming",
        attendees: 156,
      },
      {
        id: "3",
        title: "WEB202 - React Advanced Patterns",
        instructor: "Alex Martinez",
        time: "10:00 AM - 11:30 AM",
        date: "Tomorrow",
        status: "upcoming",
        attendees: 298,
      },
    ];
  },

  async getAnnouncements() {
    // Mock data - replace with actual API call
    return [
      {
        id: "1",
        title: "Mid-term Exams Schedule Released",
        content: "Check your dashboard for exam dates and timings.",
        date: "2 hours ago",
        priority: "high",
      },
      {
        id: "2",
        title: "New Course Materials Available",
        content: "Week 5 materials for all courses are now accessible.",
        date: "5 hours ago",
        priority: "medium",
      },
      {
        id: "3",
        title: "Campus Library Extended Hours",
        content: "Library will be open 24/7 during exam period.",
        date: "1 day ago",
        priority: "low",
      },
    ];
  },
};
