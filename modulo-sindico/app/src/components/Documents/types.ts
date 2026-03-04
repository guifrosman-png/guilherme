// Tipos do módulo de Documentos

export type DocumentCategory = 'conta' | 'comprovante_pago' | 'outros';

export interface SindicoDocument {
    id: string;
    /** Nome do arquivo original */
    fileName: string;
    /** URL/base64 do arquivo para preview */
    fileUrl: string;
    /** Tipo MIME do arquivo */
    fileType: string;
    /** Tamanho do arquivo em bytes */
    fileSize: number;
    /** Categoria: é uma conta a pagar (luz/água) ou um comprovante de pagamento já feito? */
    category: DocumentCategory;
    /** Descrição opcional fornecida pelo síndico */
    description: string;
    /** Mês de referência (1-12) */
    referenceMonth: number;
    /** Ano de referência */
    referenceYear: number;
    /** Data de envio */
    uploadedAt: string; // ISO string
}

export interface TransferProof {
    id: string;
    /** ID da apuração no ERP */
    apuracaoId: string;
    /** URL/base64 do comprovante */
    fileUrl: string;
    /** Nome do arquivo */
    fileName: string;
    /** Tipo MIME */
    fileType: string;
    /** Tamanho em bytes */
    fileSize: number;
    /** Valor do repasse */
    amount: number;
    /** Mês de referência (1-12) */
    referenceMonth: number;
    /** Ano de referência */
    referenceYear: number;
    /** Data do pagamento */
    paidAt: string; // ISO string
    /** Método de pagamento */
    paymentMethod: 'pix' | 'transferencia' | 'boleto';
}

/** Helper para formatar o nome do mês */
export const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
    conta: 'Conta a Pagar',
    comprovante_pago: 'Comprovante de Pagamento',
    outros: 'Outros Documentos'
};

export const CATEGORY_COLORS: Record<DocumentCategory, string> = {
    conta: 'bg-amber-100 text-amber-700 border-amber-200',
    comprovante_pago: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    outros: 'bg-blue-100 text-blue-700 border-blue-200'
};
