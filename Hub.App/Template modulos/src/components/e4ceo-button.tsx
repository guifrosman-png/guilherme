/**
 * E4CEO Button Component
 * Botão flutuante personalizado baseado no template E4CEO
 */

import { Button } from './ui/button'
import { Sparkles } from 'lucide-react'

interface E4CEOButtonProps {
  variant?: 'floating-ceo' | 'default'
  onClick?: () => void
}

export function E4CEOButton({ variant = 'floating-ceo', onClick }: E4CEOButtonProps) {
  if (variant === 'floating-ceo') {
    return (
      <Button
        onClick={onClick}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
        size="icon"
      >
        <Sparkles className="h-5 w-5 text-white" />
      </Button>
    )
  }

  return (
    <Button onClick={onClick} className="gap-2">
      <Sparkles className="h-4 w-4" />
      E4CEO
    </Button>
  )
}