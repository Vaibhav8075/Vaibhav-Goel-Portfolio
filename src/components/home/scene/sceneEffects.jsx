import { useFrame, useThree } from "@react-three/fiber"
import { Center, Stars, useGLTF } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

export function BeautifulStars() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.015
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
  })

  return (
    <group ref={groupRef}>
      <Stars radius={200} depth={120} count={8000} factor={8} fade speed={0.8} />
      <Stars radius={100} depth={50} count={3000} factor={5} saturation={0} fade speed={2} />
      <Stars radius={50} depth={30} count={1000} factor={4} saturation={0} fade speed={2.5} />
    </group>
  )
}

export function ShootingStars() {
  const starsRef = useRef([])
  const [shootingStars, setShootingStars] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newStar = {
        id: Math.random(),
        startX: (Math.random() - 0.5) * 100,
        startY: Math.random() * 50 + 20,
        startZ: -Math.random() * 50 - 20,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 5 + 3,
        angle: Math.random() * 0.5 - 0.25,
      }

      setShootingStars((prev) => [...prev.slice(-5), newStar])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    starsRef.current.forEach((star, index) => {
      if (!star || !shootingStars[index]) return

      const data = shootingStars[index]
      star.position.x -= data.speed * 0.1
      star.position.y -= data.speed * 0.05 * Math.sin(data.angle)
      star.rotation.z = data.angle

      if (star.position.x < -60) {
        star.position.x = data.startX
        star.position.y = data.startY
      }
    })
  })

  return (
    <group>
      {shootingStars.map((star, index) => (
        <mesh key={star.id} ref={(el) => (starsRef.current[index] = el)} position={[star.startX, star.startY, star.startZ]}>
          <planeGeometry args={[star.length, 0.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

export function GlowingParticles() {
  const count = 400
  const particlesRef = useRef()

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 50
      values[i * 3 + 1] = (Math.random() - 0.5) * 50
      values[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return values
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return

    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    const attributePositions = particlesRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      attributePositions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#f97316" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

export function DynamicLights() {
  const light1Ref = useRef()
  const light2Ref = useRef()
  const light3Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.3) * 15
      light1Ref.current.position.z = Math.cos(t * 0.3) * 15
      light1Ref.current.intensity = Math.sin(t) * 0.5 + 1.5
    }

    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.4) * 12
      light2Ref.current.position.z = Math.sin(t * 0.4) * 12
      light2Ref.current.intensity = Math.cos(t * 1.2) * 0.3 + 1
    }

    if (light3Ref.current) {
      light3Ref.current.position.x = Math.sin(t * 0.2) * 18
      light3Ref.current.position.y = Math.cos(t * 0.2) * 5 + 8
      light3Ref.current.intensity = Math.sin(t * 0.8) * 0.4 + 0.8
    }
  })

  return (
    <>
      <pointLight ref={light1Ref} position={[15, 10, 15]} color="#f97316" intensity={1.5} distance={40} />
      <pointLight ref={light2Ref} position={[12, 8, 12]} color="#fb923c" intensity={1} distance={35} />
      <pointLight ref={light3Ref} position={[18, 8, -15]} color="#00ffff" intensity={0.8} distance={30} />
    </>
  )
}

export function CameraMotion() {
  const { camera, mouse } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    camera.position.x += (Math.sin(t * 0.1) * 1.5 - camera.position.x) * 0.02
    camera.position.y += (Math.cos(t * 0.12) * 0.8 - camera.position.y) * 0.02

    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.05

    camera.lookAt(0, 0, 0)
  })

  return null
}

export function GLBModel() {
  const { scene } = useGLTF("/model2.glb")
  const modelRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (!modelRef.current) return

    modelRef.current.rotation.y = t * 0.3
    modelRef.current.position.y = Math.sin(t * 0.8) * 0.4
  })

  return (
    <Center>
      <primitive ref={modelRef} object={scene} scale={0.03} />
    </Center>
  )
}

useGLTF.preload("/model2.glb")
