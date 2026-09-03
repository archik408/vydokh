/**
 * Unified breath cues: soft Web Audio tones + Vibration API, same rhythm.
 * Inhale: eased pulses (dense → sparse) · Hold: silence · Exhale: soft sustained tone
 */

const DOT_MS = 48
const EXHALE_CHUNK_MS = 4000
/** Start-to-start gap at the beginning of inhale (dense) */
const INHALE_GAP_MIN_MS = 72
/** Start-to-start gap near the end of inhale (sparse) */
const INHALE_GAP_MAX_MS = 300
const INHALE_PULSE_MIN = 8
const INHALE_PULSE_MAX = 22

/** Low, dull pulse — inhale dots */
const INHALE_FREQ = 118
/** Slightly lower, warmer sustain — exhale */
const EXHALE_FREQ = 92
const MASTER_GAIN = 0.28

let audioCtx = null
let masterGain = null
/** @type {Array<{ stop: (when?: number) => void, gain?: GainNode }>} */
let activeSources = []

function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

/** Ease-in cubic — gaps grow slowly at first, then stretch toward the end */
function easeInCubic(t) {
  return t ** 3
}

/**
 * Absolute start times (ms) of inhale pulses within the phase.
 * Dense at the start, slowing with larger pauses toward the end.
 * @param {number} durationMs
 * @returns {number[]}
 */
function buildInhalePulseTimes(durationMs) {
  const lastStart = Math.max(0, durationMs - DOT_MS)
  if (lastStart <= 0) return [0]

  // Fit as many pulses as the phase allows with growing gaps
  let count = INHALE_PULSE_MIN
  for (let n = INHALE_PULSE_MAX; n >= INHALE_PULSE_MIN; n--) {
    const span = estimateInhaleSpan(n)
    if (span <= lastStart * 1.05) {
      count = n
      break
    }
  }

  if (count === 1) return [0]

  const raw = [0]
  for (let i = 0; i < count - 1; i++) {
    const p = count === 2 ? 1 : i / (count - 2)
    const gap = INHALE_GAP_MIN_MS + (INHALE_GAP_MAX_MS - INHALE_GAP_MIN_MS) * easeInCubic(p)
    raw.push(raw[raw.length - 1] + gap)
  }

  // Fit the full inhale; more pulses keep end gaps from stretching too far
  const scale = lastStart / raw[raw.length - 1]
  return raw.map((t) => t * scale)
}

/** Unscaled span of growing gaps for `count` pulses */
function estimateInhaleSpan(count) {
  if (count <= 1) return 0
  let span = 0
  for (let i = 0; i < count - 1; i++) {
    const p = count === 2 ? 1 : i / (count - 2)
    span += INHALE_GAP_MIN_MS + (INHALE_GAP_MAX_MS - INHALE_GAP_MIN_MS) * easeInCubic(p)
  }
  return span
}

/** Vibration pattern [vibrate, pause, vibrate, …] from shared pulse times */
function buildInhalePattern(times) {
  const pattern = []
  for (let i = 0; i < times.length; i++) {
    if (i > 0) {
      const gap = Math.round(times[i] - times[i - 1] - DOT_MS)
      pattern.push(Math.max(0, gap))
    }
    pattern.push(DOT_MS)
  }
  return pattern
}

function buildExhalePattern(durationMs) {
  const ms = Math.max(DOT_MS, Math.round(durationMs))
  if (ms <= EXHALE_CHUNK_MS) return [ms]

  const pattern = []
  let left = ms
  while (left > 0) {
    const chunk = Math.min(EXHALE_CHUNK_MS, left)
    pattern.push(chunk)
    left -= chunk
    if (left > 0) pattern.push(0)
  }
  return pattern
}

function ensureAudio() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null

  if (!audioCtx) {
    audioCtx = new AC()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = MASTER_GAIN
    masterGain.connect(audioCtx.destination)
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

function track(source) {
  activeSources.push(source)
  const remove = () => {
    activeSources = activeSources.filter((s) => s !== source)
  }
  source.addEventListener?.('ended', remove)
  return source
}

function stopAudio(immediate = false) {
  const ctx = audioCtx
  const now = ctx?.currentTime ?? 0

  for (const source of activeSources) {
    try {
      if (!immediate && source.gain?.gain && ctx) {
        source.gain.gain.cancelScheduledValues(now)
        source.gain.gain.setValueAtTime(Math.max(source.gain.gain.value, 0.0001), now)
        source.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
        source.stop?.(now + 0.05)
      } else {
        source.stop?.(0)
      }
    } catch {
      /* already stopped */
    }
  }
  activeSources = []
}

function vibrate(pattern) {
  if (!canVibrate()) return
  try {
    navigator.vibrate(pattern)
  } catch {
    /* unsupported / blocked */
  }
}

function stopVibrate() {
  vibrate(0)
}

/**
 * Soft muffled sine pulse (inhale “dot”).
 * @param {AudioContext} ctx
 * @param {number} when
 * @param {number} durationSec
 * @param {number} freq
 */
function schedulePulse(ctx, when, durationSec, freq) {
  const osc = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, when)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(320, when)
  filter.Q.setValueAtTime(0.7, when)

  const peak = 0.55
  const attack = 0.012
  const release = Math.max(durationSec, 0.08)

  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(peak, when + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + release)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)

  osc.start(when)
  osc.stop(when + release + 0.03)

  track(osc)
  // Keep gain node reachable for soft stop of in-flight pulses
  osc.gain = gain
}

/**
 * Soft continuous tone for the full exhale.
 * @param {AudioContext} ctx
 * @param {number} when
 * @param {number} durationSec
 * @param {number} freq
 */
function scheduleSustain(ctx, when, durationSec, freq) {
  const osc = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, when)

  // Subtle 2nd partial for a warmer “push”, still muted
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(freq * 2, when)
  gain2.gain.setValueAtTime(0.12, when)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(280, when)
  filter.Q.setValueAtTime(0.5, when)

  const attack = 0.12
  const release = 0.18
  const sustainEnd = Math.max(when + durationSec - release, when + attack + 0.05)
  const end = when + durationSec

  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(0.38, when + attack)
  gain.gain.setValueAtTime(0.38, sustainEnd)
  gain.gain.exponentialRampToValueAtTime(0.0001, end)

  osc.connect(filter)
  osc2.connect(gain2)
  gain2.connect(filter)
  filter.connect(gain)
  gain.connect(masterGain)

  osc.start(when)
  osc2.start(when)
  osc.stop(end + 0.02)
  osc2.stop(end + 0.02)

  track(osc)
  track(osc2)
  osc.gain = gain
  osc2.gain = gain
}

function scheduleInhaleAudio(times) {
  const ctx = ensureAudio()
  if (!ctx || !masterGain) return

  // Align first pulse with vibrate() which starts immediately
  const startAt = ctx.currentTime
  for (const t of times) {
    schedulePulse(ctx, startAt + t / 1000, DOT_MS / 1000, INHALE_FREQ)
  }
}

function scheduleExhaleAudio(durationMs) {
  const ctx = ensureAudio()
  if (!ctx || !masterGain) return
  scheduleSustain(ctx, ctx.currentTime, durationMs / 1000, EXHALE_FREQ)
}

export function stopBreathCues() {
  stopVibrate()
  stopAudio(true)
}

/**
 * Play phase cues as one organism: audio + haptic share the same timeline.
 * @param {'inhale' | 'hold' | 'exhale'} phase
 * @param {number} durationMs
 */
export function playPhaseCues(phase, durationMs) {
  stopBreathCues()

  if (phase === 'hold') return

  if (phase === 'inhale') {
    const times = buildInhalePulseTimes(durationMs)
    scheduleInhaleAudio(times)
    vibrate(buildInhalePattern(times))
    return
  }

  if (phase === 'exhale') {
    scheduleExhaleAudio(durationMs)
    vibrate(buildExhalePattern(durationMs))
  }
}

/** Warm up AudioContext from a user gesture (call on session start). */
export function unlockBreathAudio() {
  const ctx = ensureAudio()
  if (!ctx) return
  void ctx.resume()
}
