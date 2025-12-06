import { AlertTriangle, Clock, Info, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";

interface UsageStep {
  title: string;
  description: string;
  icon?: string;
  timing?: string;
}

interface HowToUseData {
  steps?: UsageStep[];
  frequency?: string;
  warnings?: string[];
  proTips?: string[];
  note?: string;
}

interface HowToUseTabProps {
  instructions?: HowToUseData;
}

// Map icon names to actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  info: Info,
  lightbulb: Lightbulb,
  // Add more icon mappings as needed
};

export function HowToUseTab({ instructions }: HowToUseTabProps) {
  // Handle missing instructions gracefully
  if (!instructions) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          Usage instructions will be added soon. Please check back later.
        </p>
      </div>
    );
  }

  const hasSteps = instructions.steps && instructions.steps.length > 0;
  const hasWarnings = instructions.warnings && instructions.warnings.length > 0;
  const hasProTips = instructions.proTips && instructions.proTips.length > 0;
  const hasFrequency = instructions.frequency && instructions.frequency.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Usage Steps with Icons */}
      {hasSteps && (
        <div>
          <h3 className="text-xl font-semibold mb-6">How to Use</h3>
          <div className="space-y-6">
            {instructions.steps!.map((step, index) => {
              // Get icon component if available
              const IconComponent = step.icon ? iconMap[step.icon.toLowerCase()] : null;

              return (
                <div key={index} className="flex gap-4">
                  {/* Step Number or Icon */}
                  <div className="shrink-0">
                    {IconComponent ? (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                      
                      {/* Timing Information - Displayed Prominently */}
                      {step.timing && (
                        <Badge variant="secondary" className="shrink-0">
                          <Clock className="h-3 w-3" />
                          {step.timing}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Frequency */}
      {hasFrequency && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Recommended Frequency
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {instructions.frequency}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warnings - Highlighted in Alert Boxes */}
      {hasWarnings && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Important Warnings</h4>
          {instructions.warnings!.map((warning, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Pro Tips - Highlighted in Info Boxes */}
      {hasProTips && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Pro Tips</h4>
          {instructions.proTips!.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900"
            >
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Additional Note */}
      {instructions.note && (
        <div className="p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Note:</span> {instructions.note}
          </p>
        </div>
      )}

      {/* Show message if no data available */}
      {!hasSteps && !hasWarnings && !hasProTips && !hasFrequency && !instructions.note && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Usage instructions will be added soon. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
