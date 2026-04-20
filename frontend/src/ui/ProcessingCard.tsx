export function ProcessingCard() {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
  
        {/* subtle animated glow */}
        <div className="relative">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          </div>
        </div>
  
        {/* text */}
        <p className="text-white/80 text-sm tracking-wide">
          Processing your files...
        </p>
  
      </div>
    );
  }