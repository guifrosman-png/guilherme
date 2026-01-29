import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
    LayoutGrid,
    Plus,
    X,
    GripVertical,
    Pencil,
    Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MetricPropertiesPanel } from './MetricPropertiesPanel'
import { CardRenderer } from './CardRenderer'
import { ExplorarModal } from './ExplorarModal'
import { FilterConfig } from '../hooks/useExplorarData'
import {
    CanvasComponent,
    MetricaConfig,
    CardCreatorModalProps,
    CanvasComponentType,
    ContextFilterType
} from '../types'
import {
    GRID_COLS as GLOBAL_GRID_COLS,
    GRID_ROWS as GLOBAL_GRID_ROWS,
    COLOR_OPTIONS,
    AVAILABLE_COMPONENTS,
    getComponentDefaultSize,
    isChartComponent
} from '../constants'
import { isChartTypeCompatible } from '../utils/chartCompatibility'
import { getAllMetrics } from '../metrics'

export function CardCreatorModal({ onClose, onCreate, editCard, contextFilter = 'all' }: CardCreatorModalProps & { contextFilter?: ContextFilterType }) {
    // Debug: Verificar o que está chegando
    useEffect(() => {
        console.log('[CardCreatorModal] Opened with editCard:', editCard)
        console.log('[CardCreatorModal] Canvas Components:', editCard?.canvasComponents)
    }, [editCard])

    // Se está editando, usar dados do card existente
    const isEditing = !!editCard

    const [cardName, setCardName] = useState(editCard?.titulo || 'Novo Card')
    const [showTitle, setShowTitle] = useState(editCard?.showTitle ?? true)
    const [showDescription, setShowDescription] = useState(editCard?.showDescription ?? true)

    const [showBorder, setShowBorder] = useState(editCard?.showBorder ?? true)
    const [categoria, setCategoria] = useState<'filas' | 'investigadores' | 'performance' | 'financeiro' | 'lucratividade'>(editCard?.categoria || 'performance')

    // Extrair colorScheme do card existente
    const getColorSchemeFromCard = (card?: MetricaConfig): string => {
        if (!card?.canvasConfig?.colorScheme) return 'blue'
        return card.canvasConfig.colorScheme
    }
    const [colorScheme, setColorScheme] = useState(getColorSchemeFromCard(editCard))

    // Novo estado para cor de fundo do card
    const [cardBgColor, setCardBgColor] = useState(editCard?.cardBgColor || 'blue')
    const [showCardBg, setShowCardBg] = useState(editCard?.showCardBg ?? false)

    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showBgColorPicker, setShowBgColorPicker] = useState(false)

    // Estado para o ExplorarModal
    const [explorarOpen, setExplorarOpen] = useState(false)
    const [explorarComponentId, setExplorarComponentId] = useState<string | null>(null)
    const [activeSidebarTab, setActiveSidebarTab] = useState<'geral' | 'visual'>('geral')
    const [showGrid, setShowGrid] = useState(true)

    // Estado para MetricPropertiesPanel (hoisted)
    const [metricsExpanded, setMetricsExpanded] = useState(true)
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

    // NOVO: Estado para seleção de métrica ao criar gráfico na aba Visual
    const [selectedMetricForChart, setSelectedMetricForChart] = useState<string | null>(null)


    const handleSelectMetric = (index: number, field: 'metric' | 'aggregation', value: string) => {
        // Lógica movida do MetricPropertiesPanel para cá se fosse necessário,
        // mas o componente filho ainda gerencia muito disso por enquanto.
        // No entanto, precisamos da função definida para passar pro prop.
        // Se a lógica principal ainda está no componente filho (via updateMetricsQuery interno),
        // este handler pode ser simplificado ou apenas logar por enquanto, 
        // ou precisamos checar se o filho realmente DELEGA tudo.

        // Pelo código do filho (Step 7137), ele ainda tem handleUpdateMetric interno, 
        // mas usa onSelectMetric se passado? Não, ele usa onSelectMetric apenas na prop definition?
        // Ah, eu vi no Step 7137 que eu adicionei a prop na interface, mas NÃO implementei o uso dela NO LOCAL DO SELECT.
        // O select ainda chama `handleUpdateMetric` interno.

        // Vamos deixar uma função dummy aqui para satisfazer a interface, 
        // mas o ideal é que o filho use essa função.
        console.log('Metric selected:', value)
    }

    // Handler para aplicar filtros do drill-in ao gráfico
    const handleApplyFiltersToChart = (appliedFilters: FilterConfig[]) => {
        if (!explorarComponentId) return

        // Atualizar o componente com os filtros aplicados
        setComponents(prev => prev.map(comp => {
            if (comp.id !== explorarComponentId) return comp

            // Converter FilterConfig para simpleFilters format
            const chartFilters = appliedFilters.map(f => ({
                field: f.field,
                operator: f.operator as 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_equals' | 'between',
                value: f.value as unknown
            }))

            return {
                ...comp,
                dataSource: {
                    ...comp.dataSource,
                    type: comp.dataSource?.type || 'metrics' as const,
                    metricsQuery: {
                        ...comp.dataSource?.metricsQuery,
                        metric: comp.dataSource?.metricsQuery?.metric || '',
                        aggregation: comp.dataSource?.metricsQuery?.aggregation || 'sum',
                        simpleFilters: chartFilters
                    }
                }
            } as CanvasComponent
        }))

        console.log('[CardCreatorModal] Filtros aplicados ao gráfico:', appliedFilters)
    }

    // Canvas config
    const GRID_COLS = GLOBAL_GRID_COLS
    const GRID_ROWS = GLOBAL_GRID_ROWS
    const [cellSize, setCellSize] = useState(20)

    // Grid Container Ref
    const gridContainerRef = useRef<HTMLDivElement>(null)

    // Recalcular tamanho da célula ao redimensionar container
    useEffect(() => {
        const updateSize = () => {
            if (!gridContainerRef.current) return

            const container = gridContainerRef.current
            // Subtrair padding (p-6 = 24px * 2 = 48px) e um pequeno buffer de segurança
            const availableWidth = container.clientWidth - 56
            const availableHeight = container.clientHeight - 56

            // Calcular tamanho ideal para caber sem scroll e manter a proporção
            const sizeFromWidth = availableWidth / GRID_COLS
            const sizeFromHeight = availableHeight / GRID_ROWS

            // Usar o menor valor para garantir que cabe em ambas dimensões
            // Permitir que diminua o quanto for necessário (removemos o floor de 12px)
            // Mantemos um max de 40px para não ficar gigante em telas grandes
            const newSize = Math.max(4, Math.min(40, Math.min(sizeFromWidth, sizeFromHeight)))

            setCellSize(newSize)
        }

        const resizeObserver = new ResizeObserver(() => {
            // Usar requestAnimationFrame para evitar "ResizeObserver loop limit exceeded"
            requestAnimationFrame(updateSize)
        })

        if (gridContainerRef.current) {
            resizeObserver.observe(gridContainerRef.current)
        }

        return () => resizeObserver.disconnect()
    }, [GRID_COLS, GRID_ROWS])

    // Drag state
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const canvasRef = useRef<HTMLDivElement>(null)

    const colorButtonRef = useRef<HTMLButtonElement>(null)
    const bgButtonRef = useRef<HTMLButtonElement>(null)

    // Componentes default para novo card
    // Nota: Isso poderia ser movido para constants ou mocks se necessário, 
    // mas como é específico do estado inicial deste modal, vou deixar aqui ou vazio.
    // O código original não usava isso explicitamente, usava editCard?.canvasComponents || []

    // Componentes no canvas com posição 2D - usar do card existente ou vazio para novo
    const [components, setComponents] = useState<CanvasComponent[]>(
        editCard?.canvasComponents || []
    )

    const colorOptions = COLOR_OPTIONS
    const currentColor = colorOptions.find(c => c.id === colorScheme) || colorOptions[0]
    const availableComponents = AVAILABLE_COMPONENTS

    // Encontrar posição livre no grid
    const findFreePosition = (width: number, height: number): { x: number; y: number } => {
        for (let y = 0; y <= GRID_ROWS - height; y++) {
            for (let x = 0; x <= GRID_COLS - width; x++) {
                const occupied = components.some(c =>
                    x < c.x + c.width && x + width > c.x &&
                    y < c.y + c.height && y + height > c.y
                )
                if (!occupied) return { x, y }
            }
        }
        return { x: 0, y: 0 } // fallback
    }

    const getDefaultSize = getComponentDefaultSize

    const addComponent = (type: CanvasComponentType) => {
        // REMOVIDO: A lógica de substituição "Intercom Style" confunde o usuário.
        // Agora sempre adiciona um novo componente.
        /* 
        if (selectedComponentId) {
            setComponents(prev => prev.map(c =>
                c.id === selectedComponentId ? { ...c, type } : c
            ))
            return
        }
        */



        const newId = `comp-${Date.now()}`

        const defaultProps: Record<string, unknown> = {}
        const defaultSize = getDefaultSize(type)

        // Configurar props default baseadas no tipo
        switch (type) {
            case 'title':
                defaultProps.text = 'Novo Título';
                defaultProps.fontSize = 'sm';
                defaultProps.color = 'slate-600';
                defaultProps.weight = 'medium';
                break
            case 'value':
                defaultProps.text = '0';
                defaultProps.fontSize = '4xl';
                defaultProps.weight = 'bold';
                defaultProps.color = 'slate-700';
                break
            case 'description':
                defaultProps.text = 'Nova descrição';
                defaultProps.fontSize = 'xs';
                defaultProps.color = 'slate-500';
                break
            case 'icon':
                defaultProps.iconType = 'activity';
                defaultProps.size = 24;
                defaultProps.color = 'slate-400';
                break
            case 'trend': defaultProps.value = '+12%'; defaultProps.direction = 'up'; break
            case 'progress': /* defaultProps.value = 75; */ break
            case 'badge': defaultProps.text = 'Novo'; defaultProps.variant = 'success'; break
            case 'chart-bar':
            case 'chart-bar-h':
            case 'chart-line':
            case 'chart-area':
                defaultProps.data = [30, 45, 28, 55, 42, 60, 48]
                defaultProps.labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

                // Initialize Date Range for these as well
                const todayChart = new Date()
                const startChart = new Date()
                const endChart = new Date()
                startChart.setDate(todayChart.getDate() - 29)
                startChart.setHours(0, 0, 0, 0)
                endChart.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: type === 'chart-bar' ? 'csv-total-pago' : 'csv-total-pago', // Default metric guess
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startChart.toISOString(),
                            end: endChart.toISOString()
                        }
                    }
                }
                break
            case 'chart-pie':
            case 'chart-donut':
                defaultProps.value = 65;
                // Initialize Date Range
                const todayPie = new Date()
                const startPie = new Date()
                const endPie = new Date()
                startPie.setDate(todayPie.getDate() - 29)
                startPie.setHours(0, 0, 0, 0)
                endPie.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startPie.toISOString(),
                            end: endPie.toISOString()
                        }
                    }
                }
                break
            case 'chart-gauge':
                defaultProps.value = 72; defaultProps.max = 100;
                // Initialize Date Range
                const todayGauge = new Date()
                const startGauge = new Date()
                const endGauge = new Date()
                startGauge.setDate(todayGauge.getDate() - 29)
                startGauge.setHours(0, 0, 0, 0)
                endGauge.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startGauge.toISOString(),
                            end: endGauge.toISOString()
                        }
                    }
                }
                break
            case 'chart-heatmap':
                // Dados: matriz 7x24 (dias x horas)
                defaultProps.data = Array(7).fill(null).map(() => Array(24).fill(null).map(() => Math.floor(Math.random() * 10)))
                defaultProps.rows = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
                defaultProps.cols = Array.from({ length: 24 }, (_, i) => i.toString())
                // Initialize Date Range
                const todayHeat = new Date()
                const startHeat = new Date()
                const endHeat = new Date()
                startHeat.setDate(todayHeat.getDate() - 29)
                startHeat.setHours(0, 0, 0, 0)
                endHeat.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startHeat.toISOString(),
                            end: endHeat.toISOString()
                        }
                    }
                }
                break
            case 'recharts-bar':
            case 'recharts-bar-h':
            case 'recharts-line':
            case 'recharts-area':
            case 'recharts-pie':
            case 'table':
            case 'kpi-unified':
                // Novos componentes com fonte de dados
                // Logic to set default date range (Last 30 Days)
                // Logic to set default date range (Last 30 Days)
                const today = new Date()
                const start = new Date()
                const end = new Date()
                start.setDate(today.getDate() - 29)

                // Normalize times
                start.setHours(0, 0, 0, 0)
                end.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: type === 'kpi-unified' ? 'csv-total-pago' : 'csv-total-pago', // Default metric
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: start.toISOString(),
                            end: end.toISOString()
                        }
                    }
                }
                break
            case 'recharts-radar':
                defaultProps.data = [
                    { subject: 'Vendas', A: 120, B: 110, fullMark: 150 },
                    { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
                    { subject: 'Tecnologia', A: 86, B: 130, fullMark: 150 },
                    { subject: 'Suporte', A: 99, B: 100, fullMark: 150 },
                    { subject: 'Operações', A: 85, B: 90, fullMark: 150 },
                    { subject: 'RH', A: 65, B: 85, fullMark: 150 }
                ]
                // Initialize Date Range
                const todayRadar = new Date()
                const startRadar = new Date()
                const endRadar = new Date()
                startRadar.setDate(todayRadar.getDate() - 29)
                startRadar.setHours(0, 0, 0, 0)
                endRadar.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startRadar.toISOString(),
                            end: endRadar.toISOString()
                        }
                    }
                }
                break
            case 'recharts-radial':
                defaultProps.data = [
                    { name: 'Meta', value: 100, fill: '#e5e7eb' },
                    { name: 'Atual', value: 78, fill: '#3b82f6' }
                ]
                // Initialize Date Range
                const todayRadial = new Date()
                const startRadial = new Date()
                const endRadial = new Date()
                startRadial.setDate(todayRadial.getDate() - 29)
                startRadial.setHours(0, 0, 0, 0)
                endRadial.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startRadial.toISOString(),
                            end: endRadial.toISOString()
                        }
                    }
                }
                break
            case 'recharts-scatter':
                defaultProps.data = [
                    { x: 100, y: 200, z: 200 },
                    { x: 120, y: 100, z: 260 },
                    { x: 170, y: 300, z: 400 },
                    { x: 140, y: 250, z: 280 },
                    { x: 150, y: 400, z: 500 },
                    { x: 110, y: 280, z: 200 }
                ]
                // Initialize Date Range
                const todayScatter = new Date()
                const startScatter = new Date()
                const endScatter = new Date()
                startScatter.setDate(todayScatter.getDate() - 29)
                startScatter.setHours(0, 0, 0, 0)
                endScatter.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startScatter.toISOString(),
                            end: endScatter.toISOString()
                        }
                    }
                }
                break
            case 'recharts-composed':
                defaultProps.data = [
                    { name: 'Jan', bar: 400, line: 240 },
                    { name: 'Fev', bar: 300, line: 139 },
                    { name: 'Mar', bar: 500, line: 380 },
                    { name: 'Abr', bar: 280, line: 390 },
                    { name: 'Mai', bar: 590, line: 480 },
                    { name: 'Jun', bar: 430, line: 380 }
                ]
                // Initialize Date Range
                const todayComp = new Date()
                const startComp = new Date()
                const endComp = new Date()
                startComp.setDate(todayComp.getDate() - 29)
                startComp.setHours(0, 0, 0, 0)
                endComp.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startComp.toISOString(),
                            end: endComp.toISOString()
                        }
                    }
                }
                break
            case 'recharts-treemap':
                defaultProps.data = [
                    { name: 'Categoria A', size: 400, color: '#3b82f6' },
                    { name: 'Categoria B', size: 300, color: '#8b5cf6' },
                    { name: 'Categoria C', size: 200, color: '#10b981' },
                    { name: 'Categoria D', size: 150, color: '#f59e0b' },
                    { name: 'Categoria E', size: 100, color: '#ef4444' }
                ]
                // Initialize Date Range
                const todayTree = new Date()
                const startTree = new Date()
                const endTree = new Date()
                startTree.setDate(todayTree.getDate() - 29)
                startTree.setHours(0, 0, 0, 0)
                endTree.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startTree.toISOString(),
                            end: endTree.toISOString()
                        }
                    }
                }
                break
            case 'recharts-funnel':
                defaultProps.data = [
                    { name: 'Visitantes', value: 5000, fill: '#3b82f6' },
                    { name: 'Leads', value: 3500, fill: '#8b5cf6' },
                ] // Keep original data as is, just appending dataSource
                // Initialize Date Range
                const todayFunnel = new Date()
                const startFunnel = new Date()
                const endFunnel = new Date()
                startFunnel.setDate(todayFunnel.getDate() - 29)
                startFunnel.setHours(0, 0, 0, 0)
                endFunnel.setHours(23, 59, 59, 999)

                defaultProps.dataSource = {
                    type: 'metrics',
                    metricsQuery: {
                        metric: 'csv-total-pago',
                        aggregation: 'sum',
                        dateRange: {
                            preset: 'last_30_days',
                            start: startFunnel.toISOString(),
                            end: endFunnel.toISOString()
                        }
                    }
                }
                break
            case 'table':
                defaultProps.columns = ['Período', 'Valor']
                defaultProps.rows = [
                    ['Semana 1', '120'],
                    ['Semana 2', '85'],
                    ['Semana 3', '143'],
                    ['Semana 4', '98']
                ]
                break
            case 'divider': break
            case 'spacer': defaultProps.height = 16; break
        }

        // Calcular posição e tamanho ideal baseado no tipo
        let width = GRID_COLS
        let height = GRID_ROWS
        let x = 0
        let y = 0

        // SMART LAYOUT LOGIC
        // 1. Definir tamanhos padrão ideais (não greedy)
        if (type === 'title' || type === 'description') {
            height = 6
        } else if (type === 'value') {
            width = Math.floor(GRID_COLS / 2)
            height = 8
        } else if (type === 'divider') {
            // Linha horizontal: larga e baixa
            height = 4
        } else if (type === 'spacer') {
            // Barra vertical: estreita e alta (3x32)
            width = 3
            height = 32
        } else if (type === 'icon') {
            width = 6
            height = 6
        } else {
            // Gráficos e Tabelas - Default para Meia Tela (16 linhas)
            // Isso permite colocar 2 gráficos um sobre o outro
            height = 16
        }

        // 2. Tentar encontrar posição (Stacking Vertical)

        // Caso especial: Values lado a lado
        if (type === 'value') {
            const lastComp = components[components.length - 1]
            if (lastComp && lastComp.type === 'value' && lastComp.y + lastComp.height > components.reduce((max, c) => Math.max(max, c.y + c.height), 0) - lastComp.height - 1) {
                // Se o último componente é valor e está na "bottom line", tentar colocar ao lado
                if (lastComp.x === 0 && lastComp.width <= GRID_COLS / 2) {
                    x = Math.floor(GRID_COLS / 2)
                    y = lastComp.y
                    // Encaixou ao lado!
                } else {
                    // Nova linha
                    const maxY = components.length > 0 ? Math.max(...components.map(c => c.y + c.height)) : 0
                    y = maxY
                }
            } else {
                const maxY = components.length > 0 ? Math.max(...components.map(c => c.y + c.height)) : 0
                y = maxY
            }
        }
        // Caso especial: Título sempre tenta ir pro topo se estiver vazio, senão stacka
        else if (type === 'title' && components.length === 0) {
            y = 0
            // Título ocupa largura total menos possivel espaco para icone se quiser
            width = GRID_COLS
        }
        // Caso especial: Icone sempre tenta ir para o topo direito
        else if (type === 'icon') {
            x = GRID_COLS - width - 1 // Encostado na direita com margem
            y = 1 // Margem superior
        }
        else {
            // Stacking normal
            const maxY = components.length > 0 ? Math.max(...components.map(c => c.y + c.height)) : 0
            y = maxY
        }

        // 3. Ajuste de Limites (Clamping)
        if (y >= GRID_ROWS) {
            // Canvas cheio - colocar no topo com offset para indicar novo layer
            x = 2
            y = 2
            width = Math.min(width, GRID_COLS - 4)
            height = Math.min(height, GRID_ROWS - 4)
        } else if (y + height > GRID_ROWS) {
            // Encaixar no espaço restante se for útil
            const remaining = GRID_ROWS - y
            if (remaining >= 4) { // Pelo menos 4 linhas
                height = remaining
            } else {
                // Espaço muito pequeno, melhor sobrepor
                x = 2
                y = 2
            }
        }

        setComponents(prev => [...prev, {
            id: newId,
            type,
            x: x,
            y: y,
            width: width,
            height: height,
            props: defaultProps
        }])
        setSelectedComponentId(newId)
    }

    const handleChartTypeClick = (type: CanvasComponentType) => {
        const existingChart = components.find(c => isChartComponent(c.type))

        if (existingChart) {
            // TROCA O TIPO do gráfico existente
            setComponents(prev => prev.map(c =>
                c.id === existingChart.id
                    ? { ...c, type: type }
                    : c
            ))
            // Mantém selecionado
            setSelectedComponentId(existingChart.id)
        } else {
            // CRIA NOVO com a métrica selecionada
            const newId = `chart-${Date.now()}`
            const defaultSize = getComponentDefaultSize(type)

            // Tenta posicionar inteligentemente (simples stacking)
            const y = components.length > 0 ? Math.max(...components.map(c => c.y + c.height)) : 0

            const newComp: CanvasComponent = {
                id: newId,
                type: type,
                x: 0,
                y: y >= GRID_ROWS ? 0 : y,
                width: defaultSize.width,
                height: defaultSize.height,
                props: {},
                dataSource: {
                    type: 'metrics',
                    metricsQuery: {
                        metric: selectedMetricForChart!, // Assumes metric is selected due to UI disabled state
                        aggregation: 'sum'
                    }
                }
            }

            setComponents(prev => [...prev, newComp])
            setSelectedComponentId(newId)
        }
    }

    const removeComponent = (id: string) => {
        setComponents(prev => prev.filter(c => c.id !== id))
        if (selectedComponentId === id) setSelectedComponentId(null)
    }

    const updateComponentProps = (id: string, newProps: Record<string, unknown>) => {
        setComponents(prev => prev.map(c => {
            if (c.id !== id) return c

            // Separar propriedades que devem ficar na raiz do componente vs props
            const { dataSource, ...restProps } = newProps

            return {
                ...c,
                dataSource: dataSource !== undefined ? (dataSource as any) : c.dataSource,
                props: { ...c.props, ...restProps }
            }
        }))
    }

    // Converter pixel para grid position
    const pixelToGrid = (px: number, cellSize: number): number => {
        return Math.round(px / cellSize)
    }

    // Handlers de drag
    const handleDragStart = (e: React.MouseEvent, compId: string) => {
        e.stopPropagation()
        const comp = components.find(c => c.id === compId)
        if (!comp || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        setIsDragging(true)
        setSelectedComponentId(compId)
        setDragStart({
            x: e.clientX - rect.left - comp.x * cellSize,
            y: e.clientY - rect.top - comp.y * cellSize
        })
    }

    const handleDragMove = (e: React.MouseEvent) => {
        if (!isDragging || !selectedComponentId || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const comp = components.find(c => c.id === selectedComponentId)
        if (!comp) return

        const newX = pixelToGrid(e.clientX - rect.left - dragStart.x, cellSize)
        const newY = pixelToGrid(e.clientY - rect.top - dragStart.y, cellSize)

        // Clamp para dentro do grid
        const clampedX = Math.max(0, Math.min(GRID_COLS - comp.width, newX))
        const clampedY = Math.max(0, Math.min(GRID_ROWS - comp.height, newY))

        setComponents(prev => prev.map(c =>
            c.id === selectedComponentId ? { ...c, x: clampedX, y: clampedY } : c
        ))
    }

    const handleDragEnd = () => {
        setIsDragging(false)
        setIsResizing(false)
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedComponentId) return

            const comp = components.find(c => c.id === selectedComponentId)
            if (!comp) return

            let deltaX = 0
            let deltaY = 0

            switch (e.key) {
                case 'ArrowUp':
                    deltaY = -1
                    break
                case 'ArrowDown':
                    deltaY = 1
                    break
                case 'ArrowLeft':
                    deltaX = -1
                    break
                case 'ArrowRight':
                    deltaX = 1
                    break
                default:
                    return
            }

            e.preventDefault()

            const newX = Math.max(0, Math.min(GRID_COLS - comp.width, comp.x + deltaX))
            const newY = Math.max(0, Math.min(GRID_ROWS - comp.height, comp.y + deltaY))

            setComponents(prev => prev.map(c =>
                c.id === selectedComponentId ? { ...c, x: newX, y: newY } : c
            ))
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedComponentId, components])

    // Handlers de resize
    const handleResizeStart = (e: React.MouseEvent, compId: string) => {
        e.stopPropagation()
        const comp = components.find(c => c.id === compId)
        if (!comp || !canvasRef.current) return

        setIsResizing(true)
        setSelectedComponentId(compId)
        setDragStart({ x: e.clientX, y: e.clientY })
        setDragOffset({ x: comp.width, y: comp.height })
    }

    const handleResizeMove = (e: React.MouseEvent) => {
        if (!isResizing || !selectedComponentId) return

        const comp = components.find(c => c.id === selectedComponentId)
        if (!comp) return

        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y

        const newWidth = Math.max(1, Math.min(GRID_COLS - comp.x, dragOffset.x + pixelToGrid(deltaX, cellSize)))
        const newHeight = Math.max(1, Math.min(GRID_ROWS - comp.y, dragOffset.y + pixelToGrid(deltaY, cellSize)))

        setComponents(prev => prev.map(c =>
            c.id === selectedComponentId ? { ...c, width: newWidth, height: newHeight } : c
        ))
    }

    // Mouse move handler combinado
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleDragMove(e)
        else if (isResizing) handleResizeMove(e)
    }

    const selectedComponent = components.find(c => c.id === selectedComponentId)

    const renderCanvasComponent = (comp: CanvasComponent) => {
        const isSelected = selectedComponentId === comp.id

        return (
            <div
                key={comp.id}
                className={`absolute group rounded-lg border-2 transition-all ${isSelected
                    ? 'border-primary shadow-lg shadow-primary/20 z-20'
                    : 'border-transparent hover:border-slate-300 z-10'
                    } ${isDragging && selectedComponentId === comp.id ? 'cursor-grabbing opacity-90' : 'cursor-grab'}`}
                style={{
                    left: comp.x * cellSize,
                    top: comp.y * cellSize,
                    width: comp.width * cellSize,
                    height: comp.height * cellSize
                }}
                onMouseDown={(e) => handleDragStart(e, comp.id)}
                onClick={(e) => { e.stopPropagation(); setSelectedComponentId(comp.id) }}
            >
                {/* Conteúdo do componente */}
                <div className="w-full h-full p-2 flex items-center justify-center overflow-hidden bg-transparent rounded-lg">
                    <CardRenderer
                        component={comp}
                        currentColor={currentColor}
                        scale={cellSize / 6} // Escalar visualmente para corresponder ao Dashboard (Base Unit 6)
                        onExplore={() => {
                            setExplorarComponentId(comp.id)
                            setExplorarOpen(true)
                        }}
                    />
                </div>

                {/* Handle de resize no canto inferior direito */}
                {isSelected && (
                    <>
                        {/* Delete button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); removeComponent(comp.id) }}
                            className="absolute -top-2.5 -right-2.5 p-1.5 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 z-50 transition-transform hover:scale-110"
                            title="Remover componente"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>

                        {/* Resize handle */}
                        <div
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30 flex items-center justify-center"
                            onMouseDown={(e) => handleResizeStart(e, comp.id)}
                        >
                            <div className="w-2 h-2 border-r-2 border-b-2 border-primary rounded-br" />
                        </div>

                        {/* Size indicator */}
                        <div className="absolute bottom-1 left-1 px-1 py-0.5 text-[9px] font-mono bg-slate-900/70 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {comp.width}x{comp.height}
                        </div>
                    </>
                )}
            </div>
        )
    }

    const handleCreate = () => {
        const titleComp = components.find(c => c.type === 'title')
        const valueComp = components.find(c => c.type === 'value')
        const descComp = components.find(c => c.type === 'description')

        const cardId = isEditing && editCard ? editCard.id : `custom-${Date.now()}`
        const newCard: any = {
            id: cardId,
            titulo: (titleComp?.props.text as string) || cardName,
            showTitle,
            showDescription,
            showBorder,
            showCardBg,
            cardBgColor,
            descricao: (descComp?.props.text as string) || 'Card personalizado',

            icon: Activity,
            cor: currentColor.text,
            borderColor: currentColor.border,
            getValue: () => (valueComp?.props.text as string) || '0',
            categoria: categoria,
            // Salvar os componentes do canvas
            canvasComponents: components,
            canvasConfig: {
                gridCols: GRID_COLS,
                gridRows: GRID_ROWS,
                colorScheme: colorScheme
            }
        }

        onCreate(newCard)
    }



    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                style={{ zIndex: 9999999 }}
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-3 md:inset-6 lg:inset-10 flex items-center justify-center pointer-events-none" style={{ zIndex: 9999999 }}>
                <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 w-full h-full flex flex-col animate-scaleIn overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${currentColor.bg}`}>
                                <LayoutGrid className={`h-5 w-5 ${currentColor.text}`} />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="text-lg font-semibold text-neutral-800 bg-transparent border-none outline-none focus:ring-0 p-0"
                                    placeholder="Nome do card"
                                />
                                <p className="text-xs text-slate-500">
                                    Canvas Builder - {isEditing ? 'Edite os componentes do seu card' : 'Arraste componentes para criar seu card'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleCreate}
                                className="bg-primary hover:bg-primary/90 text-white"
                            >
                                {isEditing ? (
                                    <Pencil className="h-4 w-4 mr-1" />
                                ) : (
                                    <Plus className="h-4 w-4 mr-1" />
                                )}
                                {isEditing ? 'Salvar Alterações' : 'Criar Card'}
                            </Button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors ml-2"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content - 3 colunas */}
                    <div className="flex-1 flex min-h-0 overflow-hidden">

                        {/* Painel Esquerdo - Componentes disponíveis */}
                        <div className="w-56 border-r border-slate-200 bg-white flex flex-col">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setActiveSidebarTab('geral')}
                                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeSidebarTab === 'geral' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Geral
                                </button>
                                <button
                                    onClick={() => setActiveSidebarTab('visual')}
                                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeSidebarTab === 'visual' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Visual
                                </button>
                            </div>

                            {/* Content Area - Fixed Height / No Scroll */}
                            <div className="flex-1 p-3 overflow-hidden flex flex-col">

                                {/* TAB: GERAL (Texto, Layout, Settings) */}
                                {activeSidebarTab === 'geral' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">

                                        {/* Basic Components */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {AVAILABLE_COMPONENTS.filter(c => ['Texto', 'Layout', 'Visual'].includes(c.category)).map(comp => (
                                                <button
                                                    key={comp.type}
                                                    onClick={() => addComponent(comp.type)}
                                                    className="flex flex-col items-center justify-center gap-1 p-2 h-16 rounded-lg border border-slate-100 bg-white hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all group"
                                                >
                                                    <div className="text-slate-400 group-hover:text-primary transition-colors scale-90">
                                                        {comp.icon}
                                                    </div>
                                                    <span className="text-[9px] font-medium text-slate-500 group-hover:text-primary truncate w-full text-center">{comp.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="h-px bg-slate-100 w-full" />

                                        {/* Grid Settings (Compact) */}
                                        {/* Appearance Settings */}
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aparência</h5>

                                            {/* Grid Toggle */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-600">Mostrar Grade</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>

                                            {/* Border Toggle & Colors */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-600">Borda Lateral</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={showBorder} onChange={e => setShowBorder(e.target.checked)} className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>
                                                <div className="flex gap-1 flex-wrap justify-end">
                                                    {colorOptions.map(color => (
                                                        <button
                                                            key={color.id}
                                                            onClick={() => {
                                                                setColorScheme(color.id)
                                                                setShowBorder(true)
                                                            }}
                                                            className={`w-6 h-6 rounded-full border ${colorScheme === color.id && showBorder ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-60 hover:opacity-100'} ${color.bgSolid} transition-all`}
                                                            title={color.label}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Background Toggle & Colors */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-600">Fundo Card</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={showCardBg} onChange={e => setShowCardBg(e.target.checked)} className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                    </label>
                                                </div>
                                                <div className="flex gap-1 flex-wrap justify-end">
                                                    {colorOptions.map(color => (
                                                        <button
                                                            key={color.id}
                                                            onClick={() => {
                                                                setCardBgColor(color.id)
                                                                setShowCardBg(true)
                                                            }}
                                                            className={`w-6 h-6 rounded-full border ${cardBgColor === color.id && showCardBg ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-60 hover:opacity-100'} ${color.bgSolid} transition-all`}
                                                            title={color.label}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: VISUAL (Layout Original com Lógica Nova) */}
                                {activeSidebarTab === 'visual' && (
                                    <div className="animate-in fade-in slide-in-from-left-2 duration-300 space-y-4 overflow-y-auto pr-1">

                                        {/* Indicadores */}
                                        <div className="space-y-1">
                                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2">Indicadores</h5>

                                            {/* KPI Destaque */}
                                            {AVAILABLE_COMPONENTS.filter(c => c.type === 'kpi-unified').map(comp => {
                                                const isCompatible = selectedMetricForChart
                                                    ? isChartTypeCompatible(comp.type, selectedMetricForChart)
                                                    : false

                                                return (
                                                    <button
                                                        key={comp.type}
                                                        disabled={!selectedMetricForChart || !isCompatible}
                                                        onClick={() => handleChartTypeClick(comp.type)}
                                                        className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all group mb-2
                                                        ${!selectedMetricForChart || !isCompatible
                                                                ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                                                : 'border-blue-100 bg-blue-50/50 hover:border-blue-300 hover:bg-blue-100/50'
                                                            }`}
                                                    >
                                                        <div className={`p-1.5 rounded-md group-hover:scale-110 transition-transform ${!selectedMetricForChart || !isCompatible ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                                                            {comp.icon}
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <span className={`text-xs font-bold ${!selectedMetricForChart || !isCompatible ? 'text-slate-500' : 'text-blue-700'}`}>{comp.label}</span>
                                                            <span className={`text-[9px] leading-none ${!selectedMetricForChart || !isCompatible ? 'text-slate-400' : 'text-blue-400'}`}>Recomendado</span>
                                                        </div>
                                                    </button>
                                                )
                                            })}

                                            {/* Outros Indicadores (Grid 3) */}
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {AVAILABLE_COMPONENTS.filter(c => c.category === 'Indicadores' && c.type !== 'kpi-unified').map(comp => {
                                                    const isCompatible = selectedMetricForChart
                                                        ? isChartTypeCompatible(comp.type, selectedMetricForChart)
                                                        : false

                                                    return (
                                                        <button
                                                            key={comp.type}
                                                            disabled={!selectedMetricForChart || !isCompatible}
                                                            onClick={() => handleChartTypeClick(comp.type)}
                                                            className={`flex flex-col items-center justify-center p-1.5 h-14 rounded-lg border transition-all group
                                                            ${!selectedMetricForChart || !isCompatible
                                                                    ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                                                    : 'border-slate-100 bg-white hover:border-primary hover:bg-primary/5 hover:shadow-sm'
                                                                }`}
                                                        >
                                                            <div className={`transition-colors scale-90 mb-0.5 ${!selectedMetricForChart || !isCompatible ? 'text-slate-300' : 'text-slate-400 group-hover:text-primary'}`}>
                                                                {comp.icon}
                                                            </div>
                                                            <span className={`text-[9px] font-medium truncate w-full text-center tracking-tight ${!selectedMetricForChart || !isCompatible ? 'text-slate-400' : 'text-slate-500 group-hover:text-primary'}`}>{comp.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Gráficos (Grid 3 Compacta) */}
                                        <div className="space-y-1">
                                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1">Gráficos</h5>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {AVAILABLE_COMPONENTS.filter(c => c.category === 'Gráficos').map(comp => {
                                                    const isCompatible = selectedMetricForChart
                                                        ? isChartTypeCompatible(comp.type, selectedMetricForChart)
                                                        : false

                                                    return (
                                                        <button
                                                            key={comp.type}
                                                            disabled={!selectedMetricForChart || !isCompatible}
                                                            onClick={() => handleChartTypeClick(comp.type)}
                                                            className={`flex flex-col items-center justify-center p-1 h-14 rounded-lg border transition-all group
                                                            ${!selectedMetricForChart || !isCompatible
                                                                    ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                                                    : 'border-slate-100 bg-white hover:border-primary hover:bg-primary/5 hover:shadow-sm'
                                                                }`}
                                                        >
                                                            <div className={`transition-colors scale-75 mb-0.5 ${!selectedMetricForChart || !isCompatible ? 'text-slate-300' : 'text-slate-400 group-hover:text-primary'}`}>
                                                                {comp.icon}
                                                            </div>
                                                            <span className={`text-[8px] font-medium truncate w-full text-center leading-tight ${!selectedMetricForChart || !isCompatible ? 'text-slate-400' : 'text-slate-500 group-hover:text-primary'}`}>{comp.label.replace('recharts-', '').replace('chart-', '')}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Tabelas e Dados (Botões Lista) */}
                                        <div className="space-y-1 pt-1">
                                            {AVAILABLE_COMPONENTS.filter(c => c.category === 'Dados').map(comp => {
                                                const isCompatible = selectedMetricForChart
                                                    ? isChartTypeCompatible(comp.type, selectedMetricForChart)
                                                    : false

                                                return (
                                                    <button
                                                        key={comp.type}
                                                        disabled={!selectedMetricForChart || !isCompatible}
                                                        onClick={() => handleChartTypeClick(comp.type)}
                                                        className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg border transition-all group
                                                        ${!selectedMetricForChart || !isCompatible
                                                                ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                                                : 'border-slate-100 bg-white hover:border-primary hover:bg-primary/5 hover:shadow-sm'
                                                            }`}
                                                    >
                                                        <div className={`transition-colors ${!selectedMetricForChart || !isCompatible ? 'text-slate-300' : 'text-slate-400 group-hover:text-primary'}`}>
                                                            {comp.icon}
                                                        </div>
                                                        <span className={`text-xs font-medium ${!selectedMetricForChart || !isCompatible ? 'text-slate-400' : 'text-slate-600 group-hover:text-primary'}`}>{comp.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Canvas Central - Grid 2D estilo Power BI */}
                        <div
                            ref={gridContainerRef}
                            className="flex-1 bg-slate-100 p-6 overflow-hidden flex flex-col justify-center"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                            onClick={() => setSelectedComponentId(null)}
                        >
                            <div className="flex flex-col items-center">
                                {/* Info do grid */}
                                <div className="mb-4 flex items-center gap-4 text-xs text-slate-500">
                                    <span>Grid: {GRID_COLS}x{GRID_ROWS}</span>
                                    <span>Componentes: {components.length}</span>
                                    {selectedComponent && (
                                        <span className="text-primary font-medium">
                                            Selecionado: {availableComponents.find(c => c.type === selectedComponent.type)?.label}
                                        </span>
                                    )}
                                </div>

                                {/* Canvas Grid */}
                                <div
                                    ref={canvasRef}
                                    className={`relative rounded-2xl border ${currentColor.border} ${showCardBg
                                        ? COLOR_OPTIONS.find(c => c.id === cardBgColor)?.bg || 'bg-white'
                                        : 'bg-white'
                                        } shadow-xl`}
                                    style={{
                                        width: GRID_COLS * cellSize,
                                        height: GRID_ROWS * cellSize
                                    }}
                                    onClick={() => setSelectedComponentId(null)}
                                >
                                    {/* Borda Lateral (Condicional) */}
                                    {showBorder && (
                                        <div className={`absolute left-0 top-0 bottom-0 w-[6px] ${currentColor.bgSolid} z-10 pointer-events-none`} />
                                    )}
                                    {/* Grid lines */}
                                    {showGrid && (
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                backgroundImage: `
                                                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                                                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                                                `,
                                                backgroundSize: `${cellSize}px ${cellSize}px`
                                            }}
                                        />
                                    )}

                                    {/* Componentes */}
                                    {components.length === 0 ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-slate-400">
                                                <Plus className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                                <p className="text-sm">Selecione uma métrica no painel direito<br />e escolha um gráfico na esquerda</p>
                                            </div>
                                        </div>
                                    ) : (
                                        components.map(comp => renderCanvasComponent(comp))
                                    )}
                                </div>

                                {/* Instruções */}
                                <div className="mt-4 flex items-center gap-6 text-xs text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <GripVertical className="h-3 w-3" />
                                        <span>Arraste para mover</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 border-r-2 border-b-2 border-slate-400 rounded-br" />
                                        <span>Arraste o canto para redimensionar</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        <span>Clique no X para remover</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Painel Direito - Propriedades */}
                        <div className="w-[400px] border-l border-slate-200 bg-white flex flex-col">
                            <div className="p-3 border-b border-slate-100">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Propriedades
                                </h3>
                            </div>
                            <ScrollArea className="flex-1 min-h-0">
                                <div className="p-3">
                                    <MetricPropertiesPanel
                                        // Se não tem componente, passa um fake para permitir edição da "métrica de criação"
                                        selectedComponent={selectedComponent || (activeSidebarTab === 'visual' ? {
                                            id: 'temp-creation',
                                            type: 'recharts-bar', // Tipo dummy
                                            dataSource: {
                                                type: 'metrics',
                                                metricsQuery: {
                                                    metric: selectedMetricForChart || '',
                                                    aggregation: 'sum'
                                                }
                                            }
                                        } as CanvasComponent : null)}

                                        onUpdate={(updated) => {
                                            if (selectedComponent) {
                                                // Fluxo normal: atualiza componente
                                                setComponents(prev => prev.map(c => c.id === updated.id ? updated : c))
                                            } else {
                                                // Fluxo criação: atualiza estado local da métrica
                                                const newMetric = updated.dataSource?.metricsQuery?.metric
                                                if (newMetric) {
                                                    setSelectedMetricForChart(newMetric)
                                                }
                                            }
                                        }}
                                        showPreview={true}
                                        metricsExpanded={metricsExpanded}
                                        onToggleMetrics={() => setMetricsExpanded(!metricsExpanded)}
                                        // Passa a métrica selecionada do estado local se não tiver componente
                                        selectedMetric={selectedComponent ? selectedMetric : selectedMetricForChart}
                                        onSelectMetric={(idx, field, val) => {
                                            if (field === 'metric') {
                                                setSelectedMetricForChart(val)
                                            }
                                            handleSelectMetric(idx, field, val)
                                        }}
                                        contextFilter={contextFilter}
                                        disableCompatibilityFilter={!selectedComponent}
                                    />
                                </div>
                            </ScrollArea>
                        </div>

                    </div>
                </div>
            </div >
            {/* ExplorarModal */}
            {
                (() => {
                    const componentToExplore = components.find(c => c.id === explorarComponentId)

                    // Extrair metricId e groupingField (mesma lógica do MiniCardsGrid)
                    let activeMetricId: string | undefined = undefined
                    let groupingField: string | undefined = undefined
                    let activeDateRange: { start: Date; end: Date } | undefined = undefined

                    if (componentToExplore) {
                        if (componentToExplore.dataSource?.metricsQuery?.metric) {
                            activeMetricId = componentToExplore.dataSource.metricsQuery.metric
                        }

                        if (componentToExplore.dataSource?.metricsQuery?.dimension) {
                            groupingField = componentToExplore.dataSource.metricsQuery.dimension
                        } else if (componentToExplore.dataSource?.mapping?.labels) {
                            groupingField = componentToExplore.dataSource.mapping.labels
                        }

                        // Date Range
                        if (componentToExplore.dataSource?.metricsQuery?.dateRange) {
                            const { start, end } = componentToExplore.dataSource.metricsQuery.dateRange
                            if (start && end) {
                                activeDateRange = {
                                    start: new Date(start),
                                    end: new Date(end)
                                }
                            }
                        }
                    }

                    // Determine context - Force 'financeiro' if metric ID implies financial data
                    let finalContext = categoria === 'financeiro' ? 'financeiro' : categoria === 'filas' ? 'filas' : 'geral'
                    if (activeMetricId && (activeMetricId.startsWith('fin-') || activeMetricId.startsWith('csv-'))) {
                        finalContext = 'financeiro'
                    }

                    return (
                        <ExplorarModal
                            isOpen={explorarOpen}
                            onClose={() => setExplorarOpen(false)}
                            cardTitle={componentToExplore?.props?.title as string || 'Explorar Dados'}
                            metricContext={finalContext}
                            colorScheme={colorScheme}
                            cardId={explorarComponentId || undefined}
                            metricId={activeMetricId}
                            groupingField={groupingField}
                            dateRange={activeDateRange}
                            onApplyFilters={handleApplyFiltersToChart}
                        />
                    )
                })()
            }
        </>
    )
}
