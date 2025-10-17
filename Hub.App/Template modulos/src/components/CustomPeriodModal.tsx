/**
 * CustomPeriodModal - Modal para seleção de período personalizado
 * Compatível com o design system E4CEO
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Calendar, X } from 'lucide-react'

interface CustomPeriodModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (startDate: string, endDate: string) => void
}

export function CustomPeriodModal({ isOpen, onClose, onApply }: CustomPeriodModalProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate)
      onClose()
      // Reset form
      setStartDate('')
      setEndDate('')
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form
    setStartDate('')
    setEndDate('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Período Personalizado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Data de Início</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">Data de Fim</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="bg-primary hover:bg-primary/90"
          >
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}