
import { Search, X } from 'lucide-react';

// ==================== INTERFACES ====================

interface ReportsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// ==================== COMPONENTE ====================

export function ReportsSearch({
  value,
  onChange,
  placeholder = 'Buscar relatório...'
}: ReportsSearchProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative mb-4">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-2.5
          bg-white
          border border-gray-200
          rounded-lg
          text-sm text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#525a52]/20 focus:border-[#525a52]
          transition-all duration-150
        "
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default ReportsSearch;
