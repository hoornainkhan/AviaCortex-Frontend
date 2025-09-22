import { useState, useMemo, useCallback } from "react";
import { LoginPage } from "./components/LoginPage";
import { Navigation } from "./components/Navigation";
import { FleetDashboard } from "./components/FleetDashboard";
import { AircraftDetail } from "./components/AircraftDetail";
import { EngineerWorkCard } from "./components/EngineerWorkCard";
import { EngineerTaskList } from "./components/EngineerTaskList";
import { TaskWorkCard } from "./components/TaskWorkCard";
import { TaskVerification } from "./components/TaskVerification";
import { PendingApprovals } from "./components/PendingApprovals";
import { PilotReporting } from "./components/PilotReporting";
import { User, Aircraft, MaintenanceRecord, Task, PilotReport } from "./types";
import {
  mockAircraft,
  mockMaintenanceRecords,
  mockPilotReports,
  mockUsers,
  mockTasks,
  mockFlights,
} from "./data/mockData";
import { Toaster } from "./components/ui/sonner";
import { AdminPanel } from "./AdminPanel";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState(
    mockMaintenanceRecords
  );
  const [tasks, setTasks] = useState(mockTasks);
  const [pilotReports, setPilotReports] = useState(mockPilotReports);

  // Memoize engineers list to prevent unnecessary re-calculations
  const engineers = useMemo(
    () => mockUsers.filter((u) => u.role === "engineer"),
    []
  );

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === "manager") {
      setCurrentView("dashboard");
    } else if (loggedInUser.role === "engineer") {
      setCurrentView("tasks");
    } else if (loggedInUser.role === "pilot") {
      setCurrentView("report");
    } else if (loggedInUser.role === "admin") {
      setCurrentView("admin-panel");
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentView("dashboard");
    setSelectedAircraft(null);
    setSelectedTask(null);
  }, []);

  const handleAircraftSelect = useCallback((aircraft: Aircraft) => {
    setSelectedAircraft(aircraft);
    setCurrentView("detail");
  }, []);

  const handleTaskSelect = useCallback(
    (task: Task) => {
      setSelectedTask(task);
      if (user?.role === "manager") {
        setCurrentView("task-verification");
      } else if (user?.role === "engineer") {
        setCurrentView("workcard");
      }
    },
    [user?.role]
  );

  const handleCreateTask = useCallback(
    (task: Partial<Task>) => {
      const newTask: Task = {
        ...task,
        id: task.id || `T${Date.now()}`,
        aircraftId: task.aircraftId || "",
        assignedTo: task.assignedTo || "",
        createdBy: task.createdBy || user?.id || "",
        title: task.title || "",
        description: task.description || "",
        severity: task.severity || "routine",
        status: task.status || "open",
        createdDate: task.createdDate || new Date().toISOString().split("T")[0],
      };

      setTasks((prev) => [...prev, newTask]);
    },
    [user?.id]
  );

  const handleSubmitTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    },
    []
  );

  const handleApproveTask = useCallback(
    (taskId: string, managerNotes?: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: "approved" as const, managerNotes }
            : task
        )
      );
    },
    []
  );

  const handleRejectTask = useCallback(
    (taskId: string, managerNotes: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: "rejected" as const, managerNotes }
            : task
        )
      );
    },
    []
  );

  const handleSubmitWorkCard = useCallback(
    (workCard: Partial<MaintenanceRecord>) => {
      const newRecord: MaintenanceRecord = {
        ...workCard,
        id: workCard.id || `MR${Date.now()}`,
        aircraftId: workCard.aircraftId || "",
        date: workCard.date || new Date().toISOString().split("T")[0],
        type: workCard.type || "repair",
        description: workCard.description || "",
        engineer: workCard.engineer || user?.name || "",
        status: workCard.status || "pending",
      };

      setMaintenanceRecords((prev) => [...prev, newRecord]);
    },
    [user?.name]
  );

  const handleSubmitPilotReport = useCallback(
    (report: Partial<PilotReport>) => {
      const newReport: PilotReport = {
        ...report,
        id: report.id || `PR${Date.now()}`,
        aircraftId: report.aircraftId || "",
        date: report.date || new Date().toISOString().split("T")[0],
        pilot: report.pilot || user?.name || "",
        issue: report.issue || "",
        severity: report.severity || "low",
        status: report.status || "open",
      };

      setPilotReports((prev) => [...prev, newReport]);
    },
    [user?.name]
  );

  const handleBack = useCallback(() => {
    if (currentView === "detail") {
      setSelectedAircraft(null);
      setCurrentView("dashboard");
    } else if (currentView === "workcard") {
      setSelectedTask(null);
      setCurrentView(user?.role === "engineer" ? "tasks" : "dashboard");
    } else if (currentView === "task-verification") {
      setSelectedTask(null);
      setCurrentView("pending-approvals");
    } else if (currentView === "pending-approvals") {
      setCurrentView("dashboard");
    } else {
      // Default back behavior
      if (user?.role === "manager") {
        setCurrentView("dashboard");
      } else if (user?.role === "engineer") {
        setCurrentView("tasks");
      } else if (user?.role === "pilot") {
        setCurrentView("report");
      }
    }
  }, [currentView, user?.role]);

  // Show login page if user is not authenticated
  if (!user) {
    return (
      <div className="dark min-h-screen bg-background">
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background">
      <Navigation
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />

      <main className="container mx-auto p-6">
        {/* Manager Views */}
        {currentView === "dashboard" && user.role === "manager" && (
          <FleetDashboard
            aircraft={mockAircraft}
            tasks={tasks}
            engineers={engineers}
            onAircraftSelect={handleAircraftSelect}
            onCreateTask={handleCreateTask}
            onViewPendingApprovals={() => setCurrentView("pending-approvals")}
          />
        )}

        {currentView === "detail" &&
          selectedAircraft &&
          user.role === "manager" && (
            <AircraftDetail
              aircraft={selectedAircraft}
              maintenanceRecords={maintenanceRecords}
              pilotReports={pilotReports}
              onBack={handleBack}
            />
          )}

        {currentView === "pending-approvals" && user.role === "manager" && (
          <PendingApprovals
            tasks={tasks}
            aircraft={mockAircraft}
            engineers={engineers}
            onBack={handleBack}
            onTaskSelect={handleTaskSelect}
          />
        )}

        {currentView === "task-verification" &&
          selectedTask &&
          user.role === "manager" && (
            <TaskVerification
              task={selectedTask}
              aircraft={
                mockAircraft.find((ac) => ac.id === selectedTask.aircraftId) ||
                mockAircraft[0]
              }
              engineerName={
                engineers.find((e) => e.id === selectedTask.assignedTo)?.name ||
                "Unknown"
              }
              onBack={handleBack}
              onApprove={handleApproveTask}
              onReject={handleRejectTask}
            />
          )}

        {/* Engineer Views */}
        {currentView === "tasks" && user.role === "engineer" && (
          <EngineerTaskList
            tasks={tasks}
            aircraft={mockAircraft}
            engineerId={user.id}
            onTaskSelect={handleTaskSelect}
            onBack={handleBack}
          />
        )}

        {currentView === "workcard" &&
          selectedTask &&
          user.role === "engineer" && (
            <TaskWorkCard
              task={selectedTask}
              aircraft={
                mockAircraft.find((ac) => ac.id === selectedTask.aircraftId) ||
                mockAircraft[0]
              }
              onBack={handleBack}
              onSubmitTask={handleSubmitTask}
            />
          )}

        {/* Legacy Engineer Work Card (for creating new maintenance records) */}
        {currentView === "legacy-workcard" && user.role === "engineer" && (
          <EngineerWorkCard
            aircraft={mockAircraft}
            onBack={handleBack}
            onSubmitWorkCard={handleSubmitWorkCard}
          />
        )}

        {/* Pilot Views */}
        {currentView === "report" && user.role === "pilot" && (
          <PilotReporting
            flights={mockFlights}
            pilotId={user.id}
            onSubmitReport={handleSubmitPilotReport}
            onBack={handleBack}
          />
        )}

        {/* Admin Views */}
        {currentView === "admin-panel" && user.role === "admin" && (
          <AdminPanel user={user} />
        )}
      </main>
      <Toaster />
    </div>
  );
}
