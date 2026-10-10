import Hero from "../components/sections/Hero";
import SystemProfile from "../components/sections/SystemProfile";
import EngineeringModules from "../components/sections/EngineeringModules";
import Experience from "../components/sections/Experience";
import TechStack from "../components/sections/TechStack";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-32 md:gap-48">
      <Hero />
      <SystemProfile />
      <EngineeringModules />
      <Experience />
      <TechStack />
      <Contact />
    </div>
  );
}
