// ============================================
// DASHBOARD MOCK DATA
// ============================================
// NOTE: This file is kept for backward compatibility and type safety.
// Specific report data has been moved to individual files in the 'reports' directory
// to support the auto-discovery (plug-and-play) architecture.

import {
  DashboardConfig,
} from '../types/dashboard.types';
import { DrillDownData } from '../types/drilldown.types';

// ============================================
// FUNCOES AUXILIARES
// ============================================

/**
 * Mapa de todos os dashboards
 */
const dashboardsMap: Record<string, DashboardConfig> = {
  // NOTE: Reports are now loaded dynamically via reportsService/reportsData
  // If you need to mock a specific report for tests, add it here explicitly
};

/**
 * Obtem dashboard por ID do relatorio
 */
export function getDashboardById(reportId: string): DashboardConfig | null {
  return dashboardsMap[reportId] || null;
}

// ============================================
// DRILL-DOWN DATA
// ============================================

const drillDownDataMap: Record<string, DrillDownData> = {
  // Add drilldown data here if needed without static imports of sub-modules
};


/**
 * Obtem dados de drill-down por data source
 */
export function getDrillDownData(dataSource: string): DrillDownData | null {
  return drillDownDataMap[dataSource] || null;
}
