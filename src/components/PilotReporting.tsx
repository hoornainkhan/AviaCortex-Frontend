import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Flight, PilotReport } from "../types";
import {
  Plane,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PilotReportingProps {
  flights: Flight[];
  pilotId: string;
  onSubmitReport: (report: Partial<PilotReport>) => void;
  onBack?: () => void;
}

export function PilotReporting({
  flights,
  pilotId,
  onSubmitReport,
  onBack,
}: PilotReportingProps) {
  const [tailNumber, setTailNumber] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("low");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newReport: Partial<PilotReport> = {
      id: `PR${Date.now()}`,
      aircraftId: tailNumber,
      date: new Date().toISOString().split("T")[0],
      pilot: pilotId, // Use pilotId directly
      issue: reportDetails,
      severity,
      status: "open",
    };

    onSubmitReport(newReport);

    toast.success(
      "Report submitted successfully. Maintenance team has been notified."
    );
    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setTailNumber("");
      setReportDetails("");
      setSeverity("low");
      setShowSuccess(false);
    }, 2000);
  };

  const isFormValid = tailNumber.trim() && reportDetails.trim();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
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
          <p className="text-muted-foreground">
            Report any maintenance issues or observations from your recent
            flights
          </p>
        </div>
      </div>

      {showSuccess && (
        <Alert className="border-green-500/20 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            Report submitted successfully. The maintenance team has been
            notified and will investigate promptly.
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
            {/* Tail Number Input */}
            <div className="space-y-2">
              <Label htmlFor="tailNumber">Aircraft Tail Number *</Label>
              <input
                id="tailNumber"
                type="text"
                value={tailNumber}
                onChange={(e) => setTailNumber(e.target.value)}
                placeholder="Enter aircraft tail number (e.g., N12345)"
                className="w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Severity Level */}
            <div className="space-y-2">
              <Label htmlFor="severity">Issue Severity</Label>
              <Select
                value={severity}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setSeverity(value)
                }
              >
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
                  Please enter a tail number and provide report details before
                  submitting.
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
                {isSubmitting ? "Submitting..." : "Submit Report"}
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
                <li>
                  • Reports are automatically linked to aircraft maintenance
                  records
                </li>
                <li>
                  • High severity reports trigger immediate maintenance
                  notifications
                </li>
                <li>
                  • Your report helps maintain fleet safety and reliability
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
