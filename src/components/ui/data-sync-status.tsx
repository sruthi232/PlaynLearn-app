import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface DataSyncStatusProps {
  className?: string;
}

export function DataSyncStatus({ className }: DataSyncStatusProps) {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Load last sync time from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('last_sync_time');
    if (saved) {
      setLastSyncTime(saved);
    }
  }, []);

  const formatSyncTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins === 0) return t('sync.justNow');
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      // Format as "Today, HH:MM AM/PM" or "Date, HH:MM AM/PM"
      const timeStr = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (
        date.toDateString() === now.toDateString()
      ) {
        return `Today, ${timeStr}`;
      }

      const dateStr = date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
      return `${dateStr}, ${timeStr}`;
    } catch {
      return t('sync.unknown');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    try {
      // Simulate sync operation (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const now = new Date().toISOString();
      localStorage.setItem('last_sync_time', now);
      setLastSyncTime(now);
      setSyncSuccess(true);

      // Show success message for 3-5 seconds
      setTimeout(() => {
        setSyncSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const displayText = syncSuccess
    ? t('sync.syncedUpToDate')
    : isSyncing
      ? t('sync.syncing')
      : lastSyncTime
        ? `${t('sync.lastSynced')}: ${formatSyncTime(lastSyncTime)}`
        : t('sync.readyToSync');

  const textColor = syncSuccess
    ? 'text-green-500'
    : 'text-muted-foreground';

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2 sm:px-3',
        'h-10 rounded-lg',
        'text-xs sm:text-sm font-medium',
        'transition-all duration-200',
        'hover:bg-muted/50 disabled:opacity-70',
        'text-muted-foreground',
        className
      )}
      aria-label="Sync data"
    >
      <RefreshCw
        className={cn(
          'h-4 w-4 flex-shrink-0',
          isSyncing && 'animate-spin',
          syncSuccess && 'text-green-500'
        )}
      />
      <span className={cn('hidden sm:inline whitespace-nowrap', textColor)}>
        {displayText}
      </span>
    </button>
  );
}
