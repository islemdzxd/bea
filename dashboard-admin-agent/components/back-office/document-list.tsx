'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, Download, Loader2, Image as ImageIcon, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { adminFetchBlob } from '@/lib/bea-admin-api';
import type { RequestDocument } from '@/lib/types';

function resolveDocumentUrl(doc: RequestDocument) {
  return doc.downloadUrl || doc.url || '';
}

function isPdf(doc: RequestDocument) {
  const type = `${doc.contentType || ''}`.toLowerCase();
  const fileName = doc.fileName.toLowerCase();
  return type.includes('pdf') || fileName.endsWith('.pdf');
}

function isImage(doc: RequestDocument) {
  const type = `${doc.contentType || ''}`.toLowerCase();
  const fileName = doc.fileName.toLowerCase();
  return (
    type.startsWith('image/') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.webp')
  );
}

export function DocumentList({ documents }: Readonly<{ documents: RequestDocument[] }>) {
  const [selectedDocument, setSelectedDocument] = useState<RequestDocument | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewKind = useMemo(() => {
    if (!selectedDocument) {
      return 'empty';
    }
    if (isPdf(selectedDocument)) {
      return 'pdf';
    }
    if (isImage(selectedDocument)) {
      return 'image';
    }
    return 'other';
  }, [selectedDocument]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedDocument(null);
    setLoading(false);
    setError('');
  };

  const openPreview = async (doc: RequestDocument) => {
    const documentUrl = resolveDocumentUrl(doc);
    if (!documentUrl) {
      setSelectedDocument(doc);
      setError('Le document est introuvable pour ce dossier.');
      setLoading(false);
      setPreviewUrl(null);
      return;
    }

    setSelectedDocument(doc);
    setError('');
    setLoading(true);

    try {
      const blob = await adminFetchBlob(documentUrl);
      const url = URL.createObjectURL(blob);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(url);
    } catch (err) {
      setPreviewUrl(null);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du document');
    } finally {
      setLoading(false);
    }
  };

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aucun document transmis.</p>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {documents.map((doc) => {
          const documentUrl = resolveDocumentUrl(doc);
          return (
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
                disabled={!documentUrl}
                onClick={() => {
                  void openPreview(doc);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Consulter
              </Button>
            </li>
          );
        })}
      </ul>

      <Dialog open={selectedDocument !== null} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.label || 'Document'}</DialogTitle>
          </DialogHeader>

          {loading && (
            <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Chargement du document…
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && selectedDocument && previewUrl && previewKind === 'image' && (
            <div className="overflow-auto rounded-xl border bg-white p-2">
              <img
                src={previewUrl}
                alt={selectedDocument.label}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>
          )}

          {!loading && !error && selectedDocument && previewUrl && previewKind === 'pdf' && (
            <iframe
              title={selectedDocument.label}
              src={previewUrl}
              className="min-h-[80vh] w-full rounded-xl border bg-white"
            />
          )}

          {!loading && !error && selectedDocument && previewUrl && previewKind === 'other' && (
            <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <p>Ce format de fichier n’est pas prévisualisable dans le navigateur.</p>
              <a
                className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ouvrir le fichier
              </a>
            </div>
          )}

          {!loading && !error && !previewUrl && selectedDocument && (
            <div className="flex min-h-[30vh] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
              Le document est vide ou indisponible.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
