import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Aircraft, User, Task } from '../types';
import { Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TaskCreationProps {
  aircraft: Aircraft[];
  engineers: User[];
  onCreateTask: (task: Partial<Task>) => void;
}

export function TaskCreation({ aircraft, engineers, onCreateTask }: TaskCreationProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aircraftId, setAircraftId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [severity, setSeverity] = useState<'routine' | 'major' | 'critical'>('routine');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTask: Partial<Task> = {
      id: `T${Date.now()}`,
      title,
      description,
      aircraftId,
      assignedTo,
      severity,
      status: 'open',
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || undefined,
      createdBy: '1' // Mock current manager ID
    };

    onCreateTask(newTask);
    
    // Show success notification
    const selectedEngineer = engineers.find(e => e.id === assignedTo);
    toast.success(`Task successfully created and assigned to ${selectedEngineer?.name}.`);

    // Reset form and close dialog
    setTitle('');
    setDescription('');
    setAircraftId('');
    setAssignedTo('');
    setSeverity('routine');
    setDueDate('');
    setIsSubmitting(false);
    setOpen(false);
  };

  const isFormValid = title && description && aircraftId && assignedTo;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Maintenance Task</DialogTitle>
          <DialogDescription>
            Assign a maintenance task to an engineer for aircraft servicing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aircraft">Select Aircraft *</Label>
              <Select value={aircraftId} onValueChange={setAircraftId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose aircraft..." />
                </SelectTrigger>
                <SelectContent>
                  {aircraft.map((ac) => (
                    <SelectItem key={ac.id} value={ac.id}>
                      {ac.registration} - {ac.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineer">Assign to Engineer *</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose engineer..." />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((engineer) => (
                    <SelectItem key={engineer.id} value={engineer.id}>
                      {engineer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select value={severity} onValueChange={(value: 'routine' | 'major' | 'critical') => setSeverity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Brief title for the maintenance task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Task Details *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed description of the maintenance work required..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {!isFormValid && (
            <Alert>
              <AlertDescription>
                Please fill in all required fields before creating the task.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Assign Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}