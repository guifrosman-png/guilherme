/**
 * MiniCardsGrid - Componente standalone de grid de mini-cards configuráveis
 *
 * Features:
 * - Grid 5x5 com drag and drop
 * - Resize via canto inferior direito
 * - Auto-reorganização de cards
 * - Cards de métricas customizáveis
 * - Preview em tempo real durante drag/resize
 *
 * Dependências:
 * - @dnd-kit/core
 * - @dnd-kit/sortable
 * - lucide-react
 * - Componentes UI do shadcn/ui (Card, Dialog, Button, Badge, ScrollArea)
 *
 * Uso:
 * import { MiniCardsGrid } from '@/components/MiniCardsGrid'
 * <MiniCardsGrid data={metricaData} />
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
  type DragMoveEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  LayoutGrid,
  Plus,
  X,
  GripVertical,
  Search,
  Eye,
  Pencil,
  Maximize2,
  Clock,
  Target,
  ListCollapse,
  Users,
  DollarSign,
  XCircle,
  Activity,
  Percent,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  PieChart,
  BarChart3,
  Trophy,
  Tags,
  Package,
  ScatterChart as ScatterChartIcon,
  TrendingDown,
  Wallet
} from 'lucide-react'

import { PROFITABILITY_RAW_DATA } from './data/lucratividade'

// Helper para Scatter Data
const scatterData = PROFITABILITY_RAW_DATA.map(item => ({
  x: item.vlVenda,
  y: item.lucro,
  z: item.margem,
  name: item.produto
}));
import { Card, CardContent } from '@/components/ui/card'

// Componente Explorar
import { ExplorarModal } from './components/ExplorarModal'
// Dialog removido - usando painel lateral
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'


import {
  getMinCardSize,
  COLOR_OPTIONS,
  getDefaultCardSize
} from './constants'
import {
  MetricaConfig,
  MetricaData,
  CardSizeConfig,
  MetricaAtiva,
  ResizeInfo,
  MetricContext,
  ContextFilterType,
  MetricDefinition
} from './types'
import { CardCreatorModal } from './components/CardCreatorModal'
import { CardRenderer } from './components/CardRenderer'
import { loadDashboard, saveDashboard, loadCustomCards, saveCustomCards } from './services/dashboardPersistence'

// Imports de métricas financeiras removidos



// Adapter para converter MetricDefinition (Data Layer) em MetricaConfig (UI Layer)
const adapterV2toConfig = (def: MetricDefinition): MetricaConfig => {
  // Mapeamento de ícones (string -> Component)
  const iconMap: Record<string, any> = {
    'arrow-down': TrendingUp, // Invertido para financeiro (entrada = up no jargão visual comum, ou down se for fluxo?) - Usando TrendingUp para Receita
    'arrow-up': TrendingDown,
    'dollar-sign': Wallet,
    'users': Users,
    'pie-chart': PieChart,
    'trending-up': BarChart3,
    'activity': Activity
  }

  const Icon = def.defaultIcon ? iconMap[def.defaultIcon] || Activity : Activity

  // Cores baseadas no ID/Tipo
  let colorClass = 'text-slate-700'
  let borderClass = 'border-slate-200'
  let colorScheme = 'slate'

  if (def.id.includes('revenue')) { colorClass = 'text-green-600'; borderClass = 'border-green-500'; colorScheme = 'green' }
  if (def.id.includes('expense')) { colorClass = 'text-red-600'; borderClass = 'border-red-500'; colorScheme = 'red' }
  if (def.id.includes('balance')) { colorClass = 'text-blue-600'; borderClass = 'border-blue-500'; colorScheme = 'blue' }
  if (def.id.includes('suppliers')) { colorClass = 'text-amber-600'; borderClass = 'border-amber-500'; colorScheme = 'amber' }

  return {
    id: def.id,
    titulo: def.name,
    descricao: def.description,
    icon: Icon,
    cor: colorClass,
    borderColor: borderClass,
    getValue: () => 'R$ 0,00', // Valor real vem via useMetricsBuilder / cards
    categoria: 'financeiro',
    context: 'financeiro',
    showTitle: true,
    showDescription: true,
    showBorder: true,
    canvasConfig: { gridCols: 1, gridRows: 1, colorScheme },
    // Canvas simplificado (Smart KPI)
    canvasComponents: [{
      id: `kpi-${def.id}`,
      type: 'kpi-unified',
      x: 0, y: 0, width: 1, height: 1,
      props: {
        title: def.name,
        iconName: def.defaultIcon || 'activity',
        valueSize: '28'
      },
      dataSource: {
        type: 'metrics',
        metricsQuery: {
          metric: def.id,
          aggregation: def.aggregation
        }
      }
    }]
  }
}

const FINANCEIRO_V2_CONFIGS: MetricaConfig[] = []


import { cardSalesStockCategory } from './cards/vendas/SalesStockCategoryCard'
import { cardStockoutRisk } from './cards/estoque/StockoutRiskCard'


// Helper wrapper to keep compatibility if needed, or just remove if unused.
// getDefaultCardSize was kept in file? No, I will remove it and import/reimplement if needed.
// Wait, I didn't export getDefaultCardSize from constants.
// I will keep getDefaultCardSize here briefly or reimplement it using DEFAULT_CARD_SIZES which is imported.

// Calcula o tamanho padrão de card baseado nos componentes do canvas (para novos cards)
// ============================================
// CONSTANTES
// ============================================

const GRID_COLS = 10
const MAX_GRID_ROWS = 20

/**
 * Obtém o contexto de uma métrica para filtragem.
 * Se context está definido, usa-o diretamente.
 * Senão, mapeia baseado na categoria legacy.
 */
function getMetricContext(metrica: MetricaConfig): MetricContext {
  if (metrica.context) {
    return metrica.context
  }

  // Mapeamento de categoria legacy para context
  const categoriaToContext: Record<string, MetricContext> = {
    financeiro: 'financeiro',
    lucratividade: 'financeiro',
    filas: 'geral',
    investigadores: 'geral',
    performance: 'geral'
  }

  return categoriaToContext[metrica.categoria] || 'geral'
}

/**
 * Filtra métricas baseado no contexto.
 * Se contextFilter é 'all', retorna todas.
 */
function filterMetricsByContext(
  metrics: MetricaConfig[],
  contextFilter: ContextFilterType
): MetricaConfig[] {
  if (contextFilter === 'all') {
    return metrics
  }

  return metrics.filter((m) => getMetricContext(m) === contextFilter)
}

export const METRICAS_DISPONIVEIS: MetricaConfig[] = [
  // ============================================
  // MÉTRICAS FINANCEIRAS - SHARED DATA LAYER (V2)
  // ============================================
  ...FINANCEIRO_V2_CONFIGS,
  // ============================================
  // MÉTRICAS VENDAS E ESTOQUE
  // ============================================
  cardSalesStockCategory,
  cardStockoutRisk
]

// Cards padrão iniciais (Painel Financeiro - Análises por Valores)
const DEFAULT_METRICS: MetricaAtiva[] = [
  // Linha 0: KPIs de Custo de Atraso e Economia
  { id: 'fin-juros-multas', size: '2x1', row: 0, col: 0 },
  { id: 'fin-economia-descontos', size: '2x1', row: 0, col: 2 },
  { id: 'fin-previsto-realizado', size: '4x2', row: 0, col: 4 }, // Comparativo ocupa mais espaço e altura

  // Linha 2: Top Fornecedores (Tabela/Lista)
  { id: 'fin-top-fornecedores', size: '4x4', row: 2, col: 0 },

  // Linha 2: Gráfico de Evolução (aproveitando o espaço ao lado)
  { id: 'fin-evolution-v2', size: '6x4', row: 2, col: 4 },

  // Linha 6: KPIs Gerais do V2
  { id: 'fin-revenue-v2', size: '2x1', row: 6, col: 0 },
  { id: 'fin-expense-v2', size: '2x1', row: 6, col: 2 },
  { id: 'fin-balance-v2', size: '2x1', row: 6, col: 4 }
]

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

function parseCardSize(size: string): CardSizeConfig {
  const [cols, rows] = size.split('x').map(Number)
  return { cols: cols || 1, rows: rows || 1 }
}

function createCardSize(cols: number, rows: number): string {
  return `${cols}x${rows}`
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface MiniCardsGridProps {
  /** Dados para as métricas */
  data: MetricaData
  /** Métricas iniciais (opcional) */
  initialMetrics?: MetricaAtiva[]
  /** Métricas disponíveis para seleção (opcional) */
  availableMetrics?: MetricaConfig[]
  /** Callback quando métricas mudam */
  onMetricsChange?: (metrics: MetricaAtiva[]) => void
  /** Callback quando o painel de cards abre/fecha */
  onPanelToggle?: (isOpen: boolean) => void
  /** Classe CSS adicional */
  className?: string
  /** Variante do grid: 'card' (com fundo card) ou 'flat' (sem fundo, direto na tela) */
  variant?: 'card' | 'flat'
  /** Conteúdo opcional para a barra de ferramentas (acima do grid) */
  toolbarContent?: React.ReactNode
  /** Conteúdo opcional para filtros ativos (abaixo da toolbar) */
  filterContent?: React.ReactNode
  /**
   * ID único do dashboard para persistência.
   * Ex: 'home', 'financeiro', 'vendas'
   * Se definido, o layout será salvo/carregado automaticamente do localStorage.
   */
  dashboardId?: string
  /**
   * Filtro de contexto para a biblioteca de cards.
   * 'all' = mostra cards de todos os contextos
   * 'financeiro', 'crm', etc. = mostra apenas cards daquele contexto
   */
  contextFilter?: import('./types').ContextFilterType
  /**
   * Se true, salva automaticamente o layout no localStorage quando modificado.
   * Requer dashboardId para funcionar.
   * @default true quando dashboardId está definido
   */
  autoSave?: boolean
  /**
   * Se true, desabilita edições (drag, resize, add, remove, edit).
   */
  readOnly?: boolean
}

export function MiniCardsGrid({
  data,
  initialMetrics = DEFAULT_METRICS,
  availableMetrics = METRICAS_DISPONIVEIS,
  onMetricsChange,
  onPanelToggle,
  className = '',
  variant = 'card',
  toolbarContent,
  filterContent,
  dashboardId,
  contextFilter = 'all',
  autoSave,
  readOnly = false
}: MiniCardsGridProps) {
  // Determinar se deve salvar automaticamente
  const shouldAutoSave = autoSave ?? (dashboardId !== undefined)

  // ===== OTIMIZAÇÃO: Carregar dados de forma lazy =====
  // Usar refs para armazenar dados carregados sem bloquear
  const initialLoadDoneRef = useRef(false)

  // Estados principais - iniciar com valores mínimos para renderização rápida
  const [metricasAtivas, setMetricasAtivas] = useState<MetricaAtiva[]>(() => {
    // Carregamento lazy - usar initialMetrics por padrão
    // Os dados do localStorage serão carregados em useEffect
    return initialMetrics
  })
  const [showMetricasModal, setShowMetricasModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Estados de drag
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeDragSize, setActiveDragSize] = useState<{ width: number; height: number } | null>(null)
  const [activeDragOffset, setActiveDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [dragOverCell, setDragOverCell] = useState<{ row: number; col: number } | null>(null)
  const [previewMetricas, setPreviewMetricas] = useState<MetricaAtiva[] | null>(null)
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null)
  const [gridDimensions, setGridDimensions] = useState<{ cellWidth: number; cellHeight: number; gap: number } | null>(null)

  // Estado para drag de novo card do painel (id do card sendo arrastado do painel)
  const [panelDragId, setPanelDragId] = useState<string | null>(null)

  // Estados de resize
  const [resizingInfo, setResizingInfo] = useState<ResizeInfo | null>(null)
  const [resizePreviewMetricas, setResizePreviewMetricas] = useState<MetricaAtiva[] | null>(null)

  // Estados para preview e edição de cards
  const [previewCardId, setPreviewCardId] = useState<string | null>(null)
  const [editCardId, setEditCardId] = useState<string | null>(null)
  const [explorarCardId, setExplorarCardId] = useState<string | null>(null)
  const [isCreatingNewCard, setIsCreatingNewCard] = useState(false)

  // Estado para cards personalizados - iniciar vazio
  const [customCards, setCustomCards] = useState<MetricaConfig[]>([])

  // Estado para armazenar modificações em cards padrão (persistência)
  const [modifiedStandardCards, setModifiedStandardCards] = useState<Record<string, MetricaConfig>>({})

  // ===== CARREGAR DADOS DO LOCALSTORAGE DE FORMA ASSÍNCRONA =====
  useEffect(() => {
    if (initialLoadDoneRef.current || !dashboardId) return
    initialLoadDoneRef.current = true

    // Usar requestIdleCallback para não bloquear a UI
    const loadSavedData = () => {
      try {
        // Carregar métricas salvas
        const saved = loadDashboard(dashboardId)
        if (saved && saved.length > 0) {
          // Usar startTransition para atualização não-bloqueante
          React.startTransition(() => {
            setMetricasAtivas(saved)
          })
        }

        // Carregar custom cards
        const savedCustom = loadCustomCards(dashboardId)
        if (savedCustom && savedCustom.length > 0) {
          React.startTransition(() => {
            setCustomCards(savedCustom)
          })
        }
      } catch (e) {
        console.warn('Erro ao carregar dados salvos:', e)
      }
    }

    // Adiar carregamento para quando a UI estiver ociosa
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadSavedData, { timeout: 500 })
    } else {
      setTimeout(loadSavedData, 100)
    }
  }, [dashboardId, initialMetrics])

  // Combinar métricas disponíveis com cards personalizados
  const allMetrics = useMemo(() => {
    // Apply modifications to standard metrics
    const effectiveStandardMetrics = availableMetrics.map(m => {
      if (modifiedStandardCards[m.id]) {
        return { ...m, ...modifiedStandardCards[m.id] }
      }
      return m
    })

    return [...effectiveStandardMetrics, ...customCards]
  }, [availableMetrics, customCards, modifiedStandardCards])

  // Métricas filtradas por contexto (para o painel de biblioteca)
  const contextFilteredMetrics = useMemo(() => {
    return filterMetricsByContext(availableMetrics, contextFilter)
  }, [availableMetrics, contextFilter])

  const gridRef = useRef<HTMLDivElement>(null)

  // Notificar mudanças e auto-save (com debounce implícito via requestIdleCallback)
  useEffect(() => {
    onMetricsChange?.(metricasAtivas)

    // Auto-save no localStorage se habilitado (de forma assíncrona)
    if (shouldAutoSave && dashboardId) {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          saveDashboard(dashboardId, metricasAtivas)
        }, { timeout: 1000 })
      } else {
        setTimeout(() => {
          saveDashboard(dashboardId, metricasAtivas)
        }, 100)
      }
    }
  }, [metricasAtivas, onMetricsChange, shouldAutoSave, dashboardId])

  // Escutar evento de criação de card (atalho do FAB)
  useEffect(() => {
    const handleOpenCreator = () => setIsCreatingNewCard(true)
    window.addEventListener('open-card-creator', handleOpenCreator)
    return () => window.removeEventListener('open-card-creator', handleOpenCreator)
  }, [])

  // Auto-save de custom cards quando mudam (de forma assíncrona)
  useEffect(() => {
    if (shouldAutoSave && dashboardId && customCards.length > 0) {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          saveCustomCards(dashboardId, customCards)
        }, { timeout: 1000 })
      } else {
        setTimeout(() => {
          saveCustomCards(dashboardId, customCards)
        }, 100)
      }
    }
  }, [customCards, shouldAutoSave, dashboardId])

  // Notificar quando painel abre/fecha e limpar pesquisa ao fechar
  useEffect(() => {
    onPanelToggle?.(showMetricasModal)
    if (!showMetricasModal) {
      setSearchTerm('')
    }
  }, [showMetricasModal, onPanelToggle])

  // Rastrear posição do cursor durante drag
  useEffect(() => {
    if (!activeId) return

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setCursorPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [activeId])

  // Medir dimensões do grid
  useEffect(() => {
    const measureGrid = () => {
      if (gridRef.current) {
        const gridWidth = gridRef.current.clientWidth
        if (gridWidth > 0) {
          const gap = 12
          const cellWidth = (gridWidth - (GRID_COLS - 1) * gap) / GRID_COLS
          setGridDimensions({ cellWidth, cellHeight: 100, gap })
        }
      }
    }

    let resizeObserver: ResizeObserver | null = null
    if (gridRef.current) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(measureGrid)
      })
      resizeObserver.observe(gridRef.current)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(measureGrid)
    })

    return () => {
      resizeObserver?.disconnect()
    }
  }, [metricasAtivas.length])

  // Sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeSensors = readOnly ? [] : sensors

  // Verificar se uma célula está ocupada
  const isCellOccupied = useCallback((row: number, col: number, metricas: MetricaAtiva[], excludeId?: string) => {
    return metricas.some(m => {
      if (excludeId && m.id === excludeId) return false
      const { cols: mCols, rows: mRows } = parseCardSize(m.size)
      return (
        row >= m.row && row < m.row + mRows &&
        col >= m.col && col < m.col + mCols
      )
    })
  }, [])

  // Verificar se um card cabe em uma posição
  const canPlaceCard = useCallback((row: number, col: number, cardSize: string, metricas: MetricaAtiva[], excludeId?: string): boolean => {
    const { cols: cardCols, rows: cardRows } = parseCardSize(cardSize)

    if (row < 0 || col < 0 || col + cardCols > GRID_COLS || row + cardRows > MAX_GRID_ROWS) {
      return false
    }

    for (let r = 0; r < cardRows; r++) {
      for (let c = 0; c < cardCols; c++) {
        if (isCellOccupied(row + r, col + c, metricas, excludeId)) {
          return false
        }
      }
    }
    return true
  }, [isCellOccupied])

  // Encontrar primeira posição disponível
  const findFirstAvailablePosition = useCallback((metricas: MetricaAtiva[], cardSize: string = '1x1'): { row: number; col: number } | null => {
    const { cols: cardCols, rows: cardRows } = parseCardSize(cardSize)

    for (let row = 0; row <= MAX_GRID_ROWS - cardRows; row++) {
      for (let col = 0; col <= GRID_COLS - cardCols; col++) {
        let canPlace = true
        for (let r = 0; r < cardRows && canPlace; r++) {
          for (let c = 0; c < cardCols && canPlace; c++) {
            if (isCellOccupied(row + r, col + c, metricas)) {
              canPlace = false
            }
          }
        }
        if (canPlace) return { row, col }
      }
    }
    return null
  }, [isCellOccupied])

  // Encontrar próxima posição disponível
  const findNextAvailablePosition = useCallback((
    metricas: MetricaAtiva[],
    cardSize: string = '1x1',
    excludeId?: string
  ): { row: number; col: number } | null => {
    const { cols: cardCols, rows: cardRows } = parseCardSize(cardSize)

    for (let row = 0; row < MAX_GRID_ROWS; row++) {
      for (let col = 0; col <= GRID_COLS - cardCols; col++) {
        let canPlace = true
        for (let r = 0; r < cardRows && canPlace; r++) {
          for (let c = 0; c < cardCols && canPlace; c++) {
            if (isCellOccupied(row + r, col + c, metricas, excludeId)) {
              canPlace = false
            }
          }
        }
        if (canPlace) return { row, col }
      }
    }
    return null
  }, [isCellOccupied])

  // Handler para drag start
  const handleDragStart = (event: DragStartEvent) => {
    const rawId = event.active.id as string

    // Verificar se é um card do painel (tem prefixo "panel-")
    const isFromPanel = rawId.startsWith('panel-')
    const id = isFromPanel ? rawId.replace('panel-', '') : rawId

    setActiveId(id)

    if (isFromPanel) {
      // Card do painel - apenas marcar que vem do painel, NÃO adicionar ainda
      setPanelDragId(id)

      // Tamanho padrão para card 1x1
      const defaultSize = gridDimensions
        ? { width: gridDimensions.cellWidth, height: gridDimensions.cellHeight }
        : { width: 150, height: 100 }
      setActiveDragSize(defaultSize)

      const activatorEvent = event.activatorEvent as MouseEvent | TouchEvent
      let clientX = 0
      let clientY = 0

      if (activatorEvent instanceof MouseEvent) {
        clientX = activatorEvent.clientX
        clientY = activatorEvent.clientY
      } else if (activatorEvent instanceof TouchEvent && activatorEvent.touches.length > 0) {
        clientX = activatorEvent.touches[0].clientX
        clientY = activatorEvent.touches[0].clientY
      }

      setActiveDragOffset({ x: defaultSize.width / 2, y: defaultSize.height / 2 })
      setCursorPosition({ x: clientX, y: clientY })
    } else {
      // Card existente no grid
      const element = document.querySelector(`[data-metric-id="${id}"]`)
      if (element) {
        const rect = element.getBoundingClientRect()
        setActiveDragSize({ width: rect.width, height: rect.height })

        const activatorEvent = event.activatorEvent as MouseEvent | TouchEvent
        let clientX = 0
        let clientY = 0

        if (activatorEvent instanceof MouseEvent) {
          clientX = activatorEvent.clientX
          clientY = activatorEvent.clientY
        } else if (activatorEvent instanceof TouchEvent && activatorEvent.touches.length > 0) {
          clientX = activatorEvent.touches[0].clientX
          clientY = activatorEvent.touches[0].clientY
        }

        const offsetX = clientX - rect.left
        const offsetY = clientY - rect.top

        setActiveDragOffset({ x: offsetX, y: offsetY })
        setCursorPosition({ x: clientX, y: clientY })
      }
    }
  }

  // Handler para drag move
  const handleDragMove = (_event: DragMoveEvent) => {
    if (!gridRef.current || !activeId || !cursorPosition) return

    const gridRect = gridRef.current.getBoundingClientRect()
    const gap = 12
    const cellWidth = (gridRect.width - (GRID_COLS - 1) * gap) / GRID_COLS
    const cellHeight = 100

    const relativeX = cursorPosition.x - gridRect.left
    const relativeY = cursorPosition.y - gridRect.top

    const col = Math.floor(relativeX / (cellWidth + gap))
    const row = Math.floor(relativeY / (cellHeight + gap))

    if (row >= 0 && row < MAX_GRID_ROWS && col >= 0 && col < GRID_COLS) {
      setDragOverCell({ row, col })

      // Buscar métrica no grid, ou criar uma temporária se for do painel
      let metrica = metricasAtivas.find(m => m.id === activeId)

      // Se é do painel e ainda não está em metricasAtivas, usar tamanho padrão
      if (!metrica && panelDragId === activeId) {
        metrica = { id: activeId, size: '1x1', row: -1, col: -1 }
      }

      if (metrica) {
        const { cols: cardCols, rows: cardRows } = parseCardSize(metrica.size)

        if (col + cardCols <= GRID_COLS && row + cardRows <= MAX_GRID_ROWS) {
          // Se é do painel e não está em metricasAtivas, criar o preview incluindo o card
          const cardExistsInGrid = metricasAtivas.some(m => m.id === activeId)
          let preview: MetricaAtiva[]

          if (cardExistsInGrid) {
            preview = metricasAtivas.map(m =>
              m.id === activeId
                ? { ...m, row, col }
                : { ...m }
            )
          } else {
            // Card do painel - adicionar ao preview
            preview = [
              ...metricasAtivas.map(m => ({ ...m })),
              { id: activeId, size: '1x1', row, col }
            ]
          }

          // Encontrar cards sobrepostos (usando metricasAtivas originais, não preview)
          const overlappingCards: string[] = []
          for (let r = 0; r < cardRows; r++) {
            for (let c = 0; c < cardCols; c++) {
              const cellRow = row + r
              const cellCol = col + c

              for (const m of metricasAtivas) {
                if (m.id === activeId) continue
                const { cols: mCols, rows: mRows } = parseCardSize(m.size)
                if (
                  cellRow >= m.row && cellRow < m.row + mRows &&
                  cellCol >= m.col && cellCol < m.col + mCols
                ) {
                  if (!overlappingCards.includes(m.id)) {
                    overlappingCards.push(m.id)
                  }
                }
              }
            }
          }

          for (const cardId of overlappingCards) {
            const cardToMove = preview.find(m => m.id === cardId)
            if (!cardToMove) continue

            const metricasSemCard = preview.filter(m => m.id !== cardId)
            const newPosition = findNextAvailablePosition(metricasSemCard, cardToMove.size)

            if (newPosition) {
              preview = preview.map(m =>
                m.id === cardId ? { ...m, row: newPosition.row, col: newPosition.col } : m
              )
            }
          }

          setPreviewMetricas(preview)
        } else {
          setPreviewMetricas(null)
        }
      }
    } else {
      setDragOverCell(null)
      setPreviewMetricas(null)
    }
  }

  // Handler para drag end
  const handleDragEnd = (_event: DragEndEvent) => {
    if (previewMetricas && activeId) {
      // Verificar se o card foi solto em posição válida
      const droppedCard = previewMetricas.find(m => m.id === activeId)
      if (droppedCard && droppedCard.row >= 0 && droppedCard.col >= 0) {
        // Posição válida - aplicar preview (funciona tanto para cards existentes quanto do painel)
        setMetricasAtivas(previewMetricas)
      }
      // Se não tem posição válida, não faz nada - o card do painel simplesmente não é adicionado
    }

    setActiveId(null)
    setActiveDragSize(null)
    setActiveDragOffset(null)
    setDragOverCell(null)
    setPreviewMetricas(null)
    setCursorPosition(null)
    setPanelDragId(null)
  }

  // Adicionar nova métrica
  const handleAddMetrica = (metricaId: string, targetRow?: number, targetCol?: number) => {
    if (!metricasAtivas.find(m => m.id === metricaId)) {
      // Calcular tamanho padrão baseado nos componentes do card
      const metricConfig = allMetrics.find(m => m.id === metricaId)
      const defaultSize = getDefaultCardSize(metricConfig?.canvasComponents)
      const cardSize = createCardSize(defaultSize.cols, defaultSize.rows)

      // Se posição específica foi fornecida, usar ela
      if (targetRow !== undefined && targetCol !== undefined) {
        // Verificar se cabe na posição
        if (canPlaceCard(targetRow, targetCol, cardSize, metricasAtivas)) {
          setMetricasAtivas(prev => [...prev, {
            id: metricaId,
            size: cardSize,
            row: targetRow,
            col: targetCol
          }])
        } else {
          // Se não cabe, encontrar posição mais próxima
          const position = findFirstAvailablePosition(metricasAtivas, cardSize)
          if (position) {
            setMetricasAtivas(prev => [...prev, {
              id: metricaId,
              size: cardSize,
              row: position.row,
              col: position.col
            }])
          }
        }
      } else {
        const position = findFirstAvailablePosition(metricasAtivas, cardSize)
        if (position) {
          setMetricasAtivas(prev => [...prev, {
            id: metricaId,
            size: cardSize,
            row: position.row,
            col: position.col
          }])
        }
      }
    }
  }

  // Remover métrica
  const handleRemoveMetrica = (metricaId: string) => {
    setMetricasAtivas(prev => prev.filter(m => m.id !== metricaId))
  }

  // Remover todas as métricas
  const handleClearAllMetricas = () => {
    setMetricasAtivas([])
  }

  // Otimizar grid
  const handleOptimizeGrid = () => {
    const sortedMetricas = [...metricasAtivas].sort((a, b) => {
      const areaA = parseCardSize(a.size).cols * parseCardSize(a.size).rows
      const areaB = parseCardSize(b.size).cols * parseCardSize(b.size).rows
      return areaB - areaA
    })

    const optimizedMetricas: MetricaAtiva[] = []

    for (const metrica of sortedMetricas) {
      const { cols: cardCols, rows: cardRows } = parseCardSize(metrica.size)
      let placed = false

      for (let row = 0; row < MAX_GRID_ROWS && !placed; row++) {
        for (let col = 0; col <= GRID_COLS - cardCols && !placed; col++) {
          let canPlace = true

          for (let r = 0; r < cardRows && canPlace; r++) {
            for (let c = 0; c < cardCols && canPlace; c++) {
              for (const placed of optimizedMetricas) {
                const { cols: pCols, rows: pRows } = parseCardSize(placed.size)
                if (
                  row + r >= placed.row && row + r < placed.row + pRows &&
                  col + c >= placed.col && col + c < placed.col + pCols
                ) {
                  canPlace = false
                  break
                }
              }
            }
          }

          if (canPlace) {
            optimizedMetricas.push({
              ...metrica,
              row,
              col
            })
            placed = true
          }
        }
      }

      if (!placed) {
        optimizedMetricas.push(metrica)
      }
    }

    setMetricasAtivas(optimizedMetricas)
  }

  // Resize handler
  const handleResizeMetrica = (metricaId: string, newSize: string) => {
    if (resizePreviewMetricas) {
      setMetricasAtivas(resizePreviewMetricas)
      return
    }

    const metrica = metricasAtivas.find(m => m.id === metricaId)
    if (!metrica) return

    const { cols: newCols, rows: newRows } = parseCardSize(newSize)

    // Validar tamanho mínimo baseado nos componentes do card
    const metricConfig = allMetrics.find(m => m.id === metricaId)
    const minSize = getMinCardSize(metricConfig?.canvasComponents)
    if (newCols < minSize.cols || newRows < minSize.rows) return

    if (metrica.col + newCols > GRID_COLS) return
    if (metrica.row + newRows > MAX_GRID_ROWS) return

    let updatedMetricas = metricasAtivas.map(m =>
      m.id === metricaId ? { ...m, size: newSize } : { ...m }
    )

    const overlappingCards: string[] = []
    for (let r = 0; r < newRows; r++) {
      for (let c = 0; c < newCols; c++) {
        const cellRow = metrica.row + r
        const cellCol = metrica.col + c

        for (const m of updatedMetricas) {
          if (m.id === metricaId) continue
          const { cols: mCols, rows: mRows } = parseCardSize(m.size)
          if (
            cellRow >= m.row && cellRow < m.row + mRows &&
            cellCol >= m.col && cellCol < m.col + mCols
          ) {
            if (!overlappingCards.includes(m.id)) {
              overlappingCards.push(m.id)
            }
          }
        }
      }
    }

    const tempMetricas = [...updatedMetricas]
    let canResize = true

    for (const cardId of overlappingCards) {
      const cardToMove = tempMetricas.find(m => m.id === cardId)
      if (!cardToMove) continue

      const metricasSemCard = tempMetricas.filter(m => m.id !== cardId)
      const newPosition = findNextAvailablePosition(metricasSemCard, cardToMove.size)

      if (newPosition) {
        const idx = tempMetricas.findIndex(m => m.id === cardId)
        if (idx !== -1) {
          tempMetricas[idx] = { ...tempMetricas[idx], row: newPosition.row, col: newPosition.col }
        }
      } else {
        canResize = false
        break
      }
    }

    if (canResize) {
      setMetricasAtivas(tempMetricas)
    }
  }

  // Calcular preview de resize
  const calculateResizePreview = useCallback((info: ResizeInfo | null) => {
    setResizingInfo(info)

    if (!info) {
      setResizePreviewMetricas(null)
      return
    }

    const { id: metricaId, cols: newCols, rows: newRows } = info
    const metrica = metricasAtivas.find(m => m.id === metricaId)
    if (!metrica) return

    // Validar tamanho mínimo baseado nos componentes do card
    const metricConfig = allMetrics.find(m => m.id === metricaId)
    const minSize = getMinCardSize(metricConfig?.canvasComponents)
    if (newCols < minSize.cols || newRows < minSize.rows) {
      setResizePreviewMetricas(null)
      return
    }

    if (metrica.col + newCols > GRID_COLS || metrica.row + newRows > MAX_GRID_ROWS) {
      setResizePreviewMetricas(null)
      return
    }

    const newSize = createCardSize(newCols, newRows)

    let previewMetricasTemp = metricasAtivas.map(m =>
      m.id === metricaId ? { ...m, size: newSize } : { ...m }
    )

    const overlappingCards: string[] = []
    for (let r = 0; r < newRows; r++) {
      for (let c = 0; c < newCols; c++) {
        const cellRow = metrica.row + r
        const cellCol = metrica.col + c

        for (const m of previewMetricasTemp) {
          if (m.id === metricaId) continue
          const { cols: mCols, rows: mRows } = parseCardSize(m.size)
          if (
            cellRow >= m.row && cellRow < m.row + mRows &&
            cellCol >= m.col && cellCol < m.col + mCols
          ) {
            if (!overlappingCards.includes(m.id)) {
              overlappingCards.push(m.id)
            }
          }
        }
      }
    }

    let canResize = true
    for (const cardId of overlappingCards) {
      const cardToMove = previewMetricasTemp.find(m => m.id === cardId)
      if (!cardToMove) continue

      const metricasSemCard = previewMetricasTemp.filter(m => m.id !== cardId)
      const newPosition = findNextAvailablePosition(metricasSemCard, cardToMove.size)

      if (newPosition) {
        const idx = previewMetricasTemp.findIndex(m => m.id === cardId)
        if (idx !== -1) {
          previewMetricasTemp[idx] = { ...previewMetricasTemp[idx], row: newPosition.row, col: newPosition.col }
        }
      } else {
        canResize = false
        break
      }
    }

    if (canResize) {
      setResizePreviewMetricas(previewMetricasTemp)
    } else {
      setResizePreviewMetricas(null)
    }
  }, [metricasAtivas, findNextAvailablePosition, allMetrics])

  // Layout atual exibido
  const layoutMetricas = resizePreviewMetricas ?? previewMetricas ?? metricasAtivas

  // Calcular linhas necessárias
  const currentGridRows = useMemo(() => {
    let maxRow = 0

    for (const m of layoutMetricas) {
      const { rows } = parseCardSize(m.size)
      const bottomRow = m.row + rows
      if (bottomRow > maxRow) maxRow = bottomRow
    }

    if (resizingInfo) {
      const bottomRow = resizingInfo.row + resizingInfo.rows
      if (bottomRow > maxRow) maxRow = bottomRow
    }

    return Math.min(MAX_GRID_ROWS, Math.max(1, maxRow))
  }, [layoutMetricas, resizingInfo])

  // Wrapper condicional baseado na variante
  const Wrapper = variant === 'card' ? Card : 'div'
  const ContentWrapper = variant === 'card' ? CardContent : 'div'
  const wrapperClassName = variant === 'card'
    ? `card-modern ${className}`
    : className
  const contentClassName = variant === 'card' ? 'pt-4' : ''

  return (
    <Wrapper className={wrapperClassName}>
      <ContentWrapper className={contentClassName}>
        {/* Toolbar e Botões de Ação na mesma linha */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Toolbar (lado esquerdo/centro - flex-1 para ocupar espaço) */}
          <div className="flex-1 min-w-0">
            {toolbarContent}
          </div>

          {/* Botões de Ação (lado direito - fixos) */}
          {!readOnly && (
            <div className="flex items-center gap-2 shrink-0">
              {/* Botão de otimizar grid */}
              <button
                onClick={handleOptimizeGrid}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 transition-all duration-200 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Otimizar layout"
                disabled={metricasAtivas.length === 0}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              {/* Botão de adicionar */}
              <button
                onClick={() => setShowMetricasModal(true)}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 shrink-0"
                title="Adicionar métrica"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Filtros Ativos */}
        {filterContent && (
          <div className="mb-4">
            {filterContent}
          </div>
        )}

        <DndContext
          sensors={activeSensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          {/* Grid dinâmico */}
          <div
            ref={gridRef}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${currentGridRows}, 100px)`,
              gap: '12px',
              transition: 'grid-template-rows 0.3s ease, min-height 0.3s ease',
              minHeight: `${currentGridRows * 100 + (currentGridRows - 1) * 12}px`
            }}
          >
            {/* Células de feedback durante drag */}
            {activeId && Array.from({ length: currentGridRows * GRID_COLS }).map((_, index) => {
              const row = Math.floor(index / GRID_COLS)
              const col = index % GRID_COLS
              const isDragOver = dragOverCell?.row === row && dragOverCell?.col === col
              const activeMetrica = metricasAtivas.find(m => m.id === activeId)

              if (!activeMetrica) return null

              const { cols: cardCols, rows: cardRows } = parseCardSize(activeMetrica.size)
              const fitsInGrid = col + cardCols <= GRID_COLS && row + cardRows <= MAX_GRID_ROWS
              const positionIsFree = canPlaceCard(row, col, activeMetrica.size, metricasAtivas, activeId)
              const willReorganize = fitsInGrid && !positionIsFree

              if (!isDragOver) return null

              let feedbackClass = ''
              if (!fitsInGrid) {
                feedbackClass = 'border-red-300 bg-red-50'
              } else if (willReorganize) {
                feedbackClass = 'border-amber-400 bg-amber-50'
              } else {
                feedbackClass = 'border-primary bg-primary/10'
              }

              return (
                <div
                  key={`cell-${row}-${col}`}
                  className={`rounded-xl border-2 border-dashed transition-all duration-200 ${feedbackClass}`}
                  style={{
                    gridRow: `${row + 1} / span ${cardRows}`,
                    gridColumn: `${col + 1} / span ${cardCols}`,
                    pointerEvents: 'none'
                  }}
                />
              )
            })}

            {/* Indicador de resize */}
            {resizingInfo && (
              <div
                className={`rounded-xl border-2 border-dashed transition-all duration-150 ${resizePreviewMetricas
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-400 bg-slate-200/50'
                  }`}
                style={{
                  gridRow: `${resizingInfo.row + 1} / span ${resizingInfo.rows}`,
                  gridColumn: `${resizingInfo.col + 1} / span ${resizingInfo.cols}`,
                  pointerEvents: 'none',
                  zIndex: 5
                }}
              />
            )}

            {/* Renderizar os cards */}
            {layoutMetricas.map((metricaAtiva) => {
              const metrica = allMetrics.find(m => m.id === metricaAtiva.id)
              if (!metrica) return null

              const isBeingResized = resizingInfo?.id === metrica.id
              const originalMetrica = metricasAtivas.find(m => m.id === metricaAtiva.id)
              const displayMetrica = isBeingResized && originalMetrica ? originalMetrica : metricaAtiva

              const sizeConfig = parseCardSize(displayMetrica.size)
              const isBeingDragged = activeId === metrica.id

              const isBeingRelocated = Boolean(
                (previewMetricas || resizePreviewMetricas) && originalMetrica &&
                (originalMetrica.row !== metricaAtiva.row || originalMetrica.col !== metricaAtiva.col) &&
                !isBeingDragged && !isBeingResized
              )

              const hasGridDimensions = gridDimensions !== null
              const cellWidth = gridDimensions?.cellWidth ?? 0
              const cellHeight = gridDimensions?.cellHeight ?? 100
              const gap = gridDimensions?.gap ?? 12
              const x = metricaAtiva.col * (cellWidth + gap)
              const y = metricaAtiva.row * (cellHeight + gap)
              const width = sizeConfig.cols * cellWidth + (sizeConfig.cols - 1) * gap
              const height = sizeConfig.rows * cellHeight + (sizeConfig.rows - 1) * gap

              return (
                <SortableMetricCard
                  key={metrica.id}
                  metrica={metrica}
                  data={data}
                  sizeConfig={sizeConfig}
                  row={metricaAtiva.row}
                  col={metricaAtiva.col}
                  onRemove={() => handleRemoveMetrica(metrica.id)}
                  onEdit={() => setEditCardId(metrica.id)}
                  onExplorar={() => setExplorarCardId(metrica.id)}
                  onResize={(newSize) => handleResizeMetrica(metrica.id, newSize)}
                  onResizePreview={calculateResizePreview}
                  isRelocating={isBeingRelocated}
                  useAbsolutePosition={hasGridDimensions}
                  pixelPosition={hasGridDimensions ? { x, y, width, height } : undefined}
                  style={{
                    opacity: isBeingDragged ? 0.3 : 1,
                    zIndex: isBeingRelocated ? 50 : isBeingDragged ? 1000 : 1
                  }}
                  readOnly={readOnly}
                />
              )
            })}
          </div>

          <DragOverlay dropAnimation={null} />

          {/* Fantasma customizado durante drag */}
          {activeId && activeDragSize && cursorPosition && (() => {
            // Buscar metrica ativa - se não encontrar, pode ser card do painel
            let activeMetricaAtiva = metricasAtivas.find(m => m.id === activeId)

            // Se é um card do painel sendo arrastado, criar metrica temporária
            if (!activeMetricaAtiva && panelDragId === activeId) {
              activeMetricaAtiva = { id: activeId, size: '1x1', row: -1, col: -1 }
            }

            if (!activeMetricaAtiva) return null
            const activeMetrica = allMetrics.find(m => m.id === activeId)
            if (!activeMetrica) return null

            const activeSizeConfig = parseCardSize(activeMetricaAtiva.size)
            const activeMinDimension = Math.min(activeSizeConfig.cols, activeSizeConfig.rows)
            const activeTitleSize = Math.round(10 + (activeMinDimension - 1) * 5)
            const activeValueSize = Math.round(24 + (activeMinDimension - 1) * 20)
            const activeDescSize = Math.round(10 + (activeMinDimension - 1) * 4)
            const activeIconSize = Math.round(14 + (activeMinDimension - 1) * 10)
            const activePadding = Math.round(10 + (activeMinDimension - 1) * 6)
            const ActiveIcon = activeMetrica.icon

            const ghostX = cursorPosition.x - (activeDragOffset?.x || 0)
            const ghostY = cursorPosition.y - (activeDragOffset?.y || 0)

            return createPortal(
              <div
                className={`card-modern border ${activeMetrica.borderColor} flex flex-col overflow-hidden pointer-events-none`}
                style={{
                  position: 'fixed',
                  left: `${ghostX}px`,
                  top: `${ghostY}px`,
                  width: `${activeDragSize.width}px`,
                  height: `${activeDragSize.height}px`,
                  opacity: 0.95,
                  zIndex: 2147483647,
                  willChange: 'left, top',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  transform: 'scale(1.02)',
                  backgroundColor: activeMetrica.showCardBg ? (COLOR_OPTIONS.find(c => c.id === activeMetrica.cardBgColor)?.bgHex || '#ffffff') : '#ffffff'
                }}
              >
                {(activeMetrica.showBorder ?? true) && (
                  <div className={`absolute left-0 top-0 bottom-0 w-[6px] ${activeMetrica.showCardBg
                    ? (COLOR_OPTIONS.find(c => c.id === activeMetrica.cardBgColor)?.bgSolid || 'bg-blue-500')
                    : activeMetrica.cor.replace('text-', 'bg-').replace('600', '500')} z-10`} />
                )}
                {activeMetrica.canvasComponents && activeMetrica.canvasComponents.length > 0 ? (
                  // Layout Canvas (Adaptado para o Fantasma)
                  (() => {
                    const { gridCols, gridRows } = activeMetrica.canvasConfig || { gridCols: 4, gridRows: 2 }
                    const components = activeMetrica.canvasComponents

                    // Calcular escala
                    const scaleX = activeDragSize.width / (gridCols * 40)
                    const scaleY = activeDragSize.height / (gridRows * 40)
                    const scale = Math.min(scaleX, scaleY, 1.5)

                    // Obter cores
                    const displayColor = activeMetrica.cor || 'text-blue-600'
                    const currentColorObj = COLOR_OPTIONS.find(c => c.text === displayColor) || COLOR_OPTIONS[0]

                    return (
                      <div className="relative w-full h-full" style={{ padding: `${Math.max(8, activePadding * 0.6)}px` }}>
                        {components.map(comp => {
                          const left = (comp.x / gridCols) * 100
                          const top = (comp.y / gridRows) * 100
                          const width = (comp.width / gridCols) * 100
                          const height = (comp.height / gridRows) * 100

                          return (
                            <div
                              key={comp.id}
                              className="absolute flex items-center justify-start overflow-hidden"
                              style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                width: `${width}%`,
                                height: `${height}%`,
                                padding: `${2 * scale}px`
                              }}
                            >
                              <CardRenderer component={comp} currentColor={currentColorObj} scale={scale} />
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()
                ) : (
                  // Layout Padrão
                  <div
                    className="flex flex-col h-full overflow-hidden"
                    style={{ padding: `${activePadding}px` }}
                  >
                    <div className="flex flex-row items-center justify-between">
                      {(activeMetrica.showTitle ?? true) && (
                        <span
                          className="text-neutral-600 truncate font-medium"
                          style={{ fontSize: `${activeTitleSize}px`, marginRight: `${activePadding / 2}px` }}
                        >
                          {activeMetrica.titulo}
                        </span>
                      )}
                      <ActiveIcon
                        className={`${activeMetrica.cor} shrink-0`}
                        style={{ width: `${activeIconSize}px`, height: `${activeIconSize}px` }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center overflow-hidden min-h-0">
                      <div
                        className={`font-bold ${activeMetrica.cor} truncate`}
                        style={{ fontSize: `${activeValueSize}px`, lineHeight: 1 }}
                      >
                        {activeMetrica.getValue(data)}
                      </div>
                      {(activeMetrica.showDescription ?? true) && (
                        <p
                          className="text-neutral-500 truncate"
                          style={{ fontSize: `${activeDescSize}px`, marginTop: `${activePadding / 3}px` }}
                        >
                          {activeMetrica.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>,
              document.body
            )
          })()}

          {/* Painel Lateral - Adicionar Métrica */}
          {showMetricasModal && createPortal(
            <>
              {/* Painel - colado na direita, 4px maior que a sidebar expandida */}
              <div
                className="fixed top-4 bottom-4 right-0 w-[304px] bg-white/95 backdrop-blur-xl border-l border-t border-b border-white/20 rounded-l-2xl shadow-2xl shadow-black/10 z-[9999] flex flex-col overflow-hidden"
                style={{
                  animation: 'panelSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0 px-4 py-4 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold text-neutral-800">
                      Adicionar Card
                    </h2>
                    <button
                      onClick={() => setShowMetricasModal(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Arraste para o grid ou clique para adicionar
                  </p>
                  {/* Botão Criar Novo Card + Caixa de Pesquisa */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsCreatingNewCard(true)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Criar novo card
                    </button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar card..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lista de métricas */}
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-4 space-y-5">
                    {/* Seção: Meus Cards (cards personalizados) */}
                    {(() => {
                      const searchLower = searchTerm.toLowerCase()
                      const customCardsFiltered = customCards.filter(m => {
                        // Filtrar por contexto (se não for 'all')
                        const matchContext = contextFilter === 'all' ||
                          getMetricContext(m) === contextFilter
                        const matchSearch = searchTerm === '' ||
                          m.titulo.toLowerCase().includes(searchLower) ||
                          m.descricao.toLowerCase().includes(searchLower) ||
                          'meus cards'.includes(searchLower) ||
                          'personalizado'.includes(searchLower)
                        return matchContext && matchSearch
                      })

                      if (customCardsFiltered.length === 0) return null

                      return (
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider px-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Meus Cards
                          </h3>
                          <div className="space-y-1.5">
                            {customCardsFiltered.map(metrica => {
                              const isActive = metricasAtivas.some(m => m.id === metrica.id)

                              return (
                                <DraggablePanelItem
                                  key={metrica.id}
                                  metrica={metrica}
                                  isActive={isActive}
                                  isDragging={panelDragId === metrica.id}
                                  onRemove={() => handleRemoveMetrica(metrica.id)}
                                  onAdd={() => handleAddMetrica(metrica.id)}
                                  onPreview={() => setPreviewCardId(metrica.id)}
                                  onEdit={() => setEditCardId(metrica.id)}
                                />
                              )
                            })}
                          </div>
                        </div>
                      )
                    })()}

                    {/* Categorias padrão */}
                    {['filas', 'investigadores', 'performance', 'financeiro', 'lucratividade'].map(categoria => {
                      const categoriaLabels: Record<string, string> = {
                        filas: 'Filas & Regras',
                        investigadores: 'Investigadores',
                        performance: 'Performance',
                        financeiro: 'Financeiro',
                        lucratividade: 'Lucratividade'
                      }

                      const searchLower = searchTerm.toLowerCase()
                      const categoriaLabel = categoriaLabels[categoria]

                      // Filtrar métricas pela categoria, contexto e termo de pesquisa (título, descrição ou nome do segmento)
                      const metricasCategoria = contextFilteredMetrics.filter(m => {
                        const matchCategoria = m.categoria === categoria
                        const matchSearch = searchTerm === '' ||
                          m.titulo.toLowerCase().includes(searchLower) ||
                          m.descricao.toLowerCase().includes(searchLower) ||
                          categoriaLabel.toLowerCase().includes(searchLower)
                        return matchCategoria && matchSearch
                      })
                      if (metricasCategoria.length === 0) return null

                      return (
                        <div key={categoria} className="space-y-2">
                          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
                            {categoriaLabels[categoria]}
                          </h3>
                          <div className="space-y-1.5">
                            {metricasCategoria.map(metrica => {
                              const isActive = metricasAtivas.some(m => m.id === metrica.id)

                              return (
                                <DraggablePanelItem
                                  key={metrica.id}
                                  metrica={metrica}
                                  isActive={isActive}
                                  isDragging={panelDragId === metrica.id}
                                  onRemove={() => handleRemoveMetrica(metrica.id)}
                                  onAdd={() => handleAddMetrica(metrica.id)}
                                  onPreview={() => setPreviewCardId(metrica.id)}
                                  onEdit={() => setEditCardId(metrica.id)}
                                />
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="flex-shrink-0 px-4 py-3 border-t border-slate-100 bg-slate-50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllMetricas}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    disabled={metricasAtivas.length === 0}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remover todos ({metricasAtivas.length})
                  </Button>
                </div>
              </div>
            </>,
            document.body
          )}

          {/* Modal de Preview do Card */}
          {previewCardId && createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000]"
                onClick={() => setPreviewCardId(null)}
              />
              <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto animate-scaleIn">
                  {(() => {
                    const metrica = allMetrics.find(m => m.id === previewCardId)
                    if (!metrica) return null
                    const Icon = metrica.icon
                    const value = metrica.getValue(data)

                    return (
                      <div className="relative">
                        <button
                          onClick={() => setPreviewCardId(null)}
                          className="absolute -top-3 -right-3 p-1.5 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div
                          className={`card-modern border ${metrica.borderColor} p-6 min-w-[200px]`}
                          style={{ width: '280px', height: '180px' }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-neutral-600 font-medium text-base">
                              {metrica.titulo}
                            </span>
                            <Icon className={`h-6 w-6 ${metrica.cor}`} />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className={`font-bold ${metrica.cor} text-4xl`}>
                              {value}
                            </div>
                            <p className="text-neutral-500 text-sm mt-2">
                              {metrica.descricao}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </>,
            document.body
          )}

          {/* Modal Editor de Card - SEMPRE usar CardCreatorModal */}
          {editCardId && (() => {
            const cardToEdit = allMetrics.find(m => m.id === editCardId)
            if (!cardToEdit) return null

            const isCustomCard = editCardId.startsWith('custom-')

            return createPortal(
              <CardCreatorModal
                editCard={cardToEdit}
                onClose={() => setEditCardId(null)}
                onCreate={(updatedCard) => {
                  if (isCustomCard) {
                    // Atualizar card na lista de customCards
                    setCustomCards(prev => prev.map(c =>
                      c.id === updatedCard.id ? updatedCard : c
                    ))
                  } else {
                    // Salvar modificações de cards padrão
                    setModifiedStandardCards(prev => ({
                      ...prev,
                      [updatedCard.id]: updatedCard
                    }))
                  }

                  setEditCardId(null)
                }}
              />,
              document.body
            )
          })()}

          {/* Modal Criar Novo Card */}
          {isCreatingNewCard && createPortal(
            <CardCreatorModal
              onClose={() => setIsCreatingNewCard(false)}
              onCreate={(newCard) => {
                // Adicionar contexto ao card baseado no contextFilter atual
                // Se contextFilter é 'all', usa 'geral' como default
                const cardWithContext: MetricaConfig = {
                  ...newCard,
                  context: contextFilter !== 'all' ? contextFilter : 'geral'
                }
                // Adicionar novo card à lista de cards personalizados
                setCustomCards(prev => [...prev, cardWithContext])

                // Calcular tamanho padrão baseado nos componentes do card
                const defaultSize = getDefaultCardSize(newCard.canvasComponents)
                const cardSize = createCardSize(defaultSize.cols, defaultSize.rows)

                // Também adicionar automaticamente ao grid
                const position = findFirstAvailablePosition(metricasAtivas, cardSize)
                if (position) {
                  setMetricasAtivas(prev => [...prev, {
                    id: newCard.id,
                    size: cardSize,
                    row: position.row,
                    col: position.col
                  }])
                }

                setIsCreatingNewCard(false)
              }}
            />,
            document.body
          )}

          {/* Modal Explorar (Drill-in) */}
          {explorarCardId && (() => {
            const cardToExplore = allMetrics.find(m => m.id === explorarCardId)
            if (!cardToExplore) return null

            // Extrair cor base da classe (ex: text-blue-600 -> blue)
            const colorScheme = cardToExplore.cor.split('-')[1] || 'blue'

            // Tentar extrair metricId real e campo de agrupamento dos componentes
            let activeMetricId: string | undefined = undefined
            let groupingField: string | undefined = undefined
            let activeDateRange: { start: Date; end: Date } | undefined = undefined

            if (cardToExplore.canvasComponents && cardToExplore.canvasComponents.length > 0) {
              // Priority: Find components with explicit metricsQuery
              // Check for chart components first, then KPIs
              const comp = cardToExplore.canvasComponents.find(c =>
                (c.type?.startsWith('recharts-') || c.type === 'kpi-unified' || c.type === 'table') &&
                c.dataSource?.metricsQuery?.metric
              ) || cardToExplore.canvasComponents.find(c => c.dataSource?.metricsQuery?.metric)

              if (comp) {
                // Metric ID
                if (comp.dataSource?.metricsQuery?.metric) {
                  activeMetricId = comp.dataSource.metricsQuery.metric
                }

                // Grouping Field
                if (comp.dataSource?.metricsQuery?.groupBy) {
                  groupingField = comp.dataSource.metricsQuery.groupBy
                } else if (comp.dataSource?.metricsQuery?.dimension) {
                  groupingField = comp.dataSource.metricsQuery.dimension
                } else if (comp.dataSource?.mapping?.labels) {
                  groupingField = comp.dataSource.mapping.labels
                }

                // Date Range (Global)
                // Date Range (Global)
                if (comp.dataSource?.metricsQuery?.dateRange) {
                  // Passar objeto completo, inclusive presets
                  const dr = comp.dataSource.metricsQuery.dateRange
                  if (dr.start && dr.end) {
                    activeDateRange = {
                      start: new Date(dr.start),
                      end: new Date(dr.end),
                      preset: (dr as any).preset
                    } as any
                  } else {
                    activeDateRange = dr as any
                  }
                }
              }
            }

            // Determine context - Force 'financeiro' if metric ID implies financial data
            let finalContext = (cardToExplore.context as any) || (cardToExplore.categoria as any) || "financeiro"
            if (activeMetricId && (activeMetricId.startsWith('fin-') || activeMetricId.startsWith('csv-'))) {
              finalContext = 'financeiro'
            }

            return createPortal(
              <ExplorarModal
                isOpen={true}
                onClose={() => setExplorarCardId(null)}
                cardTitle={cardToExplore.titulo}
                metricContext={finalContext}
                colorScheme={colorScheme}
                cardId={cardToExplore.id}
                groupingField={groupingField}
                metricId={activeMetricId}
                dateRange={activeDateRange}
                onOpenOriginal={(record) => {
                  toast.success(`Abrindo registro original: ${record.id}`, {
                    description: `Contexto: ${cardToExplore.categoria || 'Geral'}`,
                  })
                  console.log('Abrir Original:', record)
                }}
              />,
              document.body
            )
          })()}
        </DndContext>
      </ContentWrapper>
    </Wrapper >
  )
}

// ============================================
// COMPONENTE SORTABLE METRIC CARD
// ============================================

interface SortableMetricCardProps {
  metrica: MetricaConfig
  data: MetricaData
  sizeConfig: CardSizeConfig
  row: number
  col: number
  onRemove: () => void
  onEdit: () => void
  onExplorar: () => void
  onResize: (newSize: string) => void
  onResizePreview?: (info: ResizeInfo | null) => void
  style?: React.CSSProperties
  isRelocating?: boolean
  useAbsolutePosition?: boolean
  useAbsolutePosition?: boolean
  pixelPosition?: { x: number; y: number; width: number; height: number }
  readOnly?: boolean
}


function SortableMetricCard({
  metrica,
  data,
  sizeConfig,
  row,
  col,
  onRemove,
  onEdit,
  onExplorar,
  onResize,
  onResizePreview,
  style,
  isRelocating = false,
  useAbsolutePosition = false,
  pixelPosition,
  readOnly = false
}: SortableMetricCardProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizePreview, setResizePreview] = useState<{ cols: number; rows: number } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const resizePreviewRef = useRef<{ cols: number; rows: number } | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({ id: metrica.id })

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node)
      ; (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
  }, [setNodeRef])

  const containerCols = resizePreview?.cols ?? sizeConfig.cols
  const containerRows = resizePreview?.rows ?? sizeConfig.rows

  const basePositionStyle: React.CSSProperties = useAbsolutePosition && pixelPosition
    ? {
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${pixelPosition.width}px`,
      height: `${pixelPosition.height}px`,
      transform: `translate3d(${pixelPosition.x}px, ${pixelPosition.y}px, 0) ${isRelocating ? 'scale(0.98)' : 'scale(1)'}`,
      transition: isDragging || isResizing
        ? 'none'
        : 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease, box-shadow 0.3s ease',
    }
    : {
      gridRow: `${row + 1} / span ${containerRows}`,
      gridColumn: `${col + 1} / span ${containerCols}`,
    }

  const dragStyle: React.CSSProperties = {
    zIndex: style?.zIndex ?? (isDragging ? 1000 : isResizing ? 100 : isRelocating ? 50 : 1),
    opacity: style?.opacity ?? (isDragging ? 0.3 : 1),
    ...basePositionStyle,
    ...style
  }

  const IconComponent = metrica.icon
  const value = metrica.getValue(data)

  const minDimension = Math.min(sizeConfig.cols, sizeConfig.rows)

  // Valores base para tamanhos
  const baseTitleSize = Math.round(10 + (minDimension - 1) * 5)
  const baseValueSize = Math.round(24 + (minDimension - 1) * 20)
  const baseDescSize = Math.round(10 + (minDimension - 1) * 4)
  const iconSize = Math.round(14 + (minDimension - 1) * 10)
  const padding = Math.round(10 + (minDimension - 1) * 6)

  // Aplicar configurações personalizadas
  const displayTitle = metrica.titulo
  const displayDesc = metrica.descricao
  const displayColor = metrica.cor

  // Calcular tamanhos de fonte baseado em customConfig
  const fontSizeMultipliers = {
    sm: 0.7,
    md: 0.85,
    lg: 1,
    xl: 1.2
  }
  const fontMultiplier = fontSizeMultipliers['lg']
  const titleSize = Math.round(baseTitleSize * fontMultiplier)
  const valueSize = Math.round(baseValueSize * fontMultiplier)
  const descSize = Math.round(baseDescSize * fontMultiplier)

  // Determinar cor de borda baseada na cor do tema
  const displayBorderColor = metrica.borderColor

  // Determinar cor de fundo para gráficos
  const colorToBgMap: Record<string, string> = {
    'text-blue-600': 'bg-blue-100',
    'text-emerald-600': 'bg-emerald-100',
    'text-amber-600': 'bg-amber-100',
    'text-rose-600': 'bg-rose-100',
    'text-purple-600': 'bg-purple-100',
    'text-slate-600': 'bg-slate-100',
    'text-slate-700': 'bg-slate-100',
    'text-sky-600': 'bg-sky-100',
    'text-green-600': 'bg-green-100',
    'text-indigo-600': 'bg-indigo-100',
    'text-red-600': 'bg-red-100',
    'text-cyan-600': 'bg-cyan-100',
    'text-orange-600': 'bg-orange-100',
    'text-teal-600': 'bg-teal-100'
  }
  const chartBgColor = colorToBgMap[displayColor] || 'bg-blue-100'

  const currentColorObj = COLOR_OPTIONS.find(c => c.text === displayColor) || {
    text: displayColor,
    bg: chartBgColor,
    bgSolid: displayColor.replace('text-', 'bg-').replace('600', '500')
  }


  // Renderizar componente do canvas (extracted to CardRenderer)

  // Renderizar card com canvas components
  const renderCanvasLayout = () => {
    if (!metrica.canvasComponents || !metrica.canvasConfig) return null

    const { gridCols, gridRows } = metrica.canvasConfig
    const components = metrica.canvasComponents

    // Calcular escala baseado no tamanho do card
    const cardWidth = pixelPosition?.width || 200
    const cardHeight = pixelPosition?.height || 150

    // Ajustar unidade base dependendo da densidade do grid
    // Se grid >= 48 colunas, é alta densidade (base 6px). Se 24, é legacy (base 10px).
    // O objetivo é manter a largura de referência em ~300px (tamanho de um card padrão)
    const baseUnit = gridCols >= 48 ? 6 : 10

    const scaleX = cardWidth / (gridCols * baseUnit)
    const scaleY = cardHeight / (gridRows * baseUnit)
    const scale = Math.min(scaleX, scaleY, 1.5)

    return (
      <div
        className="w-full h-full"
        style={{
          padding: `${Math.max(8, padding * 0.6)}px`
        }}
      >
        <div className="relative w-full h-full">
          {components.map(comp => {
            const left = (comp.x / gridCols) * 100
            const top = (comp.y / gridRows) * 100
            const width = (comp.width / gridCols) * 100
            const height = (comp.height / gridRows) * 100

            return (
              <div
                key={comp.id}
                className="absolute flex items-center justify-start overflow-hidden"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                  padding: `${2 * scale}px`
                }}
              >
                <CardRenderer component={comp} currentColor={currentColorObj as any} scale={scale} onExplore={onExplorar} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }


  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const cardRect = cardRef.current?.getBoundingClientRect()

    if (!cardRect) return

    const gap = 12
    const cellWidth = (cardRect.width - (sizeConfig.cols - 1) * gap) / sizeConfig.cols
    const cellHeight = (cardRect.height - (sizeConfig.rows - 1) * gap) / sizeConfig.rows

    onResizePreview?.({ id: metrica.id, row, col, cols: sizeConfig.cols, rows: sizeConfig.rows })

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      const maxCols = GRID_COLS - col
      const maxRows = MAX_GRID_ROWS - row
      const newCols = Math.max(1, Math.min(maxCols, sizeConfig.cols + Math.round(deltaX / (cellWidth + gap))))
      const newRows = Math.max(1, Math.min(maxRows, sizeConfig.rows + Math.round(deltaY / (cellHeight + gap))))

      const preview = { cols: newCols, rows: newRows }
      resizePreviewRef.current = preview
      setResizePreview(preview)

      onResizePreview?.({ id: metrica.id, row, col, cols: newCols, rows: newRows })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      const finalPreview = resizePreviewRef.current
      if (finalPreview) {
        const newSize = createCardSize(finalPreview.cols, finalPreview.rows)
        onResize(newSize)
      }

      setIsResizing(false)
      setResizePreview(null)
      resizePreviewRef.current = null

      onResizePreview?.(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={setRefs}
      data-metric-id={metrica.id}
      className={`card-modern border ${displayBorderColor} relative group flex flex-col overflow-hidden min-h-0 ${isResizing ? 'ring-2 ring-primary ring-opacity-50' : ''} ${isRelocating ? 'ring-2 ring-amber-400 ring-opacity-70 shadow-lg shadow-amber-200/50' : ''}`}
      style={{
        ...dragStyle,
        backgroundColor: metrica.showCardBg ? (COLOR_OPTIONS.find(c => c.id === metrica.cardBgColor)?.bgHex || '#ffffff') : '#ffffff'
      }}
    >
      {(metrica.showBorder ?? true) && (
        <div className={`absolute left-0 top-0 bottom-0 w-[6px] ${currentColorObj.bgSolid} z-10`} />
      )}


      {/* Resize preview indicator */}
      {isResizing && resizePreview && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-primary text-white text-xs font-medium z-20">
          {resizePreview.cols}x{resizePreview.rows}
        </div>
      )}





      {/* Card Content - Canvas ou Layout Padrão */}
      {metrica.canvasComponents && metrica.canvasComponents.length > 0 ? (
        // Renderizar layout do canvas
        renderCanvasLayout()
      ) : (
        // Layout padrão
        <div
          className="flex flex-col h-full overflow-hidden"
          style={{ padding: `${padding}px` }}
        >
          <div className="flex flex-row items-center justify-between">
            {(metrica.showTitle ?? true) && (
              <span
                className="text-neutral-600 truncate font-medium"
                style={{ fontSize: `${titleSize}px`, marginRight: `${padding / 2}px` }}
              >
                {displayTitle}
              </span>
            )}
            <div className="relative shrink-0 flex items-center gap-1">
              {/* Ícone normal */}
              <IconComponent
                className={`${displayColor}`}
                style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center overflow-hidden min-h-0">
            <div
              className={`font-bold ${displayColor} truncate`}
              style={{ fontSize: `${valueSize}px`, lineHeight: 1 }}
            >
              {value}
            </div>

            {/* Indicador de Tendência */}

            {(metrica.showDescription ?? true) && (
              <p
                className="text-neutral-500 truncate"
                style={{ fontSize: `${descSize}px`, marginTop: `${padding / 3}px` }}
              >
                {displayDesc}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Drag handle (Esquerda) - Movido para o final para garantir z-index */}
      {!readOnly && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1 rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 z-50 bg-white/80"
          title="Arraste para mover"
        >
          <GripVertical className="h-3 w-3 text-slate-400" />
        </div>
      )}

      {/* Botões de ação no hover (Direita) */}
      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onExplorar?.()
          }}
          className="p-1 rounded hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors bg-white/80"
          title="Explorar dados (Drill-in)"
        >
          <Maximize2 className="h-3 w-3" />
        </button>
        {!readOnly && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="p-1 rounded hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors bg-white/80"
              title="Editar"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors bg-white/80"
              title="Remover"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {/* Resize handle - canto inferior direito */}
      {!readOnly && (
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '16px',
            height: '16px',
            cursor: 'se-resize',
            zIndex: 50
          }}
          title="Arraste para redimensionar"
        >
          <svg
            style={{
              width: '12px',
              height: '12px',
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              pointerEvents: 'none'
            }}
            className="text-slate-400 opacity-40"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ============================================
// COMPONENTE CARD EDITOR MODAL (CANVAS)
// ============================================


// ============================================
// COMPONENTE DRAGGABLE PANEL ITEM (MINIATURA)
// ============================================

interface DraggablePanelItemProps {
  metrica: MetricaConfig
  isActive: boolean
  isDragging: boolean
  onRemove: () => void
  onAdd: () => void
  onPreview: () => void
  onEdit: () => void
}

function DraggablePanelItem({
  metrica,
  isActive,
  isDragging,
  onRemove,
  onAdd,
  onPreview,
  onEdit
}: DraggablePanelItemProps) {
  // Usar prefixo "panel-" para evitar conflito de IDs com cards no grid
  const panelItemId = `panel-${metrica.id}`
  const [showPreviewTooltip, setShowPreviewTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)
  const previewButtonRef = useRef<HTMLButtonElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: isCurrentlyDragging,
  } = useDraggable({ id: panelItemId, disabled: isActive })

  const Icon = metrica.icon

  // Valor de exemplo para a miniatura
  const exampleValue = metrica.id.includes('taxa') || metrica.id.includes('eficiencia') || metrica.id.includes('reincidencia')
    ? '78%'
    : metrica.id.includes('sla') || metrica.id.includes('medio')
      ? '4.2h'
      : metrica.id.includes('valor') || metrica.id.includes('pendente')
        ? 'R$ 45K'
        : '24'

  const handlePreviewMouseEnter = () => {
    if (previewButtonRef.current) {
      const rect = previewButtonRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left - 12, // 12px de margem
        y: rect.top + rect.height / 2
      })
      setShowPreviewTooltip(true)
    }
  }

  const handlePreviewMouseLeave = () => {
    setShowPreviewTooltip(false)
    setTooltipPosition(null)
  }

  return (
    <div
      ref={setNodeRef}
      {...(isActive ? {} : { ...attributes, ...listeners })}
      onClick={() => {
        if (isActive) {
          onRemove()
        } else {
          onAdd()
        }
      }}
      className={`group relative transition-all duration-200 ${isActive
        ? 'cursor-pointer'
        : 'cursor-grab active:cursor-grabbing'
        } ${(isDragging || isCurrentlyDragging) ? 'opacity-40 scale-95' : 'hover:scale-[1.02]'}`}
    >
      {/* Miniatura do Card */}
      <div
        className={`relative rounded-xl border overflow-hidden transition-all duration-200 ${isActive
          ? 'border-primary ring-2 ring-primary/30 shadow-lg shadow-primary/10'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
          } ${metrica.showCardBg ? '' : 'bg-white/95 backdrop-blur-sm'}`}
        style={!metrica.showCardBg ? {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          height: '72px'
        } : {
          height: '72px',
          backgroundColor: COLOR_OPTIONS.find(c => c.id === metrica.cardBgColor)?.bgHex || '#ffffff'
        }}
      >
        {/* Botões de ação (Visualizar e Editar) */}
        <div className="absolute top-1.5 right-1.5 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            ref={previewButtonRef}
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
            onMouseEnter={handlePreviewMouseEnter}
            onMouseLeave={handlePreviewMouseLeave}
            className="p-1.5 rounded-lg bg-white/90 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 transition-all shadow-sm"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1.5 rounded-lg bg-white/90 border border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-500 hover:text-amber-600 transition-all shadow-sm"
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tooltip com Preview do Card - renderizado via portal */}
        {showPreviewTooltip && tooltipPosition && createPortal(
          <div
            className="fixed z-[99999] animate-fadeIn"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-100%, -50%)',
              pointerEvents: 'none'
            }}
          >
            <div
              className={`card-modern border ${metrica.borderColor} p-5 shadow-2xl`}
              style={{ width: '280px', height: '160px' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-600 font-medium text-base truncate pr-2">
                  {metrica.titulo}
                </span>
                <Icon className={`h-6 w-6 ${metrica.cor} shrink-0`} />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className={`font-bold ${metrica.cor} text-4xl`}>
                  {exampleValue}
                </div>
                <p className="text-neutral-500 text-sm mt-2">
                  {metrica.descricao}
                </p>
              </div>
            </div>
            {/* Arrow */}
            <div
              className="absolute top-1/2 right-0 translate-x-1 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-slate-200 shadow-sm"
            />
          </div>,
          document.body
        )}

        {/* Indicador de ativo */}
        {isActive && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        )}

        {/* Conteúdo da miniatura */}
        <div className="flex items-center h-full p-3 gap-3">
          {/* Ícone */}
          <div className={`shrink-0 p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-slate-100 group-hover:bg-slate-50'
            }`}>
            <Icon className={`h-5 w-5 ${metrica.cor}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[11px] text-neutral-500 truncate leading-tight">
              {metrica.titulo}
            </span>
            <span className={`text-lg font-bold ${metrica.cor} leading-tight`}>
              {exampleValue}
            </span>
          </div>
        </div>

        {/* Overlay de hover para remover (quando ativo) */}
        {isActive && (
          <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 rounded-lg px-2 py-1 shadow-sm border border-red-200">
              <span className="text-xs text-red-600 font-medium">Clique para remover</span>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}


// ============================================
// EXPORT DEFAULT
// ============================================

export default MiniCardsGrid
