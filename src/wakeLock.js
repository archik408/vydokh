/**
 * Keep the screen awake during a breathing session.
 * Primary: Screen Wake Lock API
 * Fallback: silent looping video (older iOS / Safari without Wake Lock)
 */

let desired = false
let sentinel = null
let video = null
let listening = false

function supportsWakeLockApi() {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator
}

function ensureVideo() {
  if (video) return video

  video = document.createElement('video')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
  video.setAttribute('muted', '')
  video.setAttribute('title', 'Wake Lock')
  video.setAttribute('aria-hidden', 'true')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.tabIndex = -1

  const webm = document.createElement('source')
  webm.src = '/wake-silent.webm'
  webm.type = 'video/webm'
  video.appendChild(webm)

  const mp4 = document.createElement('source')
  mp4.src = '/wake-silent.mp4'
  mp4.type = 'video/mp4'
  video.appendChild(mp4)

  // Short webm can loop; longer mp4 (iOS) needs a timeupdate nudge.
  video.addEventListener('loadedmetadata', () => {
    if (video.duration <= 1) {
      video.loop = true
      return
    }
    video.addEventListener('timeupdate', () => {
      if (desired && video.currentTime > 0.5) {
        video.currentTime = Math.random() * 0.4
      }
    })
  })

  Object.assign(video.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '1px',
    height: '1px',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '-1',
  })
  document.body.appendChild(video)
  return video
}

async function acquireViaApi() {
  if (!supportsWakeLockApi()) return false
  if (document.visibilityState !== 'visible') return false

  try {
    const next = await navigator.wakeLock.request('screen')
    if (!desired) {
      await next.release().catch(() => {})
      return false
    }
    sentinel = next
    sentinel.addEventListener('release', () => {
      if (sentinel === next) sentinel = null
    })
    return true
  } catch {
    return false
  }
}

async function acquireViaVideo() {
  try {
    const el = ensureVideo()
    await el.play()
    return true
  } catch {
    return false
  }
}

async function releaseApi() {
  const current = sentinel
  sentinel = null
  if (!current) return
  try {
    await current.release()
  } catch {
    /* already released by the platform */
  }
}

function releaseVideo() {
  if (!video) return
  try {
    video.pause()
  } catch {
    /* ignore */
  }
}

async function acquire() {
  if (!desired) return
  if (sentinel && !sentinel.released) return

  const ok = await acquireViaApi()
  if (ok) {
    releaseVideo()
    return
  }
  await acquireViaVideo()
}

async function release() {
  await releaseApi()
  releaseVideo()
}

function onVisibilityChange() {
  if (!desired) return
  if (document.visibilityState === 'visible') {
    void acquire()
  }
}

function ensureListeners() {
  if (listening) return
  listening = true
  document.addEventListener('visibilitychange', onVisibilityChange)
}

/**
 * Request screen wake lock for an active session (call from a user gesture).
 */
export async function enableWakeLock() {
  desired = true
  ensureListeners()
  await acquire()
}

/**
 * Release wake lock when the session ends.
 */
export async function disableWakeLock() {
  desired = false
  await release()
}
