import { storageGet, storageSet } from './storage.js'

const DISMISSED_KEY = 'vydokh-install-dismissed'

let deferredPrompt = null
const listeners = new Set()

export function isStandalone() {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.navigator.standalone === true
    )
  } catch {
    return false
  }
}

export function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isDismissed() {
  return storageGet(DISMISSED_KEY) === '1'
}

export function getInstallState() {
  const installed = isStandalone()
  return {
    installed,
    canPrompt: !installed && !!deferredPrompt,
    showIOSHint: !installed && isIOS() && !deferredPrompt && !isDismissed(),
  }
}

function notify() {
  const state = getInstallState()
  listeners.forEach((fn) => fn(state))
}

export function onInstallStateChange(fn) {
  listeners.add(fn)
  fn(getInstallState())
  return () => listeners.delete(fn)
}

export function dismissInstallHint() {
  storageSet(DISMISSED_KEY, '1')
  notify()
}

export async function promptInstall() {
  if (!deferredPrompt) return false
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  notify()
  return outcome === 'accepted'
}

export function initInstallPrompt() {
  if (isStandalone()) return

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    notify()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })
}
