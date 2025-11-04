// Resolve API base URL for Vite/Netlify deployments
// Use VITE_API_BASE_URL if provided; fallback to the deployed backend URL; finally fallback to localhost for dev
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL
  || "http://13.201.4.174:5000"
  || "http://localhost:5000";

async function httpGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

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
      { id: "stanford", name: "Stanford University" },
      { id: "mit", name: "Massachusetts Institute of Technology" },
      { id: "oxford", name: "University of Oxford" },
      { id: "berkeley", name: "UC Berkeley" },
    ];
  },

  async getCourses(tenantId?: string) {
    // If tenantId provided, fetch from backend; otherwise return mock data
    if (tenantId) {
      const data = await httpGet<{ tenantId: string; courses: any[] }>(`/api/tenant/${tenantId}/courses`);
      return data.courses;
    }
    return [
      {
        id: "1",
        title: "Introduction to Computer Science",
        instructor: "Prof. David Williams",
        progress: 65,
        thumbnail: "/placeholder.svg",
        students: 1250,
        duration: "12 weeks",
      },
      {
        id: "2",
        title: "Advanced Calculus & Linear Algebra",
        instructor: "Dr. Jennifer Park",
        progress: 40,
        thumbnail: "/placeholder.svg",
        students: 890,
        duration: "10 weeks",
      },
      {
        id: "3",
        title: "Data Structures & Algorithms",
        instructor: "Prof. Robert Thompson",
        progress: 80,
        thumbnail: "/placeholder.svg",
        students: 2100,
        duration: "14 weeks",
      },
      {
        id: "4",
        title: "Full-Stack Web Development",
        instructor: "Dr. Maria Garcia",
        progress: 30,
        thumbnail: "/placeholder.svg",
        students: 3200,
        duration: "8 weeks",
      },
    ];
  },

  async getLiveClasses() {
    // Replace with actual API call when backend endpoint is ready
    return [
      {
        id: "1",
        title: "CS101 - Introduction to Programming",
        instructor: "Prof. David Williams",
        time: "2:00 PM - 3:30 PM",
        date: "Today",
        status: "live",
        attendees: 234,
      },
      {
        id: "2",
        title: "MATH301 - Multivariable Calculus",
        instructor: "Dr. Jennifer Park",
        time: "4:00 PM - 5:30 PM",
        date: "Today",
        status: "upcoming",
        attendees: 156,
      },
      {
        id: "3",
        title: "WEB202 - Modern React Development",
        instructor: "Dr. Maria Garcia",
        time: "10:00 AM - 11:30 AM",
        date: "Tomorrow",
        status: "upcoming",
        attendees: 298,
      },
    ];
  },

  async startLiveSession(input: { sessionId: string; title: string; instructor: string; tenantId: string; }) {
    return httpPost<{ message: string; session: any }>(`/api/live/start`, input);
  },

  async stopLiveSession(sessionId: string) {
    return httpPost<{ message: string; session: any }>(`/api/live/stop`, { sessionId });
  },

  async getAllLiveSessions() {
    return httpGet<{ activeSessions: any[]; allSessions: any[] }>(`/api/live/sessions`);
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
