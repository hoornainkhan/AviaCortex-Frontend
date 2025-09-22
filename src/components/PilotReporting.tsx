import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Flight, PilotReport } from '../types';
import { Plane, Calendar, MapPin, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PilotReportingProps {
  flights: Flight[];
  pilotId: string;
  onSubmitReport: (report: Partial<PilotReport>) => void;
  onBack?: () => void;
}

export function PilotReporting({ flights, pilotId, onSubmitReport, onBack }: PilotReportingProps) {
  const [selectedFlight, setSelectedFlight] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter flights for the current pilot from the last 7 days
  const recentFlights = flights.filter(flight => {
    const flightDate = new Date(flight.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return flight.pilot.includes('Williams') && flightDate >= weekAgo; // Mock pilot matching
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedFlightData = recentFlights.find(f => f.id === selectedFlight);
    if (!selectedFlightData) return;

    const newReport: Partial<PilotReport> = {
      id: `PR${Date.now()}`,
      aircraftId: selectedFlightData.aircraftId,
      date: new Date().toISOString().split('T')[0],
      pilot: selectedFlightData.pilot,
      issue: reportDetails,
      severity,
      status: 'open'
    };

    onSubmitReport(newReport);
    
    toast.success('Report submitted successfully. Maintenance team has been notified.');
    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setSelectedFlight('');
      setReportDetails('');
      setSeverity('low');
      setShowSuccess(false);
    }, 2000);
  };

  const isFormValid = selectedFlight && reportDetails.trim();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-semibold">Submit Post-Flight Report</h1>
          <p className="text-muted-foreground">Report any maintenance issues or observations from your recent flights</p>
        </div>
      </div>

      {showSuccess && (
        <Alert className="border-green-500/20 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            Report submitted successfully. The maintenance team has been notified and will investigate promptly.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Report Form */}
      <Card>
        <CardHeader>
          <CardTitle>Flight Report Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Flight Selection */}
            <div className="space-y-2">
              <Label htmlFor="flight">Recent Flights *</Label>
              <Select value={selectedFlight} onValueChange={setSelectedFlight}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a flight from your recent flights..." />
                </SelectTrigger>
                <SelectContent>
                  {recentFlights.map((flight) => (
                    <SelectItem key={flight.id} value={flight.id}>
                      <div className="flex items-center gap-3">
                        <Plane className="h-4 w-4" />
                        <span>{flight.flightNumber} - {flight.route}</span>
                        <span className="text-muted-foreground">({new Date(flight.date).toLocaleDateString()})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {recentFlights.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent flights found in the system.</p>
              )}
            </div>

            {/* Selected Flight Details */}
            {selectedFlight && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  {(() => {
                    const flight = recentFlights.find(f => f.id === selectedFlight);
                    return flight ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Aircraft ID: {flight.aircraftId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(flight.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{flight.route}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Severity Level */}
            <div className="space-y-2">
              <Label htmlFor="severity">Issue Severity</Label>
              <Select value={severity} onValueChange={(value: 'low' | 'medium' | 'high') => setSeverity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      Low - Minor observation or routine maintenance needed
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      Medium - Noticeable issue that should be addressed soon
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      High - Significant issue requiring immediate attention
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Report Details */}
            <div className="space-y-2">
              <Label htmlFor="reportDetails">Report Details *</Label>
              <Textarea
                id="reportDetails"
                placeholder="Describe any issues, abnormalities, or maintenance concerns observed during the flight. Be as specific as possible about when the issue occurred, what you noticed, and any relevant flight conditions..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            {/* Validation Warning */}
            {!isFormValid && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please select a flight and provide report details before submitting.
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
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">What to Report:</h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Unusual sounds, vibrations, or smells</li>
                <li>• Instrument readings outside normal ranges</li>
                <li>• Control responsiveness issues</li>
                <li>• Any warning lights or system alerts</li>
                <li>• Structural observations or cabin issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Important Notes:</h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• All reports are confidential and non-punitive</li>
                <li>• Reports are automatically linked to aircraft maintenance records</li>
                <li>• High severity reports trigger immediate maintenance notifications</li>
                <li>• Your report helps maintain fleet safety and reliability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}