import { Aircraft, MaintenanceRecord, PilotReport, User, Task, Flight } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'manager',
    email: 'j.smith@airline.com'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'engineer',
    email: 's.johnson@airline.com'
  },
  {
    id: '3',
    name: 'Rohan Verma',
    role: 'engineer',
    email: 'r.verma@airline.com'
  },
  {
    id: '4',
    name: 'Captain Williams',
    role: 'pilot',
    email: 'c.williams@airline.com'
  }
];

export const mockAircraft: Aircraft[] = [
  {
    id: 'AC001',
    registration: 'N123AA',
    model: 'Boeing 737-800',
    location: 'Gate A12, LAX',
    status: 'operational',
    healthScore: 92,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15',
    flightHours: 12450,
    components: [
      {
        id: 'ENG001',
        name: 'Engine 1',
        status: 'good',
        lastInspected: '2024-01-15',
        nextInspection: '2024-02-15',
        condition: 'Excellent condition, no issues detected'
      },
      {
        id: 'ENG002',
        name: 'Engine 2',
        status: 'good',
        lastInspected: '2024-01-15',
        nextInspection: '2024-02-15',
        condition: 'Good condition, minor wear noted'
      },
      {
        id: 'LG001',
        name: 'Landing Gear',
        status: 'warning',
        lastInspected: '2024-01-10',
        nextInspection: '2024-01-25',
        condition: 'Hydraulic pressure slightly low, monitoring required'
      }
    ]
  },
  {
    id: 'AC002',
    registration: 'N456BB',
    model: 'Airbus A320',
    location: 'Hangar 3, JFK',
    status: 'maintenance',
    healthScore: 78,
    lastMaintenance: '2024-01-18',
    nextMaintenance: '2024-01-25',
    flightHours: 8920,
    components: [
      {
        id: 'ENG003',
        name: 'Engine 1',
        status: 'warning',
        lastInspected: '2024-01-18',
        nextInspection: '2024-01-25',
        condition: 'Oil temperature running high, requires attention'
      },
      {
        id: 'ENG004',
        name: 'Engine 2',
        status: 'good',
        lastInspected: '2024-01-18',
        nextInspection: '2024-02-18',
        condition: 'Operating within normal parameters'
      },
      {
        id: 'AV001',
        name: 'Avionics Suite',
        status: 'critical',
        lastInspected: '2024-01-18',
        nextInspection: '2024-01-20',
        condition: 'Navigation system malfunction, immediate repair required'
      }
    ]
  },
  {
    id: 'AC003',
    registration: 'N789CC',
    model: 'Boeing 777-300ER',
    location: 'Gate B5, ORD',
    status: 'operational',
    healthScore: 96,
    lastMaintenance: '2024-01-12',
    nextMaintenance: '2024-03-12',
    flightHours: 15680,
    components: [
      {
        id: 'ENG005',
        name: 'Engine 1',
        status: 'good',
        lastInspected: '2024-01-12',
        nextInspection: '2024-03-12',
        condition: 'Excellent performance, all parameters normal'
      },
      {
        id: 'ENG006',
        name: 'Engine 2',
        status: 'good',
        lastInspected: '2024-01-12',
        nextInspection: '2024-03-12',
        condition: 'Operating efficiently, no concerns'
      }
    ]
  },
  {
    id: 'AC004',
    registration: 'N321DD',
    model: 'Airbus A330',
    location: 'Maintenance Bay 2, MIA',
    status: 'grounded',
    healthScore: 45,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-01-22',
    flightHours: 22100,
    components: [
      {
        id: 'ENG007',
        name: 'Engine 1',
        status: 'critical',
        lastInspected: '2024-01-20',
        nextInspection: '2024-01-21',
        condition: 'Compressor blade damage detected, engine replacement required'
      },
      {
        id: 'HYD001',
        name: 'Hydraulic System',
        status: 'critical',
        lastInspected: '2024-01-20',
        nextInspection: '2024-01-21',
        condition: 'Major leak in primary hydraulic system'
      }
    ]
  }
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'MR001',
    aircraftId: 'AC001',
    date: '2024-01-15',
    type: 'routine',
    description: 'Regular A-check maintenance',
    engineer: 'Sarah Johnson',
    status: 'completed',
    managerApproval: true
  },
  {
    id: 'MR002',
    aircraftId: 'AC002',
    date: '2024-01-18',
    type: 'repair',
    description: 'Engine oil temperature sensor replacement',
    engineer: 'Mike Chen',
    status: 'in-progress'
  },
  {
    id: 'MR003',
    aircraftId: 'AC004',
    date: '2024-01-20',
    type: 'inspection',
    description: 'Emergency inspection following pilot report',
    engineer: 'Sarah Johnson',
    status: 'pending'
  }
];

export const mockPilotReports: PilotReport[] = [
  {
    id: 'PR001',
    aircraftId: 'AC001',
    date: '2024-01-14',
    pilot: 'Captain Williams',
    issue: 'Slight vibration in left engine during takeoff',
    severity: 'low',
    status: 'resolved'
  },
  {
    id: 'PR002',
    aircraftId: 'AC002',
    date: '2024-01-17',
    pilot: 'Captain Rodriguez',
    issue: 'Navigation display intermittent failure',
    severity: 'high',
    status: 'open'
  },
  {
    id: 'PR003',
    aircraftId: 'AC004',
    date: '2024-01-19',
    pilot: 'Captain Thompson',
    issue: 'Unusual engine noise and hydraulic pressure warning',
    severity: 'high',
    status: 'open'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'T001',
    aircraftId: 'AC002',
    assignedTo: '2',
    createdBy: '1',
    title: 'Navigation System Repair',
    description: 'Fix navigation display intermittent failure reported by pilot',
    severity: 'major',
    status: 'pending-review',
    createdDate: '2024-01-18',
    completedDate: '2024-01-19',
    beforePhoto: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=300&fit=crop',
    afterPhoto: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=400&h=300&fit=crop',
    engineerNotes: 'Replaced faulty display unit and updated firmware. All systems tested and functioning normally.'
  },
  {
    id: 'T002',
    aircraftId: 'AC001',
    assignedTo: '3',
    createdBy: '1',
    title: 'Engine Vibration Check',
    description: 'Investigate and resolve slight vibration in left engine during takeoff',
    severity: 'routine',
    status: 'in-progress',
    createdDate: '2024-01-19',
    dueDate: '2024-01-21'
  },
  {
    id: 'T003',
    aircraftId: 'AC004',
    assignedTo: '2',
    createdBy: '1',
    title: 'Emergency Engine Replacement',
    description: 'Replace damaged engine compressor blades and conduct full inspection',
    severity: 'critical',
    status: 'open',
    createdDate: '2024-01-20',
    dueDate: '2024-01-22'
  }
];

export const mockFlights: Flight[] = [
  {
    id: 'F001',
    flightNumber: '6E-202',
    aircraftId: 'AC001',
    date: '2024-01-19',
    route: 'DEL - BOM',
    pilot: 'Captain Williams'
  },
  {
    id: 'F002',
    flightNumber: '6E-156',
    aircraftId: 'AC003',
    date: '2024-01-19',
    route: 'BOM - BLR',
    pilot: 'Captain Williams'
  },
  {
    id: 'F003',
    flightNumber: '6E-445',
    aircraftId: 'AC001',
    date: '2024-01-18',
    route: 'BLR - CCU',
    pilot: 'Captain Rodriguez'
  }
];