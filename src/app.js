import './style.css'
import { registerSW } from 'virtual:pwa-register'
import {
  createIcons,
  Waves,
  TreePine,
  Sun,
  Wind,
  Moon,
  Play,
  Square,
  Box,
  Timer,
  Circle,
  ArrowLeft,
} from 'lucide'
import { LOCALES, BREATH_MODE_META, ELEMENT_META, sourceLinks } from './i18n.js'
import { renderShell, renderHomeView, renderGuideView } from './views.js'
import { BREATH_CYCLES } from './breathPhases.js'

registerSW({ immediate: true })

const ICONS = { Waves, TreePine, Sun, Wind, Moon, Play, Square, Box, Timer, Circle, ArrowLeft }

const THEME_KEY = 'vydokh-theme'
const ELEMENT_KEY = 'vydokh-element'
const MINUTES_KEY = 'vydokh-minutes'
const BREATH_KEY = 'vydokh-breath'
const LANG_KEY = 'vydokh-lang'
const DEFAULT_ELEMENT = 'air'
const DEFAULT_MINUTES = 5
const DEFAULT_BREATH = 'deep'
const MINUTES_OPTIONS = [5, 10, 15, 20]

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function detectLang() {
  const stored = localStorage.getItem(LANG_KEY)
  if (stored === 'ru' || stored === 'en') return stored
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

let lang = detectLang()
let t = LOCALES[lang]
let route = getRoute()

let state = 'idle'
let minutes = DEFAULT_MINUTES
let durationSec = minutes * 60
let remaining = durationSec
let endsAt = 0
let rafId = 0
let currentBreathId = DEFAULT_BREATH
let breathPhaseTimeout = 0
let lastAnnouncedMinute = -1
let sessionEndedNaturally = false
let currentPhase = null
let pendingFocusTarget = null

let timerEl
let sessionStatusEl
let playBtn
let stopBtn
let breathStage
let breathPulse
let breathCenterIcon
let breathGuide
let breathGuideText
let guideLink
let themeToggle
let langToggle
let langCode
let authorLink
let authorName
let authorSite
let stopLabel
let skipLink
let elementButtons
let minuteButtons
let breathButtons
let ariaNodes
const metaDescription = document.querySelector('meta[name="description"]')

function getRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return path === '/guide' ? 'guide' : 'home'
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function getElementMeta(id) {
  return ELEMENT_META.find((el) => el.id === id) ?? ELEMENT_META.find((el) => el.id === DEFAULT_ELEMENT)
}

function getModeCopy(id) {
  return t.modes[id] ?? t.modes[DEFAULT_BREATH]
}

function phaseLabel(phase) {
  if (phase === 'inhale') return t.inhale
  if (phase === 'hold') return t.hold
  return t.exhale
}

function refreshIcons(root = document) {
  createIcons({ icons: ICONS, attrs: { 'stroke-width': 1.75 }, root })
}

function announceStatus(message) {
  if (!sessionStatusEl) return
  sessionStatusEl.textContent = ''
  requestAnimationFrame(() => {
    sessionStatusEl.textContent = message
  })
}

function focusMain() {
  const main = document.querySelector('#main-content')
  if (main) main.focus()
}

function bindChrome() {
  themeToggle = document.querySelector('#theme-toggle')
  langToggle = document.querySelector('#lang-toggle')
  langCode = document.querySelector('#lang-code')
  authorLink = document.querySelector('#author-link')
  authorName = document.querySelector('[data-i18n="author"]')
  authorSite = document.querySelector('[data-i18n="authorSite"]')
  skipLink = document.querySelector('.skip-link')
  elementButtons = [...document.querySelectorAll('[data-element-id]')]
  minuteButtons = [...document.querySelectorAll('[data-minutes]')]
  breathButtons = [...document.querySelectorAll('[data-breath-id]')]
  ariaNodes = [...document.querySelectorAll('[data-i18n-aria]')]

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    applyTheme(next)
  })

  langToggle.addEventListener('click', () => {
    applyLang(lang === 'ru' ? 'en' : 'ru')
  })

  elementButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyElement(btn.dataset.elementId))
  })

  minuteButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyMinutes(Number(btn.dataset.minutes)))
  })

  breathButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyBreath(btn.dataset.breathId))
  })

  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      if (state === 'running') return
      const href = link.getAttribute('href')
      navigate(href === '/guide' ? 'guide' : 'home')
    })
  })
}

function bindHome() {
  timerEl = document.querySelector('#timer')
  sessionStatusEl = document.querySelector('#session-status')
  playBtn = document.querySelector('#play-btn')
  stopBtn = document.querySelector('#stop-btn')
  breathStage = document.querySelector('#breath-stage')
  breathPulse = document.querySelector('#breath-pulse')
  breathCenterIcon = document.querySelector('#breath-center-icon')
  breathGuide = document.querySelector('#breath-guide')
  breathGuideText = document.querySelector('#breath-guide-text')
  guideLink = document.querySelector('#guide-link')
  stopLabel = document.querySelector('[data-i18n="stopLabel"]')

  playBtn.addEventListener('click', start)
  stopBtn.addEventListener('click', () => stop(false))

  updateOrbIcon()
  renderSession()

  if (pendingFocusTarget === 'play') {
    playBtn.focus()
    pendingFocusTarget = null
  } else if (pendingFocusTarget === 'stop') {
    stopBtn.focus()
    pendingFocusTarget = null
  }
}

function renderView() {
  const root = document.querySelector('#view-root')
  if (!root) return

  t = LOCALES[lang]
  const links = (sources) => sourceLinks(sources, t.opensNewTab)
  root.innerHTML = route === 'guide' ? renderGuideView(t, links) : renderHomeView(t)
  document.documentElement.dataset.page = route
  refreshIcons()

  if (route === 'home') {
    bindHome()
  } else {
    cancelAnimationFrame(rafId)
    rafId = 0
    if (state === 'running') stop(false)
    focusMain()
  }

  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      if (state === 'running') return
      const href = link.getAttribute('href')
      navigate(href === '/guide' ? 'guide' : 'home')
    })
  })
}

function navigate(nextRoute) {
  if (nextRoute === route) return
  if (state === 'running' && nextRoute === 'guide') return

  const path = nextRoute === 'guide' ? '/guide' : '/'

  const update = () => {
    route = nextRoute
    history.pushState({ route }, '', path)
    renderView()
    applyLocaleTexts()
    focusMain()
  }

  if (prefersReducedMotion() || !document.startViewTransition) {
    update()
    return
  }

  document.startViewTransition(update)
}

function stopBreathPhases() {
  clearTimeout(breathPhaseTimeout)
  breathPhaseTimeout = 0
  currentPhase = null
  if (breathGuideText) breathGuideText.textContent = ''
}

function runBreathPhaseCycle(stepIndex = 0) {
  if (state !== 'running') return

  const cycle = BREATH_CYCLES[currentBreathId] ?? BREATH_CYCLES.deep
  const step = cycle[stepIndex % cycle.length]
  currentPhase = step.phase

  if (breathGuideText) {
    breathGuideText.textContent = phaseLabel(step.phase)
  }

  breathPhaseTimeout = window.setTimeout(() => {
    runBreathPhaseCycle(stepIndex + 1)
  }, step.duration)
}

function startBreathPhases() {
  stopBreathPhases()
  runBreathPhaseCycle(0)
}

function restartBreathAnimation() {
  if (!breathPulse?.classList.contains('is-active')) return
  breathPulse.classList.remove('is-active')
  breathGuide.classList.remove('is-active')
  void breathPulse.offsetWidth
  breathPulse.classList.add('is-active')
  breathGuide.classList.add('is-active')
  if (state === 'running') startBreathPhases()
}

function updateOrbIcon() {
  if (!breathCenterIcon) return
  const meta = getElementMeta(document.documentElement.dataset.element)
  breathCenterIcon.innerHTML = `<i data-lucide="${meta.icon}" aria-hidden="true"></i>`
  createIcons({ icons: ICONS, attrs: { 'stroke-width': 1.5 }, root: breathCenterIcon })
}

function updateThemeAria() {
  if (!themeToggle) return
  const dark = document.documentElement.classList.contains('dark')
  themeToggle.setAttribute('aria-pressed', String(dark))
  themeToggle.setAttribute('aria-label', dark ? t.themeDark : t.themeLight)
}

function applyLocaleTexts() {
  t = LOCALES[lang]
  document.documentElement.lang = lang
  if (metaDescription) metaDescription.content = t.metaDescription
  document.title = t.documentTitle
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDesc = document.querySelector('meta[property="og:description"]')
  const twTitle = document.querySelector('meta[name="twitter:title"]')
  const twDesc = document.querySelector('meta[name="twitter:description"]')
  if (ogTitle) ogTitle.setAttribute('content', t.documentTitle)
  if (ogDesc) ogDesc.setAttribute('content', t.metaDescription)
  if (twTitle) twTitle.setAttribute('content', t.documentTitle)
  if (twDesc) twDesc.setAttribute('content', t.metaDescription)

  if (skipLink) skipLink.textContent = t.skipToContent
  if (langCode) langCode.textContent = t.langCode
  if (langToggle) langToggle.setAttribute('aria-label', t.langToggle)
  updateThemeAria()
  if (playBtn) playBtn.setAttribute('aria-label', t.start)
  if (stopBtn) stopBtn.setAttribute('aria-label', t.stop)
  if (stopLabel) stopLabel.textContent = t.stop
  if (authorName) authorName.textContent = t.author
  if (authorSite) authorSite.textContent = t.authorSite
  if (authorLink) {
    authorLink.href = t.authorHref
    authorLink.setAttribute('aria-label', `${t.authorSite} (${t.opensNewTab})`)
  }
  if (guideLink) guideLink.innerHTML = t.readInstructions

  ariaNodes.forEach((node) => {
    const key = node.dataset.i18nAria
    if (typeof t[key] === 'string') node.setAttribute('aria-label', t[key])
  })

  minuteButtons.forEach((btn) => {
    btn.setAttribute('aria-label', t.minutesLabel(Number(btn.dataset.minutes)))
  })

  breathButtons.forEach((btn) => {
    const mode = getModeCopy(btn.dataset.breathId)
    btn.setAttribute('aria-label', mode.label)
    btn.title = mode.label
  })

  elementButtons.forEach((btn) => {
    btn.setAttribute('aria-label', t.elements[btn.dataset.elementId])
  })

  if (state === 'running' && currentPhase && breathGuideText) {
    breathGuideText.textContent = phaseLabel(currentPhase)
  }
}

function applyLang(next) {
  lang = next === 'en' ? 'en' : 'ru'
  t = LOCALES[lang]
  localStorage.setItem(LANG_KEY, lang)
  if (state === 'running') stop(false)
  renderView()
  applyLocaleTexts()
}

function setRadioSelection(buttons, isSelected) {
  buttons.forEach((btn) => {
    const selected = isSelected(btn)
    btn.classList.toggle('is-selected', selected)
    btn.setAttribute('aria-checked', String(selected))
  })
}

function applyElement(id) {
  const meta = getElementMeta(id)
  document.documentElement.dataset.element = meta.id
  localStorage.setItem(ELEMENT_KEY, meta.id)

  setRadioSelection(elementButtons, (btn) => btn.dataset.elementId === meta.id)

  updateOrbIcon()
  updateThemeColorMeta()
}

function applyMinutes(value) {
  if (state === 'running') return
  const next = MINUTES_OPTIONS.includes(value) ? value : DEFAULT_MINUTES
  minutes = next
  durationSec = minutes * 60
  remaining = durationSec
  localStorage.setItem(MINUTES_KEY, String(minutes))

  setRadioSelection(minuteButtons, (btn) => Number(btn.dataset.minutes) === minutes)

  if (timerEl) timerEl.textContent = formatTime(remaining)
}

function applyBreath(id) {
  const valid = BREATH_MODE_META.some((m) => m.id === id)
  currentBreathId = valid ? id : DEFAULT_BREATH
  document.documentElement.dataset.breath = currentBreathId
  localStorage.setItem(BREATH_KEY, currentBreathId)

  setRadioSelection(breathButtons, (btn) => btn.dataset.breathId === currentBreathId)

  restartBreathAnimation()
}

function updateThemeColorMeta() {
  const metas = document.querySelectorAll('meta[name="theme-color"]')
  if (!metas.length) return
  const element = getElementMeta(document.documentElement.dataset.element)
  const dark = document.documentElement.classList.contains('dark')
  const color = dark ? element.themeColorDark : element.themeColorLight
  metas.forEach((meta) => {
    meta.content = color
  })
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(THEME_KEY, theme)
  updateThemeColorMeta()
  updateThemeAria()
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored)
    return
  }
  applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

function initElement() {
  const stored = localStorage.getItem(ELEMENT_KEY)
  const valid = ELEMENT_META.some((el) => el.id === stored)
  applyElement(valid ? stored : DEFAULT_ELEMENT)
}

function initMinutes() {
  const stored = Number(localStorage.getItem(MINUTES_KEY))
  applyMinutes(MINUTES_OPTIONS.includes(stored) ? stored : DEFAULT_MINUTES)
}

function initBreath() {
  const stored = localStorage.getItem(BREATH_KEY)
  const valid = BREATH_MODE_META.some((m) => m.id === stored)
  applyBreath(valid ? stored : DEFAULT_BREATH)
}

function renderSession() {
  if (!timerEl) return
  timerEl.textContent = formatTime(remaining)

  const running = state === 'running'
  playBtn.hidden = running
  playBtn.classList.toggle('hidden', running)
  stopBtn.hidden = !running
  stopBtn.classList.toggle('inline-flex', running)
  breathStage.classList.toggle('hidden', !running)
  breathStage.classList.toggle('flex', running)
  breathPulse.classList.toggle('is-active', running)
  breathGuide.hidden = !running
  breathGuide.classList.toggle('is-active', running && !prefersReducedMotion())
  if (guideLink) guideLink.hidden = running

  minuteButtons.forEach((btn) => {
    btn.disabled = running
  })
}

function tick() {
  const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
  if (left !== remaining) {
    remaining = left
    timerEl.textContent = formatTime(remaining)

    const currentMinute = Math.ceil(remaining / 60)
    if (remaining > 0 && currentMinute !== lastAnnouncedMinute && remaining % 60 === 0) {
      lastAnnouncedMinute = currentMinute
      announceStatus(formatTime(remaining))
    }
  }
  if (remaining <= 0) {
    sessionEndedNaturally = true
    stop(true)
    return
  }
  rafId = requestAnimationFrame(tick)
}

function start() {
  if (state === 'running') return
  state = 'running'
  remaining = durationSec
  endsAt = Date.now() + durationSec * 1000
  lastAnnouncedMinute = minutes
  sessionEndedNaturally = false
  renderSession()
  startBreathPhases()
  announceStatus(t.sessionStarted)
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(tick)
  stopBtn.focus()
}

function stop(naturalEnd = false) {
  cancelAnimationFrame(rafId)
  rafId = 0
  stopBreathPhases()
  const wasRunning = state === 'running'
  state = 'idle'
  remaining = durationSec
  endsAt = 0
  lastAnnouncedMinute = -1
  renderSession()

  if (naturalEnd || sessionEndedNaturally) {
    announceStatus(t.sessionComplete)
    sessionEndedNaturally = false
    pendingFocusTarget = 'play'
    if (playBtn) playBtn.focus()
    else pendingFocusTarget = 'play'
  } else if (wasRunning) {
    pendingFocusTarget = 'play'
    if (playBtn) playBtn.focus()
    else pendingFocusTarget = 'play'
  }
}

function init() {
  document.documentElement.lang = lang
  const app = document.querySelector('#app')
  app.innerHTML = renderShell()
  bindChrome()
  initTheme()
  initElement()
  initMinutes()
  initBreath()
  renderView()
  applyLocaleTexts()
  history.replaceState({ route }, '', route === 'guide' ? '/guide' : '/')

  window.addEventListener('popstate', () => {
    route = getRoute()
    renderView()
    applyLocaleTexts()
    focusMain()
  })
}

init()
