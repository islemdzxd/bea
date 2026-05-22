import { formatDateTime } from '@/lib/format';
import type { AuditEntry } from '@/lib/types';

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );

  return (
    <ol className="space-y-3">
      {sorted.map((entry) => (
        <li
          key={entry.id}
          className="rounded-lg border border-border bg-card px-4 py-3"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{entry.action}</p>
            <time className="text-xs text-muted-foreground">
              {formatDateTime(entry.at)}
            </time>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Par {entry.by}</p>
          {entry.detail && (
            <p className="text-sm text-foreground mt-2">{entry.detail}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
