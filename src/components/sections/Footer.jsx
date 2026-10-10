import { profile } from "../../data/content";

export default function Footer() {
  return (
    <footer className="pt-12 pb-24 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="font-mono text-[10px] tracking-widest text-[#555555]">
        &copy; {new Date().getFullYear()} {profile.name.toUpperCase()}
      </div>

      <div className="flex gap-8 font-mono text-xs tracking-widest text-[#888888]">
        <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-[#EAEAEA] transition-colors duration-300">GITHUB</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#EAEAEA] transition-colors duration-300">LINKEDIN</a>
        <a href={`mailto:${profile.email}`} className="hover:text-[#EAEAEA] transition-colors duration-300">EMAIL</a>
      </div>
    </footer>
  );
}
