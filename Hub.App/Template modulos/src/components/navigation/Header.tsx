/**
 * Header Component - Baseado no template E4CEO
 * Header fixo com título e controles do sistema
 */

import { ReactNode } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface HeaderProps {
  title: string
  rightContent?: ReactNode
}

export function Header({ title, rightContent }: HeaderProps) {
  return (
    <header className="fixed top-4 left-4 right-80 z-50">
      <div className="flex items-center justify-between h-16 px-6 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10">
        {/* Logo e título */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
              v1.0 PRO
            </Badge>
          </div>
        </div>

        {/* Conteúdo do lado direito */}
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  )
}