import { useState } from 'react';
import {
    X, Download, ZoomIn, ZoomOut, RotateCw,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    SindicoDocument, TransferProof,
    MONTH_NAMES, CATEGORY_LABELS, CATEGORY_COLORS
} from './types';

interface DocumentViewerProps {
    doc: SindicoDocument | TransferProof;
    onClose: () => void;
    onDownload: () => void;
    formatFileSize: (bytes: number) => string;
    formatDate: (iso: string) => string;
}

export function DocumentViewer({ doc, onClose, onDownload, formatFileSize, formatDate }: DocumentViewerProps) {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    const isImage = doc.fileType.startsWith('image/');
    const isPdf = doc.fileType === 'application/pdf';
    const hasPreview = !!doc.fileUrl && (isImage || isPdf);
    const isSindicoDoc = 'category' in doc;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);
    const handleResetView = () => { setZoom(100); setRotation(0); };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                {/* ─── HEADER/TOOLBAR ─── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-900 truncate">
                                {isSindicoDoc ? doc.description : `Repasse — ${MONTH_NAMES[doc.referenceMonth - 1]}/${doc.referenceYear}`}
                            </h3>
                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                <span className="truncate">{doc.fileName}</span>
                                <span>•</span>
                                <span>{formatFileSize(doc.fileSize)}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-3">
                        {/* Zoom Controls (Images only) */}
                        {isImage && (
                            <div className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl px-2 py-1 mr-2">
                                <button onClick={handleZoomOut} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-white transition-all">
                                    <ZoomOut className="h-4 w-4" />
                                </button>
                                <span className="text-[10px] text-gray-500 font-bold w-10 text-center">{zoom}%</span>
                                <button onClick={handleZoomIn} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-white transition-all">
                                    <ZoomIn className="h-4 w-4" />
                                </button>
                                <div className="w-px h-4 bg-gray-200 mx-1" />
                                <button onClick={handleRotate} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-white transition-all">
                                    <RotateCw className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            className={`h-9 gap-2 rounded-xl transition-all ${showInfo ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-gray-50'}`}
                            onClick={() => setShowInfo(!showInfo)}
                        >
                            {showInfo ? 'Ocultar Info' : 'Informações'}
                        </Button>

                        <Button
                            size="sm"
                            className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100"
                            onClick={onDownload}
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Baixar</span>
                        </Button>

                        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* ─── BODY ─── */}
                <div className="flex-1 flex overflow-hidden bg-gray-50/50">
                    <div className="flex-1 flex items-center justify-center overflow-auto p-6 relative">
                        {hasPreview ? (
                            <div className="w-full h-full flex items-center justify-center">
                                {isImage && (
                                    <div
                                        className="transition-transform duration-300 ease-out"
                                        style={{
                                            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                                        }}
                                    >
                                        <img
                                            src={doc.fileUrl}
                                            alt={doc.fileName}
                                            className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl bg-white select-none"
                                            draggable={false}
                                        />
                                    </div>
                                )}
                                {isPdf && (
                                    <iframe
                                        src={doc.fileUrl}
                                        title={doc.fileName}
                                        className="w-full h-full rounded-xl bg-white shadow-inner border border-gray-100"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto mb-6">
                                    <FileText className="h-12 w-12 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pré-visualização indisponível</h3>
                                <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">Este formato de arquivo não pode ser exibido diretamente pelo navegador.</p>
                                <Button
                                    size="lg"
                                    className="gap-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8"
                                    onClick={onDownload}
                                >
                                    <Download className="h-5 w-5" />
                                    Baixar Arquivo
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Side panel: Document info */}
                    {showInfo && (
                        <div className="w-80 bg-white border-l border-gray-100 overflow-y-auto flex-shrink-0 animate-in slide-in-from-right duration-300 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalhes do Arquivo</h3>
                                </div>

                                {isSindicoDoc ? (
                                    <div className="space-y-5">
                                        <InfoRow label="Categoria">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[doc.category].replace('bg-', 'bg-').replace('text-', 'text-')}`}>
                                                {CATEGORY_LABELS[doc.category]}
                                            </span>
                                        </InfoRow>
                                        <InfoRow label="Descrição">{doc.description}</InfoRow>
                                        <InfoRow label="Nome Original">{doc.fileName}</InfoRow>
                                        <InfoRow label="Tamanho">{formatFileSize(doc.fileSize)}</InfoRow>
                                        <InfoRow label="Referência">{MONTH_NAMES[doc.referenceMonth - 1]}/{doc.referenceYear}</InfoRow>
                                        <InfoRow label="Data de Envio">{formatDate(doc.uploadedAt)}</InfoRow>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        <InfoRow label="Valor do Repasse">
                                            <span className="text-2xl font-black text-emerald-600 tracking-tight">
                                                R$ {doc.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </InfoRow>
                                        <InfoRow label="Status">
                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 py-1 px-3">
                                                Confirmado
                                            </Badge>
                                        </InfoRow>
                                        <InfoRow label="Referência">{MONTH_NAMES[doc.referenceMonth - 1]}/{doc.referenceYear}</InfoRow>
                                        <InfoRow label="Pagamento">{formatDate(doc.paidAt)}</InfoRow>
                                        <InfoRow label="Método">
                                            <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-3 py-2 rounded-xl text-xs w-fit">
                                                {doc.paymentMethod === 'pix' ? 'PIX' : 'Transferência'}
                                            </div>
                                        </InfoRow>
                                        <div className="pt-4 border-t border-gray-50">
                                            <InfoRow label="ID da Apuração">
                                                <code className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{doc.apuracaoId}</code>
                                            </InfoRow>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">{label}</span>
            <div className="text-sm text-gray-900 font-medium">{children}</div>
        </div>
    );
}
