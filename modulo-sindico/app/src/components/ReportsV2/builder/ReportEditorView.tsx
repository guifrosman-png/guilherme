
import React from 'react';
import { Report } from '../types/report.types';

export interface ReportEditorData {
  id?: string;
  title: string;
  description: string;
  components: any[];
  metrics: any[];
}

interface ReportEditorViewProps {
  templateId?: string | null;
  existingReport?: Report | null;
  onSave?: (data: ReportEditorData) => Promise<void>;
  onCancel?: () => void;
  contextFilter?: string;
}

export function ReportEditorView({ onCancel }: ReportEditorViewProps) {
  return (
    <div className="flex flex-col h-full bg-white p-6">
      <h2 className="text-xl font-bold mb-4">Editor de Relatórios</h2>
      <p className="text-gray-500">O editor completo será implementado futuramente.</p>
      <button onClick={onCancel} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg text-sm w-fit">
        Voltar
      </button>
    </div>
  );
}
