export default function UserChat({ onClose, isMini = false }) {
  const iframeSrc = isMini ? "/USERCHAT.html?mini=true" : "/USERCHAT.html";

  const handleIframeLoad = (event) => {
    try {
      const iframe = event.currentTarget;
      if (!iframe?.contentWindow) return;
      const raw = localStorage.getItem('urnperiodic_chat_account');
      const account = raw ? JSON.parse(raw) : null;
      iframe.contentWindow.postMessage(
        { type: 'urnperiodic-account-sync', account },
        '*'
      );
    } catch {}
  };

  return (
    <div id="chat-workspace-container" className="relative w-full h-full flex flex-col bg-[#0c0f16] text-[#e2e8f0] overflow-hidden">
      {/* Full width/height Iframe container */}
      <div id="chat-iframe-wrapper" className="flex-1 w-full h-full bg-black">
        <iframe
          id="chat-decoy-iframe"
          src={iframeSrc}
          onLoad={handleIframeLoad}
          className="w-full h-full border-none"
          title="User Chat"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
