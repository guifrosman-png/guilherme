import { ChartConfig } from '../types/dashboard.types';
import { DashboardChartCard } from './DashboardChartCard';

// ==================== INTERFACES ====================

interface DashboardChartsGridProps {
  charts: ChartConfig[];
  onDrillIn?: (chart: ChartConfig) => void;
  onEdit?: (chart: ChartConfig) => void;
}

// ==================== COMPONENTE ====================

export function DashboardChartsGrid({
  charts,
  onDrillIn,
  onEdit
}: DashboardChartsGridProps) {
  if (!charts || charts.length === 0) {
    return null;
  }

  // Separa charts por tamanho
  // full = ocupa linha inteira
  // half = ocupa metade
  // Se nao especificado, o primeiro e full e os demais sao half
  const getChartSize = (chart: ChartConfig, index: number): 'full' | 'half' => {
    if (chart.size) return chart.size;
    return index === 0 ? 'full' : 'half';
  };

  return (
    <div className="space-y-4">
      {charts.map((chart, index) => {
        const size = getChartSize(chart, index);
        const isFullWidth = size === 'full';

        // Se for half, tenta agrupar com o proximo
        if (!isFullWidth) {
          const nextChart = charts[index + 1];
          const nextSize = nextChart ? getChartSize(nextChart, index + 1) : 'full';

          // Se o proximo tambem for half e este for par, renderiza os dois juntos
          if (nextSize === 'half' && index % 2 === 0) {
            return null; // Sera renderizado pelo proximo
          }

          // Se este for impar (segundo de um par), renderiza o par
          if (index % 2 === 1) {
            const prevChart = charts[index - 1];
            const prevSize = prevChart ? getChartSize(prevChart, index - 1) : 'full';

            if (prevSize === 'half') {
              return (
                <div key={chart.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DashboardChartCard
                    chart={prevChart}
                    onDrillIn={onDrillIn}
                    onEdit={onEdit}
                  />
                  <DashboardChartCard
                    chart={chart}
                    onDrillIn={onDrillIn}
                    onEdit={onEdit}
                  />
                </div>
              );
            }
          }
        }

        // Renderiza full width ou half sozinho
        return (
          <DashboardChartCard
            key={chart.id}
            chart={chart}
            onDrillIn={onDrillIn}
            onEdit={onEdit}
            className={isFullWidth ? '' : 'md:w-1/2'}
          />
        );
      })}
    </div>
  );
}

export default DashboardChartsGrid;
