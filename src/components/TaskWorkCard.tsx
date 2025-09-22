import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Task, Aircraft } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Camera, Upload, CheckCircle, AlertTriangle, ArrowLeft, Plane, Calendar, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TaskWorkCardProps {
  task: Task;
  aircraft: Aircraft;
  onBack: () => void;
  onSubmitTask: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskWorkCard({ task, aircraft, onBack, onSubmitTask }: TaskWorkCardProps) {
  const [engineerNotes, setEngineerNotes] = useState(task.engineerNotes || '');
  const [beforePhoto, setBeforePhoto] = useState(task.beforePhoto || '');
  const [afterPhoto, setAfterPhoto] = useState(task.afterPhoto || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (type: 'before' | 'after') => {
    // Simulate photo upload with different placeholder images
    const mockPhotoUrls = {
      before: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=300&fit=crop',
      after: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=400&h=300&fit=crop'
    };
    
    if (type === 'before') {
      setBeforePhoto(mockPhotoUrls.before);
    } else {
      setAfterPhoto(mockPhotoUrls.after);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updates: Partial<Task> = {
      status: 'pending-review',
      engineerNotes,
      beforePhoto,
      afterPhoto,
      completedDate: new Date().toISOString().split('T')[0]
    };

    onSubmitTask(task.id, updates);
    
    toast.success('Task submitted for review successfully!');
    setIsSubmitting(false);
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

  const isFormValid = engineerNotes.trim() && beforePhoto && afterPhoto;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Digital Work Card</h1>
          <p className="text-muted-foreground">Complete maintenance task documentation</p>
        </div>
      </div>

      {/* Task Information */}
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
                <Plane className="h-4 w-4" />
                Aircraft
              </div>
              <p className="font-medium">{aircraft.registration} - {aircraft.model}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <p className="font-medium">{new Date(task.createdDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Due Date
              </div>
              <p className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Task Description</Label>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="text-sm">{task.description}</p>
            </div>
          </div>

          {task.status === 'rejected' && task.managerNotes && (
            <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <Label className="text-red-500 font-medium">Manager Feedback</Label>
              </div>
              <p className="text-sm text-red-600">{task.managerNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Work Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Before Photo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">1</span>
              </div>
              <Label className="font-medium">Upload 'Before' Photo *</Label>
            </div>
            
            <div className="ml-10">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {beforePhoto ? (
                  <div className="space-y-3">
                    <ImageWithFallback
                      src={beforePhoto}
                      alt="Before photo"
                      className="w-full max-w-sm h-48 object-cover rounded-lg mx-auto"
                    />
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Photo Uploaded
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Upload photo showing the issue before repair</p>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => handlePhotoUpload('before')}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {beforePhoto ? 'Replace Photo' : 'Upload Photo'}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Work Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">2</span>
              </div>
              <Label className="font-medium">Log Work Details *</Label>
            </div>
            
            <div className="ml-10">
              <Textarea
                placeholder="Describe the actions taken, parts replaced, procedures followed, and any observations..."
                value={engineerNotes}
                onChange={(e) => setEngineerNotes(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
          </div>

          {/* Step 3: After Photo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">3</span>
              </div>
              <Label className="font-medium">Upload 'After' Photo *</Label>
            </div>
            
            <div className="ml-10">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {afterPhoto ? (
                  <div className="space-y-3">
                    <ImageWithFallback
                      src={afterPhoto}
                      alt="After photo"
                      className="w-full max-w-sm h-48 object-cover rounded-lg mx-auto"
                    />
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Photo Uploaded
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Upload photo showing the completed repair</p>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => handlePhotoUpload('after')}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {afterPhoto ? 'Replace Photo' : 'Upload Photo'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Alert */}
      {!isFormValid && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            All fields and both before/after photos are required before submitting for review.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Ready to Submit?</h3>
              <p className="text-sm text-muted-foreground">
                Your work will be sent to the maintenance manager for review and approval.
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="min-w-40"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Process Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <p>Your completed work card is submitted to the maintenance manager</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <p>Manager reviews your work notes and before/after photos</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <p>Upon approval, the record becomes part of the aircraft's permanent maintenance history</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}