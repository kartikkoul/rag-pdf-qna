export default function GLobalLoader({text} : {text:string}) {
    return (
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black">
  
        <div className="relative w-32 h-32">
          
          {/* Orbit path */}
          <div className="absolute inset-0 rounded-full border border-teal-400/20" />
  
          {/* Orbiting particle */}
          <div className="absolute inset-0 animate-spin">
            <div className="w-3 h-3 bg-teal-300 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
          </div>
  
          {/* Center core */}
          <div className="absolute inset-6 rounded-full bg-teal-400/80 backdrop-blur-md shadow-[0_0_40px_rgba(45,212,191,0.6)] animate-pulse" />
        </div>

        {/* Text */}
        <div className="mt-10 text-sm tracking-wide text-zinc-400 animate-pulse">
                {text}
        </div>
  
      </div>
    );
}