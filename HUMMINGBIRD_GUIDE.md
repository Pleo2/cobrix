# Hummingbird 3D Model Integration Guide

## What We Did

Integrated your Low Poly Hummingbird asset into your Hero section using React Three Fiber, creating an animated, flying hummingbird that moves in circular patterns against a dynamic gradient background.

## Project Structure

```
public/models/
├── hummingbird.fbx              # The 3D model (Unity FBX format)
└── materials/                   # Textures and material files
    ├── *.png                    # Texture images
    ├── *.mat                    # Material definitions
    └── *.mat.meta               # Material metadata

src/components/marketing/
└── gradient-scene.tsx           # Contains both gradient and hummingbird components
```

## Components

### GradientScene
- Renders just the animated gradient background
- Use when you only want the gradient effect

```tsx
import { GradientScene } from "@/components/marketing/gradient-scene"

<GradientScene className="rounded-4xl" />
```

### GradientSceneWithHummingbird
- Renders gradient background + animated hummingbird
- The hummingbird flies in circular patterns with bobbing motion
- Perfectly lit with colored point lights matching the gradient palette

```tsx
import { GradientSceneWithHummingbird } from "@/components/marketing/gradient-scene"

<GradientSceneWithHummingbird className="rounded-4xl" />
```

## How the Animation Works

### Flight Path
The hummingbird follows a circular path with these properties:
- **Radius**: 0.8 units (configurable)
- **Speed**: 0.5 cycles per second (configurable)
- Computed using: `cos(t * speed) * radius` and `sin(t * speed) * radius`

### Bobbing Motion
- **Vertical oscillation**: ±0.2 units
- **Frequency**: 1.5x the flight speed
- Creates natural hovering motion

### Rotation
- **Facing direction**: Automatically rotates to face the direction of movement using `atan2`
- **Tilt**: Gentle z-axis rotation for naturalistic tilting during movement

### Animation Clips
- Auto-plays the first animation from the FBX if available
- Uses `useAnimations` from @react-three/drei
- Loops continuously with fade-in/fade-out effects

## Customization

### Change Flight Radius
In `gradient-scene.tsx`, inside the `useFrame` of `HummingbirdModel`:

```tsx
const radius = 1.2  // Increase for larger circles
```

### Change Flight Speed
```tsx
const speed = 0.3   // Lower = slower, higher = faster
```

### Change Bobbing Intensity
```tsx
// Larger coefficient = more bobbing
group.current.position.y = Math.sin(t * 1.5) * 0.5 + 0.3  // More bob
group.current.position.y = Math.sin(t * 1.5) * 0.1 + 0.3  // Less bob
```

### Change Model Scale
When using the component:
```tsx
<HummingbirdModel scale={1.5} />  // Make it larger
<HummingbirdModel scale={0.8} />  // Make it smaller
```

### Change Lighting
Modify the Canvas lighting in `GradientSceneWithHummingbird`:

```tsx
<ambientLight intensity={0.8} />  // More general light
<directionalLight position={[0.5, 0, 0.866]} intensity={0.7} />  // Stronger directional
<pointLight position={[2, 1, 1]} intensity={0.6} color="#fff1be" />  // Brighter colored lights
```

## Technical Details

### Why FBX Instead of GLB?
- Your asset came as FBX format
- Three.js has built-in FBXLoader support
- No conversion step needed
- Materials and textures load automatically

### Performance Considerations
- The hummingbird model is relatively lightweight
- Animation is computed in GPU using Three.js
- Gradient shader runs efficiently due to optimized shader code
- Frame rate should stay at 60fps on most devices

### Browser Compatibility
- Requires WebGL support
- Tested on modern browsers (Chrome, Firefox, Safari, Edge)
- Fallbacks can be implemented using react-three/fiber's `fallback` prop

## Using Built-in Animations

If your FBX contains animation clips (wing flaps, turns, etc.):

```tsx
function HummingbirdModel(props: React.ComponentProps<'group'>) {
  const group = useRef<THREE.Group>(null)
  const fbx = useLoader(FBXLoader, '/models/hummingbird.fbx')
  const { actions, names } = useAnimations(fbx.animations, group)

  useEffect(() => {
    // Log all available animations
    console.log('Available animations:', names)
    
    // Play specific animation
    if (names.includes('WingFlap')) {
      actions['WingFlap']?.reset().fadeIn(0.3).play()
    }
  }, [actions, names])

  // ... rest of component
}
```

## Troubleshooting

### Model Not Showing
1. Check browser console for errors
2. Verify `public/models/hummingbird.fbx` exists
3. Check that canvas camera settings are correct: `position: [0, 0.5, 2.5]`

### Animations Not Playing
1. Check if FBX has animation clips: `console.log(names)`
2. Ensure animation name matches exactly
3. Try playing manually: `actions['ClipName']?.play()`

### Performance Issues
1. Reduce `dpr` in Canvas: `dpr={[1, 1]}` instead of `[1, 2]`
2. Simplify shader gradient: reduce geometry subdivisions
3. Profile with Chrome DevTools Performance tab

## Next Steps

1. **Customize appearance**: Adjust colors, lighting, and scale
2. **Add interactivity**: Use mouse events to control hummingbird
3. **Add more animations**: Import multiple animation states
4. **Optimize**: Export to GLB format for production if needed
5. **Responsive design**: Adjust camera position based on viewport size

## Files Modified/Created

- ✅ `/src/components/marketing/gradient-scene.tsx` - Enhanced with hummingbird
- ✅ `/src/app/(main)/page.tsx` - Now uses GradientSceneWithHummingbird
- ✅ `/public/models/hummingbird.fbx` - Model file
- ✅ `/public/models/materials/` - Material and texture files

## Dependencies Already Installed

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers and components
- `three` - 3D graphics library
- `three-stdlib` - Additional Three.js utilities including FBXLoader

## Questions?

- Check React Three Fiber docs: https://r3f.docs.pmnd.rs
- Check Three.js docs: https://threejs.org/docs
- Explore examples: https://github.com/pmndrs/react-three-fiber/tree/master/packages/fiber
