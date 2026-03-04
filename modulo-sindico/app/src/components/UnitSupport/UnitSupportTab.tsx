import { useState, useEffect } from 'react';
import { Wrench, Package, Sparkles, ChevronRight, Clock, CheckCircle2, AlertCircle, X, Send, Camera } from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

// Tipos
type TicketType = 'Manutenção' | 'Reposição' | 'Limpeza';
type TicketUrgency = 'baixa' | 'media' | 'alta';
type TicketStatus = 'aberto' | 'em_andamento' | 'resolvido';

interface Ticket {
    id: string;
    type: TicketType;
    description: string;
    urgency?: TicketUrgency;
    product?: string;
    quantity?: string;
    status: TicketStatus;
    createdAt: string; // ISO string
    dateLabel: string; // "Hoje, 10:30"
    photo?: string;
}

export function UnitSupportTab() {
    // --- ESTADOS ---
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeModal, setActiveModal] = useState<'maintenance' | 'resupply' | 'cleaning' | null>(null);
    const [viewAllOpen, setViewAllOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    // Form States
    const [formData, setFormData] = useState({ description: '', urgency: 'baixa' as TicketUrgency, product: '', quantity: '1-5' });
    const [photo, setPhoto] = useState<string | null>(null);

    // --- EFEITOS (Persistência) ---
    useEffect(() => {
        const saved = localStorage.getItem('sindico_support_tickets');
        if (saved) {
            try {
                setTickets(JSON.parse(saved));
            } catch (e) {
                console.error("Erro ao carregar tickets", e);
            }
        }
    }, []);

    const saveTicket = (newTicket: Ticket) => {
        const updated = [newTicket, ...tickets];
        setTickets(updated);
        localStorage.setItem('sindico_support_tickets', JSON.stringify(updated));
    };

    // --- HELPERS ---
    const getUrgencyColor = (u?: TicketUrgency) => {
        if (u === 'alta') return 'bg-red-100 text-red-700 border-red-200 ring-red-500';
        if (u === 'media') return 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500';
        return 'bg-green-100 text-green-700 border-green-200 ring-green-500';
    };

    const getStatusColor = (s: TicketStatus) => {
        if (s === 'resolvido') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s === 'em_andamento') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-amber-100 text-amber-700 border-amber-200';
    };

    const getStatusLabel = (s: TicketStatus) => {
        if (s === 'resolvido') return 'Resolvido';
        if (s === 'em_andamento') return 'Em Andamento';
        return 'Em Aberto';
    };

    const getStatusLabelSimple = (s: TicketStatus) => {
        if (s === 'resolvido') return 'Resolvido';
        if (s === 'em_andamento') return 'Em Andamento';
        return 'Em Aberto';
    };

    const getStatusColorBadge = (s: TicketStatus) => {
        if (s === 'resolvido') return 'bg-emerald-100 text-emerald-700';
        if (s === 'em_andamento') return 'bg-blue-100 text-blue-700';
        return 'bg-amber-100 text-amber-700';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- HANDLERS ---
    const handleSubmit = () => {
        const now = new Date();
        const dateLabel = `Hoje, ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        const newTicket: Ticket = {
            id: crypto.randomUUID(),
            type: activeModal === 'maintenance' ? 'Manutenção' : activeModal === 'cleaning' ? 'Limpeza' : 'Reposição',
            description: formData.description,
            urgency: activeModal !== 'resupply' ? formData.urgency : undefined,
            product: activeModal === 'resupply' ? formData.product : undefined,
            quantity: activeModal === 'resupply' ? formData.quantity : undefined,
            status: 'aberto',
            createdAt: now.toISOString(),
            dateLabel,
            photo: photo || undefined
        };

        saveTicket(newTicket);
        setActiveModal(null);
        setFormData({ description: '', urgency: 'baixa', product: '', quantity: '1-5' }); // Reset
        setPhoto(null);

        // Feedback visual simples/nativo para MVP (pode ser Toast depois)
        toast.success(`Solicitação de ${newTicket.type} enviada!`, {
            description: "A equipe técnica foi notificada."
        });
    };

    // --- RENDER ---
    return (
        <div className="space-y-6 pb-20 relative min-h-[500px]">

            {/* HEADER - CARD DA UNIDADE (LIMPO, SEM DADOS FAKE) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 opacity-10 blur-3xl rounded-full bg-white/20"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna 1: Identidade */}
                    <div className="flex flex-col justify-between h-full py-1">
                        <div>
                            <div className="mb-2 flex items-center gap-2 opacity-80">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Minha Unidade</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-5 text-white">Condomínio Exemplo</h2>

                            <div className="space-y-4">
                                <div>
                                    <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Síndico Responsável</span>
                                    <p className="text-lg font-medium text-white tracking-tight">João da Silva</p>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">E-mail de Contato</span>
                                    <p className="text-sm font-medium text-gray-300 tracking-wide">sindico@exemplo.com.br</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: Dados Administrativos (Endereço e Banco) */}
                    <div className="flex flex-col h-full gap-3">
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 flex flex-col justify-center flex-1 transition-colors hover:bg-white/15">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Endereço Cadastrado</p>
                            <p className="text-sm font-medium leading-relaxed text-gray-100">Av. Paulista, 1000 - Bela Vista, São Paulo - SP</p>
                        </div>

                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 flex flex-col justify-center flex-1 transition-colors hover:bg-white/15">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Dados Bancários</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-100">
                                <span><span className="text-gray-400 text-xs block sm:inline mr-1">Banco:</span> Itaú (341)</span>
                                <span><span className="text-gray-400 text-xs block sm:inline mr-1">Ag:</span> 1234</span>
                                <span><span className="text-gray-400 text-xs block sm:inline mr-1">CC:</span> 56789-0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionCard
                    icon={Wrench} color="red" title="Manutenção" subtitle="Relatar quebras"
                    onClick={() => setActiveModal('maintenance')}
                />
                <ActionCard
                    icon={Package} color="blue" title="Reposição" subtitle="Solicitar produtos"
                    onClick={() => setActiveModal('resupply')}
                />
                <ActionCard
                    icon={Sparkles} color="purple" title="Limpeza" subtitle="Reportar sujeira"
                    onClick={() => setActiveModal('cleaning')}
                />
            </div>

            {/* LISTA DE HISTÓRICO - RESUMIDA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        Histórico de Solicitações
                    </h3>
                    {tickets.length > 0 && (
                        <button
                            onClick={() => setViewAllOpen(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                            Ver todos ({tickets.length})
                        </button>
                    )}
                </div>

                <div className="divide-y divide-gray-50 flex-1 min-h-[100px]">
                    {tickets.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                            <Clock className="h-10 w-10 mb-3 opacity-20" />
                            <p className="text-sm">Nenhuma solicitação realizada ainda.</p>
                        </div>
                    ) : (
                        tickets.slice(0, 3).map(ticket => (
                            <TicketItem
                                key={ticket.id}
                                ticket={ticket}
                                onClick={() => setSelectedTicket(ticket)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* --- MODAIS DE CRIAÇÃO --- */}
            {(activeModal === 'maintenance' || activeModal === 'cleaning') && (
                <ModalOverlay onClose={() => setActiveModal(null)}>
                    <ModalHeader
                        icon={activeModal === 'maintenance' ? Wrench : Sparkles}
                        color={activeModal === 'maintenance' ? 'text-red-500' : 'text-purple-500'}
                        title={activeModal === 'maintenance' ? 'Nova Manutenção' : 'Solicitar Limpeza'}
                        onClose={() => setActiveModal(null)}
                    />
                    <div className="p-6 space-y-5">
                        <FormGroup label="O que aconteceu?">
                            <textarea
                                className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm min-h-[100px] p-3 outline-none transition-all"
                                placeholder={activeModal === 'maintenance' ? "Descreva o problema..." : "Descreva o local e a sujeira..."}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </FormGroup>

                        <FormGroup label="Nível de Urgência">
                            <div className="flex gap-2">
                                {(['baixa', 'media', 'alta'] as TicketUrgency[]).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFormData({ ...formData, urgency: level })}
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${formData.urgency === level ? `ring-2 ${level === 'alta' ? 'bg-red-50 border-red-200 text-red-700 ring-red-100' : level === 'media' ? 'bg-amber-50 border-amber-200 text-amber-700 ring-amber-100' : 'bg-green-50 border-green-200 text-green-700 ring-green-100'}`
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {level === 'alta' ? 'Alta' : level === 'media' ? 'Média' : 'Baixa'}
                                    </button>
                                ))}
                            </div>
                        </FormGroup>

                        <div className={`border border-dashed ${photo ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer active:scale-95 relative overflow-hidden`}>
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {photo ? (
                                <div className="flex flex-col items-center text-green-600">
                                    <CheckCircle2 className="h-6 w-6 mb-2" />
                                    <span className="text-sm font-medium">Foto Adicionada!</span>
                                    <span className="text-xs text-green-500 mt-1">Clique para alterar</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Camera className="h-6 w-6 mb-2" />
                                    <span className="text-sm font-medium">Adicionar Foto</span>
                                </div>
                            )}
                        </div>

                        <Button
                            className={`w-full gap-2 ${activeModal === 'maintenance' ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                            onClick={handleSubmit}
                            disabled={!formData.description}
                        >
                            <Send className="h-4 w-4" />
                            Enviar Solicitação
                        </Button>
                    </div>
                </ModalOverlay>
            )}

            {activeModal === 'resupply' && (
                <ModalOverlay onClose={() => setActiveModal(null)}>
                    <ModalHeader icon={Package} color="text-blue-500" title="Solicitar Reposição" onClose={() => setActiveModal(null)} />
                    <div className="p-6 space-y-5">
                        <FormGroup label="Produto">
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm h-12 px-4 outline-none transition-all"
                                placeholder="Ex: Coca-Cola Lata"
                                value={formData.product}
                                onChange={e => setFormData({ ...formData, product: e.target.value })}
                            />
                        </FormGroup>

                        <FormGroup label="Quantidade Estimada">
                            <select
                                className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm h-12 px-4 outline-none bg-white transition-all"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            >
                                <option value="1-5">1 a 5 unidades</option>
                                <option value="6-10">6 a 10 unidades</option>
                                <option value="+10">Mais de 10 unidades</option>
                                <option value="vazio">Prateleira Vazia (Urgente)</option>
                            </select>
                        </FormGroup>

                        <Button
                            className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                            onClick={handleSubmit}
                            disabled={!formData.product}
                        >
                            <Send className="h-4 w-4" />
                            Solicitar Reposição
                        </Button>
                    </div>
                </ModalOverlay>
            )}

            {/* --- LISTA COMPLETA (MODAL CENTRALIZADO COM TABELA) --- */}
            {viewAllOpen && (
                <ModalOverlay onClose={() => setViewAllOpen(false)} className="w-[98%] max-w-[1920px] h-[90vh]">
                    {/* Container Maior e Mais Largo, quase colando nas bordas */}
                    <div className="flex flex-col h-full w-full mx-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">Histórico de Solicitações</h3>
                                <p className="text-sm text-gray-500 mt-1">Todas as {tickets.length} solicitações registradas</p>
                            </div>
                            <button onClick={() => setViewAllOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {/* flex-1 aqui é CRUCIAL para empurrar o footer para baixo mesmo com pouco conteúdo */}
                        <div className="overflow-y-auto p-0 bg-white flex-1">
                            {tickets.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <Clock className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-lg">Nenhuma solicitação encontrada.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitação</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Urgência</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tickets.map(ticket => (
                                            <tr
                                                key={ticket.id}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-gray-900 line-clamp-1 max-w-[300px]" title={ticket.type === 'Reposição' ? ticket.product : ticket.description}>
                                                        {ticket.type === 'Reposição' ? ticket.product : ticket.description}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-2 text-sm font-medium
                                                        ${ticket.type === 'Manutenção' ? 'text-red-600' : ticket.type === 'Reposição' ? 'text-blue-600' : 'text-purple-600'}`}>
                                                        {ticket.type === 'Manutenção' && <Wrench className="h-4 w-4" />}
                                                        {ticket.type === 'Reposição' && <Package className="h-4 w-4" />}
                                                        {ticket.type === 'Limpeza' && <Sparkles className="h-4 w-4" />}
                                                        {ticket.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(ticket.createdAt).toLocaleDateString('pt-BR')} <span className="text-gray-300 mx-1">|</span> {new Date(ticket.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {ticket.type !== 'Reposição' && ticket.urgency && (
                                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${getUrgencyColor(ticket.urgency)}`}>
                                                            {ticket.urgency}
                                                        </span>
                                                    )}
                                                    {ticket.type === 'Reposição' && (
                                                        <span className="text-xs text-gray-400 font-medium ml-1">N/A</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusColorBadge(ticket.status)}`}>
                                                        {getStatusLabelSimple(ticket.status)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer sempre no fundo */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end mt-auto">
                            <Button variant="outline" onClick={() => setViewAllOpen(false)}>Fechar Lista</Button>
                        </div>
                    </div>
                </ModalOverlay>
            )}

            {/* --- DETALHES DO TICKET (MODAL) --- */}
            {selectedTicket && (
                <ModalOverlay onClose={() => setSelectedTicket(null)}>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedTicket.type}</h3>
                                <p className="text-sm text-gray-500">{selectedTicket.dateLabel} • ID #{selectedTicket.id.slice(0, 4)}</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)}><X className="h-5 w-5 text-gray-400" /></button>
                        </div>

                        <div className="space-y-6">
                            <DetailRow label="Status">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedTicket.status)}`}>
                                    {getStatusLabel(selectedTicket.status)}
                                </span>
                            </DetailRow>

                            {selectedTicket.type === 'Reposição' ? (
                                <>
                                    <DetailRow label="Produto">{selectedTicket.product}</DetailRow>
                                    <DetailRow label="Quantidade">{selectedTicket.quantity}</DetailRow>
                                </>
                            ) : (
                                <>
                                    <DetailRow label="Descrição">{selectedTicket.description}</DetailRow>
                                    <DetailRow label="Urgência">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getUrgencyColor(selectedTicket.urgency)}`}>
                                            {selectedTicket.urgency}
                                        </span>
                                    </DetailRow>
                                </>
                            )}

                            {selectedTicket.photo && (
                                <DetailRow label="Foto Anexada">
                                    <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 max-h-64 bg-gray-50">
                                        <img src={selectedTicket.photo} alt="Foto da solicitação" className="w-full h-full object-contain" />
                                    </div>
                                </DetailRow>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <Button variant="outline" className="w-full" onClick={() => setSelectedTicket(null)}>Fechar</Button>
                        </div>
                    </div>
                </ModalOverlay>
            )}

        </div>
    );
}

// --- SUB-COMPONENTES PARA ORGANIZAÇÃO ---

const ActionCard = ({ icon: Icon, color, title, subtitle, onClick }: any) => (
    <button
        onClick={onClick}
        className={`group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:border-${color}-200 hover:shadow-md transition-all text-left`}
    >
        <div className={`absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-${color}-500`}>
            <Icon className="h-24 w-24" />
        </div>
        <div className="relative z-10">
            <div className={`h-10 w-10 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
    </button>
);

const TicketItem = ({ ticket, onClick, detailed }: { ticket: Ticket, onClick: () => void, detailed?: boolean }) => {
    const iconMap = { 'Manutenção': Wrench, 'Reposição': Package, 'Limpeza': Sparkles };
    const Icon = iconMap[ticket.type];
    const colorMap = { 'Manutenção': 'red', 'Reposição': 'blue', 'Limpeza': 'purple' };
    const color = colorMap[ticket.type];

    const getStatusLabelSimple = (s: TicketStatus) => {
        if (s === 'resolvido') return 'Resolvido';
        if (s === 'em_andamento') return 'Em Andamento';
        return 'Em Aberto';
    };

    const getStatusColorBadge = (s: TicketStatus) => {
        if (s === 'resolvido') return 'bg-emerald-100 text-emerald-700';
        if (s === 'em_andamento') return 'bg-blue-100 text-blue-700';
        return 'bg-amber-100 text-amber-700';
    };

    return (
        <div onClick={onClick} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-${color}-50 text-${color}-600`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {ticket.type === 'Reposição' ? ticket.product : ticket.description.slice(0, 30) + (ticket.description.length > 30 ? '...' : '')}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                        {detailed && <span>{ticket.dateLabel}</span>}
                        {detailed && <span>•</span>}
                        {ticket.type}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusColorBadge(ticket.status)}`}>
                    {getStatusLabelSimple(ticket.status)}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400" />
            </div>
        </div>
    );
};

const ModalOverlay = ({ children, onClose, className }: { children: React.ReactNode, onClose: () => void, className?: string }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 ${className || 'max-w-md'}`}>
            {children}
        </div>
    </div>
);

const ModalHeader = ({ icon: Icon, color, title, onClose }: any) => (
    <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
        <h3 className={`font-bold text-gray-900 flex items-center gap-2`}>
            <Icon className={`h-5 w-5 ${color}`} />
            {title}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
    </div>
);

const FormGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700 ml-1">{label}</label>
        {children}
    </div>
);

const DetailRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">{label}</span>
        <div className="text-sm text-gray-900 font-medium">{children}</div>
    </div>
);
