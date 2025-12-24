import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ConfettiEffect } from './confetti-effect';

interface SyncItem {
  id: string;
  label: string;
  icon: string;
  completed: boolean;
  failed: boolean;
}

interface SyncPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSyncing?: boolean;
  isSuccess?: boolean;
  lastSyncTime?: string;
  syncItems?: SyncItem[];
}

export function SyncPopupModal({
  isOpen,
  onClose,
  isSyncing = false,
  isSuccess = false,
  lastSyncTime,
  syncItems = [],
}: SyncPopupModalProps) {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isSuccess && !isSyncing) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isSyncing]);

  if (!isOpen) return null;

  const hasFailedItems = syncItems.some(item => item.failed);
  const allItemsCompleted = syncItems.every(item => item.completed || item.failed);

  const formatSyncTime = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const timeStr = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `Today at ${timeStr}`;
    } catch {
      return '';
    }
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} />
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <div
          className={cn(
            'w-full max-w-md pointer-events-auto rounded-2xl my-auto',
            'bg-gradient-to-br from-slate-900/95 to-slate-800/95',
            'backdrop-blur-xl border border-white/10',
            'shadow-2xl',
            'p-6 sm:p-8',
            'animate-pop',
            'flex flex-col gap-6'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center">
            {isSyncing ? (
              <div className="flex justify-center mb-4">
                <div className="relative w-12 h-12">
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full',
                      'border-4 border-transparent border-t-blue-400 border-r-blue-400',
                      'animate-spin'
                    )}
                  />
                </div>
              </div>
            ) : isSuccess && !hasFailedItems ? (
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-400 animate-bounce-in" />
              </div>
            ) : hasFailedItems ? (
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-amber-400 animate-pop" />
              </div>
            ) : null}

            <h2 className={cn(
              'text-xl sm:text-2xl font-heading font-bold',
              'text-white mb-2'
            )}>
              {isSyncing
                ? t('sync.syncing')
                : isSuccess && !hasFailedItems
                  ? t('sync.successTitle')
                  : hasFailedItems
                    ? t('sync.partialFailure')
                    : t('sync.syncStatus')}
            </h2>

            {!isSyncing && (
              <p className="text-sm text-gray-300">
                {isSuccess && !hasFailedItems
                  ? t('sync.successSubtitle')
                  : hasFailedItems
                    ? t('sync.retryMessage')
                    : t('sync.inProgress')}
              </p>
            )}
          </div>

          {/* Sync Items List */}
          <div className="space-y-2">
            {syncItems.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg',
                  'transition-all duration-500',
                  item.completed ? 'bg-green-500/15' : item.failed ? 'bg-red-500/15' : 'bg-slate-700/50',
                  !item.completed && !item.failed && 'opacity-50'
                )}
                style={{
                  animation: item.completed || item.failed ? `slideUp 0.4s ease-out 0.${index}s both` : 'none',
                }}
              >
                <div className="flex-shrink-0">
                  {item.completed && !item.failed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 animate-bounce-in" />
                  ) : item.failed ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : isSyncing ? (
                    <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-blue-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500/50" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-base">{item.icon}</span>
                    <p className={cn(
                      'text-sm font-medium truncate',
                      item.completed ? 'text-green-300' : item.failed ? 'text-red-300' : 'text-gray-200'
                    )}>
                      {item.label}
                    </p>
                  </div>
                </div>

                {item.failed && (
                  <span className="text-xs font-medium text-red-300">
                    {t('sync.failed')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Timestamp */}
          {!isSyncing && isSuccess && lastSyncTime && (
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-700">
              <Clock className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-400">
                {t('sync.lastSynced')}: {formatSyncTime(lastSyncTime)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-col sm:flex-row">
            {isSyncing ? (
              <Button
                disabled
                className="flex-1"
                size="lg"
              >
                {t('sync.syncing')}
              </Button>
            ) : isSuccess && !hasFailedItems ? (
              <Button
                onClick={onClose}
                className="flex-1"
                variant="default"
                size="lg"
              >
                {t('sync.continueButton')}
              </Button>
            ) : hasFailedItems ? (
              <>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  {t('sync.tryLater')}
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1"
                  size="lg"
                >
                  {t('sync.retrySync')}
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                {t('sync.close')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
