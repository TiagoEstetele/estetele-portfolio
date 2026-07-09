/**
 * Shared pointer state, written by `CustomCursor` and read by `MatrixBackground`.
 *
 * The two are separate components but describe one cursor: the glyph field lights up
 * around the *ring's* trailing position (`rx`/`ry`), not the raw pointer, so the glow
 * lags behind the dot exactly as the ring does. A module singleton keeps them in step
 * without threading state through React on every frame — this changes 60x a second and
 * has no business triggering renders.
 *
 * `seen` stays false until the first real mousemove, which is what keeps the glow off
 * on touch devices and before the pointer ever enters the page.
 */
export interface PointerState {
  /** Raw pointer position, straight off the last mousemove. */
  x: number
  y: number
  /** Dot position: tight lerp toward the raw position. */
  sx: number
  sy: number
  /** Ring position: slow lerp. Doubles as the centre of the glyph glow. */
  rx: number
  ry: number
  /** Has the pointer ever moved over the document? */
  seen: boolean
  /** Is the pointer currently over a link or button? */
  hover: boolean
}

const OFFSCREEN = -9999

export const pointer: PointerState = {
  x: OFFSCREEN,
  y: OFFSCREEN,
  sx: OFFSCREEN,
  sy: OFFSCREEN,
  rx: OFFSCREEN,
  ry: OFFSCREEN,
  seen: false,
  hover: false,
}

export function resetPointer() {
  pointer.x = OFFSCREEN
  pointer.y = OFFSCREEN
  pointer.sx = OFFSCREEN
  pointer.sy = OFFSCREEN
  pointer.rx = OFFSCREEN
  pointer.ry = OFFSCREEN
  pointer.seen = false
  pointer.hover = false
}

/**
 * When the custom cursor is allowed to take over: a real pointing device. Touch and
 * stylus fall through to the native cursor.
 *
 * This is the single source of truth. `globals.css` hides the native cursor off the
 * `data-cursor="custom"` attribute that `<CustomCursor>` sets only when this matches,
 * so CSS and JS cannot disagree about who owns the cursor.
 */
export const CURSOR_MEDIA_QUERY = '(pointer: fine)'
