import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Aircraft, MaintenanceRecord, PilotReport } from '../types';
import { HealthScoreBar } from './HealthScoreBar';
import { ArrowLeft, Plane, MapPin, Clock, AlertTriangle, CheckCircle, Settings, FileText, User } from 'lucide-react';

interface AircraftDetailProps {
  aircraft: Aircraft;
  maintenanceRecords: MaintenanceRecord[];
  pilotReports: PilotReport[];
  onBack: () => void;
}

export function AircraftDetail({ aircraft, maintenanceRecords, pilotReports, onBack }: AircraftDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'maintenance': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'grounded': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getComponentStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const aircraftMaintenanceRecords = maintenanceRecords.filter(mr => mr.aircraftId === aircraft.id);
  const aircraftPilotReports = pilotReports.filter(pr => pr.aircraftId === aircraft.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Plane className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">{aircraft.registration}</h1>
            <p className="text-muted-foreground">{aircraft.model}</p>
          </div>
        </div>
        <div className="ml-auto">
          <Badge className={getStatusColor(aircraft.status)}>
            {aircraft.status.charAt(0).toUpperCase() + aircraft.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Aircraft Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Aircraft Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Current Location
                </div>
                <p className="font-medium">{aircraft.location}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Flight Hours
                </div>
                <p className="font-medium">{aircraft.flightHours.toLocaleString()} hours</p>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Next Maintenance</div>
                <p className="font-medium">{new Date(aircraft.nextMaintenance).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Health Score</span>
              </div>
              <HealthScoreBar score={aircraft.healthScore} size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="components" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">Component Health</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          <TabsTrigger value="reports">Pilot Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aircraft.components.map((component) => (
                  <Card key={component.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getComponentStatusIcon(component.status)}
                        <div>
                          <h4 className="font-medium">{component.name}</h4>
                          <p className="text-sm text-muted-foreground">ID: {component.id}</p>
                        </div>
                      </div>
                      <Badge className={
                        component.status === 'good' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        component.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }>
                        {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{component.condition}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Last Inspected: </span>
                        <span>{new Date(component.lastInspected).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Inspection: </span>
                        <span>{new Date(component.nextInspection).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aircraftMaintenanceRecords.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No maintenance records found for this aircraft.</p>
                ) : (
                  aircraftMaintenanceRecords.map((record) => (
                    <Card key={record.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{record.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(record.date).toLocaleDateString()} • {record.engineer}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {record.type}
                          </Badge>
                          <Badge className={
                            record.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            record.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }>
                            {record.status.replace('-', ' ').charAt(0).toUpperCase() + record.status.replace('-', ' ').slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {record.managerApproval !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">
                            Manager Approval: {record.managerApproval ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pilot Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aircraftPilotReports.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pilot reports found for this aircraft.</p>
                ) : (
                  aircraftPilotReports.map((report) => (
                    <Card key={report.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{report.issue}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(report.date).toLocaleDateString()} • {report.pilot}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                          </Badge>
                          <Badge className={
                            report.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}