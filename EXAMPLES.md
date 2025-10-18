# Hummingbird Integration Examples

## Example 1: Basic Usage (Current Setup)

```tsx
// src/app/(main)/page.tsx
import { GradientSceneWithHummingbird } from "@/components/marketing/gradient-scene"

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <GradientSceneWithHummingbird className="rounded-4xl" />
      </div>
    </div>
  )
}
```

## Example 2: Customizing Flight Speed

```tsx
// In src/components/marketing/gradient-scene.tsx
// Inside HummingbirdModel useFrame:

const t = clock.getElapsedTime()
const radius = 0.8
const speed = 1.0  // Double the speed for more dynamic flight

group.current.position.x = Math.cos(t * speed) * radius
group.current.position.z = Math.sin(t * speed) * radius
```

## Example 3: Multiple Birds Flying

```tsx
// Create a new component
function MultipleHummingbirds() {
  return (
    <>
      <HummingbirdModel scale={1.2} />
      <HummingbirdModel scale={0.8} position={[-0.5, 0, 0]} />
      <HummingbirdModel scale={1.0} position={[0.5, 0.5, -0.5]} />
    </>
  )
}

// Use in GradientSceneWithHummingbird instead of single HummingbirdModel
```

## Example 4: Mouse-Controlled Camera

```tsx
// In GradientSceneWithHummingbird component
import { PerspectiveCamera } from '@react-three/drei'

function CameraController() {
  useFrame((state) => {
    state.camera.position.x = Math.sin(mouse.x * Math.PI) * 2
    state.camera.position.y = 0.5 + Math.cos(mouse.y * Math.PI) * 0.5
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

// Use it in canvas
<CameraController />
```

## Example 5: Custom Animation Clip

```tsx
// Play specific animation from FBX if available
function HummingbirdModel() {
  const group = useRef(null)
  const fbx = useLoader(FBXLoader, '/models/hummingbird.fbx')
  const { actions, names } = useAnimations(fbx.animations, group)

  useEffect(() => {
    // Check available animations
    console.log('Animations:', names)
    
    // Try to play each animation in sequence
    if (names.includes('Idle')) {
      actions['Idle']?.reset().fadeIn(0.5).play()
    } else if (names.includes('Fly')) {
      actions['Fly']?.reset().fadeIn(0.5).play()
    }
  }, [actions, names])

  return <primitive ref={group} object={fbx} />
}
```

## Example 6: Responsive Design

```tsx
// Adjust camera based on viewport
function GradientSceneWithHummingbird({ 
  className, 
  fov = 70 
}: { 
  className?: string
  fov?: number 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = React.useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const cameraPos = isMobile 
    ? [0, 0.8, 3.5]    // Farther for mobile
    : [0, 0.5, 2.5]    // Closer for desktop

  return (
    <div className='w-full h-full'>
      <Canvas 
        ref={canvasRef} 
        camera={{ position: cameraPos, fov: fov }} 
        className={className} 
      >
        <Sketch />
        <HummingbirdModel scale={1.2} />
        {/* lights... */}
      </Canvas>
    </div>
  )
}
```

## Example 7: Custom Colors & Lighting

```tsx
// Create a warm sunset theme
const warmPalette = ["#ff6b4a", "#ff8c5a", "#ffa85c", "#ffb347"].map(color => {
  const threeColor = new THREE.Color(color)
  return threeColor
})

// In canvas:
<ambientLight intensity={0.7} color="#ffd700" />
<directionalLight position={[1, 1, 1]} intensity={0.6} color="#ffaa00" />
<pointLight position={[2, 1, 1]} intensity={0.5} color="#ff6b6b" />
```

## Example 8: Add Click Interaction

```tsx
function InteractiveHummingbird() {
  const group = useRef(null)
  const [isFlying, setIsFlying] = useState(true)

  const handleClick = () => {
    setIsFlying(!isFlying)
  }

  useFrame(({ clock }) => {
    if (!group.current) return
    
    const t = clock.getElapsedTime()
    
    if (isFlying) {
      group.current.position.x = Math.cos(t * 0.5) * 0.8
      group.current.position.z = Math.sin(t * 0.5) * 0.8
    } else {
      // Hovering in place
      group.current.position.x = 0
      group.current.position.z = 0
    }
    
    group.current.position.y = Math.sin(t * 1.5) * 0.2 + 0.3
  })

  return (
    <primitive 
      ref={group} 
      object={fbx} 
      onClick={handleClick}
      scale={1.2}
    />
  )
}
```

## Example 9: Performance Optimization

```tsx
// For production - lower DPR, optimize shader
<Canvas 
  ref={canvasRef} 
  camera={{ position: [0, 0.5, 2.5], fov: 70 }} 
  dpr={[1, 1]}  // Single pixel ratio instead of [1, 2]
  gl={{ antialias: true }}
>
  <Sketch />
  <HummingbirdModel scale={1.2} />
</Canvas>
```

## Example 10: Loading States & Fallback

```tsx
import { Suspense } from 'react'

function HummingbirdModelWithFallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HummingbirdModel scale={1.2} />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshBasicMaterial color="#ff69b4" />
    </mesh>
  )
}

// Use in canvas:
<HummingbirdModelWithFallback />
```

---

Each example builds on the basics. Mix and match to create your perfect animation!
