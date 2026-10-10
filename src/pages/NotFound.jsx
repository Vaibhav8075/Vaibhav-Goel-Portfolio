import { ArrowLeft } from "lucide-react";
import Link from "../components/ui/Link";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col justify-center gap-6">
      <div className="font-mono text-xs tracking-[0.2em] text-white/50">404</div>
      <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
        This page doesn&apos;t exist.
      </h1>
      <Link to="/" className="self-start flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-white pb-1 border-b border-white/20 hover:border-white/60 transition-colors">
        <ArrowLeft size={14} /> Back home
      </Link>
    </section>
  );
}
