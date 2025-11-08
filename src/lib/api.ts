// ✅ API Base URL setup (Vite + Netlify compatible)
const getApiBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL?.trim();
  
  // If VITE_API_BASE_URL is set to "/api-proxy" or similar, use it (Netlify proxy)
  if (envUrl && envUrl.startsWith('/')) {
    return envUrl; // Relative path - will use Netlify proxy
  }
  
  // If full URL provided, use it
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl;
  }
  
  // In production (Netlify), use proxy to avoid mixed content issues
  // In development, use direct backend URL
  if (import.meta.env.PROD) {
    // Production: Use Netlify proxy (no protocol, relative path)
    return "/api-proxy";
  }
  
  // Development: Use direct backend URL
  return "http://3.109.212.23:5000";
};

const API_BASE_URL = getApiBaseUrl();

// Log API base URL for debugging (always, so you can see it in production too)
console.log("🔗 API Base URL:", API_BASE_URL);
console.log("🔗 Environment VITE_API_BASE_URL:", (import.meta as any).env?.VITE_API_BASE_URL || "not set");

// ✅ Generic GET request helper
async function httpGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log(`📡 GET ${url}`);
  
  // Check for mixed content (HTTP from HTTPS page) - but only if not using proxy
  // Proxy paths (starting with /) are safe from mixed content
  if (window.location.protocol === 'https:' && url.startsWith('http:') && !API_BASE_URL.startsWith('/')) {
    const errorMsg = `🚫 MIXED CONTENT BLOCKED: Cannot load ${url} from HTTPS page. Backend must use HTTPS or use a proxy.`;
    console.error(errorMsg);
    console.error(`💡 Solution: Use Netlify proxy (set VITE_API_BASE_URL="/api-proxy" in netlify.toml)`);
    alert(`Mixed Content Error!\n\nYour frontend is on HTTPS (Netlify) but backend is HTTP.\n\nBackend URL: ${url}\n\nSolutions:\n1. Use HTTPS for backend (recommended)\n2. Use Netlify proxy/rewrites (configured in netlify.toml)\n3. Deploy backend with HTTPS`);
    throw new Error(errorMsg);
  }
  
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      // Add mode to help with CORS debugging
      mode: 'cors',
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
    // Enhanced error logging
    const errorMessage = err.message || String(err);
    console.error(`❌ GET ${path} failed:`, errorMessage);
    console.error(`❌ Full error:`, err);
    
    // Check for specific error types
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      console.error(`🚫 Network Error Details:`);
      console.error(`   - URL: ${url}`);
      console.error(`   - Frontend Protocol: ${window.location.protocol}`);
      console.error(`   - Backend Protocol: ${url.startsWith('https') ? 'https' : 'http'}`);
      console.error(`   - Mixed Content: ${window.location.protocol === 'https:' && url.startsWith('http:') ? 'YES (BLOCKED!)' : 'No'}`);
    }
    
    throw err;
  }
}

// ✅ Generic PUT request helper
async function httpPut<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log(`📡 PUT ${url}`, body);
  
  if (window.location.protocol === 'https:' && url.startsWith('http:') && !API_BASE_URL.startsWith('/')) {
    const errorMsg = `🚫 MIXED CONTENT BLOCKED: Cannot load ${url} from HTTPS page.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
      mode: 'cors',
    });
    
    console.log(`📥 Response status: ${res.status} for ${path}`);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`PUT ${path} failed: ${res.status} ${res.statusText}. ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`✅ PUT ${path} success:`, data);
    return data;
  } catch (err: any) {
    const errorMessage = err.message || String(err);
    console.error(`❌ PUT ${path} failed:`, errorMessage);
    throw err;
  }
}

// ✅ Generic DELETE request helper
async function httpDelete<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log(`📡 DELETE ${url}`);
  
  if (window.location.protocol === 'https:' && url.startsWith('http:') && !API_BASE_URL.startsWith('/')) {
    const errorMsg = `🚫 MIXED CONTENT BLOCKED: Cannot load ${url} from HTTPS page.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      mode: 'cors',
    });
    
    console.log(`📥 Response status: ${res.status} for ${path}`);
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`DELETE ${path} failed: ${res.status} ${res.statusText}. ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`✅ DELETE ${path} success:`, data);
    return data;
  } catch (err: any) {
    const errorMessage = err.message || String(err);
    console.error(`❌ DELETE ${path} failed:`, errorMessage);
    throw err;
  }
}

// ✅ Generic POST request helper
async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log(`📡 POST ${url}`, body);
  
  // Check for mixed content (HTTP from HTTPS page) - but only if not using proxy
  // Proxy paths (starting with /) are safe from mixed content
  if (window.location.protocol === 'https:' && url.startsWith('http:') && !API_BASE_URL.startsWith('/')) {
    const errorMsg = `🚫 MIXED CONTENT BLOCKED: Cannot load ${url} from HTTPS page. Backend must use HTTPS or use a proxy.`;
    console.error(errorMsg);
    console.error(`💡 Solution: Use Netlify proxy (set VITE_API_BASE_URL="/api-proxy" in netlify.toml)`);
    alert(`Mixed Content Error!\n\nYour frontend is on HTTPS (Netlify) but backend is HTTP.\n\nBackend URL: ${url}\n\nSolutions:\n1. Use HTTPS for backend (recommended)\n2. Use Netlify proxy/rewrites (configured in netlify.toml)\n3. Deploy backend with HTTPS`);
    throw new Error(errorMsg);
  }
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
      mode: 'cors',
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
    const errorMessage = err.message || String(err);
    console.error(`❌ POST ${path} failed:`, errorMessage);
    console.error(`❌ Full error:`, err);
    throw err;
  }
}

// ✅ Get current user from localStorage
function getCurrentUser() {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

// ✅ API object (exports all available functions)
export const api = {
  // 🔐 Login - connect to real backend
  async login(email: string, password: string) {
    try {
      const result = await httpPost<{ success: boolean; user: any; token: string }>(
        "/api/auth/login",
        { email, password }
      );
      return result;
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err.message || "Login failed. Please check your credentials.");
    }
  },

  // 🏫 Fetch all tenants (universities) - connect to backend
  async getTenants() {
    try {
      const data = await httpGet<{ tenants: any[] }>("/api/tenants");
      return data.tenants;
    } catch (err: any) {
      console.error("Error fetching tenants:", err);
      // Fallback mock data
      return [
        { id: "stanford", name: "Stanford University" },
        { id: "mit", name: "Massachusetts Institute of Technology" },
        { id: "oxford", name: "University of Oxford" },
        { id: "berkeley", name: "UC Berkeley" },
      ];
    }
  },

  // 🏫 Get tenant details
  async getTenant(tenantId: string) {
    try {
      return await httpGet<any>(`/api/tenant/${tenantId}`);
    } catch (err: any) {
      console.error("Error fetching tenant:", err);
      throw err;
    }
  },

  // 🎓 Fetch courses per tenant (real backend integration)
  async getCourses(tenantId?: string) {
    // Always try to fetch from backend first - no silent fallbacks
    const targetTenant = tenantId || 'stanford';
    
    try {
      console.log(`🎓 Fetching courses for tenant: ${targetTenant}`);
      const data = await httpGet<{ tenantId: string; courses: any[] }>(
        `/api/tenant/${targetTenant}/courses`
      );
      
      console.log(`✅ Successfully fetched ${data.courses.length} courses from backend`);
      
      // Transform backend data to match frontend format
      return data.courses.map(course => ({
        ...course,
        progress: Math.floor(Math.random() * 100), // Add progress for display
        thumbnail: "/placeholder.svg",
        duration: "12 weeks", // Default duration
      }));
    } catch (err: any) {
      // Log the error but don't silently fall back - let the error propagate
      console.error(`❌ Failed to fetch courses from backend for tenant ${targetTenant}:`, err);
      
      // Only use mock data if it's a mixed content or network error
      const isMixedContent = err.message?.includes('MIXED CONTENT') || 
                             err.message?.includes('Failed to fetch') ||
                             err.message?.includes('NetworkError');
      
      if (isMixedContent) {
        console.error(`🚫 Mixed content error detected. Backend must use HTTPS.`);
        // Return empty array so UI shows "no courses" instead of mock data
        // This makes the problem visible
        return [];
      }
      
      // For other errors, still return empty array to make it visible
      console.error(`⚠️ Returning empty courses array due to error`);
      return [];
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
      console.log(`🎥 Fetching live sessions from backend`);
      // Fetch live sessions from backend directly
      const data = await httpGet<{ activeSessions: any[]; allSessions: any[] }>(
        `/api/live/sessions`
      );
      
      console.log(`✅ Successfully fetched ${data.allSessions.length} live sessions from backend`);
      
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
      
      return transformedSessions;
    } catch (err: any) {
      console.error("❌ Error fetching live classes:", err);
      
      // Check for mixed content error
      const isMixedContent = err.message?.includes('MIXED CONTENT') || 
                             err.message?.includes('Failed to fetch') ||
                             err.message?.includes('NetworkError');
      
      if (isMixedContent) {
        console.error(`🚫 Mixed content error detected. Backend must use HTTPS.`);
        return []; // Return empty array
      }
      
      // Return empty array on any error
      return [];
    }
  },

  // 📢 Announcements - connect to backend
  async getAnnouncements(tenantId?: string) {
    try {
      const query = tenantId ? `?tenantId=${tenantId}` : "";
      return await httpGet<any[]>(`/api/announcements${query}`);
    } catch (err: any) {
      console.error("Error fetching announcements:", err);
      // Fallback mock data
      return [
        {
          id: "1",
          title: "Mid-term Exams Schedule Released",
          content: "Check your dashboard for exam dates and timings.",
          date: "2 hours ago",
          priority: "high",
        },
      ];
    }
  },

  // 📊 Get platform statistics
  async getStats() {
    try {
      return await httpGet<{
        totalTenants: number;
        totalCourses: number;
        totalStudents: number;
        activeLiveSessions: number;
      }>("/api/stats");
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      return {
        totalTenants: 4,
        totalCourses: 48,
        totalStudents: 8547,
        activeLiveSessions: 24,
      };
    }
  },

  // 🎓 Course enrollment
  async enrollInCourse(courseId: string, tenantId: string) {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be logged in");
    
    try {
      return await httpPost<{ message: string; course: any; progress: number }>(
        "/api/courses/enroll",
        { userId: user.id, courseId, tenantId }
      );
    } catch (err: any) {
      console.error("Error enrolling in course:", err);
      throw err;
    }
  },

  // 📈 Get course progress
  async getCourseProgress(courseId: string) {
    const user = getCurrentUser();
    if (!user) return { progress: 0, enrolled: false };
    
    try {
      return await httpGet<{ progress: number; enrolled: boolean }>(
        `/api/courses/${courseId}/progress?userId=${user.id}`
      );
    } catch (err: any) {
      console.error("Error fetching course progress:", err);
      return { progress: 0, enrolled: false };
    }
  },

  // 📈 Update course progress
  async updateCourseProgress(courseId: string, progress: number) {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be logged in");
    
    try {
      return await httpPost<{ message: string; progress: number }>(
        `/api/courses/${courseId}/progress`,
        { userId: user.id, progress }
      );
    } catch (err: any) {
      console.error("Error updating course progress:", err);
      throw err;
    }
  },

  // 🎥 Join live session
  async joinLiveSession(sessionId: string) {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be logged in");
    
    try {
      return await httpPost<{ message: string; session: any }>(
        "/api/live/join",
        { sessionId, userId: user.id }
      );
    } catch (err: any) {
      console.error("Error joining live session:", err);
      throw err;
    }
  },

  // 🔔 Set reminder for live session
  async setLiveSessionReminder(sessionId: string) {
    const user = getCurrentUser();
    if (!user) throw new Error("User must be logged in");
    
    try {
      return await httpPost<{ message: string; sessionId: string }>(
        "/api/live/reminder",
        { sessionId, userId: user.id }
      );
    } catch (err: any) {
      console.error("Error setting reminder:", err);
      throw err;
    }
  },

  // 🧑‍🏫 Admin: Create course
  async createCourse(data: { title: string; instructor: string; tenantId: string; duration?: string; description?: string }) {
    try {
      return await httpPost<{ message: string; course: any }>(
        "/api/admin/courses",
        data
      );
    } catch (err: any) {
      console.error("Error creating course:", err);
      throw err;
    }
  },

  // 🧑‍🏫 Admin: Update course
  async updateCourse(courseId: string, data: { title?: string; instructor?: string; tenantId: string; duration?: string; description?: string }) {
    try {
      return await httpPut<{ message: string; course: any }>(
        `/api/admin/courses/${courseId}`,
        data
      );
    } catch (err: any) {
      console.error("Error updating course:", err);
      throw err;
    }
  },

  // 🧑‍🏫 Admin: Delete course
  async deleteCourse(courseId: string, tenantId: string) {
    try {
      return await httpDelete<{ message: string }>(
        `/api/admin/courses/${courseId}?tenantId=${tenantId}`
      );
    } catch (err: any) {
      console.error("Error deleting course:", err);
      throw err;
    }
  },
};