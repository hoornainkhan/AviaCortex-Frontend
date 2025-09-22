import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Task, Aircraft, User } from '../types';
import { Search, Calendar, User as UserIcon, Plane, ArrowLeft, Eye } from 'lucide-react';

interface PendingApprovalsProps {
  tasks: Task[];
  aircraft: Aircraft[];
  engineers: User[];
  onBack: () => void;
  onTaskSelect: (task: Task) => void;
}

export function PendingApprovals({ tasks, aircraft, engineers, onBack, onTaskSelect }: PendingApprovalsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const pendingTasks = tasks.filter(t => t.status === 'pending-review');

  const filteredTasks = pendingTasks.filter(task => {
    const aircraft_info = aircraft.find(ac => ac.id === task.aircraftId);
    const engineer_info = engineers.find(eng => eng.id === task.assignedTo);
    
    return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           aircraft_info?.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
           engineer_info?.name.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    // Sort by severity: critical > major > routine, then by completion date
    const severityOrder = { critical: 3, major: 2, routine: 1 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return new Date(b.completedDate || 0).getTime() - new Date(a.completedDate || 0).getTime();
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'routine': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'major': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAircraftInfo = (aircraftId: string) => {
    return aircraft.find(ac => ac.id === aircraftId);
  };

  const getEngineerInfo = (engineerId: string) => {
    return engineers.find(eng => eng.id === engineerId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve completed maintenance tasks</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-amber-500">
              {pendingTasks.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-red-500">
              {pendingTasks.filter(t => t.severity === 'critical').length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Critical Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-semibold text-blue-500">
              {pendingTasks.filter(t => t.completedDate === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Completed Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks Awaiting Review</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {pendingTasks.length === 0 
                    ? "No tasks pending approval at this time." 
                    : "No tasks found matching your search criteria."
                  }
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const aircraftInfo = getAircraftInfo(task.aircraftId);
                const engineerInfo = getEngineerInfo(task.assignedTo);
                
                return (
                  <Card key={task.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-6" onClick={() => onTaskSelect(task)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6 text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {aircraftInfo && (
                                <div className="flex items-center gap-2">
                                  <Plane className="h-4 w-4 text-muted-foreground" />
                                  <span>{aircraftInfo.registration}</span>
                                </div>
                              )}
                              {engineerInfo && (
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{engineerInfo.name}</span>
                                </div>
                              )}
                              {task.completedDate && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>Completed {new Date(task.completedDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge className={getSeverityColor(task.severity)}>
                            {task.severity.charAt(0).toUpperCase() + task.severity.slice(1)}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Review & Approve
                          </Button>
                        </div>
                      </div>

                      {/* Photos indicator */}
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-3 h-3 rounded-full ${task.beforePhoto ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Before Photo</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-3 h-3 rounded-full ${task.afterPhoto ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>After Photo</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-3 h-3 rounded-full ${task.engineerNotes ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Work Notes</span>
                        </div>
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