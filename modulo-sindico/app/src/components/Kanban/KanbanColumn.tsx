
import React, { useState } from 'react';
import { MoreHorizontal, Plus, Trash2, Edit2, X, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { KanbanCard, KanbanCardProps, ViewSettings } from './KanbanCard';
import { clsx } from 'clsx';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface KanbanColumnProps {
    id: string;
    title: string;
    color: string;
    cards: KanbanCardProps[];
    viewSettings?: ViewSettings;
    isCollapsed?: boolean;
    onToggleCollapse?: (val: boolean) => void;
    onCardClick?: (cardId: string) => void;
    onAddCard?: (title: string) => void;
    onDeleteColumn?: (columnId: string) => void;
    onDeleteCard?: (cardId: string) => void;
    onUpdateTitle?: (columnId: string, newTitle: string) => void;
}

export function KanbanColumnContent({
    id,
    title,
    color,
    cards,
    viewSettings,
    onCardClick,
    onAddCard,
    onDeleteColumn,
    onDeleteCard,
    onUpdateTitle,
    style,
    attributes,
    listeners,
    forwardedRef,
    isDragging,
    isOver,
    isEditing,
    setIsEditing,
    isCollapsed,
    setIsCollapsed,
    children // Valid if we want to pass cards directly (e.g. for Overlay)
}: KanbanColumnProps & {
    style?: React.CSSProperties,
    attributes?: any,
    listeners?: any,
    forwardedRef?: React.Ref<HTMLDivElement>,
    isDragging?: boolean,

    isOver?: boolean,
    isEditing: boolean,
    setIsEditing: (value: boolean) => void,
    isCollapsed: boolean,
    setIsCollapsed: (value: boolean) => void,
    children?: React.ReactNode
}) {
    const [newTitle, setNewTitle] = useState(title);

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const handleSaveTitle = () => {
        if (newTitle.trim()) {
            onUpdateTitle?.(id, newTitle);
        } else {
            setNewTitle(title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveTitle();
        if (e.key === 'Escape') {
            setNewTitle(title);
            setIsEditing(false);
        }
    };

    const [isAdding, setIsAdding] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (isAdding && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isAdding]);

    function handleAddCard() {
        if (!newCardTitle.trim()) return;
        onAddCard?.(newCardTitle);
        setNewCardTitle('');
        // Keep focus
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }

    const widthClasses = {
        small: 'w-[260px] min-w-[260px]',
        medium: 'w-[300px] min-w-[300px]',
        large: 'w-[360px] min-w-[360px]'
    };
    const widthClass = widthClasses[viewSettings?.cardSize || 'medium'];

    if (isCollapsed) {
        return (
            <div
                ref={forwardedRef}
                style={style}
                {...attributes}
                {...listeners}
                className={clsx(
                    "flex flex-col h-full rounded-xl transition-[width,background-color,border-color,opacity,box-shadow] duration-300 ease-in-out items-center py-4 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 hover:shadow-md select-none w-[50px] min-w-[50px]",
                    isDragging && "opacity-50",
                    isOver && "bg-blue-50/50 ring-2 ring-blue-200 ring-inset"
                )}
                onClick={() => setIsCollapsed(false)}
            >
                <div className="flex-1 flex items-center justify-center [writing-mode:vertical-rl] rotate-180">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-medium text-xs">{cards.length}</span>
                        <h2 className="font-bold text-gray-600 text-sm tracking-wide uppercase">
                            {title}
                        </h2>
                        <div className={clsx("w-2 h-2 rounded-full", color)} />
                    </div>
                </div>
                <div className="mt-4 text-gray-400">
                    <ChevronsRight className="w-4 h-4" />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={forwardedRef}
            style={style}
            className={clsx(
                "flex flex-col h-full rounded-xl transition-[width,background-color,border-color,opacity,box-shadow] duration-300 ease-in-out",
                widthClass,
                isDragging && "opacity-50",
                isOver && "bg-blue-50/50 ring-2 ring-blue-200 ring-inset"
            )}
        >
            {/* Header */}
            <div
                {...attributes}
                {...listeners}
                className={clsx(
                    "flex items-center justify-between mb-3 px-1 group cursor-grab active:cursor-grabbing",
                    isEditing && "!cursor-default"
                )}
            >
                <div className="flex items-center gap-2 flex-1">
                    <div className={clsx("w-2 h-2 rounded-full", color)} />

                    {isEditing ? (
                        <div
                            className="flex items-center gap-1 flex-1"
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <textarea
                                autoFocus
                                placeholder="Digite o título da tarefa..."
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleSaveTitle}
                                className="w-full text-sm font-semibold text-gray-700 bg-white border border-blue-400 rounded px-1 py-0.5 outline-none resize-none overflow-hidden"
                                rows={1}
                            />
                        </div>
                    ) : (
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            {title}
                        </h2>
                    )}

                    {!isEditing && (
                        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            {cards.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 relative">
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all hover:scale-110 active:scale-95"
                        title="Minimizar lista"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all hover:scale-110 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all hover:scale-110 active:scale-95"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <div className="p-1">
                                    <button
                                        onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md text-left"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Renomear
                                    </button>
                                    <button
                                        onClick={() => { onDeleteColumn?.(id); setIsMenuOpen(false); }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md text-left"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Excluir lista
                                    </button>
                                </div>
                                <div className="border-t border-gray-100 p-1">
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full px-3 py-2 text-xs text-gray-400 hover:text-gray-600 text-center"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Close menu when clicking outside (simple overlay) */}
                        {isMenuOpen && (
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsMenuOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Cards Container */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <div className="flex flex-col gap-3 pb-4 min-h-[100px]">
                    {children ? children : (
                        <>
                            <SortableContext
                                items={cards.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {cards.map((card) => (
                                    <KanbanCard
                                        key={card.id}
                                        {...card}
                                        viewSettings={viewSettings}
                                        onClick={onCardClick}
                                        onDelete={onDeleteCard}
                                    />
                                ))}
                            </SortableContext>

                            {/* Inline Add Input */}
                            {isAdding ? (
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-200 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <textarea
                                        ref={textareaRef}
                                        autoFocus
                                        placeholder="Digite o título da tarefa..."
                                        className="w-full text-sm resize-none border-none p-0 focus:ring-0 placeholder-gray-400 min-h-[60px]"
                                        value={newCardTitle}
                                        onChange={(e) => setNewCardTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddCard();
                                            }
                                            if (e.key === 'Escape') {
                                                setIsAdding(false);
                                            }
                                        }}
                                    />
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={handleAddCard}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
                                        >
                                            Adicionar
                                        </button>
                                        <button
                                            onClick={() => setIsAdding(false)}
                                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Add Card Button (Bottom) */
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="flex items-center gap-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 border-dashed transition-all text-sm group"
                                >
                                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>Adicionar tarefa</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export function KanbanColumn(props: KanbanColumnProps) {
    const [isEditing, setIsEditing] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver
    } = useSortable({
        id: props.id,
        data: {
            type: 'Column',
            column: props
        },
        disabled: isEditing, // Disable drag when editing
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const widthClasses = {
        small: 'w-[260px]',
        medium: 'w-[300px]',
        large: 'w-[360px]'
    };
    const widthClass = widthClasses[props.viewSettings?.cardSize || 'medium'];

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className={clsx(
                "h-full opacity-30 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl",
                props.isCollapsed ? "w-[50px] min-w-[50px]" : widthClass
            )} />
        );
    }

    return (
        <KanbanColumnContent
            {...props}
            onAddCard={props.onAddCard}
            forwardedRef={setNodeRef}
            style={style}
            attributes={attributes}
            listeners={listeners}
            isDragging={isDragging}
            isOver={isOver}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isCollapsed={!!props.isCollapsed}
            setIsCollapsed={(val) => props.onToggleCollapse?.(val)}
        />
    );
}
