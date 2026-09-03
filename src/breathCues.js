/**
 * Unified breath cues: soft Web Audio tones + Vibration API, same rhythm.
 * Inhale: eased pulses (dense → sparse) · Hold: silence · Exhale: soft sustained tone
 *
 * iOS: playback audio session + short unlock; never block session start on audio.
 */

const DOT_MS = 48
const EXHALE_CHUNK_MS = 4000
const INHALE_GAP_MIN_MS = 72
const INHALE_GAP_MAX_MS = 300
const INHALE_PULSE_MIN = 8
const INHALE_PULSE_MAX = 22

/** Soft low tones (original character) */
const INHALE_FREQ = 118
const EXHALE_FREQ = 92
const MASTER_GAIN = 0.28

const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'

const UNLOCK_TIMEOUT_MS = 280

let audioCtx = null
let masterGain = null
let unlockEl = null
let sessionAudioActive = false
let visibilityBound = false
/** @type {Array<{ stop: (when?: number) => void, gain?: GainNode }>} */
let activeSources = []

function canVibrate() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

function easeInCubic(t) {
  return t ** 3
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function setPlaybackSession() {
  try {
    if (navigator.audioSession) {
      navigator.audioSession.type = 'playback'
    }
  } catch {
    /* AudioSession not available */
  }
}

function buildInhalePulseTimes(durationMs) {
  const lastStart = Math.max(0, durationMs - DOT_MS)
  if (lastStart <= 0) return [0]

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

  const scale = lastStart / raw[raw.length - 1]
  return raw.map((t) => t * scale)
}

function estimateInhaleSpan(count) {
  if (count <= 1) return 0
  let span = 0
  for (let i = 0; i < count - 1; i++) {
    const p = count === 2 ? 1 : i / (count - 2)
    span += INHALE_GAP_MIN_MS + (INHALE_GAP_MAX_MS - INHALE_GAP_MIN_MS) * easeInCubic(p)
  }
  return span
}

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

    audioCtx.addEventListener('statechange', () => {
      if (!sessionAudioActive || !audioCtx) return
      if (audioCtx.state !== 'running' && audioCtx.state !== 'closed') {
        void Promise.race([audioCtx.resume(), sleep(UNLOCK_TIMEOUT_MS)]).catch(() => {})
      }
    })
  }
  return audioCtx
}

function ensureUnlockElement() {
  if (unlockEl) return unlockEl
  unlockEl = new Audio(SILENT_WAV)
  unlockEl.loop = true
  unlockEl.preload = 'auto'
  unlockEl.volume = 0.01
  unlockEl.setAttribute('playsinline', '')
  unlockEl.setAttribute('webkit-playsinline', '')
  return unlockEl
}

async function resumeContext(ctx) {
  if (!ctx || ctx.state === 'closed' || ctx.state === 'running') return ctx?.state === 'running'
  try {
    await Promise.race([ctx.resume(), sleep(UNLOCK_TIMEOUT_MS)])
  } catch {
    return false
  }
  return ctx.state === 'running'
}

function playSilentBuffer(ctx) {
  try {
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    source.start(0)
  } catch {
    /* ignore */
  }
}

function track(source) {
  activeSources.push(source)
  const remove = () => {
    activeSources = activeSources.filter((s) => s !== source)
  }
  source.addEventListener?.('ended', remove)
  return source
}

function stopAudio() {
  const ctx = audioCtx
  const now = ctx?.currentTime ?? 0

  for (const source of activeSources) {
    try {
      source.stop?.(now)
    } catch {
      try {
        source.stop?.(0)
      } catch {
        /* already stopped */
      }
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
  osc.gain = gain
}

function scheduleSustain(ctx, when, durationSec, freq) {
  const osc = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, when)

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

async function prepareAudioGraph() {
  setPlaybackSession()
  const ctx = ensureAudio()
  if (!ctx || !masterGain) return null
  await resumeContext(ctx)
  return ctx.state === 'running' ? ctx : null
}

function scheduleInhaleAudio(ctx, times) {
  const startAt = ctx.currentTime
  for (const t of times) {
    schedulePulse(ctx, startAt + t / 1000, DOT_MS / 1000, INHALE_FREQ)
  }
}

function scheduleExhaleAudio(ctx, durationMs) {
  scheduleSustain(ctx, ctx.currentTime, durationMs / 1000, EXHALE_FREQ)
}

export function stopBreathCues() {
  stopVibrate()
  stopAudio()
}

export function releaseBreathAudio() {
  sessionAudioActive = false
  stopBreathCues()
  if (unlockEl) {
    try {
      unlockEl.pause()
      unlockEl.currentTime = 0
    } catch {
      /* ignore */
    }
  }
}

/**
 * @param {'inhale' | 'hold' | 'exhale'} phase
 * @param {number} durationMs
 */
export function playPhaseCues(phase, durationMs) {
  stopBreathCues()

  if (phase === 'hold') return

  if (phase === 'inhale') {
    const times = buildInhalePulseTimes(durationMs)
    vibrate(buildInhalePattern(times))
    void prepareAudioGraph().then((ctx) => {
      if (!ctx || !sessionAudioActive) return
      scheduleInhaleAudio(ctx, times)
    })
    return
  }

  if (phase === 'exhale') {
    vibrate(buildExhalePattern(durationMs))
    void prepareAudioGraph().then((ctx) => {
      if (!ctx || !sessionAudioActive) return
      scheduleExhaleAudio(ctx, durationMs)
    })
  }
}

/**
 * Kick off iOS/WebAudio unlock from the Play gesture.
 * Synchronous work runs immediately; awaits are capped so Safari cannot hang.
 */
export async function unlockBreathAudio() {
  setPlaybackSession()
  sessionAudioActive = true

  const ctx = ensureAudio()
  if (!ctx) return false

  // Still inside the user-gesture call stack if start() does not await us.
  playSilentBuffer(ctx)
  if (ctx.state !== 'running' && ctx.state !== 'closed') {
    void ctx.resume()
  }

  try {
    const el = ensureUnlockElement()
    el.currentTime = 0
    void el.play().catch(() => {})
  } catch {
    /* ignore */
  }

  await Promise.race([resumeContext(ctx), sleep(UNLOCK_TIMEOUT_MS)])

  if (!visibilityBound) {
    visibilityBound = true
    document.addEventListener('visibilitychange', () => {
      if (!sessionAudioActive || document.visibilityState !== 'visible') return
      setPlaybackSession()
      void resumeContext(audioCtx)
      if (unlockEl?.paused) void unlockEl.play().catch(() => {})
    })
  }

  return audioCtx?.state === 'running'
}
