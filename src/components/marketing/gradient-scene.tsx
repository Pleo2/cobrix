'use client'

import { clsx } from 'clsx'
import React from 'react'
import { useRef, useEffect, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { vertexShader, fragmentShader } from '@/lib/shaders'
import { useAnimations, useFBX } from '@react-three/drei'

extend({
  ShaderMaterial: THREE.ShaderMaterial
})

interface AnimationActionWithUserData extends THREE.AnimationAction {
  userData?: {
    loopStart?: number
    loopEnd?: number
  }
}

const pallete = [
  "#00ff1f",        // green
  "#009aff",        // blue
  "#00bcb4",         // teal
  "#b9ffe5",        // greenish-white
  "#e0f4ff",        // bluish-white
  "#00bcb4"         // teal
].map(color => {
  const threeColor = new THREE.Color(color);
  threeColor.offsetHSL(0, 0, 0.1);
  return threeColor;
});

function Sketch() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    uColor: { value: pallete },
    resolution: { value: new THREE.Vector4(size.width, size.height, 1, 1) },
  }), [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[10, 10, 300, 300]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

function HummingbirdModel(props: React.ComponentProps<'group'>) {
  const group = useRef<THREE.Group>(null)
  const fbx = useFBX('/models/hummingbird.fbx')
  const { actions, names } = useAnimations(fbx.animations, group)
  const mousePos = useRef({ x: 0, y: 0 })

  const matcapTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load('https://raw.githubusercontent.com/nidorx/matcaps/master/512/537387_75BBB9_152E5B_0E85E8-512px.png')
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (fbx && matcapTexture) {
      fbx.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture,
          })
        }
      })
    }
  }, [fbx, matcapTexture])

  useEffect(() => {
    if (names.length > 0 && names[0]) {
      const action = actions[names[0]]
      if (action) {
        action.setLoop(THREE.LoopRepeat, Infinity)
        action.clampWhenFinished = false
        action.reset().play()
        action.time = 6.1

        const actionWithUserData = action as AnimationActionWithUserData
        if (!actionWithUserData.userData) {
          actionWithUserData.userData = {}
        }
        actionWithUserData.userData.loopStart = 6.0
        actionWithUserData.userData.loopEnd = 12.0
      }
    }
    return () => {
      Object.values(actions).forEach(action => action?.stop())
    }
  }, [actions, names])

  useFrame(() => {
    if (group.current) {
      const isSmallScreen = window.innerWidth < 1024

      const rotationInfluence = isSmallScreen ? 0 : 0.15
      const rotationY = mousePos.current.x * rotationInfluence
      const rotationX = -mousePos.current.y * rotationInfluence * (isSmallScreen ? 0 : 0.6)

      const baseRotationY = isSmallScreen ? -Math.PI / 22 : -Math.PI / 7
      group.current.rotation.y = baseRotationY + rotationY
      group.current.rotation.x = rotationX

      const baseX = isSmallScreen ? 0 : 1
      const baseY = isSmallScreen ? -0.2 : -0.75
      const baseZ = isSmallScreen ? 0.8 : 1.1

      const moveX = mousePos.current.x * (isSmallScreen ? 0.1 : 0.15)
      const moveY = mousePos.current.y * (isSmallScreen ? 0.08 : 0.12)

      const cosY = Math.cos(rotationY)
      const sinY = Math.sin(rotationY)

      group.current.position.x = baseX + moveX * cosY - moveY * sinY * 0.4
      group.current.position.y = baseY + moveY * 0.9
      group.current.position.z = baseZ + moveX * sinY * 0.3

      const scale = isSmallScreen ? 0.00008 : 0.000109
      group.current.scale.setScalar(scale)
    }

    if (names.length > 0 && names[0]) {
      const action = actions[names[0]]
      if (action && action.isRunning()) {
        const actionWithUserData = action as AnimationActionWithUserData
        if (actionWithUserData.userData?.loopStart !== undefined && actionWithUserData.userData?.loopEnd !== undefined) {
          if (action.time >= actionWithUserData.userData.loopEnd) {
            action.time = actionWithUserData.userData.loopStart
          }
        }
      }
    }
  })

  return (
    <primitive ref={group} object={fbx} {...props} />
  )
}

export function GradientScene({ className, fov = 40 }: { className?: HTMLDivElement['className'], fov?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className='w-full h-full'>
      <Canvas ref={canvasRef} camera={{ position: [0, 0, 6], fov: fov }} className={className} frameloop="always">
        <Sketch />
        <Suspense fallback={null}>
          <HummingbirdModel />
        </Suspense>
        <ambientLight intensity={0.6} />
        <directionalLight position={[0.5, 0, 0.866]} intensity={0.5} />
        <pointLight position={[2, 1, 1]} intensity={0.4} color="#fff1be" />
        <pointLight position={[-2, 1, 1]} intensity={0.4} color="#ee87cb" />
      </Canvas>
    </div>
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-[36rem] transform-gpu md:right-0',
          'bg-linear-115 from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff]',
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}