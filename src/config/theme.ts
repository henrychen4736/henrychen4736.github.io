/**
 * ─────────────────────────────────────────────────────────────
 *  THEME — colors, background gradient, and emblem styling.
 * ─────────────────────────────────────────────────────────────
 *  Tip: design a gradient at https://www.shadergradient.co/customize,
 *  click "Copy URL", and paste it into `gradient.urlString` to use it as-is.
 */

export const theme = {
  colors: {
    /** Page background (shown before the WebGL gradient loads) */
    bg: '#07060f',
    text: '#f4f1ff',
    muted: 'rgba(236, 232, 255, 0.66)',
    /** Accent used for italic headline words, links, and highlights */
    accent: '#ffb38a',
  },

  /** Animated 3D background rendered by ShaderGradient (react-three-fiber) */
  gradient: {
    /** Paste a shadergradient.co URL here to override every value below */
    urlString: '' as string,
    type: 'waterPlane' as 'plane' | 'sphere' | 'waterPlane',
    color1: '#4a2bd1',
    color2: '#ff8d6b',
    color3: '#0d0b26',
    uSpeed: 0.12,
    uStrength: 1.4,
    uDensity: 1.0,
    uFrequency: 5.5,
    brightness: 0.95,
    cAzimuthAngle: 180,
    cPolarAngle: 80,
    cDistance: 3.4,
    rotationX: 50,
    rotationY: 0,
    rotationZ: -60,
    grain: 'off' as 'on' | 'off',
  },

  /** Liquid-metal emblem (paper-design liquid-logo shader) */
  emblem: {
    colorBack: '#00000000',
    colorTint: '#ffffff',
    /** CSS font used to draw the monogram letters into the metal */
    font: 'italic 900 520px "Fraunces", serif',
    /** Extra stroke (as a fraction of font size) to thicken thin letterforms */
    weight: 0.045,
    /** Gap between monogram letters (em) */
    letterSpacing: 0.08,
    speed: 0.5,
    repetition: 2,
    distortion: 0.06,
    softness: 0.25,
    /** Rainbow edge dispersion. 0 = pure chrome. */
    dispersion: 0.08,
    contour: 0.25,
  },
}

export type Theme = typeof theme
