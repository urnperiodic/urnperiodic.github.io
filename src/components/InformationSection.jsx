import { Info, ExternalLink, ShieldCheck, Mail, Globe } from 'lucide-react';

const InformationSection = ({ onClose }) => {
  return (
    <div className="flex flex-col w-full h-full animate-fade-in bg-[var(--bg-secondary)] overflow-y-auto p-6 md:p-10">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[var(--accent-color)] text-[var(--bg-color)] shadow-lg shadow-[var(--accent-color)]/20">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)]">Information Hub</h1>
              <p className="text-sm text-[var(--text-muted)] font-medium">Learn more about our platform and resources</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer border border-white/5"
          >
            <span className="text-xs font-bold uppercase px-2">Back to Games</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[var(--accent-color)]" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wide">About Platform</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Our platform is dedicated to providing high-quality, unblocked entertainment and educational resources. 
              We curate a wide range of content from arcades and simulators to interactive learning tools, 
              ensuring accessibility across various environments.
            </p>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-[var(--accent-color)]" />
              <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wide">Privacy & Safety</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              We prioritize user safety and privacy. Our platform uses local storage for personal preferences 
              and does not track sensitive information. All third-party resources are vetted for quality and 
              appropriateness within school and work settings.
            </p>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 mb-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Mail className="w-32 h-32 text-[var(--accent-color)]" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase">Connect With Us</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6 max-w-lg">
              Have questions, feedback, or need to report an issue? Our team is here to help you get the best 
              possible experience on the platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => window.open('https://forms.gle/qJt9X8225t6y2s6G7', '_blank')}
                className="flex items-center gap-2 py-3 px-6 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] font-bold text-sm uppercase transition-transform active:scale-95 shadow-lg shadow-[var(--accent-color)]/20 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Contact Form
              </button>
              <div className="flex items-center gap-2 py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] font-mono text-sm">
                <Mail className="w-4 h-4 opacity-50" />
                support@platform.xyz
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-10 opacity-30">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
            v3.2.0-stable • Internal Resource Network
          </p>
        </div>
      </div>
    </div>
  );
};

export default InformationSection;
