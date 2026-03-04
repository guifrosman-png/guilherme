import { SindicoDocument, TransferProof } from './types';

// ─── IMAGEM PLACEHOLDER INLINE ───
// Usando data:image/svg+xml com encodeURIComponent para suportar caracteres UTF-8

const SVG_COMPROVANTE = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f9ff"/><stop offset="100%" style="stop-color:#e0f2fe"/></linearGradient></defs><rect width="800" height="600" fill="url(#bg)"/><rect x="50" y="40" width="700" height="80" rx="8" fill="#1e40af" opacity="0.9"/><text x="400" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">COMPROVANTE DE PAGAMENTO</text><rect x="50" y="150" width="700" height="400" rx="8" fill="white" stroke="#e2e8f0" stroke-width="2"/><text x="80" y="200" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">BENEFICIARIO</text><text x="80" y="225" fill="#1e293b" font-family="Arial" font-size="16">Condominio Residencial Parque das Flores</text><line x1="80" y1="245" x2="720" y2="245" stroke="#e2e8f0" stroke-width="1"/><text x="80" y="275" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">VALOR</text><text x="80" y="305" fill="#059669" font-family="Arial" font-size="28" font-weight="bold">R$ 1.250,00</text><line x1="80" y1="325" x2="720" y2="325" stroke="#e2e8f0" stroke-width="1"/><text x="80" y="355" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">TIPO</text><text x="80" y="380" fill="#1e293b" font-family="Arial" font-size="16">PIX - Transferencia Instantanea</text><line x1="80" y1="400" x2="720" y2="400" stroke="#e2e8f0" stroke-width="1"/><text x="80" y="430" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">DATA</text><text x="80" y="455" fill="#1e293b" font-family="Arial" font-size="16">27/02/2026 - 14:32:15</text><line x1="80" y1="475" x2="720" y2="475" stroke="#e2e8f0" stroke-width="1"/><text x="80" y="505" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">ID DA TRANSACAO</text><text x="80" y="530" fill="#1e293b" font-family="Arial" font-size="13">E18236120001020260227143200000001</text><circle cx="680" cy="200" r="30" fill="#059669" opacity="0.15"/><text x="680" y="207" text-anchor="middle" fill="#059669" font-size="24">OK</text></svg>`;

const SVG_NOTA_FISCAL = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fefce8"/><stop offset="100%" style="stop-color:#fef3c7"/></linearGradient></defs><rect width="800" height="600" fill="url(#bg2)"/><rect x="50" y="40" width="700" height="80" rx="8" fill="#b45309" opacity="0.9"/><text x="400" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">NOTA FISCAL DE SERVICO</text><rect x="50" y="150" width="700" height="400" rx="8" fill="white" stroke="#e2e8f0" stroke-width="2"/><text x="80" y="200" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">PRESTADOR</text><text x="80" y="225" fill="#1e293b" font-family="Arial" font-size="16">ElevaTech Manutencao de Elevadores LTDA</text><text x="80" y="275" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">CNPJ</text><text x="80" y="300" fill="#1e293b" font-family="Arial" font-size="16">12.345.678/0001-90</text><text x="80" y="350" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">VALOR DO SERVICO</text><text x="80" y="380" fill="#b45309" font-family="Arial" font-size="28" font-weight="bold">R$ 2.800,00</text><text x="80" y="430" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">DESCRICAO</text><text x="80" y="455" fill="#1e293b" font-family="Arial" font-size="14">Manutencao preventiva elevadores 1 e 2 - Fevereiro/2026</text><text x="80" y="505" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">NF-e</text><text x="80" y="530" fill="#1e293b" font-family="Arial" font-size="16">#2026-00452</text></svg>`;

const PLACEHOLDER_IMG = `data:image/svg+xml,${encodeURIComponent(SVG_COMPROVANTE)}`;
const PLACEHOLDER_IMG_2 = `data:image/svg+xml,${encodeURIComponent(SVG_NOTA_FISCAL)}`;

const PLACEHOLDER_PDF = `data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQgL0YxIDE4IFRmIDUwIDcwMCBUZCAoRG9jdW1lbnRvIGRlIEV4ZW1wbG8pIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDMwNiAwMDAwMCBuIAowMDAwMDAwNDAyIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNDkyCiUlRU9G`;

/**
 * Documentos enviados pelo síndico (contas, comprovantes, etc.)
 * Mock expandido com dados realistas para demonstração
 */
export const MOCK_DOCUMENTS: SindicoDocument[] = [
    // ─── DEZEMBRO 2025 ───
    {
        id: 'doc-d01',
        fileName: 'conta_energia_dez2025.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 231_000,
        category: 'conta',
        description: 'Conta de Energia Elétrica - CPFL',
        referenceMonth: 12,
        referenceYear: 2025,
        uploadedAt: '2025-12-28T14:00:00Z'
    },
    {
        id: 'doc-d02',
        fileName: 'conta_agua_dez2025.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 178_000,
        category: 'conta',
        description: 'Conta de Água e Esgoto - SABESP',
        referenceMonth: 12,
        referenceYear: 2025,
        uploadedAt: '2025-12-29T09:00:00Z'
    },

    // ─── JANEIRO 2026 ───
    {
        id: 'doc-001',
        fileName: 'conta_energia_jan2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 245_000,
        category: 'conta',
        description: 'Conta de Energia Elétrica - CPFL',
        referenceMonth: 1,
        referenceYear: 2026,
        uploadedAt: '2026-01-28T14:30:00Z'
    },
    {
        id: 'doc-002',
        fileName: 'conta_agua_jan2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 189_000,
        category: 'conta',
        description: 'Conta de Água e Esgoto - SABESP',
        referenceMonth: 1,
        referenceYear: 2026,
        uploadedAt: '2026-01-29T09:15:00Z'
    },
    {
        id: 'doc-003',
        fileName: 'comprovante_manutencao_elevador.jpg',
        fileUrl: PLACEHOLDER_IMG_2,
        fileType: 'image/jpeg',
        fileSize: 1_200_000,
        category: 'comprovante_pago',
        description: 'Comprovante PIX - Manutenção Elevador',
        referenceMonth: 1,
        referenceYear: 2026,
        uploadedAt: '2026-01-30T16:45:00Z'
    },
    {
        id: 'doc-007',
        fileName: 'conta_gas_jan2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 95_000,
        category: 'conta',
        description: 'Conta de Gás - Comgás',
        referenceMonth: 1,
        referenceYear: 2026,
        uploadedAt: '2026-01-25T11:20:00Z'
    },
    {
        id: 'doc-008',
        fileName: 'comprovante_jardinagem.jpg',
        fileUrl: PLACEHOLDER_IMG,
        fileType: 'image/jpeg',
        fileSize: 780_000,
        category: 'comprovante_pago',
        description: 'Comprovante PIX - Serviço de Jardinagem',
        referenceMonth: 1,
        referenceYear: 2026,
        uploadedAt: '2026-01-22T08:40:00Z'
    },

    // ─── FEVEREIRO 2026 ───
    {
        id: 'doc-004',
        fileName: 'conta_energia_fev2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 252_000,
        category: 'conta',
        description: 'Conta de Energia Elétrica - CPFL',
        referenceMonth: 2,
        referenceYear: 2026,
        uploadedAt: '2026-02-25T10:20:00Z'
    },
    {
        id: 'doc-009',
        fileName: 'conta_agua_fev2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 195_000,
        category: 'conta',
        description: 'Conta de Água e Esgoto - SABESP',
        referenceMonth: 2,
        referenceYear: 2026,
        uploadedAt: '2026-02-26T09:30:00Z'
    },
    {
        id: 'doc-010',
        fileName: 'conta_internet_fev2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 112_000,
        category: 'conta',
        description: 'Conta de Internet - Vivo Fibra',
        referenceMonth: 2,
        referenceYear: 2026,
        uploadedAt: '2026-02-15T14:10:00Z'
    },
    {
        id: 'doc-005',
        fileName: 'recibo_festa_carnaval.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 340_000,
        category: 'outros',
        description: 'Recibo de gastos - Festa de Carnaval do Condomínio',
        referenceMonth: 2,
        referenceYear: 2026,
        uploadedAt: '2026-02-20T11:00:00Z'
    },
    {
        id: 'doc-006',
        fileName: 'comprovante_limpeza_fev.jpg',
        fileUrl: PLACEHOLDER_IMG,
        fileType: 'image/jpeg',
        fileSize: 890_000,
        category: 'comprovante_pago',
        description: 'Comprovante PIX - Serviço de Limpeza de Piscina',
        referenceMonth: 2,
        referenceYear: 2026,
        uploadedAt: '2026-02-18T08:30:00Z'
    },
    {
        id: 'doc-011',
        fileName: 'comprovante_dedetizacao_fev.jpg',
        fileUrl: PLACEHOLDER_IMG,
        fileType: 'image/jpeg',
        fileSize: 650_000,
        category: 'comprovante_pago',
        description: 'Comprovante PIX - Dedetização Áreas Comuns',
        referenceMonth: 2,
        referenceYear: 2026,
        uploadedAt: '2026-02-12T15:00:00Z'
    },
    {
        id: 'doc-012',
        fileName: 'ata_reuniao_fev2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 420_000,
        category: 'outros',
        description: 'Ata da Reunião de Condomínio - Fevereiro',
        referenceMonth: 2,
        referenceYear: 2026,
        uploadedAt: '2026-02-22T19:00:00Z'
    },

    // ─── MARÇO 2026 ───
    {
        id: 'doc-013',
        fileName: 'conta_energia_mar2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 268_000,
        category: 'conta',
        description: 'Conta de Energia Elétrica - CPFL',
        referenceMonth: 3,
        referenceYear: 2026,
        uploadedAt: '2026-02-28T10:00:00Z'
    },
    {
        id: 'doc-014',
        fileName: 'conta_agua_mar2026.pdf',
        fileUrl: PLACEHOLDER_PDF,
        fileType: 'application/pdf',
        fileSize: 201_000,
        category: 'conta',
        description: 'Conta de Água e Esgoto - SABESP',
        referenceMonth: 3,
        referenceYear: 2026,
        uploadedAt: '2026-03-01T09:00:00Z'
    },
    {
        id: 'doc-015',
        fileName: 'comprovante_pintura_hall.jpg',
        fileUrl: PLACEHOLDER_IMG_2,
        fileType: 'image/jpeg',
        fileSize: 1_450_000,
        category: 'comprovante_pago',
        description: 'Comprovante PIX - Pintura do Hall de Entrada',
        referenceMonth: 3,
        referenceYear: 2026,
        uploadedAt: '2026-03-02T08:15:00Z'
    },
];

/**
 * Comprovantes de repasse recebidos (pagamentos da empresa para o condomínio)
 * Mock expandido com mais meses
 */
export const MOCK_TRANSFER_PROOFS: TransferProof[] = [
    {
        id: 'tf-001',
        apuracaoId: 'APU-2025-11',
        fileUrl: PLACEHOLDER_PDF,
        fileName: 'comprovante_repasse_nov2025.pdf',
        fileType: 'application/pdf',
        fileSize: 148_000,
        amount: 4_520.30,
        referenceMonth: 11,
        referenceYear: 2025,
        paidAt: '2025-12-05T10:00:00Z',
        paymentMethod: 'pix'
    },
    {
        id: 'tf-002',
        apuracaoId: 'APU-2025-12',
        fileUrl: PLACEHOLDER_PDF,
        fileName: 'comprovante_repasse_dez2025.pdf',
        fileType: 'application/pdf',
        fileSize: 156_000,
        amount: 4_850.75,
        referenceMonth: 12,
        referenceYear: 2025,
        paidAt: '2026-01-05T10:00:00Z',
        paymentMethod: 'pix'
    },
    {
        id: 'tf-003',
        apuracaoId: 'APU-2026-01',
        fileUrl: PLACEHOLDER_PDF,
        fileName: 'comprovante_repasse_jan2026.pdf',
        fileType: 'application/pdf',
        fileSize: 162_000,
        amount: 5_230.40,
        referenceMonth: 1,
        referenceYear: 2026,
        paidAt: '2026-02-05T10:00:00Z',
        paymentMethod: 'pix'
    },
    {
        id: 'tf-004',
        apuracaoId: 'APU-2026-02',
        fileUrl: PLACEHOLDER_PDF,
        fileName: 'comprovante_repasse_fev2026.pdf',
        fileType: 'application/pdf',
        fileSize: 170_000,
        amount: 5_680.90,
        referenceMonth: 2,
        referenceYear: 2026,
        paidAt: '2026-02-27T10:00:00Z',
        paymentMethod: 'pix'
    },
    {
        id: 'tf-005',
        apuracaoId: 'APU-2026-03',
        fileUrl: PLACEHOLDER_PDF,
        fileName: 'comprovante_repasse_mar2026.pdf',
        fileType: 'application/pdf',
        fileSize: 175_000,
        amount: 6_120.00,
        referenceMonth: 3,
        referenceYear: 2026,
        paidAt: '2026-03-05T10:00:00Z',
        paymentMethod: 'transferencia'
    },
];
