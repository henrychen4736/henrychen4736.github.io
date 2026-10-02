import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import { theme } from '../config/theme'

/** Fixed, full-viewport animated gradient (ShaderGradient on react-three-fiber). */
export function Background() {
  const { urlString, ...g } = theme.gradient
  const props = urlString ? { control: 'query' as const, urlString } : { control: 'props' as const, ...g }

  return (
    <div className="bg" aria-hidden>
      <ShaderGradientCanvas
        style={{ position: 'absolute', inset: 0 }}
        pixelDensity={1}
        fov={45}
        pointerEvents="none"
      >
        <ShaderGradient animate="on" lightType="3d" envPreset="city" {...props} />
      </ShaderGradientCanvas>
      {/* Legibility scrims */}
      <div className="bg__scrim" />
      <div className="bg__noise" />
    </div>
  )
}
