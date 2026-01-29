// ============================================
// REPORTS DATA - Mock Data dos Relatórios
// ============================================

import { Report, ReportCategory, MODULE_ICONS, MODULE_LABELS, ReportModule } from '../types/report.types';
import { DashboardConfig } from '../types/dashboard.types';

// ============================================
// AUTO-DISCOVERY (PLUG-AND-PLAY)
// ============================================

// 1. Carrega todos os arquivos .ts dentro da pasta reports e subpastas
// Eager: carrega imediatamente para estar disponivel na inicializacao
const modules = (import.meta as any).glob('../reports/**/*.ts', { eager: true });

// 2. Transforma os módulos encontrados em objetos Report
const discoveredReports: Report[] = [];

for (const path in modules) {
  // Ignora index.ts ou arquivos de teste/tipos
  if (path.includes('index.ts') || path.includes('.test.ts') || path.includes('.d.ts')) {
    continue;
  }

  const moduleExports = modules[path];

  // Procura por um export que pareça ser uma configuração de dashboard
  // Geralmente é o export nomeado que termina com 'Mock' ou 'Report' ou apenas a configuração
  const config = Object.values(moduleExports).find(exportItem =>
    exportItem &&
    typeof exportItem === 'object' &&
    'id' in exportItem &&
    'title' in exportItem &&
    'module' in exportItem
  ) as DashboardConfig | undefined;

  if (config) {
    // Se encontrou uma configuração válida, converte para Report
    const report: Report = {
      id: config.id,
      code: config.reportId || `REL-${config.module.toUpperCase()}-${Math.floor(Math.random() * 1000)}`, // Fallback para codigo
      title: config.title,
      description: config.description || `Relatório de ${config.title}`,
      icon: MODULE_ICONS[config.module as ReportModule] || 'FileText',
      module: config.module as ReportModule,
      category: 'system',
      owner: config.owner || 'Sistema',
      createdAt: new Date('2024-01-01'), // Data fixa para evitar mudanças constantes no mock
      updatedAt: new Date(),
      isFavorite: false,
      config: {
        columns: [],
        metrics: config.kpis ? config.kpis.map((kpi, index) => ({
          id: kpi.id,
          size: '1x1', // Default size
          row: 0,
          col: index
        })) : [],
        components: []
      }
    };

    discoveredReports.push(report);
  }
}

/**
 * Relatórios padrão do sistema (Auto-discovered)
 */
export const systemReports: Report[] = discoveredReports;

/**
 * Gera itens da sidebar dinamicamente com base nos módulos dos relatórios descobertos
 */
export function getDiscoveredModules(): { id: string; label: string; icon: string }[] {
  const uniqueModules = new Set(discoveredReports.map(r => r.module));

  return Array.from(uniqueModules).map(moduleId => ({
    id: moduleId,
    label: MODULE_LABELS[moduleId] || moduleId,
    icon: MODULE_ICONS[moduleId] || 'FileText'
  }));
}

// Pre-compute for exports
export const DYNAMIC_MODULE_SIDEBAR_ITEMS = getDiscoveredModules();

/**
 * Relatórios criados pelo usuário (mock para demonstração)
 */
export const userReports: Report[] = [];

/**
 * Relatórios compartilhados (mock para demonstração)
 */
export const sharedReports: Report[] = [];

/**
 * Todos os relatórios combinados
 */
export const allReports: Report[] = [
  ...systemReports,
  ...userReports,
  ...sharedReports
];

/**
 * Obtém relatórios por categoria
 */
export function getReportsByCategory(category: ReportCategory): Report[] {
  switch (category) {
    case 'system':
      return systemReports;
    case 'user':
      return userReports;
    case 'shared':
      return sharedReports;
    default:
      return allReports;
  }
}

/**
 * Obtém um relatório por ID
 */
export function getReportById(id: string): Report | undefined {
  return allReports.find(r => r.id === id);
}

/**
 * Obtém relatórios favoritados
 */
export function getFavoriteReports(): Report[] {
  return allReports.filter(r => r.isFavorite);
}

/**
 * Contadores para as tabs
 */
export function getReportCounts(): { shared: number; user: number; system: number } {
  return {
    shared: sharedReports.length,
    user: userReports.length,
    system: systemReports.length
  };
}
