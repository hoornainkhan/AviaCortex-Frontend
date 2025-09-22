import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Task, Aircraft } from "../types";
import {
  Search,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

interface EngineerTaskListProps {
  tasks: Task[];
  aircraft: Aircraft[];
  engineerId: string;
  onTaskSelect: (task: Task) => void;
  onBack?: () => void;
}

export function EngineerTaskList({
  tasks,
  aircraft,
  engineerId,
  onTaskSelect,
  onBack,
}: EngineerTaskListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const myTasks = tasks.filter((task) => task.assignedTo === engineerId);

  const filteredTasks = myTasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by priority: critical > major > routine, then by date
      const severityOrder = { critical: 3, major: 2, routine: 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return (
        new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "in-progress":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "pending-review":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending-review":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "approved":
        return "bg-green-600/10 text-green-600 border-green-600/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "routine":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "major":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAircraftInfo = (aircraftId: string) => {
    return aircraft.find((ac) => ac.id === aircraftId);
  };

  const activeTasksCount = myTasks.filter((t) =>
    ["open", "in-progress"].includes(t.status)
  ).length;
  const pendingReviewCount = myTasks.filter(
    (t) => t.status === "pending-review"
  ).length;
  const completedTasksCount = myTasks.filter(
    (t) => t.status === "approved"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-semibold">My Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your assigned maintenance tasks
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold text-amber-500">
              <Clock className="h-6 w-6" />
              {activeTasksCount}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Active Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold text-green-500">
              <CheckCircle className="h-6 w-6" />
              {pendingReviewCount}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold text-blue-500">
              <FileText className="h-6 w-6" />
              {completedTasksCount}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending-review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No tasks found matching your criteria.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const aircraftInfo = getAircraftInfo(task.aircraftId);
                return (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <CardContent
                      className="p-6"
                      onClick={() => onTaskSelect(task)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getStatusIcon(task.status)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {aircraftInfo && (
                                <span>
                                  {aircraftInfo.registration} -{" "}
                                  {aircraftInfo.model}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Created{" "}
                                {new Date(
                                  task.createdDate
                                ).toLocaleDateString()}
                              </span>
                              {task.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Due{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge className={getSeverityColor(task.severity)}>
                            {task.severity.charAt(0).toUpperCase() +
                              task.severity.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status
                              .replace("-", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>

                      {task.status === "rejected" && task.managerNotes && (
                        <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <p className="text-sm text-red-600 font-medium mb-1">
                            Manager Feedback:
                          </p>
                          <p className="text-sm text-red-600">
                            {task.managerNotes}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          {task.status === "open" || task.status === "rejected"
                            ? "Start Work"
                            : "View Details"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
