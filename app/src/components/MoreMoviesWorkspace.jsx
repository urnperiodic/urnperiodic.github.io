export default function MoreMoviesWorkspace() {
  return (
    <div id="more-movies" className="relative w-full h-full flex flex-col bg-[#0c0f16] text-[#e2e8f0] overflow-hidden">
      {/* Full width/height Iframe container */}
      <div id="atlantic-iframe-wrapper" className="flex-1 w-full h-full bg-black">
        <iframe 
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
