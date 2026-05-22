'use client';

import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminDownload } from '@/lib/bea-admin-api';
import type { RequestDocument } from '@/lib/types';

export function DocumentList({ documents }: { documents: RequestDocument[] }) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aucun document transmis.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {doc.label}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {doc.fileName}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => {
              const path =
                'downloadUrl' in doc && typeof doc.downloadUrl === 'string'
                  ? doc.downloadUrl
                  : null;
              if (path) {
                adminDownload(path).catch((e) =>
                  alert(e instanceof Error ? e.message : 'Téléchargement impossible')
                );
              }
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Consulter
          </Button>
        </li>
      ))}
    </ul>
  );
}
