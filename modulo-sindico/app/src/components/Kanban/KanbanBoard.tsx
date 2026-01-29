import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { KanbanColumn, KanbanColumnProps, KanbanColumnContent } from './KanbanColumn';
import { KanbanCard, KanbanCardProps, KanbanCardContent, ViewSettings } from './KanbanCard';
import { CardModal } from './CardModal';
import { ConfirmModal } from './ConfirmModal';
import { MemberModal } from './MemberModal';
import { UniversalFilterMenu } from '../Filters/UniversalFilterMenu';
import { FilterCapsules } from '../Filters/FilterCapsules';
import { FilterCondition, FilterOperator, FilterField } from '../Filters/types';
import { Search, Plus, Filter, Settings2, X, Users } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    useDraggable
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// Helpers for mock dates
const getToday = () => new Date().toISOString().split('T')[0];
const getRelativeDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const MOCK_DATA: KanbanColumnProps[] = [

    {
        id: 'todo',
        title: 'A Fazer',
        color: 'bg-slate-400',
        cards: [
            {
                id: '1',
                title: 'Pesquisa de referências de UI/UX',
                description: 'Coletar referências de design moderno, focado em minimalismo e usabilidade. Verificar concorrentes diretos e indiretos.',
                priority: 'medium',
                tags: [{ label: 'Design', color: 'bg-purple-100 text-purple-700' }],
                assignees: ['AF', 'JD'],
                commentCount: 3,
                dueDate: getRelativeDate(2)
            },
            {
                id: '2',
                title: 'Configuração do ambiente de desenvolvimento',
                priority: 'high',
                tags: [{ label: 'DevTools', color: 'bg-gray-100 text-gray-700' }],
                checklistItems: [
                    { id: 'c1', text: 'Instalar Node.js', completed: true },
                    { id: 'c2', text: 'Configurar ESLint', completed: true },
                    { id: 'c3', text: 'Configurar Prettier', completed: false },
                    { id: 'c4', text: 'Criar repositório', completed: false },
                    { id: 'c5', text: 'Convidar time', completed: false },
                ],
                checklist: { completed: 2, total: 5 },
                dueDate: getToday()
            }
        ]
    },
    {
        id: 'in-progress',
        title: 'Em Progresso',
        color: 'bg-blue-500',
        cards: [
            {
                id: '3',
                title: 'Implementação do componente de Kanban',
                priority: 'urgent',
                tags: [{ label: 'Frontend', color: 'bg-emerald-100 text-emerald-700' }],
                assignees: ['AF'],
                attachmentCount: 2,
                coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=500&q=80',
                dueDate: getRelativeDate(1)
            }
        ]
    },
    {
        id: 'review',
        title: 'Revisão',
        color: 'bg-orange-400',
        cards: [
            {
                id: '4',
                title: 'Integração com API de autenticação',
                priority: 'high',
                tags: [{ label: 'Backend', color: 'bg-amber-100 text-amber-700' }],
                assignees: ['JD'],
                commentCount: 12,
                checklist: { completed: 8, total: 8 }
            }
        ]
    },
    {
        id: 'done',
        title: 'Concluído',
        color: 'bg-emerald-500',
        cards: [
            {
                id: '5',
                title: 'Kickoff do projeto',
                tags: [{ label: 'Meeting', color: 'bg-gray-100 text-gray-700' }],
                assignees: ['AF', 'JD', 'MG'],
                dueDate: getRelativeDate(-1)
            },
            {
                id: '6',
                title: 'Definição de escopo',
                tags: [{ label: 'Planning', color: 'bg-pink-100 text-pink-700' }],
                checklist: { completed: 3, total: 3 }
            }
        ]
    }
];

// Helper for safe parsing
const safeParse = (key: string, fallback: any) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
        console.error(`Error parsing ${key} from localStorage`, e);
        return fallback;
    }
};

function DraggableMember({ member }: { member: { id: string; name: string; avatar: string } }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: member.id,
        data: { type: 'Member', member },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={clsx(
                "w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing hover:z-10 transition-all text-xs font-medium relative hover:scale-110 shadow-sm",
                isDragging && "opacity-50"
            )}
            title={member.name}
            style={{ zIndex: isDragging ? 50 : 'auto' }}
        >
            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        </div>
    );
}

export function KanbanBoard() {
    const [columns, setColumns] = useState<KanbanColumnProps[]>(() => safeParse('kanban-storage', MOCK_DATA));
    const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>(() => safeParse('kanban-collapsed', {}));

    React.useEffect(() => {
        localStorage.setItem('kanban-storage', JSON.stringify(columns));
    }, [columns]);

    React.useEffect(() => {
        localStorage.setItem('kanban-collapsed', JSON.stringify(collapsedColumns));
    }, [collapsedColumns]);

    // Cleanup effect to remove duplicates on mount (in case of corruption)
    React.useEffect(() => {
        const seenIds = new Set();
        let hasDuplicates = false;

        // Check for duplicates
        columns.forEach(col => {
            col.cards.forEach(card => {
                if (seenIds.has(card.id)) hasDuplicates = true;
                seenIds.add(card.id);
            });
        });

        if (hasDuplicates) {
            console.warn("Cleaning up duplicate cards...");
            setColumns(prev => {
                const seen = new Set();
                return prev.map(col => ({
                    ...col,
                    cards: col.cards.filter(card => {
                        if (seen.has(card.id)) return false;
                        seen.add(card.id);
                        return true;
                    })
                }));
            });
        }
    }, []);

    const [availableTags, setAvailableTags] = useState<{ id: string; label: string; color: string }[]>(() =>
        safeParse('kanban-tags', [
            { id: 't1', label: 'Design', color: 'bg-purple-100 text-purple-700' },
            { id: 't2', label: 'DevOps', color: 'bg-blue-100 text-blue-700' },
            { id: 't3', label: 'Frontend', color: 'bg-emerald-100 text-emerald-700' },
            { id: 't4', label: 'Backend', color: 'bg-amber-100 text-amber-700' },
            { id: 't5', label: 'Meeting', color: 'bg-gray-100 text-gray-700' },
            { id: 't6', label: 'Planning', color: 'bg-pink-100 text-pink-700' },
        ])
    );

    const [availableMembers, setAvailableMembers] = useState<{ id: string; name: string; avatar: string }[]>(() =>
        safeParse('kanban-members', [
            { id: 'm1', name: 'Angela Smith', avatar: 'https://ui-avatars.com/api/?name=Angela+Smith&background=random' },
            { id: 'm2', name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
        ])
    );

    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    React.useEffect(() => {
        localStorage.setItem('kanban-tags', JSON.stringify(availableTags));
    }, [availableTags]);

    React.useEffect(() => {
        localStorage.setItem('kanban-members', JSON.stringify(availableMembers));
    }, [availableMembers]);

    function handleAddMember(name: string) {
        if (!name.trim()) return;
        const newMember = {
            id: `mem-${Date.now()}`,
            name: name.trim(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        };
        setAvailableMembers(prev => [...prev, newMember]);
    }

    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    const [filters, setFilters] = useState<FilterCondition[]>([]);

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const filteredColumns = useMemo(() => {
        let cols = columns;

        // 1. Text Search
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            cols = cols.map(col => ({
                ...col,
                cards: col.cards.filter(card =>
                    card.title.toLowerCase().includes(lowerQuery) ||
                    card.tags?.some(tag => tag.label.toLowerCase().includes(lowerQuery))
                )
            }));
        }

        // 2. Advanced Filters (Query Builder)
        if (filters.length > 0) {
            cols = cols.map(col => ({
                ...col,
                cards: col.cards.filter(card => {
                    return filters.every(condition => {
                        const { field, operator, value } = condition;

                        switch (field) {
                            case 'tag': {
                                const cardTags = card.tags?.map(t => t.label) || [];
                                if (operator === 'set') return cardTags.length > 0;
                                if (operator === 'not_set') return cardTags.length === 0;

                                const targetTags = Array.isArray(value) ? value : [value];
                                const hasTag = targetTags.some((t: string) => cardTags.includes(t));

                                if (operator === 'is') return hasTag;
                                if (operator === 'is_not') return !hasTag;
                                if (operator === 'contains') return hasTag;
                                if (operator === 'not_contains') return !hasTag;
                                return true;
                            }
                            case 'priority': {
                                const p = card.priority || 'medium'; // Default to medium if missing? Or 'no-priority'
                                const targetPriorities = Array.isArray(value) ? value : [value];
                                const match = targetPriorities.includes(p);

                                if (operator === 'is') return match;
                                if (operator === 'is_not') return !match;
                                if (operator === 'set') return !!card.priority;
                                if (operator === 'not_set') return !card.priority;
                                return true;
                            }
                            case 'member': {
                                const assignees = card.assignees || [];
                                const targetMembers = Array.isArray(value) ? value : [value];
                                const hasMember = targetMembers.some((mId: string) => {
                                    if (assignees.includes(mId)) return true;
                                    const member = availableMembers.find(m => m.id === mId);
                                    if (member && assignees.includes(member.avatar)) return true;
                                    return false;
                                });

                                if (operator === 'is') return hasMember;
                                if (operator === 'is_not') return !hasMember;
                                if (operator === 'set') return assignees.length > 0;
                                if (operator === 'not_set') return assignees.length === 0;
                                return true;
                            }
                            case 'dueDate': {
                                const dueDate = card.dueDate ? new Date(card.dueDate) : null;
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                if (operator === 'is') {
                                    if (value === 'overdue') {
                                        return dueDate ? dueDate < today : false;
                                    }
                                    if (value === 'today') {
                                        if (!dueDate) return false;
                                        const cardDate = new Date(dueDate);
                                        cardDate.setHours(0, 0, 0, 0);
                                        return cardDate.getTime() === today.getTime();
                                    }
                                    if (value === 'week') {
                                        if (!dueDate) return false;
                                        const weekFromNow = new Date(today);
                                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                                        return dueDate >= today && dueDate <= weekFromNow;
                                    }
                                    if (value === 'nodate') return !dueDate;
                                }
                                if (operator === 'set') return !!dueDate;
                                if (operator === 'not_set') return !dueDate;

                                if (!dueDate) return false;
                                const cardTime = dueDate.getTime();

                                if (operator === 'before' && value) {
                                    const targetDate = new Date(value);
                                    targetDate.setHours(0, 0, 0, 0);
                                    return cardTime < targetDate.getTime();
                                }
                                if (operator === 'after' && value) {
                                    const targetDate = new Date(value);
                                    targetDate.setHours(23, 59, 59, 999);
                                    return cardTime > targetDate.getTime();
                                }
                                if (operator === 'between' && value?.start && value?.end) {
                                    const start = new Date(value.start);
                                    start.setHours(0, 0, 0, 0);
                                    const end = new Date(value.end);
                                    end.setHours(23, 59, 59, 999);
                                    return cardTime >= start.getTime() && cardTime <= end.getTime();
                                }

                                return true;
                            }
                        }
                        return true;
                    });
                })
            }));
        }

        return cols;
    }, [columns, searchQuery, filters, availableMembers]);
    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

    const [viewSettings, setViewSettings] = useState<ViewSettings>(() => safeParse('kanban-view-settings', {
        showCover: true,
        showTags: true,
        showMembers: true,
        showDate: true,
        showChecklist: true,
        showFooter: true,
        showPriority: true,
        cardSize: 'medium'
    }));

    React.useEffect(() => {
        localStorage.setItem('kanban-view-settings', JSON.stringify(viewSettings));
    }, [viewSettings]);

    function handleAddTag(newTag: { label: string; color: string }) {
        const tag = { id: `tag-${Date.now()}`, ...newTag };
        setAvailableTags(prev => [...prev, tag]);
    }

    // ... (keep hooks) 

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Start dragging after 5px movement
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // ... (keep other functions: findColumn, handleDragStart, handleDragOver, handleDragEnd, etc.)

    function findColumn(id: string) {
        return columns.find((col) => col.cards.some((card) => card.id === id))?.id || columns.find((col) => col.id === id)?.id;
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // If dragging a Member, do nothing in DragOver (assignment happens on DragEnd)
        if (active.data.current?.type === 'Member') return;

        const activeColumnId = findColumn(activeId);
        const overColumnId = findColumn(overId);

        if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
            return;
        }

        // Fix: Ignore if verify if drag is a Column
        const isColumnDrag = columns.some(col => col.id === activeId);
        if (isColumnDrag) return;

        setColumns((prev) => {
            const activeColIndex = prev.findIndex((col) => col.id === activeColumnId);
            const overColIndex = prev.findIndex((col) => col.id === overColumnId);

            return prev.map((col, index) => {
                if (index === activeColIndex) {
                    return {
                        ...col,
                        cards: col.cards.filter((card) => card.id !== activeId),
                    };
                }
                if (index === overColIndex) {
                    const activeCard = prev[activeColIndex].cards.find((card) => card.id === activeId)!;
                    // Insert potentially at specific index if hovering over a card
                    // For simplicity in DragOver, just appending or basic insertion. 
                    // Better logic: find index in overColumn if overId is a card.

                    const isOverColumn = overId === overColumnId;
                    let newIndex = col.cards.length;

                    if (!isOverColumn) {
                        const overCardIndex = col.cards.findIndex((card) => card.id === overId);
                        const isBelowOverItem = over &&
                            active.rect.current.translated &&
                            active.rect.current.translated.top > over.rect.top + over.rect.height;

                        const modifier = isBelowOverItem ? 1 : 0;
                        newIndex = overCardIndex >= 0 ? overCardIndex + modifier : newIndex;
                    }

                    return {
                        ...col,
                        cards: [
                            ...col.cards.slice(0, newIndex),
                            activeCard,
                            ...col.cards.slice(newIndex)
                        ],
                    };
                }
                return col;
            });
        });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) {
            setActiveId(null);
            return;
        }

        // Handle Member Drop
        if (active.data.current?.type === 'Member') {
            const member = active.data.current.member;
            const overId = over.id as string;

            // Find target card
            let targetCardId = overId;
            let foundCard = columns.flatMap(col => col.cards).find(c => c.id === targetCardId);

            // Since Sortable item id is the card id, overwrite check is direct.
            if (foundCard) {
                setColumns(prev => prev.map(col => ({
                    ...col,
                    cards: col.cards.map(card => {
                        if (card.id === foundCard!.id) {
                            const currentAssignees = card.assignees || [];
                            // Avoid duplicates
                            if (!currentAssignees.includes(member.id)) {
                                return {
                                    ...card,
                                    assignees: [...currentAssignees, member.id] // Add member ID
                                };
                            }
                        }
                        return card;
                    })
                })));
                // Optional: Show toast or feedback
            }

            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Column Dragging
        const activeColumnIndex = columns.findIndex(col => col.id === activeId);

        if (activeColumnIndex >= 0) {
            // Active is a column. Resolve over to a column (handles if over is a card or column)
            const overColumnId = findColumn(overId);
            const overColumnIndex = columns.findIndex(col => col.id === overColumnId);

            if (overColumnIndex >= 0 && activeColumnIndex !== overColumnIndex) {
                setColumns((prev) => arrayMove(prev, activeColumnIndex, overColumnIndex));
            }
            setActiveId(null);
            return;
        }

        // Card Dragging Logic
        const activeColumnId = findColumn(activeId);
        const overColumnId = findColumn(overId);

        if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
            // Reordering within same column
            const columnIndex = columns.findIndex((col) => col.id === activeColumnId);
            const column = columns[columnIndex];
            const oldIndex = column.cards.findIndex((card) => card.id === activeId);
            const newIndex = overId === overColumnId
                ? column.cards.length
                : column.cards.findIndex((card) => card.id === overId);

            if (oldIndex !== newIndex) {
                setColumns((prev) => {
                    const newColumns = [...prev];
                    newColumns[columnIndex] = {
                        ...column,
                        cards: arrayMove(column.cards, oldIndex, newIndex),
                    };
                    return newColumns;
                });
            }
        }

        setActiveId(null);
    }


    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    function handleAddColumn() {
        if (!newColumnTitle.trim()) {
            setIsAddingColumn(false);
            return;
        }

        const newColumn: KanbanColumnProps = {
            id: `col-${Date.now()}`,
            title: newColumnTitle,
            color: 'bg-gray-400',
            cards: []
        };
        setColumns(prev => [...prev, newColumn]);
        setNewColumnTitle('');
        setIsAddingColumn(false);
    }

    function handleDeleteColumn(columnId: string) {
        setConfirmModal({
            isOpen: true,
            title: 'Excluir Lista',
            message: 'Tem certeza que deseja excluir esta lista e todas as suas tarefas? Esta ação não pode ser desfeita.',
            onConfirm: () => {
                setColumns(prev => prev.filter(col => col.id !== columnId));
            }
        });
    }

    function handleDeleteCard(cardId: string) {
        setConfirmModal({
            isOpen: true,
            title: 'Excluir Tarefa',
            message: 'Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.',
            onConfirm: () => {
                setColumns(prev => prev.map(col => ({
                    ...col,
                    cards: col.cards.filter(card => card.id !== cardId)
                })));
                setSelectedCardId(null);
            }
        });
    }

    function handleConfirmDelete() {
        if (cardToDelete) {
            setColumns(prev => prev.map(col => ({
                ...col,
                cards: col.cards.filter(card => card.id !== cardToDelete)
            })));
            setCardToDelete(null);
            setSelectedCardId(null);
        }
    }

    function handleUpdateColumnTitle(columnId: string, newTitle: string) {
        setColumns(prev => prev.map(col =>
            col.id === columnId ? { ...col, title: newTitle } : col
        ));
    }



    function handleAddTask(title: string, columnId: string) {
        if (!title.trim()) return;

        const newCard: KanbanCardProps = {
            id: `card-${Date.now()}`,
            title: title,
            description: '',
            priority: 'medium',
            dueDate: new Date().toISOString().split('T')[0], // Today as default
            tags: [],
            checklistItems: [],
            attachmentCount: 0,
            commentCount: 0,
        };

        setColumns((prev) => {
            const newColumns = [...prev];
            const columnIndex = newColumns.findIndex(col => col.id === columnId);
            if (columnIndex >= 0) {
                newColumns[columnIndex] = {
                    ...newColumns[columnIndex],
                    cards: [...newColumns[columnIndex].cards, newCard]
                };
            }
            return newColumns;
        });
    }

    function handleCardClick(cardId: string) {
        setSelectedCardId(cardId);
    }

    function handleUpdateCard(updatedCard: KanbanCardProps) {
        setColumns(prev => prev.map(col => ({
            ...col,
            cards: col.cards.map(card => card.id === updatedCard.id ? updatedCard : card)
        })));
        setSelectedCardId(null);
    }



    // Find selected card for Modal
    const selectedCard = selectedCardId
        ? columns.flatMap(col => col.cards).find(card => card.id === selectedCardId)
        : null;

    // Find the active card for DragOverlay
    const activeCard = activeId
        ? columns.flatMap(col => col.cards).find(card => card.id === activeId)
        : null;

    // Find active member
    const activeMember = activeId && !activeCard && !columns.find(c => c.id === activeId)
        ? availableMembers.find(m => m.id === activeId)
        : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar tarefas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
                            />
                        </div>
                        <div className="flex -space-x-2">
                            <div className="flex -space-x-2">
                                {availableMembers.slice(0, 4).map((member) => (
                                    <DraggableMember key={member.id} member={member} />
                                ))}
                                {availableMembers.length > 4 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500 hover:z-10">
                                        +{availableMembers.length - 4}
                                    </div>
                                )}
                                <button
                                    onClick={() => setIsMemberModalOpen(true)}
                                    className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                >
                                    <Users className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg transition-colors",
                                    isFilterMenuOpen ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-600 bg-white hover:bg-gray-50"
                                )}
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filtros</span>
                                {filters.length > 0 && (
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                )}
                            </button>

                            {isFilterMenuOpen && (
                                <UniversalFilterMenu
                                    filters={filters}
                                    setFilters={setFilters}
                                    availableTags={availableTags}
                                    availableMembers={availableMembers}
                                    onClose={() => setIsFilterMenuOpen(false)}
                                />
                            )}
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg transition-colors",
                                    isViewMenuOpen ? "bg-gray-100 text-gray-800" : "text-gray-600 bg-white hover:bg-gray-50"
                                )}
                            >
                                <Settings2 className="w-4 h-4" />
                                <span>Visualização</span>
                            </button>

                            {isViewMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsViewMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-2 py-2 border-b border-gray-100 mb-2">
                                            <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Tamanho</div>
                                            <div className="flex bg-gray-100 rounded-lg p-1">
                                                {(['small', 'medium', 'large'] as const).map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setViewSettings(prev => ({ ...prev, cardSize: size }))}
                                                        className={clsx(
                                                            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                                            viewSettings.cardSize === size
                                                                ? "bg-white text-blue-600 shadow-sm"
                                                                : "text-gray-500 hover:text-gray-700"
                                                        )}
                                                    >
                                                        {size === 'small' ? 'P' : size === 'medium' ? 'M' : 'G'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-xs font-semibold text-gray-400 px-2 py-1.5 uppercase tracking-wider">
                                            Elementos do Cartão
                                        </div>
                                        {[
                                            { key: 'showCover', label: 'Capa / Imagem' },
                                            { key: 'showPriority', label: 'Prioridade' },
                                            { key: 'showTags', label: 'Tags' },
                                            { key: 'showChecklist', label: 'Progresso do Checklist' },
                                            { key: 'showDate', label: 'Data de Entrega' },
                                            { key: 'showFooter', label: 'Rodapé (Icones)' },
                                            { key: 'showMembers', label: 'Membros' },
                                        ].map((option) => (
                                            <label
                                                key={option.key}
                                                className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={(viewSettings as any)[option.key]}
                                                    onChange={() => setViewSettings(prev => ({
                                                        ...prev,
                                                        [option.key]: !(prev as any)[option.key]
                                                    }))}
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
                {/* Active Filters Chips */}
                <FilterCapsules filters={filters} setFilters={setFilters} />

                {/* Board Area */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-6 h-full pb-4 min-w-max">
                        <SortableContext items={filteredColumns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
                            {filteredColumns.map((column) => {
                                return (
                                    <KanbanColumn
                                        key={column.id}
                                        id={column.id}
                                        title={column.title}
                                        color={column.color}
                                        viewSettings={viewSettings}
                                        cards={column.cards
                                            .map(c => ({
                                                ...c,
                                                members: c.assignees?.map(id => availableMembers.find(m => m.id === id)).filter(Boolean) as any
                                            }))
                                        }
                                        isCollapsed={!!collapsedColumns[column.id]}
                                        onToggleCollapse={(val) => setCollapsedColumns(prev => ({ ...prev, [column.id]: val }))}
                                        onCardClick={handleCardClick}
                                        onAddCard={(title) => handleAddTask(title, column.id)}
                                        onDeleteColumn={handleDeleteColumn}
                                        onDeleteCard={handleDeleteCard}
                                        onUpdateTitle={handleUpdateColumnTitle}
                                    />
                                );
                            })}
                        </SortableContext>

                        {/* Add Column Button */}
                        <div className="min-w-[300px] w-[300px]">
                            {isAddingColumn ? (
                                <div className="p-3 bg-white rounded-xl shadow-lg border border-gray-200 animate-in fade-in zoom-in duration-200">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newColumnTitle}
                                        onChange={(e) => setNewColumnTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddColumn();
                                            if (e.key === 'Escape') setIsAddingColumn(false);
                                        }}
                                        placeholder="Nome da lista..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddColumn}
                                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Adicionar
                                        </button>
                                        <button
                                            onClick={() => setIsAddingColumn(false)}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingColumn(true)}
                                    className="flex items-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-medium">Adicionar lista</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeCard ? (
                        <KanbanCardContent
                            {...activeCard}
                            isDragging={true} // Force visual 
                            className="cursor-grabbing"
                        />
                    ) : null}

                    {activeMember ? (
                        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-xl cursor-grabbing scale-110 z-50">
                            <img src={activeMember.avatar} className="w-full h-full object-cover" />
                        </div>
                    ) : null}

                    {activeId && !activeCard && !activeMember && columns.find(col => col.id === activeId) ? (
                        // If it's a column
                        (() => {
                            const col = columns.find(c => c.id === activeId)!;
                            return (
                                <KanbanColumnContent
                                    {...col}
                                    isDragging={true}
                                    viewSettings={viewSettings}
                                    isEditing={false}
                                    setIsEditing={() => { }}
                                    isCollapsed={!!collapsedColumns[col.id]}
                                    setIsCollapsed={() => { }}
                                >
                                    {/* Render static cards for the overlay column to avoid SortableContext conflict */}
                                    {col.cards.map(card => (
                                        <KanbanCardContent
                                            key={card.id}
                                            {...card}
                                            viewSettings={viewSettings}
                                            className="opacity-100" // Ensure they are visible
                                        />
                                    ))}
                                </KanbanColumnContent>
                            );
                        })()
                    ) : null}
                </DragOverlay>



                {/* Card Edit Modal */}
                {selectedCard && (
                    <CardModal
                        isOpen={!!selectedCard}
                        onClose={() => setSelectedCardId(null)}
                        card={selectedCard}
                        onSave={handleUpdateCard}
                        onDelete={handleDeleteCard}
                        availableTags={availableTags}
                        availableMembers={availableMembers}
                        onAddTag={handleAddTag}
                        onAddMember={handleAddMember}
                    />
                )}

                {/* Member Modal */}
                <MemberModal
                    isOpen={isMemberModalOpen}
                    onClose={() => setIsMemberModalOpen(false)}
                    members={availableMembers}
                    onAddMember={handleAddMember}
                    onDeleteMember={(id) => setAvailableMembers(prev => prev.filter(m => m.id !== id))}
                />

                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                    onConfirm={confirmModal.onConfirm}
                    title={confirmModal.title}
                    message={confirmModal.message}
                />

                {/* Confirm Delete Card Modal */}
                <ConfirmModal
                    isOpen={!!cardToDelete}
                    onClose={() => setCardToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Excluir Tarefa"
                    message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
                />
            </div>
        </DndContext >
    );
}
