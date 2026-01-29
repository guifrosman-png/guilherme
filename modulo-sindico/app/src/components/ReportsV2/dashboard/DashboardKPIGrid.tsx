import { DashboardKPI } from '../types/dashboard.types';
import { DashboardKPICard } from './DashboardKPICard';

// ==================== INTERFACES ====================

interface DashboardKPIGridProps {
  kpis: DashboardKPI[];
  onKPIClick?: (kpi: DashboardKPI) => void;
}

// ==================== COMPONENTE ====================

export function DashboardKPIGrid({ kpis, onKPIClick }: DashboardKPIGridProps) {
  if (!kpis || kpis.length === 0) {
    return null;
  }

  // Define o grid baseado na quantidade de KPIs
  // 1-2: 2 colunas
  // 3: 3 colunas
  // 4+: 4 colunas
  const gridCols = kpis.length <= 2
    ? 'md:grid-cols-2'
    : kpis.length === 3
      ? 'md:grid-cols-3'
      : 'md:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      {kpis.map((kpi) => (
        <DashboardKPICard
          key={kpi.id}
          kpi={kpi}
          onClick={onKPIClick}
        />
      ))}
    </div>
  );
}

export default DashboardKPIGrid;
