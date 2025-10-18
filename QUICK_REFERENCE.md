# Quick Reference: Hummingbird Animation

## Using the Component

```tsx
// In your page or component
import { GradientSceneWithHummingbird } from "@/components/marketing/gradient-scene"

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <GradientSceneWithHummingbird className="rounded-4xl" />
      </div>
      {/* Your content overlay */}
    </div>
  )
}
```

## Animation Parameters (Edit in gradient-scene.tsx)

```tsx
// Inside useFrame of HummingbirdModel:

const radius = 0.8      // Circle size (0.5 = small, 1.5 = large)
const speed = 0.5       // Speed multiplier (0.3 = slow, 1.0 = fast)

// Bobbing motion (vertical)
Math.sin(t * 1.5) * 0.2 + 0.3
                ↓↓↓      ↓↓↓
            frequency   amplitude
```

## Common Tweaks

| Change | Where | How |
|--------|-------|-----|
| Bigger bird | `scale={1.5}` | Pass to `<HummingbirdModel scale={1.5} />` |
| Faster flight | `speed = 0.8` | Increase speed value |
| Brighter scene | `intensity={0.8}` | Increase light intensities |
| Slower bob | `Math.sin(t * 0.8)` | Decrease time multiplier |
| Different colors | `pallete` array | Edit RGB hex values |

## Performance

- **GPU Load**: Low (efficient shader + lightweight model)
- **FPS**: 60fps on most devices
- **Bundle Size**: ~750 KB (FBX + textures)
- **Optimization**: Export to GLB format for production

## Debugging

```tsx
// In HummingbirdModel useEffect:
console.log('Available animations:', names)  // See all animation clips

// In HummingbirdModel useFrame:
console.log(group.current.position)  // Track position
```

## Alternatives

### Just the gradient (no bird)
```tsx
import { GradientScene } from "@/components/marketing/gradient-scene"
<GradientScene className="rounded-4xl" />
```

### Load different models
Replace FBX path:
```tsx
const fbx = useLoader(FBXLoader, '/models/YOUR_MODEL.fbx')
```

---

**For full documentation, see:** `HUMMINGBIRD_GUIDE.md`
