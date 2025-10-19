'use client'

import { clsx } from 'clsx'
import React from 'react'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { vertexShader, fragmentShader } from '@/lib/shaders'

extend({
  ShaderMaterial: THREE.ShaderMaterial
})

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

export function GradientScene({ className, fov = 40 }: { className?: HTMLDivElement['className'], fov?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className='w-full h-full'>
      <Canvas 
        ref={canvasRef} 
        camera={{ position: [0, 0, 6], fov: fov }} 
        className={className} 
        frameloop="always"
      >
        <Sketch />
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