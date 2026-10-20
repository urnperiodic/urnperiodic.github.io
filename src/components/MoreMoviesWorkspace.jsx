import { useState, useRef } from 'react';
import { Film, RotateCcw, Maximize, Minimize, ExternalLink, ArrowLeft } from 'lucide-react';

export default function MoreMoviesWorkspace({ onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleReload = () => {
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 50);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const openInBlank = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        win.document.title = 'Google Drive';
        const link = win.document.createElement('link');
        link.rel = 'icon';
        link.href = 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
        win.document.head.appendChild(link);

        const iframe = win.document.createElement('iframe');
        iframe.src = 'https://atlantic.st';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
        win.document.body.style.margin = '0';
        win.document.body.style.overflow = 'hidden';
        win.document.body.appendChild(iframe);
      }
    } catch {
      window.open('https://atlantic.st', '_blank');
    }
  };

  return (
    <div 
      ref={containerRef}
      id="more-movies-workspace" 
      className="relative w-full h-full flex flex-col bg-[#0c0f16] text-[#e2e8f0] overflow-hidden rounded-xl border border-[var(--card-border)]/60 shadow-xl"
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0d14] border-b border-[var(--card-border)]/40 text-xs select-none shrink-0">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="Back to games"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[11px]">Back</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 font-mono font-bold text-[12px] text-[var(--accent-color)]">
            <Film className="w-4 h-4" />
            <span>More Movies</span>
            <span className="text-[10px] text-neutral-400 font-normal hidden sm:inline">• Atlantic.st</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReload}
            type="button"
            className="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reload Atlantic"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            type="button"
            className="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={openInBlank}
            type="button"
            className="px-2 py-1 rounded-md text-neutral-300 hover:text-white hover:bg-[var(--accent-color)] hover:text-black transition-all flex items-center gap-1 text-[11px] font-mono cursor-pointer"
            title="Open Atlantic in about:blank cloaked tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cloak</span>
          </button>
        </div>
      </div>

      {/* Full width/height Iframe container */}
      <div id="atlantic-iframe-wrapper" className="flex-1 w-full h-full bg-black relative">
        <iframe 
          ref={iframeRef}
          id="atlantic-movies-iframe"
          src="https://atlantic.st" 
          className="w-full h-full border-none"
          title="More Movies - Atlantic"
          allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
