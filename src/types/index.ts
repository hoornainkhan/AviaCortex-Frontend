export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  location: string;
  status: 'operational' | 'maintenance' | 'grounded';
  healthScore: number; // 0-100
  lastMaintenance: string;
  nextMaintenance: string;
  flightHours: number;
  components: Component[];
}

export interface Component {
  id: string;
  name: string;
  status: 'good' | 'warning' | 'critical';
  lastInspected: string;
  nextInspection: string;
  condition: string;
}

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  engineer: string;
  status: 'pending' | 'in-progress' | 'completed';
  beforePhoto?: string;
  afterPhoto?: string;
  managerApproval?: boolean;
}

export interface PilotReport {
  id: string;
  aircraftId: string;
  date: string;
  pilot: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
}

export interface User {
  id: string;
  name: string;
  role: 'manager' | 'engineer' | 'pilot';
  email: string;
}

export interface Task {
  id: string;
  aircraftId: string;
  assignedTo: string; // engineer ID
  createdBy: string; // manager ID
  title: string;
  description: string;
  severity: 'routine' | 'major' | 'critical';
  status: 'open' | 'in-progress' | 'pending-review' | 'approved' | 'rejected';
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  engineerNotes?: string;
  managerNotes?: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  aircraftId: string;
  date: string;
  route: string;
  pilot: string;
}