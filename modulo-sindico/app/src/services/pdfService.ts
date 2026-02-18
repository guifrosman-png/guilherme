
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FinancialReportData {
    month: string;
    year: number;
    generatedAt: string;

    // Totais
    grossSales: number;
    cancellations: number;
    netBase: number;
    contractRate: number; // %
    contractRateValue: number; // R$
    finalRepasse: number;

    // Lista de Vendas
    sales: any[]; // Raw Mercatus Data
}

export const pdfService = {
    generateFinancialReport: (data: FinancialReportData) => {
        const doc = new jsPDF();

        // Cores
        const PRIMARY_COLOR = [23, 37, 84]; // blue-950
        const SECONDARY_COLOR = [59, 130, 246]; // blue-500
        const TEXT_COLOR = [71, 85, 105]; // slate-600

        // --- CABEÇALHO ---
        // Logo (Simulado com texto por enquanto, ou url se tiver)
        doc.setFontSize(22);
        doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        doc.setFont("helvetica", "bold");
        doc.text("HUB.APP", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
        doc.setFont("helvetica", "normal");
        doc.text("Relatório de Fechamento Mensal", 14, 26);

        // Data e Info
        doc.setFontSize(10);
        doc.text(`Período: ${data.month}/${data.year}`, 140, 20);
        doc.text(`Gerado em: ${data.generatedAt}`, 140, 26);

        // Linha Divisória
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 32, 196, 32);

        // --- RESUMO FINANCEIRO ---
        let yPos = 45;

        doc.setFontSize(14);
        doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Resumo Financeiro", 14, yPos);

        yPos += 10;

        // Grid de Resumo
        const summaryData = [
            ["Vendas Brutas", new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.grossSales)],
            ["(-) Cancelamentos/Estornos", new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.cancellations)],
            ["(=) Base de Cálculo", new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.netBase)],
            [`(-) Taxa de Contrato (${data.contractRate}%)`, new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.contractRateValue)],
            ["(=) Repasse Final Líquido", new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.finalRepasse)]
        ];

        autoTable(doc, {
            startY: yPos,
            head: [['Descrição', 'Valor']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: PRIMARY_COLOR as any },
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
            }
        });

        // Pega a posição Y final da tabela anterior
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 20;

        // --- DETALHAMENTO DE VENDAS ---
        doc.setFontSize(14);
        doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        doc.text("Detalhamento de Transações", 14, yPos);

        yPos += 5;

        // Preparar dados da tabela de vendas
        // Filtrar apenas vendas válidas e mapear para colunas
        const salesRows = data.sales
            .filter(s => !s.cancelado) // Opcional: mostrar ou não cancelados com flag? Vamos mostrar apenas válidas por padrão para prestação de contas líquida, ou todas com status? Melhor todas e mostrar status.
            .map(s => [
                new Date(s.dataMovimento).toLocaleDateString('pt-BR') + ' ' + new Date(s.dataMovimento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                s.id ? `#${s.id}` : '-',
                s.cancelado ? 'CANCELADO' : 'CONFIRMADO',
                s.finalizadoras?.map((f: any) => f.descricao).join(', ') || '-',
                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.valorTotal)
            ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Data/Hora', 'ID', 'Status', 'Pagamento', 'Valor']],
            body: salesRows,
            theme: 'grid',
            headStyles: { fillColor: SECONDARY_COLOR as any },
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 20 },
                2: { cellWidth: 30 }, // Status
                3: { cellWidth: 'auto' }, // Pagamento
                4: { cellWidth: 30, halign: 'right' }
            },
            didParseCell: function (data) {
                // Pintar de vermelho linhas de cancelado
                if (data.row.raw[2] === 'CANCELADO') {
                    data.cell.styles.textColor = [220, 38, 38];
                }
            }
        });

        // Rodapé
        const pageCount = doc.internal.pages.length - 1; // jsPDF array bug workaround
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount} - Gerado automaticamente pelo Sistema Hub.App`, 14, doc.internal.pageSize.height - 10);
        }

        // Save
        const fileName = `Relatorio_Fechamento_${data.month}_${data.year}.pdf`;
        doc.save(fileName);
    }
};
