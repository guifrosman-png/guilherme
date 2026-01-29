import React, { useState } from 'react';
import { Wrench, Package, Sparkles, Phone, FileText, ChevronRight, Clock, CheckCircle2, AlertCircle, X, Info, Send, Camera } from 'lucide-react';

export function UnitSupportTab() {
    // Configuração dos Modais
    const [activeModal, setActiveModal] = useState<'maintenance' | 'resupply' | 'cleaning' | null>(null);
    const [featureInfoModal, setFeatureInfoModal] = useState<{ open: boolean; title: string; description: string }>({ open: false, title: '', description: '' });

    // Estados dos Formulários
    const [formData, setFormData] = useState({ description: '', urgency: 'normal', product: '', quantity: '1' });

    // Função para abrir o modal de explicação final
    const handleFinalSubmit = (feature: string, description: string) => {
        setActiveModal(null); // Fecha o modal de input
        setFeatureInfoModal({
            open: true,
            title: `Funcionalidade: ${feature}`,
            description: description
        });
        setFormData({ description: '', urgency: 'normal', product: '', quantity: '1' }); // Limpa formulário
    };

    const tickets = [
        { id: 1, title: 'Porta da geladeira travada', status: 'em_andamento', date: 'Hoje, 10:30', category: 'Manutenção' },
        { id: 2, title: 'Reposição de Coca-Cola', status: 'concluido', date: 'Ontem, 15:45', category: 'Reposição' },
        { id: 3, title: 'Limpeza da área de café', status: 'aberto', date: 'Ontem, 09:00', category: 'Limpeza' },
    ];

    const statusColors = {
        aberto: 'bg-amber-100 text-amber-700 border-amber-200',
        em_andamento: 'bg-blue-100 text-blue-700 border-blue-200',
        concluido: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    const statusLabels = {
        aberto: 'Aberto',
        em_andamento: 'Em Andamento',
        concluido: 'Resolvido',
    };

    return (
        <div className="space-y-6 pb-20 relative">

            {/* 1. Modal de Manutenção / Limpeza (Input Visual) */}
            {(activeModal === 'maintenance' || activeModal === 'cleaning') && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                {activeModal === 'maintenance' ? <Wrench className="h-5 w-5 text-red-500" /> : <Sparkles className="h-5 w-5 text-purple-500" />}
                                {activeModal === 'maintenance' ? 'Abrir Chamado Técnico' : 'Reportar Limpeza'}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">O que aconteceu?</label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm min-h-[100px]"
                                    placeholder={activeModal === 'maintenance' ? "Ex: A porta da geladeira não está fechando direito..." : "Ex: Derramaram refrigerante no chão..."}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Urgência</label>
                                <div className="flex gap-2">
                                    {['baixa', 'media', 'alta'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setFormData({ ...formData, urgency: level })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${formData.urgency === level
                                                    ? (level === 'alta' ? 'bg-red-50 border-red-200 text-red-700' : level === 'media' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-green-50 border-green-200 text-green-700')
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {level === 'alta' ? 'Alta' : level === 'media' ? 'Média' : 'Baixa'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                                <Camera className="h-6 w-6 mb-2" />
                                <span className="text-sm">Adicionar Foto (Opcional)</span>
                            </div>

                            <button
                                onClick={() => handleFinalSubmit(
                                    activeModal === 'maintenance' ? "Enviar para HelpDesk (Manutenção)" : "Enviar para HelpDesk (Limpeza)",
                                    "Ao clicar neste botão, o sistema criará um ticket oficial no módulo HelpDesk, notificando imediatamente a equipe técnica responsável. O síndico receberá o número do protocolo para acompanhamento."
                                )}
                                className={`w-full py-3 rounded-xl text-white font-medium shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${activeModal === 'maintenance' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
                                    }`}
                            >
                                <Send className="h-4 w-4" />
                                Enviar Solicitação
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Modal de Reposição (Input Visual) */}
            {activeModal === 'resupply' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Package className="h-5 w-5 text-blue-500" />
                                Solicitar Reposição
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Qual produto está faltando?</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 px-3"
                                    placeholder="Ex: Coca-Cola Lata 350ml"
                                    value={formData.product}
                                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Estimada</label>
                                <select
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 px-3"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                >
                                    <option value="1">Poucas unidades</option>
                                    <option value="2">Prateleira vazia</option>
                                    <option value="3">Urgência Total</option>
                                </select>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800">
                                    Dica: Você pode solicitar múltiplos itens de uma vez na próxima versão. Por enquanto, solicite o mais crítico.
                                </p>
                            </div>

                            <button
                                onClick={() => handleFinalSubmit(
                                    "Solicitar Reposição ao Estoque",
                                    "Esta solicitação entrará na fila de prioridade do time de logística (Kanban de Abastecimento). O sistema verificará o estoque e agendará a próxima rota para incluir essa unidade."
                                )}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Send className="h-4 w-4" />
                                Solicitar Agora
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 3. Modal de Explicação Final (Feature Info) */}
            {featureInfoModal.open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-blue-50 border-b border-blue-100 p-6 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Info className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">Funcionalidade em Desenvolvimento</h3>
                                <p className="text-blue-700 text-sm mt-1 font-medium">{featureInfoModal.title}</p>
                            </div>
                            <button
                                onClick={() => setFeatureInfoModal({ ...featureInfoModal, open: false })}
                                className="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="prose prose-sm text-gray-600">
                                <p className="leading-relaxed text-base">
                                    {featureInfoModal.description}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setFeatureInfoModal({ ...featureInfoModal, open: false })}
                                    className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                >
                                    Entendi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Unidade & Suporte</h1>
                <p className="text-gray-500">Gestão operacional e canal direto com a Expresso</p>
            </div>

            {/* Unit Identity Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 opacity-10 blur-3xl rounded-full bg-white/20"></div>

                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 opacity-80">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Contrato Ativo</span>
                            <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                            <span className="text-xs text-gray-300">Unidade #4029</span>
                        </div>
                        <h2 className="text-3xl font-bold">Condomínio Grand Splendor</h2>
                        <p className="text-gray-400">Rua das Acácias, 120 - Jardins</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md">
                            <p className="text-xs text-gray-400 mb-1">Repasse Contratual</p>
                            <p className="text-2xl font-bold text-emerald-400">5.0%</p>
                        </div>
                        <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md">
                            <p className="text-xs text-gray-400 mb-1">Próximo Pagamento</p>
                            <p className="text-lg font-bold text-white">15/FEV</p>
                        </div>
                    </div>
                </div>

                {/* Bank Details Strip */}
                <div className="mt-6 border-t border-white/10 pt-4 flex items-center gap-4 text-sm text-gray-300">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Dados Bancários: <strong>Banco Itaú</strong> • Ag <strong>3421</strong> • CC <strong>39291-0</strong></span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setActiveModal('maintenance')}
                    className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:border-red-100 hover:shadow-md transition-all text-left"
                >
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wrench className="h-24 w-24 text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 mb-3 group-hover:scale-110 transition-transform">
                            <Wrench className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Manutenção</h3>
                        <p className="text-sm text-gray-500 mt-1">Relatar quebras ou falhas</p>
                    </div>
                </button>

                <button
                    onClick={() => setActiveModal('resupply')}
                    className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all text-left"
                >
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Package className="h-24 w-24 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                            <Package className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Reposição</h3>
                        <p className="text-sm text-gray-500 mt-1">Solicitar produtos em falta</p>
                    </div>
                </button>

                <button
                    onClick={() => setActiveModal('cleaning')}
                    className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:border-purple-100 hover:shadow-md transition-all text-left"
                >
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="h-24 w-24 text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Limpeza</h3>
                        <p className="text-sm text-gray-500 mt-1">Reportar sujeira ou bagunça</p>
                    </div>
                </button>
            </div>

            {/* Main Content Grid (Manager & History) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Tickets List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            Histórico de Solicitações
                        </h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todos</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${ticket.category === 'Manutenção' ? 'bg-red-50 text-red-600' :
                                            ticket.category === 'Reposição' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                        {ticket.category === 'Manutenção' && <Wrench className="h-5 w-5" />}
                                        {ticket.category === 'Reposição' && <Package className="h-5 w-5" />}
                                        {ticket.category === 'Limpeza' && <Sparkles className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{ticket.title}</h4>
                                        <p className="text-xs text-gray-500">{ticket.date} • {ticket.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                                        {statusLabels[ticket.status as keyof typeof statusLabels]}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manager Contact (Direto para explicação, sem input modal) */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Seu Gerente de Conta</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <img src="https://ui-avatars.com/api/?name=Carlos+Mendes&background=0D9488&color=fff" alt="Manager" className="h-12 w-12 rounded-full ring-2 ring-emerald-50" />
                            <div>
                                <p className="font-medium text-gray-900">Carlos Mendes</p>
                                <p className="text-sm text-gray-500">Customer Success</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleFinalSubmit(
                                "Contato via WhatsApp",
                                "Esta funcionalidade abrirá diretamente o WhatsApp Web (ou App) iniciando uma conversa com o número corporativo do Gerente de Conta responsável. A mensagem inicial já será preenchida com a identificação do condomínio para agilizar o atendimento."
                            )}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-medium transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            Falar no WhatsApp
                        </button>
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Dica:</span> Para emergências fora do horário comercial, utilize o canal de Manutenção Crítica no botão acima.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
