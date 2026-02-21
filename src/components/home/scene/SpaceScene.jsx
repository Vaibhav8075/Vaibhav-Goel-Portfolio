import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import * as THREE from "three"
import {
  BeautifulStars,
  CameraMotion,
  DynamicLights,
  GLBModel,
  GlowingParticles,
  ShootingStars,
} from "./sceneEffects"

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#000000", 15, 60]} />
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.2} />
      <DynamicLights />
      <spotLight position={[0, 15, 0]} angle={0.5} penumbra={1} intensity={1.5} color="#ffffff" />
      <pointLight position={[-20, 5, -20]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[20, 5, -20]} intensity={0.5} color="#ec4899" />

      <Suspense fallback={null}>
        <BeautifulStars />
        <ShootingStars />
        <GlowingParticles />
        <GLBModel />
      </Suspense>

      <CameraMotion />
    </>
  )
}

export default function SpaceScene() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping }}>
        <Scene />
      </Canvas>
    </div>
  )
}
