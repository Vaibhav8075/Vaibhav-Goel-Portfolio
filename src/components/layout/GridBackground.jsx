export default function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0A0D14] to-[#050505]"></div>
      
      {/* Interactive Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem'
        }}
      ></div>

      {/* Cybernetic Glow Accents */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-[#00E5FF] rounded-full blur-[150px] opacity-[0.03] mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-0 w-1/3 h-[600px] bg-[#0055FF] rounded-full blur-[180px] opacity-[0.04] mix-blend-screen"></div>
      
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
}
