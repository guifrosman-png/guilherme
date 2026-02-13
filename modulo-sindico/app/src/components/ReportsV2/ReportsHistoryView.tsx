
import { useState, useMemo } from 'react';
import { Calendar, Search, Filter, History, Clock, FileCheck, FileWarning, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReportsPermissions } from './contexts/ReportsPermissionsContext'; // Importar contexto
import { clsx } from 'clsx';

interface ReportsHistoryViewProps {
    onSelectReport: (id: string) => void;
}

export function ReportsHistoryView({ onSelectReport }: ReportsHistoryViewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const { permissions } = useReportsPermissions(); // Hook de Permissões

    // Gerador de dados de histórico (simulado para exemplo, mas pode vir da API)
    const generateHistory = () => {
        const history = [];
        const today = new Date();
        const owners = ["Guilherme", "João", "Maria", "Sistema"];

        for (let i = 0; i < 24; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const isPaid = i > 0; // Só meses passados estão pagos

            history.push({
                id: `report-${date.getMonth() + 1}-${date.getFullYear()}`,
                month: date.toLocaleString('pt-BR', { month: 'long' }),
                year: date.getFullYear(),
                fullDate: date,
                status: isPaid ? 'PAID' : (i === 0 ? 'OPEN' : 'PROCESSING'),
                owner: owners[i % owners.length],
                updatedAt: new Date(date.getFullYear(), date.getMonth(), 5).toLocaleDateString(),
                createdAt: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString(),
            });
        }
        return history;
    };

    const historyData = useMemo(() => generateHistory(), []);

    const filteredData = historyData.filter(item =>
        item.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year.toString().includes(searchTerm)
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 text-[10px] h-5 px-1.5">Aberto</Badge>;
            case 'PROCESSING':
                return <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 text-[10px] h-5 px-1.5">Processando</Badge>;
            case 'PAID':
                return <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-[10px] h-5 px-1.5">Pago</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
            {/* Header da View */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <History className="h-5 w-5 text-[#525a52]" />
                        Histórico Completo
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Todos os fechamentos mensais desde o início do contrato.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar mês ou ano..."
                            className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabela Clean / Lista */}
            <div className="flex-1 overflow-hidden p-6">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700">#</th>

                                {permissions.history.columns.titleMonth && (
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700">Mês de Referência</th>
                                )}

                                {permissions.history.columns.owner && (
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700">Proprietário</th>
                                )}

                                {permissions.history.columns.status && (
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700 text-center">Status</th>
                                )}

                                {permissions.history.columns.updatedAt && (
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700">Última Atualização</th>
                                )}

                                {permissions.history.columns.createdAt && (
                                    <th className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700">Criado Em</th>
                                )}

                                <th className="px-6 py-3 font-medium text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map((report, index) => (
                                <tr
                                    key={report.id}
                                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                    onClick={() => onSelectReport(report.id)}
                                >
                                    <td className="px-6 py-4 text-gray-400 w-12 text-xs">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </td>

                                    {permissions.history.columns.titleMonth && (
                                        <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                                                    report.status === 'PAID' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {report.month.substring(0, 3).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="capitalize text-sm">{report.month} de {report.year}</span>
                                                    <span className="text-[10px] text-gray-400 font-normal">ID: {report.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                    )}

                                    {permissions.history.columns.owner && (
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    {report.owner.charAt(0)}
                                                </div>
                                                {report.owner}
                                            </div>
                                        </td>
                                    )}

                                    {permissions.history.columns.status && (
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(report.status)}
                                        </td>
                                    )}

                                    {permissions.history.columns.updatedAt && (
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {report.updatedAt}
                                        </td>
                                    )}

                                    {permissions.history.columns.createdAt && (
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {report.createdAt}
                                        </td>
                                    )}

                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200">
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
