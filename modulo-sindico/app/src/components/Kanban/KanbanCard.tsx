
import React, { useState } from 'react';
import { Calendar, MoreHorizontal, Trash2, Edit2, Clock, AlertCircle, ArrowUp, ArrowDown, Minus, MessageSquare, Paperclip } from 'lucide-react';
import { clsx } from 'clsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface ViewSettings {
    showCover: boolean;
    showTags: boolean;
    showMembers: boolean;
    showDate: boolean;
    showChecklist: boolean;
    showFooter: boolean;
    showPriority: boolean;
    cardSize: 'small' | 'medium' | 'large';
}

export interface Comment {
    id: string;
    text: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
}

export interface KanbanCardProps {
    id: string;
    title: string;
    description?: string;
    tags?: { label: string; color: string }[];
    dueDate?: string;
    assignees?: string[]; // URLs or initials
    members?: { id: string; name: string; avatar: string }[];
    attachmentCount?: number;
    commentCount?: number;
    comments?: Comment[];
    checklist?: { completed: number; total: number };
    checklistItems?: { id: string; text: string; completed: boolean }[];
    coverImage?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    viewSettings?: ViewSettings;
    onClick?: (id: string) => void;
    onDelete?: (id: string) => void;
    className?: string;
    isDragging?: boolean;
    forwardedRef?: any;
    style?: any;
    attributes?: any;
    listeners?: any;
}

const priorityConfig: Record<string, { color: string; icon: any; label: string }> = {
    low: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Baixa' },
    medium: { color: 'bg-orange-100 text-orange-700', icon: AlertCircle, label: 'Média' },
    high: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Alta' },
    urgent: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Urgente' }
};

const getDateStatus = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr + 'T12:00:00'); // Normalize 
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isNaN(diffDays)) return null;

    if (diffDays < 0) return { color: 'text-red-700 bg-red-50 border-red-100', label: 'Atrasado', icon: AlertCircle };
    if (diffDays === 0) return { color: 'text-orange-700 bg-orange-50 border-orange-100', label: 'Hoje', icon: Clock };
    if (diffDays === 1) return { color: 'text-amber-700 bg-amber-50 border-amber-100', label: 'Amanhã', icon: Clock };
    return { color: 'text-gray-500 bg-gray-50 border-gray-200', label: null, icon: Calendar };
};

export function KanbanCardContent({
    id,
    title,
    tags = [],
    dueDate,
    assignees = [],
    members = [], // Use members prop if available
    attachmentCount = 0,
    commentCount = 0,
    comments = [],
    checklist,
    coverImage,
    priority,
    viewSettings = {
        showCover: true,
        showTags: true,
        showMembers: true,
        showDate: true,
        showChecklist: true,
        showFooter: true,
        showPriority: true,
        cardSize: 'medium'
    },
    onClick,
    onDelete,
    className,
    isDragging,
    forwardedRef,
    style,
    attributes,
    listeners
}: KanbanCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    // Prefer full member objects if available, fallback to basic assignees handling
    const activeMembers = members.length > 0 ? members : assignees.map(a => ({
        id: a,
        name: 'Member',
        avatar: a.startsWith('http') ? a : undefined,
        initials: !a.startsWith('http') ? a : undefined
    }));

    const dateStatus = getDateStatus(dueDate);
    const PriorityIcon = priority ? priorityConfig[priority].icon : null;

    const sizeStyles = {
        small: {
            p: 'p-2',
            gap: 'gap-1.5',
            title: 'text-xs font-medium',
            text: 'text-xs',
            icon: 'w-3 h-3',
            tag: 'text-[10px] px-1 py-0.5',
            coverHeight: 'h-24'
        },
        medium: {
            p: 'p-3',
            gap: 'gap-2',
            title: 'text-sm font-medium',
            text: 'text-xs',
            icon: 'w-3.5 h-3.5',
            tag: 'text-[11px] px-2 py-1',
            coverHeight: 'h-32'
        },
        large: {
            p: 'p-4',
            gap: 'gap-3',
            title: 'text-base font-semibold',
            text: 'text-sm',
            icon: 'w-4 h-4',
            tag: 'text-xs px-2.5 py-1',
            coverHeight: 'h-40'
        }
    };

    const s = sizeStyles[viewSettings.cardSize || 'medium'];

    return (
        <div
            ref={forwardedRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick?.(id)}
            className={clsx(
                "group relative bg-white rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer select-none overflow-hidden",
                // s.p removed here to separate padding from container
                isDragging ? "border-blue-500 shadow-xl rotate-2 scale-105 z-50 cursor-grabbing bg-blue-50/50 backdrop-blur-sm" : "border-gray-200/60 hover:border-blue-300/60 hover:bg-gray-50/50",
                "active:scale-95 active:cursor-grabbing",
                className
            )}
        >
            {/* Quick Actions Menu */}
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className={clsx(
                        "p-1 rounded transition-all cursor-pointer hover:bg-gray-100",
                        showMenu ? "opacity-100 bg-gray-100 text-gray-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMenu && (
                    <div
                        className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-100 overflow-hidden cursor-default z-50"
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                                onClick?.(id);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 text-left cursor-pointer"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Editar
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                                onDelete?.(id);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left border-t border-gray-50 cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Excluir
                        </button>
                    </div>
                )}

                {showMenu && (
                    <div
                        className="fixed inset-0 z-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                        }}
                    />
                )}
            </div>

            {/* Cover Image - Full Width, No Padding */}
            {viewSettings.showCover && coverImage && (
                <div className={clsx("w-full overflow-hidden shrink-0 relative bg-gray-50 border-b border-gray-100/50", s.coverHeight)}>
                    <img
                        src={coverImage}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent/0 pointer-events-none" />
                </div>
            )}

            {/* Content Container - Padding Applied Here */}
            <div className={clsx("relative z-10 flex flex-col items-start w-full", s.p, s.gap)}>

                {/* Title */}
                <h3 className={clsx(s.title, "text-gray-800 leading-tight w-full break-words")}>
                    {title}
                </h3>

                {/* Tags */}
                {viewSettings.showTags && tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 w-full mt-1.5 mb-0.5">
                        {tags.map((tag, i) => (
                            <span
                                key={i}
                                className={clsx(s.tag, "rounded-md font-medium shadow-sm", tag.color)}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>
                )}

                {/* Checklist Progress Bar */}
                {checklist && checklist.total > 0 && viewSettings.showChecklist && (
                    <div className="w-full my-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                            <span>Progresso</span>
                            <span>{Math.round((checklist.completed / checklist.total) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={clsx(
                                    "h-full transition-all duration-500 rounded-full",
                                    checklist.completed === checklist.total ? "bg-emerald-500" : "bg-blue-500"
                                )}
                                style={{ width: `${(checklist.completed / checklist.total) * 100}% ` }}
                            />
                        </div>
                    </div>
                )}

                {/* Footer Info */}
                {(viewSettings.showMembers || viewSettings.showDate || viewSettings.showChecklist || viewSettings.showPriority) && viewSettings.showFooter && (
                    <div className={clsx("w-full flex items-center justify-between border-t border-gray-100/80 pt-2.5 mt-1 text-gray-400 font-sans", s.text)}>
                        <div className="flex items-center gap-2 flex-wrap">

                            {dueDate && dateStatus && viewSettings.showDate && (
                                <div className={clsx(
                                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors",
                                    dateStatus.color
                                )} title={dateStatus.label || 'Prazo'}>
                                    <dateStatus.icon className="w-3.5 h-3.5" />
                                    <span>
                                        {dateStatus.label ? `${dateStatus.label} • ` : ''}
                                        {new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(dueDate + 'T12:00:00'))}
                                    </span>
                                </div>
                            )}

                            {priority && PriorityIcon && viewSettings.showPriority && (
                                <div className={clsx(
                                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border",
                                    priorityConfig[priority].color
                                )}>
                                    <PriorityIcon className="w-3 h-3" />
                                    <span>{priorityConfig[priority].label}</span>
                                </div>
                            )}

                            {attachmentCount > 0 && viewSettings.showFooter && (
                                <div className="flex items-center gap-1 text-gray-400 text-xs" title={`${attachmentCount} anexos`}>
                                    <Paperclip className="w-3.5 h-3.5" />
                                    <span>{attachmentCount}</span>
                                </div>
                            )}

                            {(commentCount || (comments?.length || 0)) > 0 && viewSettings.showFooter && (
                                <div className="flex items-center gap-1 text-gray-400 text-xs" title={`${comments?.length || commentCount} comentários`}>
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>{comments?.length || commentCount}</span>
                                </div>
                            )}
                        </div>

                        {/* Assignees */}
                        {activeMembers.length > 0 && viewSettings.showMembers && (
                            <div className="flex -space-x-2">
                                {activeMembers.map((member: any, i) => (
                                    <div
                                        key={member.id || i}
                                        className="w-6 h-6 rounded-full bg-white ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden shadow-sm relative z-0 hover:z-10 transition-transform hover:scale-110 cursor-help"
                                        title={member.name || member.id}
                                    >
                                        {member.avatar ? (
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[9px]">{member.initials || member.id?.substring(0, 2)}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


export function KanbanCard(props: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1, // Fix: Hide original element completely when dragging to show placeholder only
    };

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="opacity-50 bg-blue-50 border-2 border-dashed border-blue-400 rounded-xl h-[100px]" />
        );
    }

    return (
        <KanbanCardContent
            {...props}
            forwardedRef={setNodeRef}
            style={style}
            attributes={attributes}
            listeners={listeners}
            isDragging={isDragging}
        />
    );
}

