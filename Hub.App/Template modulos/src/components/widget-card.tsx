/**
 * Widget Card Component - Baseado no template E4CEO
 * Card padronizado para widgets do MultiFins
 */

import { ReactNode } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { MoreHorizontal, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from './ui/utils'

interface WidgetCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
  expandable?: boolean
  expanded?: boolean
  onToggleExpand?: () => void
  loading?: boolean
}

export function WidgetCard({ 
  title, 
  subtitle, 
  children, 
  className, 
  actions,
  expandable = false,
  expanded = false,
  onToggleExpand,
  loading = false
}: WidgetCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-md",
      "border-l-4 border-l-primary bg-card",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          {expandable && onToggleExpand && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpand}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {expanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {actions || (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          children
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      )}
    </Card>
  )
}