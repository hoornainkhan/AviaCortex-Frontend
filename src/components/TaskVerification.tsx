import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Task, Aircraft } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, CheckCircle, X, Eye, Calendar, User, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TaskVerificationProps {
  task: Task;
  aircraft: Aircraft;
  engineerName: string;
  onBack: () => void;
  onApprove: (taskId: string, managerNotes?: string) => void;
  onReject: (taskId: string, managerNotes: string) => void;
}

export function TaskVerification({ task, aircraft, engineerName, onBack, onApprove, onReject }: TaskVerificationProps) {
  const [managerNotes, setManagerNotes] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleApprove = (notes?: string) => {
    onApprove(task.id, notes);
    toast.success('Task Approved. The record has been verified and permanently locked.');
    onBack();
  };

  const handleReject = (notes: string) => {
    onReject(task.id, notes);
    toast.error('Task rejected and returned to engineer for revision.');
    onBack();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'routine': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'major': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Task Verification</h1>
          <p className="text-muted-foreground">Review and approve completed maintenance work</p>
        </div>
      </div>

      {/* Task Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{task.title}</CardTitle>
              <p className="text-muted-foreground mt-1">Task ID: {task.id}</p>
            </div>
            <Badge className={getSeverityColor(task.severity)}>
              {task.severity.charAt(0).toUpperCase() + task.severity.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Aircraft
              </div>
              <p className="font-medium">{aircraft.registration} - {aircraft.model}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Engineer
              </div>
              <p className="font-medium">{engineerName}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Completed
              </div>
              <p className="font-medium">{new Date(task.completedDate!).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Original Description</Label>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            </div>
            
            {task.engineerNotes && (
              <div>
                <Label className="text-sm font-medium">Engineer's Work Notes</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm">{task.engineerNotes}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual Proof Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Photo */}
            <div className="space-y-3">
              <Label className="font-medium">Before Photo</Label>
              {task.beforePhoto ? (
                <div className="space-y-3">
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedPhoto(task.beforePhoto!)}
                  >
                    <ImageWithFallback
                      src={task.beforePhoto}
                      alt="Before repair photo"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedPhoto(task.beforePhoto!)}>
                    View Full Size
                  </Button>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No before photo provided</p>
                </div>
              )}
            </div>

            {/* After Photo */}
            <div className="space-y-3">
              <Label className="font-medium">After Photo</Label>
              {task.afterPhoto ? (
                <div className="space-y-3">
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedPhoto(task.afterPhoto!)}
                  >
                    <ImageWithFallback
                      src={task.afterPhoto}
                      alt="After repair photo"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedPhoto(task.afterPhoto!)}>
                    View Full Size
                  </Button>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No after photo provided</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Manager Review Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any additional notes or comments about this task..."
            value={managerNotes}
            onChange={(e) => setManagerNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Validation Warning */}
      {(!task.beforePhoto || !task.afterPhoto) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: This task is missing required photo documentation. Consider rejecting until proper photos are provided.
          </AlertDescription>
        </Alert>
      )}

      {/* Decision Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-end gap-4">
            {/* Reject Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject this task? It will be returned to the engineer for revision.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                  <Label>Rejection Reason (Required)</Label>
                  <Textarea
                    placeholder="Please provide specific feedback for the engineer..."
                    value={managerNotes}
                    onChange={(e) => setManagerNotes(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleReject(managerNotes)}
                    disabled={!managerNotes.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject Task
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Approve Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Approve & Sign
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve this work? This action will permanently lock the record and add it to the aircraft's maintenance history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleApprove(managerNotes)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirm Approval
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <ImageWithFallback
              src={selectedPhoto}
              alt="Full size photo"
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}