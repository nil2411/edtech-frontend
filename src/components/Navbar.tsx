import { Moon, Sun, GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Courses", path: "/courses" },
  { name: "Live Classes", path: "/live" },
  { name: "Admin", path: "/admin" },
];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [tenant, setTenant] = useState("university-1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">EduPlatform</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={location.pathname === link.path ? "secondary" : "ghost"}
                    size="sm"
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={tenant} onValueChange={setTenant}>
              <SelectTrigger className="w-[180px] hidden sm:flex">
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="university-1">University One</SelectItem>
                <SelectItem value="university-2">University Two</SelectItem>
                <SelectItem value="college-1">College Alpha</SelectItem>
                <SelectItem value="school-1">School Beta</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={location.pathname === link.path ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
            <Select value={tenant} onValueChange={setTenant}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="university-1">University One</SelectItem>
                <SelectItem value="university-2">University Two</SelectItem>
                <SelectItem value="college-1">College Alpha</SelectItem>
                <SelectItem value="school-1">School Beta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </nav>
  );
};
