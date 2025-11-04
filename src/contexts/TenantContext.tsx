import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

interface Tenant {
  id: string;
  name: string;
  students?: number;
  courses?: number;
  instructors?: number;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  setCurrentTenant: (tenantId: string) => void;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [currentTenant, setCurrentTenantState] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const data = await api.getTenants();
        setTenants(data);
        
        // Set default tenant from localStorage or use first tenant
        const savedTenantId = localStorage.getItem("currentTenantId") || data[0]?.id;
        if (savedTenantId) {
          const tenant = data.find(t => t.id === savedTenantId) || data[0];
          setCurrentTenantState(tenant);
        }
      } catch (error) {
        console.error("Error loading tenants:", error);
        // Fallback to default
        setCurrentTenantState({ id: "stanford", name: "Stanford University" });
      } finally {
        setIsLoading(false);
      }
    };

    loadTenants();
  }, []);

  const setCurrentTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenantState(tenant);
      localStorage.setItem("currentTenantId", tenantId);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenants,
        setCurrentTenant,
        isLoading,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

