
import React from 'react';
import { EyeOff } from 'lucide-react';
import { useViewMode } from '../contexts/ViewModeContext';
import { usePermissions } from '../contexts/PermissionsContext';

interface ManagedFeatureProps {
    id: string; // ID único da feature, ex: 'dashboard.kpis', 'sales.table.col_amount'
    children: React.ReactNode;
    label?: string; // Nome legível para o overlay, ex: "KPIs de Vendas"
    className?: string;
    defaultVisible?: boolean; // Se não definido no contexto, qual o padrão? (Default true)
}

export function ManagedFeature({
    id,
    children,
    label,
    className = '',
}: ManagedFeatureProps) {
    const { isOwnerView, isSindicoView } = useViewMode();
    const { getPermission, togglePermission } = usePermissions();

    const isVisibleForSindico = getPermission(id);

    // MODO SÍNDICO: Se não tiver permissão, e estiver no modo síndico, oculta totalmente
    if (isSindicoView && !isVisibleForSindico) {
        return null;
    }

    // Estrutura consistente para evitar unmount/remount ao trocar de modo
    const isHiddenStyle = isOwnerView && !isVisibleForSindico;

    return (
        <div
            className={`
                relative group/managed transition-all duration-300
                ${className}
                ${isHiddenStyle ? 'opacity-50 grayscale contrast-125 border-2 border-dashed border-slate-300/50 rounded-lg p-1' : ''}
            `}
        >
            {/* Indicador visual apenas no modo editor quando oculto */}
            {isHiddenStyle && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-slate-400 rounded-full z-10 shadow-sm pointer-events-none" title="Item oculto para o síndico" />
            )}
            {children}
        </div>
    );
}
