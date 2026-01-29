import { useState } from 'react';
import { MoreHorizontal, Maximize2, Edit2, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartConfig } from '../types/dashboard.types';

// ==================== INTERFACES ====================

interface DashboardChartCardProps {
  chart: ChartConfig;
  onDrillIn?: (chart: ChartConfig) => void;
  onEdit?: (chart: ChartConfig) => void;
  className?: string;
}

// ==================== CORES PADRÃO ====================

const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
  '#84cc16', // lime-500
];

// ==================== COMPONENTE ====================

export function DashboardChartCard({
  chart,
  onDrillIn,
  onEdit,
  className = ''
}: DashboardChartCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const hasData = chart.data && chart.data.length > 0;

  const handleDrillIn = () => {
    onDrillIn?.(chart);
    setShowMenu(false);
  };

  const handleEdit = () => {
    onEdit?.(chart);
    setShowMenu(false);
  };

  const renderChart = () => {
    if (!hasData) {
      return (
        <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
          Este grafico nao possui dados
        </div>
      );
    }

    const commonAxisProps = {
      stroke: '#a1a1aa',
      fontSize: 12,
      tickLine: false,
      axisLine: false
    };

    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis dataKey={chart.xAxisKey || 'name'} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {chart.series?.map((serie, index) => (
                <Bar
                  key={serie.key}
                  dataKey={serie.key}
                  name={serie.label}
                  fill={serie.color || CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              )) || (
                  <Bar
                    dataKey="value"
                    fill={CHART_COLORS[0]}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              {chart.showLegend && <Legend />}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis dataKey={chart.xAxisKey || 'name'} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {chart.series?.map((serie, index) => (
                <Line
                  key={serie.key}
                  type="monotone"
                  dataKey={serie.key}
                  name={serie.label}
                  stroke={serie.color || CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )) || (
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              {chart.showLegend && <Legend />}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis dataKey={chart.xAxisKey || 'name'} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {chart.series?.map((serie, index) => (
                <Area
                  key={serie.key}
                  type="monotone"
                  dataKey={serie.key}
                  name={serie.label}
                  stroke={serie.color || CHART_COLORS[index % CHART_COLORS.length]}
                  fill={serie.color || CHART_COLORS[index % CHART_COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              )) || (
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS[0]}
                    fill={CHART_COLORS[0]}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                )}
              {chart.showLegend && <Legend />}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'donut':
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                innerRadius={chart.type === 'donut' ? '60%' : 0}
                outerRadius="80%"
                dataKey="value"
                nameKey="name"
                paddingAngle={chart.type === 'donut' ? 2 : 0}
              >
                {chart.data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {chart.showLegend && (
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'column':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis type="number" {...commonAxisProps} />
              <YAxis type="category" dataKey={chart.xAxisKey || 'name'} {...commonAxisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {chart.series?.map((serie, index) => (
                <Bar
                  key={serie.key}
                  dataKey={serie.key}
                  name={serie.label}
                  fill={serie.color || CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[0, 4, 4, 0]}
                />
              )) || (
                <Bar
                  dataKey="value"
                  fill={CHART_COLORS[0]}
                  radius={[0, 4, 4, 0]}
                />
              )}
              {chart.showLegend && <Legend />}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'combo': {
        const primarySeries = chart.series?.[0];
        const secondarySeries = chart.series?.[1];

        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chart.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis dataKey={chart.xAxisKey || 'name'} {...commonAxisProps} />

              {/* Eixo Y esquerdo */}
              <YAxis
                yAxisId="left"
                {...commonAxisProps}
              />

              {/* Eixo Y direito */}
              <YAxis
                yAxisId="right"
                orientation="right"
                {...commonAxisProps}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />

              {/* Barras (eixo esquerdo) */}
              {primarySeries && (
                <Bar
                  yAxisId="left"
                  dataKey={primarySeries.key}
                  name={primarySeries.label}
                  fill={primarySeries.color || CHART_COLORS[0]}
                  radius={[4, 4, 0, 0]}
                />
              )}

              {/* Linha (eixo direito) */}
              {secondarySeries && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={secondarySeries.key}
                  name={secondarySeries.label}
                  stroke={secondarySeries.color || CHART_COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}

              {chart.showLegend && <Legend />}
            </ComposedChart>
          </ResponsiveContainer>
        );
      }

      case 'heatmap': {
        // Extrai valores únicos para X e Y
        const xValues = Array.from(new Set(chart.data.map(d => d[chart.xAxisKey || 'x'])));
        const yValues = Array.from(new Set(chart.data.map(d => d.y)));

        // Encontra min/max para escala de cores
        const allValues = chart.data.map(d => d.value || 0);
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues);

        // Função para obter cor baseado no valor
        const getHeatmapColor = (value: number) => {
          if (value === 0 || value === null || value === undefined) {
            return 'bg-zinc-100 dark:bg-zinc-800';
          }

          const intensity = (value - minValue) / (maxValue - minValue);

          if (intensity < 0.2) return 'bg-blue-200 dark:bg-blue-900';
          if (intensity < 0.4) return 'bg-blue-300 dark:bg-blue-800';
          if (intensity < 0.6) return 'bg-blue-400 dark:bg-blue-700';
          if (intensity < 0.8) return 'bg-blue-500 dark:bg-blue-600';
          return 'bg-blue-600 dark:bg-blue-500';
        };

        // Cria matriz de dados
        const matrix = yValues.map(y => {
          return xValues.map(x => {
            const cell = chart.data.find(d =>
              d[chart.xAxisKey || 'x'] === x && d.y === y
            );
            return cell?.value || 0;
          });
        });

        return (
          <div className="h-full flex flex-col p-4">
            {/* Labels do eixo Y */}
            <div className="flex gap-2">
              <div className="w-20 flex flex-col justify-around text-xs text-zinc-600 dark:text-zinc-400">
                {yValues.map(y => (
                  <div key={y} className="h-8 flex items-center justify-end pr-2">
                    {y}
                  </div>
                ))}
              </div>

              {/* Grid do Heatmap */}
              <div className="flex-1">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${xValues.length}, 1fr)` }}>
                  {matrix.flat().map((value, i) => {
                    const x = xValues[i % xValues.length];
                    const y = yValues[Math.floor(i / xValues.length)];

                    return (
                      <div
                        key={i}
                        className={`h-8 rounded ${getHeatmapColor(value)} transition-colors cursor-pointer hover:opacity-80`}
                        title={`${x} - ${y}: ${value}`}
                      />
                    );
                  })}
                </div>

                {/* Labels do eixo X */}
                <div className="grid gap-1 mt-2" style={{ gridTemplateColumns: `repeat(${xValues.length}, 1fr)` }}>
                  {xValues.map(x => (
                    <div key={x} className="text-xs text-center text-zinc-600 dark:text-zinc-400">
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legenda de cores */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-6 h-4 rounded bg-blue-200 dark:bg-blue-900" />
                <div className="w-6 h-4 rounded bg-blue-300 dark:bg-blue-800" />
                <div className="w-6 h-4 rounded bg-blue-400 dark:bg-blue-700" />
                <div className="w-6 h-4 rounded bg-blue-500 dark:bg-blue-600" />
                <div className="w-6 h-4 rounded bg-blue-600 dark:bg-blue-500" />
              </div>
              <span>Mais</span>
            </div>
          </div>
        );
      }

      case 'table': {
        // Determina colunas da tabela
        const tableColumns = chart.series?.map(s => s.key) || Object.keys(chart.data[0] || {});
        const tableHeaders = chart.series?.map(s => s.label) || tableColumns;

        // Função para formatar valores
        const formatTableValue = (value: any, columnKey: string) => {
          if (typeof value === 'number') {
            // Verifica se é porcentagem (se key contém 'rate', 'percent', etc)
            if (columnKey.toLowerCase().includes('rate') || columnKey.toLowerCase().includes('percent')) {
              return `${value}%`;
            }
            // Verifica se é moeda
            if (columnKey.toLowerCase().includes('revenue') || columnKey.toLowerCase().includes('value')) {
              return `R$ ${value.toLocaleString('pt-BR')}`;
            }
            return value.toLocaleString('pt-BR');
          }
          return value;
        };

        return (
          <div className="h-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    {tableColumns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-3 text-zinc-700 dark:text-zinc-300"
                      >
                        {formatTableValue(row[col], col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      default:
        return (
          <div className="h-full flex items-center justify-center text-zinc-400">
            Tipo de grafico nao suportado: {chart.type}
          </div>
        );
    }
  };

  return (
    <div
      className={`
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-lg overflow-hidden
        transition-all duration-200
        ${isHovered ? 'shadow-md' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {chart.title}
        </h3>

        {/* Acoes (visivel no hover) */}
        <div className={`
          flex items-center gap-1
          transition-opacity duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          {/* Drill-in */}
          {chart.drillDownDataSource && (
            <button
              onClick={handleDrillIn}
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Drill-in"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}

          {/* Edit */}
          <button
            onClick={handleEdit}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Mais opcoes"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 py-1 z-10">
                <button
                  className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar PNG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4" style={{ height: chart.height || 300 }}>
        {renderChart()}
      </div>
    </div>
  );
}

export default DashboardChartCard;
