// ✅ API Base URL setup (Vite + Netlify compatible)
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL?.trim() ||
  "http://13.201.4.174:5000";

// ✅ Generic GET request helper
async function httpGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("GET failed, using mock data →", path, err);
    throw err;
  }
}

// ✅ Generic POST request helper
async function httpPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("POST failed, using mock data →", path, err);
    throw err;
  }
}

// ✅ API object (exports all available functions)
export const api = {
  // 🔐 Login (mock for now)
  async login(email: string, password: string) {
    return {
      success: true,
      user: { id: "1", email, name: "John Doe", role: "student" },
      token: "mock-jwt-token",
    };
  },

  // 🏫 Fetch all tenants (universities)
  async getTenants() {
    try {
      // Use backend if available
      const tenants = await httpGet<{ tenants: any[] }>("/api/tenants");
      return tenants.tenants;
    } catch {
      // Fallback mock data
      return [
        { id: "stanford", name: "Stanford University" },
        { id: "mit", name: "Massachusetts Institute of Technology" },
        { id: "oxford", name: "University of Oxford" },
        { id: "berkeley", name: "UC Berkeley" },
      ];
    }
  },

  // 🎓 Fetch courses per tenant (real backend integration)
  async getCourses(tenantId?: string) {
    try {
      if (tenantId) {
        const data = await httpGet<{ tenantId: string; courses: any[] }>(
          `/api/tenant/${tenantId}/courses`
        );
        return data.courses;
      }
      // fallback: if no tenantId given, show mock data
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
      ];
    } catch {
      // fallback on error
      return [
        {
          id: "1",
          title: "Mock: Data Structures & Algorithms",
          instructor: "Prof. Robert Thompson",
          progress: 80,
          thumbnail: "/placeholder.svg",
          students: 2100,
          duration: "14 weeks",
        },
      ];
    }
  },

  // 🎥 Live session APIs
  async startLiveSession(input: {
    sessionId: string;
    title: string;
    instructor: string;
    tenantId: string;
  }) {
    try {
      return await httpPost<{ message: string; session: any }>(
        `/api/live/start`,
        input
      );
    } catch {
      return { message: "Mock session started", session: input };
    }
  },

  async stopLiveSession(sessionId: string) {
    try {
      return await httpPost<{ message: string; session: any }>(
        `/api/live/stop`,
        { sessionId }
      );
    } catch {
      return { message: "Mock session stopped", sessionId };
    }
  },

  async getAllLiveSessions() {
    try {
      return await httpGet<{ activeSessions: any[]; allSessions: any[] }>(
        `/api/live/sessions`
      );
    } catch {
      return {
        activeSessions: [],
        allSessions: [
          {
            id: "mock1",
            title: "Mock Live Class",
            instructor: "Dr. Maria Garcia",
            date: "Today",
            time: "10:00 AM - 11:00 AM",
            status: "live",
          },
        ],
      };
    }
  },

  // 🧑‍🏫 Live classes (still mock, can map to /api/live/sessions if needed)
  async getLiveClasses() {
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
    ];
  },

  // 📢 Announcements (still mock)
  async getAnnouncements() {
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
    ];
  },
};