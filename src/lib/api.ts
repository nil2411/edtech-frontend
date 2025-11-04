// ✅ API Base URL setup (Vite + Netlify compatible)
const getApiBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL?.trim();
  if (envUrl) return envUrl;
  
  // Fallback to hardcoded backend URL
  return "http://13.201.4.174:5000";
};

const API_BASE_URL = getApiBaseUrl();

// Log API base URL for debugging (always, so you can see it in production too)
console.log("🔗 API Base URL:", API_BASE_URL);
console.log("🔗 Environment VITE_API_BASE_URL:", (import.meta as any).env?.VITE_API_BASE_URL || "not set");

// ✅ Generic GET request helper
async function httpGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log(`📡 GET ${url}`);
  
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    
    console.log(`📥 Response status: ${res.status} for ${path}`);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}. ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`✅ GET ${path} success:`, data);
    return data;
  } catch (err: any) {
    console.error(`❌ GET ${path} failed:`, err.message || err);
    throw err;
  }
}

// ✅ Generic POST request helper
async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log(`📡 POST ${url}`, body);
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    console.log(`📥 Response status: ${res.status} for ${path}`);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`POST ${path} failed: ${res.status} ${res.statusText}. ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`✅ POST ${path} success:`, data);
    return data;
  } catch (err: any) {
    console.error(`❌ POST ${path} failed:`, err.message || err);
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
      // If tenantId provided, fetch from backend
      if (tenantId) {
        const data = await httpGet<{ tenantId: string; courses: any[] }>(
          `/api/tenant/${tenantId}/courses`
        );
        // Transform backend data to match frontend format
        return data.courses.map(course => ({
          ...course,
          progress: Math.floor(Math.random() * 100), // Add progress for display
          thumbnail: "/placeholder.svg",
          duration: "12 weeks", // Default duration
        }));
      }
      
      // If no tenantId, try to get courses from a default tenant (stanford)
      try {
        const data = await httpGet<{ tenantId: string; courses: any[] }>(
          `/api/tenant/stanford/courses`
        );
        // Transform backend data to match frontend format
        return data.courses.map(course => ({
          ...course,
          progress: Math.floor(Math.random() * 100),
          thumbnail: "/placeholder.svg",
          duration: "12 weeks",
        }));
      } catch (err) {
        console.warn("Failed to fetch courses from backend, using mock data");
        // Fallback mock data
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
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      // Fallback on error
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
    } catch (err: any) {
      console.error("Error starting live session:", err);
      return { message: "Mock session started (backend unavailable)", session: input };
    }
  },

  async stopLiveSession(sessionId: string) {
    try {
      return await httpPost<{ message: string; session: any }>(
        `/api/live/stop`,
        { sessionId }
      );
    } catch (err: any) {
      console.error("Error stopping live session:", err);
      return { message: "Mock session stopped (backend unavailable)", sessionId };
    }
  },

  async getAllLiveSessions() {
    try {
      return await httpGet<{ activeSessions: any[]; allSessions: any[] }>(
        `/api/live/sessions`
      );
    } catch (err: any) {
      console.error("Error fetching live sessions:", err);
      return {
        activeSessions: [],
        allSessions: [],
      };
    }
  },

  // 🧑‍🏫 Live classes - fetch from backend
  async getLiveClasses() {
    try {
      // Fetch live sessions from backend directly
      const data = await httpGet<{ activeSessions: any[]; allSessions: any[] }>(
        `/api/live/sessions`
      );
      
      // Transform backend sessions to frontend format
      const transformedSessions = data.allSessions.map((session: any, index: number) => {
        const isActive = session.status === 'active';
        const startTime = session.startTime ? new Date(session.startTime) : new Date();
        const hours = startTime.getHours();
        const minutes = startTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        const endHours = (hours + 1) % 12 || 12;
        
        return {
          id: session.sessionId || `session-${index}`,
          title: session.title || `Live Session ${index + 1}`,
          instructor: session.instructor || "Instructor",
          time: `${displayHours}:${displayMinutes} ${ampm} - ${endHours}:${displayMinutes} ${ampm}`,
          date: isActive ? "Today" : "Upcoming",
          status: isActive ? "live" : "upcoming",
          attendees: session.attendees || 0,
        };
      });
      
      // If we have sessions, return them
      if (transformedSessions.length > 0) {
        return transformedSessions;
      }
      
      // If no sessions, return mock data
      return [
        {
          id: "1",
          title: "CS101 - Introduction to Programming",
          instructor: "Prof. David Williams",
          time: "2:00 PM - 3:30 PM",
          date: "Today",
          status: "upcoming",
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
    } catch (err: any) {
      console.error("Error fetching live classes:", err);
      // Fallback to mock data on error
      return [
        {
          id: "1",
          title: "CS101 - Introduction to Programming",
          instructor: "Prof. David Williams",
          time: "2:00 PM - 3:30 PM",
          date: "Today",
          status: "upcoming",
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
    }
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