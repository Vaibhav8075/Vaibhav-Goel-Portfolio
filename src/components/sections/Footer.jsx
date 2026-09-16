export default function Footer() {
  return (
    <footer className="py-12 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="font-mono text-[10px] tracking-widest text-[#555555]">
        © {new Date().getFullYear()}
      </div>
      
      <div className="flex gap-8 font-mono text-xs tracking-widest text-[#888888]">
        <a href="https://github.com/Vaibhav8075" target="_blank" rel="noreferrer" className="hover:text-[#EAEAEA] transition-colors duration-300">GITHUB</a>
        <a href="https://www.linkedin.com/in/vaibhav-goel-23983b344" target="_blank" rel="noreferrer" className="hover:text-[#EAEAEA] transition-colors duration-300">LINKEDIN</a>
        <a href="mailto:vaibhav.goel0531@gmail.com" className="hover:text-[#EAEAEA] transition-colors duration-300">EMAIL</a>
      </div>
    </footer>
  );
}
