import LaunchLoadingScreen from "./scene/LaunchLoadingScreen"
import SpaceScene from "./scene/SpaceScene"
import HeroStyles from "./HeroStyles"
import HomeSection from "./sections/HomeSection"
import AboutSection from "./sections/AboutSection"
import SkillsSection from "./sections/SkillsSection"
import ExperienceSection from "./sections/ExperienceSection"
import ProjectsSection from "./sections/ProjectsSection"
import Reachout from "../contact/Reachout"

export default function Hero() {
  return (
    <>
      <LaunchLoadingScreen />
      <SpaceScene />

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <HeroStyles />
        <HomeSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <Reachout />
      </div>
    </>
  )
}
