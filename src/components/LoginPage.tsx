import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { User } from "../types";
import logo from "../components/ui/logo.jpeg";
import { mockUsers } from "../data/mockData";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple mock authentication
    let user = mockUsers.find((u) => u.email === email);

    // Allow admin login for alice@aviacortex.com with any 6+ char password
    if (email === "alice@aviacortex.com" && password.length >= 6) {
      // If not present in mockUsers, create a user object for admin
      if (!user) {
        user = {
          id: "admin",
          name: "Alice Smith",
          employeeId: "E001",
          email: "alice@aviacortex.com",
          role: "admin",
          status: "Active",
        };
      }
      onLogin({ ...user, role: "admin" });
      return;
    }

    if (!user) {
      setError(
        "Invalid credentials. Please contact your System Administrator."
      );
      return;
    }

    // In a real app, password would be validated here
    if (password.length < 6) {
      setError(
        "Invalid credentials. Please contact your System Administrator."
      );
      return;
    }

    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-12 bg-primary rounded-lg flex items-center justify-center">
              <img
                src={logo}
                alt="Aviacortex Logo"
                className="object-contain w-16 h-12"
              />
            </div>
          </div>
          <CardTitle className="text-2xl">Aircraft Management System</CardTitle>
          <CardDescription>
            Secure access for authorized airline personnel only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Manager:</strong> j.smith@airline.com
              </p>
              <p>
                <strong>Engineer:</strong> s.johnson@airline.com
              </p>
              <p>
                <strong>Pilot:</strong> c.williams@airline.com
              </p>
              <p>
                <strong>Admin:</strong> alice@aviacortex.com
              </p>
              <p>
                <strong>Password:</strong> Any 6+ characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
