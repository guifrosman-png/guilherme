
import React from 'react';
import {
    Download,
    FileText,
    DollarSign,
    Calendar,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

// ==================== INTERFACES ====================

interface FinancialStatementData {
    month: string;
    year: number;
    status: 'OPEN' | 'PROCESSING' | 'PAID';
    grossSales: number;
    contractRate: number; // Porcentagem (ex: 5.0)
    netValue: number;
    paymentDate?: string; // Data prevista ou realizada
    documents: {
        reportPdfUrl?: string;
        proofImageUrl?: string;
    };
}

interface FinancialStatementViewProps {
    data: FinancialStatementData;
}

// ==================== COMPONENTE ====================

export function FinancialStatementView({ data }: FinancialStatementViewProps) {

    // Helpers de formatação
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const getStatusBadge = (status: string) => {
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

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full animate-in fade-in duration-500">

            {/* 1. Header do Extrato */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-[#525a52]" />
                        Fechamento de {data.month}/{data.year}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Referência do período de vendas de 01 a 31 de {data.month}.
                    </p>
                </div>
                <div>
                    {getStatusBadge(data.status)}
                </div>
            </div>

            {/* 2. Card Principal - O Valor que Importa */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vendas Brutas */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Vendas Brutas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(data.grossSales)}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Total transacionado na máquina
                        </p>
                    </CardContent>
                </Card>

                {/* Taxa de Repasse */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Contrato
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {data.contractRate}%
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Porcentagem de repasse ao condomínio
                        </p>
                    </CardContent>
                </Card>

                {/* Valor Líquido (Destaque) */}
                <Card className="border-[#525a52]/20 shadow-md bg-[#525a52]/5 relative overflow-hidden">
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
                            {formatCurrency(data.netValue)}
                        </div>
                        <p className="text-xs text-[#525a52]/80 mt-1 font-medium">
                            {data.status === 'PAID'
                                ? `Pago em ${data.paymentDate}`
                                : `Previsão: ${data.paymentDate || 'Até 5º dia útil'}`}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Tabela Detalhada de Cálculo (Accordion Simulado) */}
            <Card className="border-gray-200">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-base font-semibold text-gray-800">
                        Detalhamento do Cálculo
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                        <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-600">(+) Vendas Totais (Crédito + Débito + Pix)</span>
                            <span className="font-medium text-gray-900">{formatCurrency(data.grossSales)}</span>
                        </div>
                        <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-600">(-) Estornos / Cancelamentos</span>
                            <span className="font-medium text-red-600">{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors bg-gray-50/30">
                            <span className="text-gray-800 font-medium">(=) Base de Cálculo Oficial</span>
                            <span className="font-bold text-gray-900">{formatCurrency(data.grossSales)}</span>
                        </div>
                        <div className="flex justify-between py-3 px-6 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-600">(x) Alíquota Contratual</span>
                            <span className="font-medium text-gray-900">{data.contractRate}%</span>
                        </div>
                        <div className="flex justify-between py-4 px-6 bg-[#525a52]/5">
                            <span className="font-bold text-[#525a52] text-lg">(=) Repasse Final</span>
                            <span className="font-bold text-[#525a52] text-lg">{formatCurrency(data.netValue)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Área de Documentos e Comprovantes */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    Auditoria & Comprovantes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Botão de Relatório PDF */}
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

                    {/* Botão de Comprovante de Pagamento */}
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
                </div>
            </div>

        </div>
    );
}
