import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./components/ui/select";
import { Eye, EyeOff, Edit, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const roles = [
  { value: "engineer", label: "Engineer" },
  { value: "manager", label: "Manager" },
  { value: "pilot", label: "Pilot" },
];

const mockUsers = [
  {
    id: "1",
    name: "Alice Smith",
    employeeId: "E001",
    email: "alice@aviacortex.com",
    role: "engineer",
    status: "Active",
  },
  {
    id: "2",
    name: "Bob Jones",
    employeeId: "E002",
    email: "bob@aviacortex.com",
    role: "manager",
    status: "Active",
  },
  {
    id: "3",
    name: "Charlie Lee",
    employeeId: "E003",
    email: "charlie@aviacortex.com",
    role: "pilot",
    status: "Inactive",
  },
];

const mockAircraft = [
  {
    id: "A1",
    tailNumber: "N12345",
    model: "Boeing 737-800",
    manufacturer: "Boeing",
    healthScore: 92,
  },
  {
    id: "A2",
    tailNumber: "N54321",
    model: "Airbus A320",
    manufacturer: "Airbus",
    healthScore: 88,
  },
  {
    id: "A3",
    tailNumber: "N98765",
    model: "Boeing 777-300ER",
    manufacturer: "Boeing",
    healthScore: 30,
  },
];

export function AdminPanel({ user }: { user: { id: string; role: string } }) {
  // Only allow access for system administrator
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-medium mb-4 text-foreground">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              You do not have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State management
  const [activeTab, setActiveTab] = useState<"users" | "aircraft">("users");
  const [users, setUsers] = useState(mockUsers);
  const [aircraft, setAircraft] = useState(mockAircraft);
  const [userSearch, setUserSearch] = useState("");
  const [aircraftSearch, setAircraftSearch] = useState("");

  // Modal states
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeactivateUser, setShowDeactivateUser] = useState(false);
  const [showAddAircraft, setShowAddAircraft] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    name: "",
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "engineer",
  });
  const [aircraftForm, setAircraftForm] = useState({
    tailNumber: "",
    model: "",
    manufacturer: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Filtered data
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredAircraft = aircraft.filter(
    (a) =>
      a.tailNumber.toLowerCase().includes(aircraftSearch.toLowerCase()) ||
      a.model.toLowerCase().includes(aircraftSearch.toLowerCase())
  );

  // Event handlers
  const handleAddUser = () => {
    if (
      !userForm.name ||
      !userForm.employeeId ||
      !userForm.email ||
      !userForm.password ||
      !userForm.confirmPassword
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: userForm.name,
      employeeId: userForm.employeeId,
      email: userForm.email,
      role: userForm.role,
      status: "Active",
    };

    setUsers([...users, newUser]);
    setShowAddUser(false);
    setUserForm({
      name: "",
      employeeId: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "engineer",
    });
    toast.success("User account created successfully");
  };

  const handleEditUser = () => {
    if (!userForm.name) {
      toast.error("Please enter a name");
      return;
    }

    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, name: userForm.name, role: userForm.role }
          : u
      )
    );
    setShowEditUser(false);
    setSelectedUser(null);
    toast.success("User profile updated successfully");
  };

  const handleDeactivateUser = () => {
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id ? { ...u, status: "Inactive" } : u
      )
    );
    setShowDeactivateUser(false);
    setSelectedUser(null);
    toast.success("User account deactivated successfully");
  };

  const handleAddAircraft = () => {
    if (
      !aircraftForm.tailNumber ||
      !aircraftForm.model ||
      !aircraftForm.manufacturer
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newAircraft = {
      id: Date.now().toString(),
      tailNumber: aircraftForm.tailNumber,
      model: aircraftForm.model,
      manufacturer: aircraftForm.manufacturer,
      healthScore: 100,
    };

    setAircraft([...aircraft, newAircraft]);
    setShowAddAircraft(false);
    setAircraftForm({
      tailNumber: "",
      model: "",
      manufacturer: "",
    });
    toast.success("Aircraft added to fleet successfully");
  };

  const openEditUser = (user: any) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      employeeId: user.employeeId,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
    });
    setShowEditUser(true);
  };

  const openDeactivateUser = (user: any) => {
    setSelectedUser(user);
    setShowDeactivateUser(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-foreground mb-2">
            Administrator Panel
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts and aircraft fleet for AviaCortex system
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={(v: string) => setActiveTab(v as "users" | "aircraft")}
            >
              <div className="border-b border-border p-6">
                <TabsList className="grid w-fit grid-cols-2 p-1 pr-2">
                  <TabsTrigger value="users" className="px-14">
                    Manage Users
                  </TabsTrigger>
                  <TabsTrigger value="aircraft" className="pr-2">
                    Manage Aircraft
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* User Management Tab */}
              <TabsContent value="users" className="p-6 space-y-6">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Button
                    onClick={() => setShowAddUser(true)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>

                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-4 text-left font-medium">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Employee ID
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-12 text-center text-muted-foreground"
                            >
                              No users found
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr
                              key={user.id}
                              className="border-t hover:bg-muted/30"
                            >
                              <td className="px-6 py-4 font-medium">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">
                                {user.employeeId}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">
                                {user.email}
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant="secondary"
                                  className="capitalize"
                                >
                                  {roles.find((r) => r.value === user.role)
                                    ?.label || user.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant={
                                    user.status === "Active"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className={
                                    user.status === "Active"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : ""
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openEditUser(user)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => openDeactivateUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Aircraft Management Tab */}
              <TabsContent value="aircraft" className="p-6 space-y-6">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Button
                    onClick={() => setShowAddAircraft(true)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Aircraft
                  </Button>

                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by tail number or model..."
                      value={aircraftSearch}
                      onChange={(e) => setAircraftSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Aircraft Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-4 text-left font-medium">
                            Tail Number
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Model
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Manufacturer
                          </th>
                          <th className="px-6 py-4 text-left font-medium">
                            Current Health Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAircraft.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-12 text-center text-muted-foreground"
                            >
                              No aircraft found
                            </td>
                          </tr>
                        ) : (
                          filteredAircraft.map((ac) => (
                            <tr
                              key={ac.id}
                              className="border-t hover:bg-muted/30"
                            >
                              <td className="px-6 py-4 font-medium font-mono">
                                {ac.tailNumber}
                              </td>
                              <td className="px-6 py-4">{ac.model}</td>
                              <td className="px-6 py-4 text-muted-foreground">
                                {ac.manufacturer}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium w-8">
                                    {ac.healthScore}
                                  </span>
                                  <div className="flex-1 max-w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full transition-all ${
                                        ac.healthScore >= 90
                                          ? "bg-green-500"
                                          : ac.healthScore >= 70
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{ width: `${ac.healthScore}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({ ...userForm, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee ID</label>
              <Input
                value={userForm.employeeId}
                onChange={(e) =>
                  setUserForm({ ...userForm, employeeId: e.target.value })
                }
                placeholder="Enter employee ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={userForm.confirmPassword}
                onChange={(e) =>
                  setUserForm({ ...userForm, confirmPassword: e.target.value })
                }
                placeholder="Confirm password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Role</label>
              <Select
                value={userForm.role}
                onValueChange={(value: any) =>
                  setUserForm({ ...userForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({ ...userForm, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee ID</label>
              <Input
                value={userForm.employeeId}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                value={userForm.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={userForm.role}
                onValueChange={(value: any) =>
                  setUserForm({ ...userForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" className="w-full">
              Reset Password
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate User Modal */}
      <Dialog open={showDeactivateUser} onOpenChange={setShowDeactivateUser}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm User Deactivation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to deactivate this user's account? They will
              immediately lose access to the platform. Their historical records
              will be preserved.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeactivateUser(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeactivateUser}>
              Yes, Deactivate User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Aircraft Modal */}
      <Dialog open={showAddAircraft} onOpenChange={setShowAddAircraft}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Aircraft to Fleet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tail Number</label>
              <Input
                value={aircraftForm.tailNumber}
                onChange={(e) =>
                  setAircraftForm({
                    ...aircraftForm,
                    tailNumber: e.target.value,
                  })
                }
                placeholder="e.g., N12345"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aircraft Model</label>
              <Input
                value={aircraftForm.model}
                onChange={(e) =>
                  setAircraftForm({ ...aircraftForm, model: e.target.value })
                }
                placeholder="e.g., Boeing 737-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Manufacturer</label>
              <Input
                value={aircraftForm.manufacturer}
                onChange={(e) =>
                  setAircraftForm({
                    ...aircraftForm,
                    manufacturer: e.target.value,
                  })
                }
                placeholder="e.g., Boeing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAircraft(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAircraft}>Add Aircraft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
