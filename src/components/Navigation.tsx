import { Button } from './ui/button';
import { User } from '../types';
import { Plane, FileText, LogOut, Settings } from 'lucide-react';

interface NavigationProps {
  user: User;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Navigation({ user, currentView, onViewChange, onLogout }: NavigationProps) {
  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-lg">✈</span>
            </div>
            <div>
              <h1 className="font-semibold">Fleet Management</h1>
              <p className="text-xs text-muted-foreground">Airline Operations</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            {user.role === 'manager' && (
              <>
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('dashboard')}
                  className="gap-2"
                >
                  <Plane className="h-4 w-4" />
                  Fleet Dashboard
                </Button>
                {currentView === 'pending-approvals' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Pending Approvals
                  </Button>
                )}
              </>
            )}
            {user.role === 'engineer' && (
              <>
                <Button
                  variant={currentView === 'tasks' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('tasks')}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  My Tasks
                </Button>
                {currentView === 'workcard' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Work Card
                  </Button>
                )}
              </>
            )}
            {user.role === 'pilot' && (
              <Button
                variant={currentView === 'report' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('report')}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Submit Report
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}