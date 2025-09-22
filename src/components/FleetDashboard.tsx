import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Aircraft, Task, User } from '../types';
import { HealthScoreBar } from './HealthScoreBar';
import { TaskCreation } from './TaskCreation';
import { Search, Filter, Plane, MapPin, Clock, Settings, AlertTriangle } from 'lucide-react';

interface FleetDashboardProps {
  aircraft: Aircraft[];
  tasks: Task[];
  engineers: User[];
  onAircraftSelect: (aircraft: Aircraft) => void;
  onCreateTask: (task: Partial<Task>) => void;
  onViewPendingApprovals: () => void;
}

export function FleetDashboard({ aircraft, tasks, engineers, onAircraftSelect, onCreateTask, onViewPendingApprovals }: FleetDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('health');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'maintenance': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'grounded': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredAndSortedAircraft = aircraft
    .filter(ac => {
      const matchesSearch = ac.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ac.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ac.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'health':
          return b.healthScore - a.healthScore;
        case 'registration':
          return a.registration.localeCompare(b.registration);
        case 'model':
          return a.model.localeCompare(b.model);
        default:
          return 0;
      }
    });

  const criticalAircraft = aircraft.filter(ac => ac.healthScore < 60).length;
  const maintenanceAircraft = aircraft.filter(ac => ac.status === 'maintenance').length;
  const operationalAircraft = aircraft.filter(ac => ac.status === 'operational').length;
  const pendingApprovals = tasks.filter(t => t.status === 'pending-review').length;

  return (
    <div className="space-y-6">
      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <Plane className="h-6 w-6 text-primary" />
              {aircraft.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total Aircraft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold text-green-500">
              {operationalAircraft}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold text-amber-500">
              {maintenanceAircraft}
            </div>
            <p className="text-sm text-muted-foreground mt-1">In Maintenance</p>
          </CardContent>
        </Card>
        <Card 
          className={pendingApprovals > 0 ? "cursor-pointer hover:bg-accent/50 border-amber-500/30" : ""}
          onClick={pendingApprovals > 0 ? onViewPendingApprovals : undefined}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-2xl font-semibold text-amber-500">
              <AlertTriangle className="h-6 w-6" />
              {pendingApprovals}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Pending Approvals</p>
            {pendingApprovals > 0 && (
              <Badge variant="outline" className="mt-2 text-xs">Click to review</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fleet Management</CardTitle>
            <TaskCreation 
              aircraft={aircraft}
              engineers={engineers}
              onCreateTask={onCreateTask}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by registration or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="grounded">Grounded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Health Score</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="model">Model</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aircraft List */}
          <div className="space-y-4">
            {filteredAndSortedAircraft.map((ac) => (
              <Card key={ac.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-6" onClick={() => onAircraftSelect(ac)}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Plane className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{ac.registration}</h3>
                        <p className="text-sm text-muted-foreground">{ac.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(ac.status)}>
                        {ac.status.charAt(0).toUpperCase() + ac.status.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{ac.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{ac.flightHours.toLocaleString()} hours</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Next maintenance: </span>
                      <span>{new Date(ac.nextMaintenance).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Aircraft Health Score</span>
                    </div>
                    <HealthScoreBar score={ac.healthScore} size="md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}