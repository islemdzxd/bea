'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function DocumentViewerPage() {
  const searchParams = useSearchParams();
  const path = searchParams.get('path') ?? '';
  const token = searchParams.get('token') ?? '';
  const bridge = searchParams.get('bridge');
  const [source, setSource] = useState<string>('');
  const title = path || 'Document viewer';
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (path && token) {
      setSource(`/api/document-view?path=${encodeURIComponent(path)}&token=${encodeURIComponent(token)}`);
      return;
    }

    if (bridge) {
      // notify opener that viewer is ready to receive the document
      try {
        window.opener?.postMessage({ type: 'viewer-ready' }, '*');
      } catch (err) {
        // ignore
      }

      function onMessage(e: MessageEvent) {
        try {
          const msg = e.data;
          if (msg?.type === 'bea-document' && msg.blob) {
            const blob = msg.blob as Blob;
            const url = URL.createObjectURL(blob);
            setSource(url);
            // revoke after some time
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
          }
        } catch (err) {
          // ignore
        }
      }
      window.addEventListener('message', onMessage);
      return () => window.removeEventListener('message', onMessage);
    }
  }, [path, token, bridge]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Document viewer</p>
          <h1 className="mt-1 break-all text-lg font-semibold">
            {title || 'Aucun document à afficher'}
          </h1>
        </header>

        <section className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/40">
          {source ? (
            <iframe ref={iframeRef} title={title || 'Document'} src={source} className="h-full w-full min-h-[80vh] bg-white" />
          ) : (
            <div className="flex min-h-[80vh] items-center justify-center px-6 text-center text-sm text-white/70">
              Open a document from the back-office to view it here.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}