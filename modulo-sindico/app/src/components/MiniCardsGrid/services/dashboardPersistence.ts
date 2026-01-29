import type { MetricaAtiva, MetricaConfig, MetricContext, CanvasComponent } from '../types'
import { Activity, DollarSign, Users, TrendingUp, Package, BarChart3, PieChart, Target, Clock, CheckCircle, AlertTriangle, Percent } from 'lucide-react'
import type { ComponentType } from 'react'

/**
 * ============================================
 * DASHBOARD PERSISTENCE SERVICE
 * ============================================
 *
 * Service para persistir layouts de dashboards no localStorage.
 * Cada dashboard é identificado por um ID único e salva seu layout de forma independente.
 *
 * Storage Keys:
 * - 'dashboard_home' → Dashboard geral
 * - 'dashboard_financeiro' → Dashboard do financeiro
 * - 'dashboard_vendas' → Dashboard de vendas
 * - 'dashboard_crm' → Dashboard de CRM
 * - etc.
 */

const STORAGE_PREFIX = 'mcg_dashboard_'
const CUSTOM_CARDS_PREFIX = 'mcg_custom_cards_'
const STORAGE_VERSION = '1.2.0' // Version bump to clear legacy/mock data

// ============================================
// ICON REGISTRY - Mapeia nomes para componentes
// ============================================

type IconName = 'activity' | 'dollar-sign' | 'users' | 'trending-up' | 'package' | 'bar-chart' | 'pie-chart' | 'target' | 'clock' | 'check-circle' | 'alert-triangle' | 'percent'

const ICON_REGISTRY: Record<IconName, ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'activity': Activity,
  'dollar-sign': DollarSign,
  'users': Users,
  'trending-up': TrendingUp,
  'package': Package,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'target': Target,
  'clock': Clock,
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  'percent': Percent
}

/**
 * Versão serializável de MetricaConfig (sem componentes React)
 */
interface SerializableMetricaConfig {
  id: string
  titulo: string
  descricao: string
  showTitle?: boolean
  showDescription?: boolean
  showBorder?: boolean
  showCardBg?: boolean
  cardBgColor?: string
  iconName: IconName
  cor: string
  borderColor: string
  // getValue é reconstruído com base no valueText armazenado
  valueText: string
  categoria: 'filas' | 'investigadores' | 'performance' | 'financeiro' | 'lucratividade'
  context?: MetricContext
  canvasComponents?: CanvasComponent[]
  canvasConfig?: {
    gridCols: number
    gridRows: number
    colorScheme: string
  }
}

interface DashboardStorage {
  version: string
  metrics: MetricaAtiva[]
  lastUpdated: string
}

interface CustomCardsStorage {
  version: string
  cards: SerializableMetricaConfig[]
  lastUpdated: string
}

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Carrega o layout de um dashboard do localStorage
 * @param dashboardId - Identificador único do dashboard (ex: 'home', 'financeiro')
 * @returns Array de métricas ativas ou null se não existir
 */
export function loadDashboard(dashboardId: string): MetricaAtiva[] | null {
  try {
    const key = getStorageKey(dashboardId)
    const stored = localStorage.getItem(key)

    if (!stored) {
      return null
    }

    const data: DashboardStorage = JSON.parse(stored)

    // Verificar versão (para futuras migrações)
    if (data.version !== STORAGE_VERSION) {
      console.warn(
        `[Dashboard Persistence] Versão diferente detectada para "${dashboardId}". ` +
        `Esperado: ${STORAGE_VERSION}, Encontrado: ${data.version}`
      )
      // Por enquanto, aceitar versões diferentes
    }

    return data.metrics
  } catch (error) {
    console.error(`[Dashboard Persistence] Erro ao carregar dashboard "${dashboardId}":`, error)
    return null
  }
}

/**
 * Salva o layout de um dashboard no localStorage
 * @param dashboardId - Identificador único do dashboard
 * @param metrics - Array de métricas ativas com posições
 */
export function saveDashboard(dashboardId: string, metrics: MetricaAtiva[]): void {
  try {
    const key = getStorageKey(dashboardId)
    const data: DashboardStorage = {
      version: STORAGE_VERSION,
      metrics,
      lastUpdated: new Date().toISOString()
    }

    localStorage.setItem(key, JSON.stringify(data))

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dashboard Persistence] Dashboard "${dashboardId}" salvo com ${metrics.length} cards`)
    }
  } catch (error) {
    console.error(`[Dashboard Persistence] Erro ao salvar dashboard "${dashboardId}":`, error)
  }
}

/**
 * Remove o layout de um dashboard do localStorage
 * @param dashboardId - Identificador único do dashboard
 */
export function clearDashboard(dashboardId: string): void {
  try {
    const key = getStorageKey(dashboardId)
    localStorage.removeItem(key)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dashboard Persistence] Dashboard "${dashboardId}" removido`)
    }
  } catch (error) {
    console.error(`[Dashboard Persistence] Erro ao limpar dashboard "${dashboardId}":`, error)
  }
}

/**
 * Verifica se um dashboard tem dados salvos
 * @param dashboardId - Identificador único do dashboard
 */
export function hasSavedDashboard(dashboardId: string): boolean {
  const key = getStorageKey(dashboardId)
  return localStorage.getItem(key) !== null
}

/**
 * Retorna informações sobre um dashboard salvo
 * @param dashboardId - Identificador único do dashboard
 */
export function getDashboardInfo(dashboardId: string): {
  exists: boolean
  cardCount: number
  lastUpdated: string | null
} {
  try {
    const key = getStorageKey(dashboardId)
    const stored = localStorage.getItem(key)

    if (!stored) {
      return { exists: false, cardCount: 0, lastUpdated: null }
    }

    const data: DashboardStorage = JSON.parse(stored)
    return {
      exists: true,
      cardCount: data.metrics.length,
      lastUpdated: data.lastUpdated
    }
  } catch {
    return { exists: false, cardCount: 0, lastUpdated: null }
  }
}

/**
 * Lista todos os dashboards salvos
 */
export function listSavedDashboards(): string[] {
  const dashboards: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) {
      dashboards.push(key.replace(STORAGE_PREFIX, ''))
    }
  }

  return dashboards
}

/**
 * Remove todos os dashboards salvos
 * Use com cuidado!
 */
export function clearAllDashboards(): void {
  const dashboards = listSavedDashboards()
  dashboards.forEach((id) => clearDashboard(id))

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dashboard Persistence] Todos os dashboards removidos (${dashboards.length})`)
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Gera a chave de storage para um dashboard
 */
function getStorageKey(dashboardId: string): string {
  return `${STORAGE_PREFIX}${dashboardId}`
}

/**
 * Gera a chave de storage para custom cards de um contexto
 */
function getCustomCardsKey(contextId: string): string {
  return `${CUSTOM_CARDS_PREFIX}${contextId}`
}

// ============================================
// CUSTOM CARDS - Persistência de cards criados
// ============================================

/**
 * Converte MetricaConfig para formato serializável
 * Remove a função icon e getValue, armazena iconName e valueText
 */
function serializeCard(card: MetricaConfig): SerializableMetricaConfig {
  // Extrair texto do valor para reconstrução
  let valueText = '0'
  try {
    const result = card.getValue({})
    valueText = typeof result === 'string' ? result : String(result)
  } catch {
    valueText = '0'
  }

  return {
    id: card.id,
    titulo: card.titulo,
    descricao: card.descricao,
    showTitle: card.showTitle,
    showDescription: card.showDescription,
    showBorder: card.showBorder,
    showCardBg: card.showCardBg,
    cardBgColor: card.cardBgColor,
    iconName: 'activity', // Default icon for custom cards
    cor: card.cor,
    borderColor: card.borderColor,
    valueText,
    categoria: card.categoria,
    context: card.context,
    canvasComponents: card.canvasComponents,
    canvasConfig: card.canvasConfig
  }
}

/**
 * Reconstrói MetricaConfig a partir do formato serializável
 */
function deserializeCard(serialized: SerializableMetricaConfig): MetricaConfig {
  const icon = ICON_REGISTRY[serialized.iconName] || Activity

  return {
    id: serialized.id,
    titulo: serialized.titulo,
    descricao: serialized.descricao,
    showTitle: serialized.showTitle,
    showDescription: serialized.showDescription,
    showBorder: serialized.showBorder,
    showCardBg: serialized.showCardBg,
    cardBgColor: serialized.cardBgColor,
    icon,
    cor: serialized.cor,
    borderColor: serialized.borderColor,
    getValue: () => serialized.valueText,
    categoria: serialized.categoria,
    context: serialized.context,
    canvasComponents: serialized.canvasComponents,
    canvasConfig: serialized.canvasConfig
  }
}

/**
 * Salva custom cards para um contexto específico
 * @param contextId - Identificador do contexto ('home', 'financeiro', etc.)
 * @param cards - Array de MetricaConfig dos cards customizados
 */
export function saveCustomCards(contextId: string, cards: MetricaConfig[]): void {
  try {
    const key = getCustomCardsKey(contextId)
    const serializedCards = cards.map(serializeCard)

    const data: CustomCardsStorage = {
      version: STORAGE_VERSION,
      cards: serializedCards,
      lastUpdated: new Date().toISOString()
    }

    localStorage.setItem(key, JSON.stringify(data))

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dashboard Persistence] Custom cards para "${contextId}" salvos: ${cards.length} cards`)
    }
  } catch (error) {
    console.error(`[Dashboard Persistence] Erro ao salvar custom cards para "${contextId}":`, error)
  }
}

/**
 * Carrega custom cards de um contexto específico
 * @param contextId - Identificador do contexto ('home', 'financeiro', etc.)
 * @returns Array de MetricaConfig ou array vazio se não existir
 */
export function loadCustomCards(contextId: string): MetricaConfig[] {
  try {
    const key = getCustomCardsKey(contextId)
    const stored = localStorage.getItem(key)

    if (!stored) {
      return []
    }

    const data: CustomCardsStorage = JSON.parse(stored)

    // Enforce version match to clear legacy data
    if (data.version !== STORAGE_VERSION) {
      return []
    }

    const cards = data.cards.map(deserializeCard)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dashboard Persistence] Custom cards para "${contextId}" carregados: ${cards.length} cards`)
    }

    return cards
  } catch (error) {
    console.error(`[Dashboard Persistence] Erro ao carregar custom cards para "${contextId}":`, error)
    return []
  }
}

/**
 * Remove custom cards de um contexto
 * @param contextId - Identificador do contexto
 */
export function clearCustomCards(contextId: string): void {
  try {
    const key = getCustomCardsKey(contextId)
    localStorage.removeItem(key)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dashboard Persistence] Custom cards para "${contextId}" removidos`)
    }
  } catch (error) {
    console.error(`[Dashboard Persistence] Erro ao limpar custom cards para "${contextId}":`, error)
  }
}

/**
 * Verifica se um contexto tem custom cards salvos
 */
export function hasCustomCards(contextId: string): boolean {
  const key = getCustomCardsKey(contextId)
  return localStorage.getItem(key) !== null
}

/**
 * Lista todos os contextos com custom cards salvos
 */
export function listContextsWithCustomCards(): string[] {
  const contexts: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(CUSTOM_CARDS_PREFIX)) {
      contexts.push(key.replace(CUSTOM_CARDS_PREFIX, ''))
    }
  }

  return contexts
}

// ============================================
// DASHBOARDS PRÉ-DEFINIDOS
// ============================================

/**
 * IDs de dashboards conhecidos
 */
export const DASHBOARD_IDS = {
  HOME: 'home',
  FINANCEIRO: 'financeiro',
  VENDAS: 'vendas',
  CRM: 'crm',
  FORMULARIOS: 'formularios'
} as const

export type DashboardId = (typeof DASHBOARD_IDS)[keyof typeof DASHBOARD_IDS]

/**
 * Layouts padrão para dashboards (quando não há dados salvos)
 */
import { DASHBOARD_LAYOUTS } from '../layouts'

export const DEFAULT_LAYOUTS = DASHBOARD_LAYOUTS


/**
 * Carrega dashboard com fallback para layout padrão
 */
export function loadDashboardWithDefault(
  dashboardId: string,
  defaultMetrics?: MetricaAtiva[]
): MetricaAtiva[] {
  const saved = loadDashboard(dashboardId)

  if (saved && saved.length > 0) {
    return saved
  }

  // Tentar layout padrão do registro
  if (DEFAULT_LAYOUTS[dashboardId]) {
    return DEFAULT_LAYOUTS[dashboardId]
  }

  // Fallback para parâmetro ou array vazio
  return defaultMetrics || []
}
