import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Heart, Skull, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertCardProps {
  type: "health" | "mortality" | "production" | "general"
  title: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
  actionLabel?: string
  onAction?: () => void
}

export function AlertCard({ 
  type, 
  title, 
  description, 
  severity, 
  timestamp, 
  actionLabel, 
  onAction 
}: AlertCardProps) {
  const severityConfig = {
    low: {
      variant: "default" as const,
      badgeVariant: "secondary" as const,
      icon: Clock
    },
    medium: {
      variant: "warning" as const,
      badgeVariant: "outline" as const,
      icon: AlertTriangle
    },
    high: {
      variant: "destructive" as const,
      badgeVariant: "destructive" as const,
      icon: AlertTriangle
    }
  }

  const typeIcons = {
    health: Heart,
    mortality: Skull,
    production: Clock,
    general: AlertTriangle
  }

  const config = severityConfig[severity]
  const TypeIcon = typeIcons[type]
  const SeverityIcon = config.icon

  return (
    <Alert className={cn(
      "transition-all border-l-4",
      severity === "high" && "border-l-destructive bg-destructive/5",
      severity === "medium" && "border-l-warning bg-warning/5",
      severity === "low" && "border-l-primary bg-primary/5"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={cn(
            "h-5 w-5 mt-0.5",
            severity === "high" && "text-destructive",
            severity === "medium" && "text-warning",
            severity === "low" && "text-primary"
          )}>
            <TypeIcon className="h-full w-full" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <AlertTitle className="text-sm font-medium">{title}</AlertTitle>
              <Badge variant={config.badgeVariant} className="text-xs">
                {severity === "high" ? "Alto" : severity === "medium" ? "Medio" : "Bajo"}
              </Badge>
            </div>
            <AlertDescription className="text-sm">
              {description}
            </AlertDescription>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{timestamp}</span>
              {actionLabel && onAction && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onAction}
                  className="h-6 px-2 text-xs"
                >
                  {actionLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Alert>
  )
}