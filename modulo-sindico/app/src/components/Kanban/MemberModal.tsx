import React, { useState } from 'react';
import { X, Plus, Trash2, Users } from 'lucide-react';
import { clsx } from 'clsx';

interface MemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    members: { id: string; name: string; avatar: string }[];
    onAddMember: (name: string) => void;
    onDeleteMember: (id: string) => void;
}

export function MemberModal({ isOpen, onClose, members, onAddMember, onDeleteMember }: MemberModalProps) {
    const [newMemberName, setNewMemberName] = useState('');

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newMemberName.trim()) {
            onAddMember(newMemberName);
            setNewMemberName('');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Gerenciar Equipe</h2>
                            <p className="text-xs text-gray-500">Adicione ou remova membros do projeto</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Add Member Input */}
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Nome do novo membro..."
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            autoFocus
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!newMemberName.trim()}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </button>
                    </div>

                    {/* Members List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {members.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm italic">
                                Nenhum membro na equipe ainda.
                            </div>
                        ) : (
                            members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100">
                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-700 text-sm">{member.name}</h3>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Membro</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDeleteMember(member.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Remover membro"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Concluído
                    </button>
                </div>
            </div>
        </div>
    );
}
