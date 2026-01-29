import { useState, useEffect } from 'react';
import { X, Calendar, Tag, Plus, Check, ChevronDown, AlertCircle, Trash2, Save, CheckSquare, ChevronRight, Image as ImageIcon, Upload } from 'lucide-react';
import { KanbanCardProps } from './KanbanCard';
import { clsx } from 'clsx';

interface CardModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: KanbanCardProps;
    onSave: (updatedCard: KanbanCardProps) => void;
    onDelete: (cardId: string) => void;
    availableTags: { id: string; label: string; color: string }[];
    availableMembers: { id: string; name: string; avatar: string }[];
    onAddTag: (tag: { label: string; color: string }) => void;
    onAddMember?: (name: string) => void;
    onAddComment?: (text: string) => void;
}

const TAG_COLORS = [
    'bg-red-100 text-red-700',
    'bg-orange-100 text-orange-700',
    'bg-amber-100 text-amber-700',
    'bg-yellow-100 text-yellow-700',
    'bg-lime-100 text-lime-700',
    'bg-green-100 text-green-700',
    'bg-emerald-100 text-emerald-700',
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
    'bg-sky-100 text-sky-700',
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-violet-100 text-violet-700',
    'bg-purple-100 text-purple-700',
    'bg-fuchsia-100 text-fuchsia-700',
    'bg-pink-100 text-pink-700',
    'bg-rose-100 text-rose-700',
    'bg-slate-100 text-slate-700',
];

const priorities = [
    { value: 'low', label: 'Baixa', color: 'bg-slate-400' },
    { value: 'medium', label: 'Média', color: 'bg-blue-400' },
    { value: 'high', label: 'Alta', color: 'bg-orange-400' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-500' },
] as const;

export function CardModal({ isOpen, onClose, card, onSave, onDelete, availableTags, availableMembers, onAddTag, onAddComment }: CardModalProps) {
    const [editedCard, setEditedCard] = useState<KanbanCardProps>(card);
    const [newTag, setNewTag] = useState('');
    const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
    const [isTagInputFocused, setIsTagInputFocused] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        description: true,
        checklist: false,
        tags: false,
        members: false,
        cover: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        setEditedCard(card);
    }, [card]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(editedCard);
        onClose();
    };

    const handleDelete = () => {
        onDelete(card.id);
    };

    const removeTag = (indexToRemove: number) => {
        setEditedCard(prev => ({
            ...prev,
            tags: prev.tags?.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedCard(prev => ({ ...prev, coverImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 relative">

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Title input */}
                    <div>
                        <div className="flex items-center justify-between mb-0.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Título
                            </label>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 border border-gray-100">
                                    <span className="text-[10px] text-gray-400 uppercase font-medium mr-1">Prioridade:</span>
                                    <div className={clsx("w-2 h-2 rounded-full", priorities.find(p => p.value === editedCard.priority)?.color || 'bg-gray-300')} />
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                        {priorities.find(p => p.value === editedCard.priority)?.label || 'Normal'}
                                    </span>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={editedCard.title}
                            onChange={(e) => setEditedCard(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full text-xl font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder-gray-300"
                            placeholder="Nome da tarefa"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Priority */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                <AlertCircle className="w-4 h-4" />
                                Prioridade
                            </label>
                            <select
                                value={editedCard.priority}
                                onChange={(e) => setEditedCard(prev => ({ ...prev, priority: e.target.value as any }))}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            >
                                {priorities.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                <Calendar className="w-4 h-4" />
                                Prazo
                            </label>
                            <input
                                type="date"
                                value={editedCard.dueDate || ''}
                                onChange={(e) => setEditedCard(prev => ({ ...prev, dueDate: e.target.value }))}
                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                            />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <button
                            onClick={() => toggleSection('cover')}
                            className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 hover:text-gray-700 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Capa
                            </span>
                            {expandedSections.cover ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {expandedSections.cover && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                {!editedCard.coverImage ? (
                                    <div className="space-y-3">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                                <p className="text-sm text-gray-500 group-hover:text-blue-600 font-medium">Clique para enviar uma imagem</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG or GIF</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>

                                    </div>
                                ) : (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group bg-gray-100 shadow-sm">
                                        <img src={editedCard.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        <button
                                            onClick={() => setEditedCard(prev => ({ ...prev, coverImage: undefined }))}
                                            className="absolute top-2 right-2 p-2 bg-white text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-50"
                                            title="Remover capa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <button
                            onClick={() => toggleSection('description')}
                            className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 hover:text-gray-700 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                Descrição
                            </span>
                            {expandedSections.description ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {expandedSections.description && (
                            <textarea
                                value={editedCard.description || ''}
                                onChange={(e) => setEditedCard(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none animate-in fade-in slide-in-from-top-1 duration-200"
                                placeholder="Adicione detalhes sobre esta tarefa..."
                            />
                        )}
                    </div>

                    {/* Checklist */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={() => toggleSection('checklist')}
                                className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors group"
                            >
                                <span className="flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    Checklist
                                </span>
                                <div className="flex items-center gap-2">
                                    {editedCard.checklistItems && editedCard.checklistItems.length > 0 && (
                                        <span className="text-xs text-gray-400 font-normal">
                                            {Math.round((editedCard.checklistItems.filter(i => i.completed).length / editedCard.checklistItems.length) * 100)}%
                                        </span>
                                    )}
                                    {expandedSections.checklist ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                            </button>
                        </div>

                        {expandedSections.checklist && (
                            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Progress Bar */}
                                {editedCard.checklistItems && editedCard.checklistItems.length > 0 && (
                                    <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${(editedCard.checklistItems.filter(i => i.completed).length / editedCard.checklistItems.length) * 100}% ` }}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2 mb-3">
                                    {editedCard.checklistItems?.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-3 group">
                                            <button
                                                onClick={() => {
                                                    const newItems = [...(editedCard.checklistItems || [])];
                                                    newItems[index] = { ...item, completed: !item.completed };
                                                    const completedCount = newItems.filter(i => i.completed).length;
                                                    setEditedCard(prev => ({
                                                        ...prev,
                                                        checklistItems: newItems,
                                                        checklist: { completed: completedCount, total: newItems.length }
                                                    }));
                                                }}
                                                className={clsx(
                                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                    item.completed
                                                        ? "bg-blue-500 border-blue-500 text-white"
                                                        : "border-gray-300 hover:border-blue-500 text-transparent"
                                                )}
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                            <input
                                                type="text"
                                                value={item.text}
                                                onChange={(e) => {
                                                    const newItems = [...(editedCard.checklistItems || [])];
                                                    newItems[index] = { ...item, text: e.target.value };
                                                    setEditedCard(prev => ({ ...prev, checklistItems: newItems }));
                                                }}
                                                className={clsx(
                                                    "flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm",
                                                    item.completed ? "text-gray-400 line-through" : "text-gray-700"
                                                )}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newItems = editedCard.checklistItems?.filter((_, i) => i !== index) || [];
                                                    const completedCount = newItems.filter(i => i.completed).length;
                                                    setEditedCard(prev => ({
                                                        ...prev,
                                                        checklistItems: newItems,
                                                        checklist: newItems.length > 0 ? { completed: completedCount, total: newItems.length } : undefined
                                                    }));
                                                }}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Adicionar item ao checklist..."
                                        className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm placeholder-gray-400"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const target = e.target as HTMLInputElement;
                                                if (target.value.trim()) {
                                                    const newItem = {
                                                        id: `item - ${Date.now()} `,
                                                        text: target.value,
                                                        completed: false
                                                    };
                                                    const newItems = [...(editedCard.checklistItems || []), newItem];
                                                    setEditedCard(prev => ({
                                                        ...prev,
                                                        checklistItems: newItems,
                                                        checklist: { completed: newItems.filter(i => i.completed).length, total: newItems.length }
                                                    }));
                                                    target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <button
                            onClick={() => toggleSection('tags')}
                            className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 hover:text-gray-700 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Tags
                            </span>
                            {expandedSections.tags ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        {expandedSections.tags && (
                            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Active Tags on Card */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {editedCard.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className={clsx(
                                                "flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide",
                                                tag.color
                                            )}
                                        >
                                            {tag.label}
                                            <button
                                                onClick={() => removeTag(index)}
                                                className="hover:text-black/50"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Tag Selector / Creator (Always visible when expanded) */}
                                <div className="flex flex-col gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">

                                    {/* Available Tags List */}
                                    <div className="flex flex-wrap gap-2">
                                        {availableTags.map(tag => {
                                            const isSelected = editedCard.tags?.some(t => t.label === tag.label);
                                            return (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setEditedCard(prev => ({
                                                                ...prev,
                                                                tags: prev.tags?.filter(t => t.label !== tag.label)
                                                            }));
                                                        } else {
                                                            setEditedCard(prev => ({
                                                                ...prev,
                                                                tags: [...(prev.tags || []), { label: tag.label, color: tag.color }]
                                                            }));
                                                        }
                                                    }}
                                                    className={clsx(
                                                        "px-3 py-1 text-xs font-semibold rounded-full border transition-all flex items-center gap-1",
                                                        tag.color,
                                                        isSelected
                                                            ? "ring-2 ring-offset-1 ring-blue-500 border-transparent opacity-100"
                                                            : "opacity-70 hover:opacity-100 border-transparent hover:ring-1 hover:ring-black/10"
                                                    )}
                                                >
                                                    {tag.label}
                                                    {isSelected && <Check className="w-3 h-3 ml-1" />}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* New Tag Input Area */}
                                    <div className="w-full border-t border-gray-200 pt-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={clsx("w-6 h-6 rounded-full flex-shrink-0 transition-colors shadow-sm", newTagColor.split(' ')[0])} />
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    onFocus={() => setIsTagInputFocused(true)}
                                                    placeholder="Criar nova tag..."
                                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && newTag.trim()) {
                                                            onAddTag({ label: newTag, color: newTagColor });
                                                            setNewTag('');
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (newTag.trim()) {
                                                            onAddTag({ label: newTag, color: newTagColor });
                                                            setNewTag('');
                                                        }
                                                    }}
                                                    disabled={!newTag.trim()}
                                                    className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Criar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Color Picker (visible when typing or focused) */}
                                        {(newTag || isTagInputFocused) && (
                                            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200 pl-8">
                                                {TAG_COLORS.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setNewTagColor(color)}
                                                        className={clsx(
                                                            "w-5 h-5 rounded-full transition-all hover:scale-110 border-2",
                                                            color.split(' ')[0], // Use background class
                                                            newTagColor === color ? "border-black scale-110 shadow-sm" : "border-transparent hover:border-gray-200"
                                                        )}
                                                        title={color.split('-')[1]} // extracting color name roughly
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div >

                    {/* Members */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={() => toggleSection('members')}
                                className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-[8px] text-white font-bold">@</div>
                                    Membros
                                </span>
                                {expandedSections.members ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>

                        {expandedSections.members && (
                            <div className="flex flex-wrap gap-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                {availableMembers.map(member => {
                                    const isAssigned = editedCard.assignees?.includes(member.avatar);
                                    return (
                                        <button
                                            key={member.id}
                                            onClick={() => {
                                                const currentAssignees = editedCard.assignees || [];
                                                if (isAssigned) {
                                                    setEditedCard(prev => ({
                                                        ...prev,
                                                        assignees: currentAssignees.filter(a => a !== member.avatar)
                                                    }));
                                                } else {
                                                    setEditedCard(prev => ({
                                                        ...prev,
                                                        assignees: [...currentAssignees, member.avatar]
                                                    }));
                                                }
                                            }}
                                            className={clsx(
                                                "relative w-8 h-8 rounded-full transition-all border-2",
                                                isAssigned ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                                            )}
                                            title={member.name}
                                        >
                                            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                            {isAssigned && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <Check className="w-2 h-2 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/20 transition-all"
                        >
                            <Save className="w-4 h-4" />
                            Salvar Alterações
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
