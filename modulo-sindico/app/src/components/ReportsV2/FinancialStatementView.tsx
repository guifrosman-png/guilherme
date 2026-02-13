
import { Calendar, DollarSign, Download, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ManagedFeature } from '../ManagedFeature'; // Controle de Permissões
import { useReportsPermissions } from './contexts/ReportsPermissionsContext'; // Importar contexto
import { clsx } from 'clsx';


interface FinancialData {
    month: string;
    year: number;
    status: 'OPEN' | 'PROCESSING' | 'PAID';
    grossSales: number;
    contractRate: number;
    netValue: number;
    paymentDate: string | null;
    documents: {
        reportPdfUrl: string | null;
        proofImageUrl: string | null;
    };
    calculationDetail?: {
        credito: number;
        debito: number;
        pix: number;
        outros: number;
        cancellations: number;
    };
}

interface FinancialStatementViewProps {
    data: FinancialData;
    isLoading?: boolean;
}

// ==================== COMPONENTE ====================

export function FinancialStatementView({ data, isLoading = false }: FinancialStatementViewProps) {
    const { permissions } = useReportsPermissions(); // Hooks de Permissão

    // Helpers de formatação
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Componente Skeleton
    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    );

    const getStatusBadge = (status: string) => {
        if (isLoading) return <Skeleton className="h-6 w-24" />;
        switch (status) {
            case 'OPEN':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">EM ABERTO</Badge>;
            case 'PROCESSING':
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">PROCESSANDO</Badge>;
            case 'PAID':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">PAGO</Badge>;
            default:
                return <Badge variant="outline">DESCONHECIDO</Badge>;
        }
    };

    // Lógica para Grid Responsivo dos KPIs
    const visibleKpis = [
        permissions.statement.kpis.grossSales,
        permissions.statement.kpis.contractRate,
        permissions.statement.kpis.netValue
    ].filter(Boolean).length;

    const gridColsClass = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        0: 'hidden' // Se nenhum estiver visível
    }[visibleKpis] || 'md:grid-cols-3';

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full animate-in fade-in duration-300">

            {/* 1. Header do Extrato */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-[#525a52]" />
                        {isLoading ? <Skeleton className="h-8 w-64" /> : `Fechamento de ${data.month}/${data.year}`}
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        {isLoading ? <Skeleton className="h-4 w-96" /> : `Referência do período de vendas de 01 a 31 de ${data.month}.`}
                    </p>
                </div>
                <div>
                    {getStatusBadge(data?.status || 'OPEN')}
                </div>
            </div>

            {/* 2. Card Principal - KPIs Dinâmicos */}
            {visibleKpis > 0 && (
                <div className={clsx("grid grid-cols-1 gap-6", gridColsClass)}>

                    {/* Vendas Brutas */}
                    {permissions.statement.kpis.grossSales && (
                        <ManagedFeature id="closing.kpi.gross" label="KPI Vendas Brutas" className="h-full">
                            <Card className="border-gray-200 shadow-sm h-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Vendas Brutas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {isLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(data.grossSales)}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Total transacionado na máquina
                                    </p>
                                </CardContent>
                            </Card>
                        </ManagedFeature>
                    )}

                    {/* Taxa de Repasse */}
                    {permissions.statement.kpis.contractRate && (
                        <ManagedFeature id="closing.kpi.rate" label="KPI Taxa Contrato" className="h-full">
                            <Card className="border-gray-200 shadow-sm h-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Contrato
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {isLoading ? <Skeleton className="h-8 w-16" /> : `${data.contractRate}%`}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Porcentagem de repasse ao condomínio
                                    </p>
                                </CardContent>
                            </Card>
                        </ManagedFeature>
                    )}

                    {/* Valor Líquido (Destaque) */}
                    {permissions.statement.kpis.netValue && (
                        <ManagedFeature id="closing.kpi.net" label="KPI Valor a Receber" className="h-full">
                            <Card className="border-[#525a52]/20 shadow-md bg-[#525a52]/5 relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <DollarSign className="h-24 w-24 text-[#525a52]" />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-[#525a52] uppercase tracking-wider flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Valor a Receber
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-[#525a52]">
                                        {isLoading ? <Skeleton className="h-10 w-40" /> : formatCurrency(data.netValue)}
                                    </div>
                                    <div className="text-xs text-[#525a52]/80 mt-1 font-medium min-h-[16px]">
                                        {isLoading ? <Skeleton className="h-3 w-48 mt-1" /> : (
                                            data.status === 'PAID'
                                                ? `Pago em ${data.paymentDate}`
                                                : `Previsão: ${data.paymentDate || 'Até 5º dia útil'}`
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </ManagedFeature>
                    )}
                </div>
            )}

            {/* 3. Tabela Detalhada de Cálculo */}
            <Card className="border-gray-200">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-base font-semibold text-gray-800">
                        Detalhamento do Cálculo
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">

                        {permissions.statement.calculation.totalSales && (
                            <ManagedFeature id="closing.extract.total" label="Extrato: Vendas Totais">
                                <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors">
                                    <span className="text-gray-600">(+) Vendas Totais (Crédito + Débito + Pix)</span>
                                    <span className="font-medium text-gray-900">
                                        {isLoading ? <Skeleton className="h-5 w-24" /> : (data.calculationDetail
                                            ? formatCurrency(data.calculationDetail.credito + data.calculationDetail.debito + data.calculationDetail.pix + data.calculationDetail.outros)
                                            : formatCurrency(data.grossSales))}
                                    </span>
                                </div>
                            </ManagedFeature>
                        )}

                        {permissions.statement.calculation.details && (data.calculationDetail || isLoading) && (
                            <ManagedFeature id="closing.extract.details" label="Extrato: Detalhamento">
                                <div className="bg-gray-50/30 px-10 py-2 space-y-1 text-xs text-gray-500">
                                    <div className="flex justify-between">
                                        <span>• Crédito</span>
                                        <span>{isLoading ? <Skeleton className="h-3 w-20" /> : formatCurrency(data.calculationDetail?.credito || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>• Débito</span>
                                        <span>{isLoading ? <Skeleton className="h-3 w-20" /> : formatCurrency(data.calculationDetail?.debito || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>• Pix</span>
                                        <span>{isLoading ? <Skeleton className="h-3 w-20" /> : formatCurrency(data.calculationDetail?.pix || 0)}</span>
                                    </div>
                                </div>
                            </ManagedFeature>
                        )}

                        {permissions.statement.calculation.cancellations && (
                            <ManagedFeature id="closing.extract.cancel" label="Extrato: Estornos">
                                <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors">
                                    <span className="text-gray-600">(-) Estornos / Cancelamentos</span>
                                    <span className="font-medium text-red-600">
                                        {isLoading ? <Skeleton className="h-5 w-16" /> : formatCurrency(data.calculationDetail?.cancellations || 0)}
                                    </span>
                                </div>
                            </ManagedFeature>
                        )}

                        {permissions.statement.calculation.baseCalculation && (
                            <ManagedFeature id="closing.extract.base" label="Extrato: Base de Cálculo">
                                <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors bg-gray-50/30">
                                    <span className="text-gray-800 font-medium">(=) Base de Cálculo Oficial</span>
                                    <span className="font-bold text-gray-900">
                                        {isLoading ? <Skeleton className="h-5 w-24" /> : formatCurrency(data.grossSales)}
                                    </span>
                                </div>
                            </ManagedFeature>
                        )}

                        {permissions.statement.calculation.contractRateLine && (
                            <ManagedFeature id="closing.extract.rate" label="Extrato: Alíquota">
                                <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors">
                                    <span className="text-gray-600">(x) Alíquota Contratual</span>
                                    <span className="font-medium text-gray-900">
                                        {isLoading ? <Skeleton className="h-5 w-10" /> : `${data.contractRate}%`}
                                    </span>
                                </div>
                            </ManagedFeature>
                        )}

                        {permissions.statement.calculation.finalRepasse && (
                            <ManagedFeature id="closing.extract.final" label="Extrato: Repasse Final">
                                <div className="flex justify-between py-4 px-6 bg-[#525a52]/5">
                                    <span className="font-bold text-[#525a52] text-lg">(=) Repasse Final</span>
                                    <span className="font-bold text-[#525a52] text-lg">
                                        {isLoading ? <Skeleton className="h-6 w-32" /> : formatCurrency(data.netValue)}
                                    </span>
                                </div>
                            </ManagedFeature>
                        )}
                    </div>
                </CardContent>
            </Card>


            {/* 4. Área de Documentos e Comprovantes */}
            {(permissions.statement.docs.reportPdf || permissions.statement.docs.proof) && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        Auditoria & Comprovantes
                    </h3>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : (
                        <div className={clsx("grid gap-4", (permissions.statement.docs.reportPdf && permissions.statement.docs.proof) ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>

                            {/* Botão de Relatório PDF */}
                            {permissions.statement.docs.reportPdf && (
                                <ManagedFeature id="closing.docs.report" label="Doc: Relatório PDF">
                                    <div className="p-4 border border-gray-200 rounded-lg bg-white hover:border-[#525a52]/40 transition-all group flex items-start gap-4">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Relatório Detalhado (PDF)</h4>
                                            <p className="text-sm text-gray-500 mb-3">Extrato completo de todas as vendas item a item para auditoria.</p>
                                            <Button variant="outline" size="sm" className="w-full gap-2 text-gray-700"
                                                disabled={!data.documents.reportPdfUrl}
                                                onClick={() => console.log("Download PDF")}
                                            >
                                                <Download className="h-4 w-4" />
                                                Baixar Prestação de Contas
                                            </Button>
                                        </div>
                                    </div>
                                </ManagedFeature>
                            )}

                            {/* Botão de Comprovante de Pagamento */}
                            {permissions.statement.docs.proof && (
                                <ManagedFeature id="closing.docs.proof" label="Doc: Comprovante">
                                    <div className="p-4 border border-gray-200 rounded-lg bg-white hover:border-[#525a52]/40 transition-all group flex items-start gap-4">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                                            <DollarSign className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Comprovante de Repasse</h4>
                                            <p className="text-sm text-gray-500 mb-3">Comprovante bancário (TED/Pix) da transferência realizada.</p>
                                            <Button
                                                variant={data.status === 'PAID' ? "default" : "secondary"}
                                                className={data.status === 'PAID' ? "w-full gap-2 bg-[#525a52] hover:bg-[#525a52]/90" : "w-full gap-2"}
                                                size="sm"
                                                disabled={data.status !== 'PAID'}
                                            >
                                                {data.status === 'PAID' ? (
                                                    <>
                                                        <Download className="h-4 w-4" />
                                                        Visualizar Comprovante
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-4 w-4" />
                                                        Ainda não depositado
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </ManagedFeature>
                            )}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

// Default export para garantir compatibilidade
export default FinancialStatementView;
