import { ArrowLeft, MoreHorizontal, Share2, Edit2, Pin, Building2, Settings, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { useState } from 'react';

// ==================== INTERFACES ====================

interface DashboardHeaderProps {
  title: string;
  description?: string;
  owner?: string;
  ownerAvatar?: string;
  onBack?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  onPin?: () => void;
  onSettings?: () => void;
  onFeedback?: (type: 'like' | 'dislike') => void;
  isPinned?: boolean;
}

// ==================== COMPONENTE ====================

export function DashboardHeader({
  title,
  description,
  owner = 'Sistema',
  ownerAvatar,
  onBack,
  onShare,
  onEdit,
  onPin,
  onSettings,
  onFeedback,
  isPinned = false
}: DashboardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-6 py-4">
        {/* Linha superior com navegacao */}
        <div className="flex items-center gap-4 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Titulo e Owner */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </h1>

              {/* Owner Badge */}
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <div className="h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <User className="h-3 w-3 text-zinc-500" />
                </div>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {owner}
                </span>
              </div>
            </div>
          </div>

          {/* Acoes */}
          <div className="flex items-center gap-1">
            {/* Feedback */}
            {onFeedback && (
              <div className="flex items-center gap-1 mr-2 border-r border-zinc-200 dark:border-zinc-700 pr-2">
                <button
                  onClick={() => onFeedback('like')}
                  className="p-2 rounded-lg text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                  title="Gostei"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onFeedback('dislike')}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Não gostei"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Pin */}
            {onPin && (
              <button
                onClick={onPin}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isPinned
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-950'
                    : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }
                `}
                title={isPinned ? 'Remover dos fixados' : 'Fixar'}
              >
                <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Share */}
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}

            {/* Edit */}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Editar"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}

            {/* Settings */}
            {onSettings && (
              <button
                onClick={onSettings}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Configurações"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Mais opcoes"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 py-1 z-10">
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Duplicar relatorio
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Exportar dados
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Agendar envio
                  </button>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descricao */}
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-0 max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
