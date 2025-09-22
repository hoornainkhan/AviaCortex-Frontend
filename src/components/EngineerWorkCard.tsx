import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Aircraft, MaintenanceRecord } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Camera, Upload, CheckCircle, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';

interface EngineerWorkCardProps {
  aircraft: Aircraft[];
  onBack: () => void;
  onSubmitWorkCard: (workCard: Partial<MaintenanceRecord>) => void;
}

export function EngineerWorkCard({ aircraft, onBack, onSubmitWorkCard }: EngineerWorkCardProps) {
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');
  const [workType, setWorkType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [beforePhoto, setBeforePhoto] = useState<string>('');
  const [afterPhoto, setAfterPhoto] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePhotoUpload = (type: 'before' | 'after') => {
    // Simulate photo upload with placeholder
    const mockPhotoUrl = `https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=300&fit=crop`;
    if (type === 'before') {
      setBeforePhoto(mockPhotoUrl);
    } else {
      setAfterPhoto(mockPhotoUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const workCard: Partial<MaintenanceRecord> = {
      id: `WC${Date.now()}`,
      aircraftId: selectedAircraft,
      date: new Date().toISOString().split('T')[0],
      type: workType as 'routine' | 'repair' | 'inspection',
      description,
      engineer: 'Sarah Johnson', // Mock current user
      status: 'pending',
      beforePhoto,
      afterPhoto
    };

    onSubmitWorkCard(workCard);
    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setSelectedAircraft('');
      setWorkType('');
      setDescription('');
      setBeforePhoto('');
      setAfterPhoto('');
      setShowSuccess(false);
    }, 2000);
  };

  const isFormValid = selectedAircraft && workType && description && beforePhoto && afterPhoto;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Digital Work Card</h1>
            <p className="text-muted-foreground">Log maintenance and repair tasks</p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <Alert className="border-green-500/20 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            Work card submitted successfully and sent for managerial review.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Aircraft Selection */}
            <div className="space-y-2">
              <Label htmlFor="aircraft">Aircraft Registration *</Label>
              <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                <SelectTrigger>
                  <SelectValue placeholder="Select aircraft..." />
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

            {/* Work Type */}
            <div className="space-y-2">
              <Label htmlFor="workType">Work Type *</Label>
              <Select value={workType} onValueChange={setWorkType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Work Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the maintenance work performed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Photo Documentation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <Label>Photo Documentation (Required)</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before Photo */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Before Photo *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {beforePhoto ? (
                      <div className="space-y-3">
                        <ImageWithFallback
                          src={beforePhoto}
                          alt="Before photo"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Photo Uploaded
                        </Badge>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Upload before photo</p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => handlePhotoUpload('before')}
                    >
                      {beforePhoto ? 'Replace Photo' : 'Upload Photo'}
                    </Button>
                  </div>
                </div>

                {/* After Photo */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">After Photo *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {afterPhoto ? (
                      <div className="space-y-3">
                        <ImageWithFallback
                          src={afterPhoto}
                          alt="After photo"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Photo Uploaded
                        </Badge>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Upload after photo</p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => handlePhotoUpload('after')}
                    >
                      {afterPhoto ? 'Replace Photo' : 'Upload Photo'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Warning */}
            {!isFormValid && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  All fields and both before/after photos are required before submission.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submission Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <p>Complete all required fields and upload both before and after photos</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <p>Work card is submitted and automatically sent to the maintenance manager</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <p>Manager reviews the work and photos for approval</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">4</span>
              </div>
              <p>Aircraft maintenance records are updated automatically upon approval</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}