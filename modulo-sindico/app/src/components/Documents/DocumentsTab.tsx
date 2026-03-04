import { useState, useEffect, useRef, useCallback } from 'react';
import {
    FileText, Upload, Download, Eye, Send, Calendar, Tag,
    Search, FolderOpen, Receipt, ArrowDownToLine,
    CheckCircle2, FileImage, File, Trash2, Filter, Check,
    DownloadCloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    SindicoDocument, TransferProof, DocumentCategory,
    MONTH_NAMES, CATEGORY_LABELS, CATEGORY_COLORS
} from './types';
import { MOCK_DOCUMENTS, MOCK_TRANSFER_PROOFS } from './mockData';
import { DocumentViewer } from './DocumentViewer';

// ─── DOWNLOAD HELPER ─────────────────────────────────────
function triggerDownload(dataUrl: string, fileName: string) {
    // For large base64 strings, downloading them natively inside an href fails on many browsers.
    // The reliable way is to fetch the dataURL to a blob and download the blob object URL.
    fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        })
        .catch(err => {
            console.error("Falha ao preparar download", err);
            // Fallback to basic if fetch fails somehow
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}
// ─── MAIN COMPONENT ────────────────────────────────────────

export function DocumentsTab() {
    // Estado dos documentos
    const [documents, setDocuments] = useState<SindicoDocument[]>([]);
    const [transferProofs] = useState<TransferProof[]>(MOCK_TRANSFER_PROOFS);

    // Estado da UI
    const [activeSection, setActiveSection] = useState<'upload' | 'meus-docs' | 'repasses'>('meus-docs');
    const [previewDoc, setPreviewDoc] = useState<SindicoDocument | TransferProof | null>(null);

    // ─── FILTRO MULTI-SELEÇÃO ─────────────────────────────
    const [selectedMonths, setSelectedMonths] = useState<Set<number>>(() => {
        const currentMonth = new Date().getMonth() + 1;
        return new Set([currentMonth]);
    });
    const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
    const allMonthsSelected = selectedMonths.size === 12;

    const toggleMonth = useCallback((month: number) => {
        setSelectedMonths(prev => {
            const next = new Set(prev);
            if (next.has(month)) {
                // Não permite desmarcar todos — mantém pelo menos 1
                if (next.size > 1) {
                    next.delete(month);
                }
            } else {
                next.add(month);
            }
            return next;
        });
    }, []);

    const toggleAllMonths = useCallback(() => {
        if (allMonthsSelected) {
            // Volta pro mês atual
            setSelectedMonths(new Set([new Date().getMonth() + 1]));
        } else {
            setSelectedMonths(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
        }
    }, [allMonthsSelected]);

    // Upload form state
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('conta');
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadMonth, setUploadMonth] = useState(new Date().getMonth() + 1);
    const [uploadYear, setUploadYear] = useState(new Date().getFullYear());
    const [isDragging, setIsDragging] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<{ fileName: string; category: DocumentCategory; month: number; year: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carrega documentos do localStorage na inicialização
    // Force reload mocks if version changed
    useEffect(() => {
        const MOCK_VERSION = 'v3';
        const savedVersion = localStorage.getItem('sindico_docs_version');
        if (savedVersion !== MOCK_VERSION) {
            localStorage.removeItem('sindico_documents');
            localStorage.setItem('sindico_docs_version', MOCK_VERSION);
        }
        const saved = localStorage.getItem('sindico_documents');
        if (saved) {
            try {
                setDocuments(JSON.parse(saved));
            } catch (e) {
                console.error('Erro ao carregar documentos', e);
                setDocuments(MOCK_DOCUMENTS);
            }
        } else {
            setDocuments(MOCK_DOCUMENTS);
        }
    }, []);

    // Salva documentos no localStorage
    const saveDocuments = (docs: SindicoDocument[]) => {
        setDocuments(docs);
        try {
            // Check if size is too big, optionally clear fileUrls to save space in localStorage
            // But for simple mock, try/catch is enough to not break the UI flow
            localStorage.setItem('sindico_documents', JSON.stringify(docs));
        } catch (error) {
            console.warn('Falha ao salvar no localStorage (limite excedido?), mantendo apenas em memória.', error);
        }
    };

    // ─── HANDLERS ────────────────────────────────────────
    const handleFileChange = (file: File) => {
        setUploadFile(file);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setUploadPreview(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleSubmitDocument = () => {
        if (!uploadFile) return;

        const catSnapshot = uploadCategory;
        const monthSnapshot = uploadMonth;
        const yearSnapshot = uploadYear;
        const fileNameSnapshot = uploadFile.name;

        const reader = new FileReader();
        reader.onloadend = () => {
            try {
                // Fallback para crypto.randomUUID em HTTP/Mobile
                const genId = typeof crypto.randomUUID === 'function'
                    ? crypto.randomUUID().slice(0, 8)
                    : Math.random().toString(36).substr(2, 8);

                const newDoc: SindicoDocument = {
                    id: `doc-${genId}`,
                    fileName: fileNameSnapshot,
                    fileUrl: reader.result as string,
                    fileType: uploadFile.type,
                    fileSize: uploadFile.size,
                    category: catSnapshot,
                    description: uploadDescription || fileNameSnapshot,
                    referenceMonth: monthSnapshot,
                    referenceYear: yearSnapshot,
                    uploadedAt: new Date().toISOString()
                };

                const updated = [newDoc, ...documents];
                saveDocuments(updated);

                // Reset form imediatamente
                setUploadFile(null);
                setUploadPreview(null);
                setUploadDescription('');
                setUploadCategory('conta');

                // Mostra tela de sucesso
                setUploadSuccess({ fileName: fileNameSnapshot, category: catSnapshot, month: monthSnapshot, year: yearSnapshot });

                // Ajusta filtro para mostrar o mês do documento enviado
                setSelectedMonths(prev => {
                    const next = new Set(prev);
                    next.add(monthSnapshot);
                    return next;
                });
                setFilterYear(yearSnapshot);

                // Auto-redireciona após 3 segundos
                setTimeout(() => {
                    setUploadSuccess(null);
                    setActiveSection('meus-docs');
                }, 3000);

            } catch (err) {
                console.error("Erro no processamento do arquivo:", err);
                toast.error("Ocorreu um erro ao processar o arquivo.");
            }
        };
        reader.readAsDataURL(uploadFile);
    };

    const handleGoToDocuments = () => {
        setUploadSuccess(null);
        setActiveSection('meus-docs');
    };

    const handleDeleteDocument = (id: string) => {
        const updated = documents.filter(d => d.id !== id);
        saveDocuments(updated);
        toast.success('Documento removido.');
    };

    const handleDownload = (doc: SindicoDocument | TransferProof) => {
        const fileUrl = 'fileUrl' in doc ? doc.fileUrl : undefined;
        if (fileUrl) {
            triggerDownload(fileUrl, doc.fileName);
            toast.success('Download iniciado!', { description: doc.fileName });
        } else {
            toast.error('Arquivo não disponível para download.');
        }
    };

    const handleDownloadAll = () => {
        const items = activeSection === 'repasses' ? filteredTransfers : filteredDocuments;
        if (items.length === 0) {
            toast.error('Nenhum arquivo para baixar.');
            return;
        }
        let count = 0;
        items.forEach((item, i) => {
            if (item.fileUrl) {
                setTimeout(() => {
                    triggerDownload(item.fileUrl, item.fileName);
                    count++;
                }, i * 300);
            }
        });
        toast.success(`Baixando ${items.length} arquivo(s)...`);
    };

    // ─── FILTROS ─────────────────────────────────────────
    const filteredDocuments = documents.filter(d =>
        selectedMonths.has(d.referenceMonth) && d.referenceYear === filterYear
    );

    const filteredTransfers = transferProofs.filter(t =>
        selectedMonths.has(t.referenceMonth) && t.referenceYear === filterYear
    );

    // Stats
    const totalDocsMes = filteredDocuments.length;
    const totalContasMes = filteredDocuments.filter(d => d.category === 'conta').length;
    const totalComprovantesMes = filteredDocuments.filter(d => d.category === 'comprovante_pago').length;
    const totalRepassesMes = filteredTransfers.length;
    const totalRepasseValor = filteredTransfers.reduce((sum, t) => sum + t.amount, 0);

    // Label do filtro para o header
    const filterLabel = allMonthsSelected
        ? `Todos os meses/${filterYear}`
        : selectedMonths.size === 1
            ? `${MONTH_NAMES[[...selectedMonths][0] - 1]}/${filterYear}`
            : `${selectedMonths.size} meses/${filterYear}`;

    // ─── HELPERS ─────────────────────────────────────────
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return FileImage;
        return File;
    };

    // ─── RENDER ──────────────────────────────────────────
    return (
        <div className="space-y-5 pb-20 min-h-[600px]">

            {/* ══════════ HEADER CARD ══════════ */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 opacity-10 blur-3xl rounded-full bg-white/20" />
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 opacity-5 blur-2xl rounded-full bg-purple-300" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <FolderOpen className="h-5 w-5 text-indigo-300" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Central de Documentos</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-5">Gestão de Documentos</h2>

                    {/* Mini Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <StatCard
                            label="Documentos"
                            value={totalDocsMes.toString()}
                            sublabel={filterLabel}
                        />
                        <StatCard
                            label="Contas Enviadas"
                            value={totalContasMes.toString()}
                            sublabel="Para apuração"
                        />
                        <StatCard
                            label="Comprovantes"
                            value={totalComprovantesMes.toString()}
                            sublabel="Pagos pelo síndico"
                        />
                        <StatCard
                            label="Repasses Recebidos"
                            value={totalRepassesMes > 0 ? `R$ ${totalRepasseValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                            sublabel={totalRepassesMes > 0 ? `${totalRepassesMes} comprovante(s)` : 'Nenhum neste período'}
                        />
                    </div>
                </div>
            </div>

            {/* ══════════ NAVEGAÇÃO (3 SEÇÕES) ══════════ */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <TabButton
                        active={activeSection === 'meus-docs'}
                        icon={FileText}
                        label="Meus Documentos"
                        count={totalDocsMes}
                        onClick={() => setActiveSection('meus-docs')}
                    />
                    <TabButton
                        active={activeSection === 'repasses'}
                        icon={Receipt}
                        label="Comprovantes de Repasse"
                        count={totalRepassesMes}
                        onClick={() => setActiveSection('repasses')}
                    />
                    <TabButton
                        active={activeSection === 'upload'}
                        icon={Upload}
                        label="Enviar Documento"
                        onClick={() => setActiveSection('upload')}
                    />
                </div>

                {/* ══════════ FILTRO MULTI-SELEÇÃO ══════════ */}
                {activeSection !== 'upload' && (
                    <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-100 space-y-3">
                        {/* Linha 1: Ano + Todos */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar:</span>
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(Number(e.target.value))}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                            >
                                {[2025, 2026, 2027].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <button
                                onClick={toggleAllMonths}
                                className={`
                                    text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                                    ${allMonthsSelected
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                                    }
                                `}
                            >
                                {allMonthsSelected ? '✓ Todos' : 'Todos'}
                            </button>
                        </div>

                        {/* Linha 2: Chips de meses */}
                        <div className="flex flex-wrap gap-1.5">
                            {MONTH_NAMES.map((name, i) => {
                                const month = i + 1;
                                const isSelected = selectedMonths.has(month);
                                return (
                                    <button
                                        key={month}
                                        onClick={() => toggleMonth(month)}
                                        className={`
                                            text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all
                                            ${isSelected
                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-100'
                                                : 'bg-white text-gray-400 border-gray-200 hover:text-gray-600 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        {isSelected && <Check className="h-3 w-3 inline mr-0.5 -mt-0.5" />}
                                        {name.slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ══════════ CONTEÚDO DA SEÇÃO ══════════ */}
                <div className="p-5">

                    {/* ─── SEÇÃO: MEUS DOCUMENTOS ─── */}
                    {activeSection === 'meus-docs' && (
                        <div className="space-y-3">
                            {/* Barra de ações: Baixar Todos */}
                            {filteredDocuments.length > 0 && (
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs text-gray-400">
                                        {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs h-8"
                                        onClick={handleDownloadAll}
                                    >
                                        <DownloadCloud className="h-3.5 w-3.5" />
                                        Baixar Todos
                                    </Button>
                                </div>
                            )}

                            {filteredDocuments.length === 0 ? (
                                <EmptyState
                                    icon={FileText}
                                    title="Nenhum documento encontrado"
                                    subtitle={`Não há documentos registrados para o período selecionado em ${filterYear}`}
                                    action={
                                        <Button
                                            variant="outline"
                                            className="mt-3 gap-2"
                                            onClick={() => setActiveSection('upload')}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Enviar Primeiro Documento
                                        </Button>
                                    }
                                />
                            ) : (
                                filteredDocuments.map(doc => (
                                    <DocumentCard
                                        key={doc.id}
                                        doc={doc}
                                        onPreview={() => setPreviewDoc(doc)}
                                        onDelete={() => handleDeleteDocument(doc.id)}
                                        onDownload={() => handleDownload(doc)}
                                        formatFileSize={formatFileSize}
                                        formatDate={formatDate}
                                        getFileIcon={getFileIcon}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {/* ─── SEÇÃO: COMPROVANTES DE REPASSE ─── */}
                    {activeSection === 'repasses' && (
                        <div className="space-y-3">
                            {/* Barra de ações: Baixar Todos */}
                            {filteredTransfers.length > 0 && (
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs text-gray-400">
                                        {filteredTransfers.length} comprovante{filteredTransfers.length !== 1 ? 's' : ''}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs h-8"
                                        onClick={handleDownloadAll}
                                    >
                                        <DownloadCloud className="h-3.5 w-3.5" />
                                        Baixar Todos
                                    </Button>
                                </div>
                            )}

                            {filteredTransfers.length === 0 ? (
                                <EmptyState
                                    icon={Receipt}
                                    title="Nenhum repasse encontrado"
                                    subtitle={`Não há comprovantes de repasse para o período selecionado em ${filterYear}`}
                                />
                            ) : (
                                filteredTransfers.map(proof => (
                                    <TransferCard
                                        key={proof.id}
                                        proof={proof}
                                        onPreview={() => setPreviewDoc(proof)}
                                        onDownload={() => handleDownload(proof)}
                                        formatFileSize={formatFileSize}
                                        formatDate={formatDate}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {/* ─── SEÇÃO: UPLOAD ─── */}
                    {activeSection === 'upload' && (
                        <div className="max-w-2xl mx-auto space-y-5">

                            {/* ═══ TELA DE SUCESSO ═══ */}
                            {uploadSuccess ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                                    {/* Ícone verde grande com animação */}
                                    <div className="relative mb-6">
                                        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center animate-in zoom-in duration-500">
                                            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                                        </div>
                                        <div className="absolute -inset-2 rounded-full border-2 border-emerald-200 animate-ping opacity-30" />
                                    </div>

                                    <h3 className="text-xl font-bold text-emerald-700 mb-2">Documento Enviado!</h3>
                                    <p className="text-sm text-gray-500 mb-4 max-w-sm">
                                        Seu documento foi salvo com sucesso e já está disponível na sua lista.
                                    </p>

                                    {/* Resumo do que foi enviado */}
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 w-full max-w-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-sm font-semibold text-emerald-800 truncate">{uploadSuccess.fileName}</p>
                                                <p className="text-xs text-emerald-600">
                                                    {CATEGORY_LABELS[uploadSuccess.category]} • {MONTH_NAMES[uploadSuccess.month - 1]}/{uploadSuccess.year}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                                            onClick={handleGoToDocuments}
                                        >
                                            <FileText className="h-4 w-4" />
                                            Ver Meus Documentos
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => setUploadSuccess(null)}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Enviar Outro
                                        </Button>
                                    </div>

                                    {/* Timer visual */}
                                    <p className="text-[11px] text-gray-400 mt-5">Redirecionando automaticamente em instantes...</p>
                                </div>
                            ) : (
                                /* ═══ FORMULÁRIO DE UPLOAD ═══ */
                                <>
                                    {/* Drop Zone */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                                            ${isDragging
                                                ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                                                : uploadFile
                                                    ? 'border-emerald-300 bg-emerald-50'
                                                    : 'border-gray-300 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/50'
                                            }
                                        `}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileChange(file);
                                            }}
                                        />

                                        {uploadFile ? (
                                            <div className="flex flex-col items-center gap-3">
                                                {uploadPreview ? (
                                                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-emerald-200 shadow-md">
                                                        <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                        <File className="h-8 w-8 text-emerald-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                                                    <p className="text-sm font-semibold text-emerald-700">{uploadFile.name}</p>
                                                    <p className="text-xs text-emerald-500">{formatFileSize(uploadFile.size)} • Clique para trocar</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                                    <Upload className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-600">Arraste e solte seu arquivo aqui</p>
                                                    <p className="text-xs text-gray-400 mt-1">ou clique para selecionar • PDF, JPG, PNG</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Tipo de Documento */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-gray-700 ml-1">
                                                <Tag className="h-3.5 w-3.5 inline mr-1.5 text-gray-400" />
                                                Tipo de Documento
                                            </label>
                                            <div className="flex flex-col gap-2">
                                                {(['conta', 'comprovante_pago', 'outros'] as DocumentCategory[]).map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setUploadCategory(cat)}
                                                        className={`
                                                            flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left
                                                            ${uploadCategory === cat
                                                                ? `ring-2 ring-indigo-200 ${CATEGORY_COLORS[cat]}`
                                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                                            }
                                                        `}
                                                    >
                                                        {cat === 'conta' && <FileText className="h-4 w-4 flex-shrink-0" />}
                                                        {cat === 'comprovante_pago' && <Receipt className="h-4 w-4 flex-shrink-0" />}
                                                        {cat === 'outros' && <FolderOpen className="h-4 w-4 flex-shrink-0" />}
                                                        <div>
                                                            <span className="block">{CATEGORY_LABELS[cat]}</span>
                                                            <span className="block text-[11px] opacity-70 font-normal mt-0.5">
                                                                {cat === 'conta' && 'Luz, água, gás, internet...'}
                                                                {cat === 'comprovante_pago' && 'PIX, transferência, boleto...'}
                                                                {cat === 'outros' && 'Recibos de festas, manutenções...'}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mês/Ano + Descrição */}
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-sm font-semibold text-gray-700 ml-1">
                                                    <Calendar className="h-3.5 w-3.5 inline mr-1.5 text-gray-400" />
                                                    Mês de Referência
                                                </label>
                                                <div className="flex gap-2">
                                                    <select
                                                        value={uploadMonth}
                                                        onChange={(e) => setUploadMonth(Number(e.target.value))}
                                                        className="flex-1 rounded-xl border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm h-12 px-4 outline-none bg-white transition-all"
                                                    >
                                                        {MONTH_NAMES.map((name, i) => (
                                                            <option key={i} value={i + 1}>{name}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={uploadYear}
                                                        onChange={(e) => setUploadYear(Number(e.target.value))}
                                                        className="w-28 rounded-xl border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm h-12 px-4 outline-none bg-white transition-all"
                                                    >
                                                        {[2025, 2026, 2027].map(y => (
                                                            <option key={y} value={y}>{y}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-sm font-semibold text-gray-700 ml-1">
                                                    <Search className="h-3.5 w-3.5 inline mr-1.5 text-gray-400" />
                                                    Descrição
                                                </label>
                                                <textarea
                                                    className="w-full rounded-xl border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm min-h-[100px] p-4 outline-none transition-all resize-none"
                                                    placeholder="Ex: Conta de energia elétrica - CPFL"
                                                    value={uploadDescription}
                                                    onChange={(e) => setUploadDescription(e.target.value)}
                                                />
                                            </div>

                                            <Button
                                                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 h-12 text-sm font-semibold shadow-xl shadow-indigo-300/40 disabled:opacity-40 disabled:shadow-none transition-all"
                                                onClick={handleSubmitDocument}
                                                disabled={!uploadFile}
                                            >
                                                <Send className="h-4 w-4" />
                                                Enviar Documento
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* ══════════ DOCUMENT VIEWER ══════════ */}
            {previewDoc && (
                <DocumentViewer
                    doc={previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    onDownload={() => handleDownload(previewDoc)}
                    formatFileSize={formatFileSize}
                    formatDate={formatDate}
                />
            )}

        </div>
    );
}

// ─── SUB-COMPONENTES ──────────────────────────────────────

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
    return (
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 transition-all hover:bg-white/15 hover:scale-[1.02]">
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1.5">{label}</p>
            <p className="text-xl font-bold text-white leading-tight">{value}</p>
            <p className="text-[11px] text-indigo-200/70 mt-1">{sublabel}</p>
        </div>
    );
}

function TabButton({ active, icon: Icon, label, count, onClick }: {
    active: boolean; icon: any; label: string; count?: number; onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition-all border-b-2
                ${active
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
            `}
        >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
            {count !== undefined && (
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center
                    ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}
                `}>
                    {count}
                </span>
            )}
        </button>
    );
}

function DocumentCard({ doc, onPreview, onDelete, onDownload, formatFileSize, formatDate, getFileIcon }: {
    doc: SindicoDocument;
    onPreview: () => void;
    onDelete: () => void;
    onDownload: () => void;
    formatFileSize: (b: number) => string;
    formatDate: (s: string) => string;
    getFileIcon: (t: string) => any;
}) {
    const FileIcon = getFileIcon(doc.fileType);

    return (
        <div className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
            onClick={onPreview}
        >
            {/* Ícone do tipo de arquivo */}
            <div className={`
                h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 mt-0.5
                ${doc.category === 'conta'
                    ? 'bg-amber-50 text-amber-600'
                    : doc.category === 'comprovante_pago'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-blue-50 text-blue-600'
                }
            `}>
                <FileIcon className="h-6 w-6" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {doc.description}
                </h4>
                <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${CATEGORY_COLORS[doc.category]}`}>
                        {CATEGORY_LABELS[doc.category]}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{MONTH_NAMES[doc.referenceMonth - 1] ?? 'Mês'}/{doc.referenceYear}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{formatFileSize(doc.fileSize)}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{doc.fileName}</p>
            </div>

            {/* Data + Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs text-gray-400 hidden lg:block mr-1">{formatDate(doc.uploadedAt)}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Baixar"
                >
                    <Download className="h-4 w-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onPreview(); }}
                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Visualizar"
                >
                    <Eye className="h-4 w-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Remover"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function TransferCard({ proof, onPreview, onDownload, formatFileSize, formatDate }: {
    proof: TransferProof;
    onPreview: () => void;
    onDownload: () => void;
    formatFileSize: (b: number) => string;
    formatDate: (s: string) => string;
}) {
    return (
        <div
            className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer"
            onClick={onPreview}
        >
            {/* Ícone */}
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 mt-0.5">
                <ArrowDownToLine className="h-6 w-6" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    Repasse — {MONTH_NAMES[proof.referenceMonth - 1] ?? 'Mês'}/{proof.referenceYear}
                </h4>
                <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-bold uppercase px-2 py-0.5">
                        {proof.paymentMethod === 'pix' ? 'PIX' : proof.paymentMethod === 'transferencia' ? 'TED' : 'Boleto'}
                    </Badge>
                    <span className="text-gray-300">•</span>
                    <span className="font-mono text-[11px] text-gray-400">{proof.apuracaoId}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{formatFileSize(proof.fileSize)}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{proof.fileName}</p>
            </div>

            {/* Valor + Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                    <p className="text-base font-bold text-emerald-600">
                        R$ {proof.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-gray-400">{formatDate(proof.paidAt)}</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Baixar"
                >
                    <Download className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, subtitle, action }: {
    icon: any; title: string; subtitle: string; action?: React.ReactNode;
}) {
    return (
        <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-5 shadow-inner">
                <Icon className="h-9 w-9 text-gray-300" />
            </div>
            <h4 className="text-base font-semibold text-gray-500 mb-1">{title}</h4>
            <p className="text-sm text-gray-400 max-w-xs">{subtitle}</p>
            {action}
        </div>
    );
}

