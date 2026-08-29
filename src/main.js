import './style.css'
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
} from 'lucide'
import { LOCALES, BREATH_MODE_META, ELEMENT_META } from './i18n.js'

const THEME_KEY = 'vydokh-theme'
const ELEMENT_KEY = 'vydokh-element'
const MINUTES_KEY = 'vydokh-minutes'
const BREATH_KEY = 'vydokh-breath'
const LANG_KEY = 'vydokh-lang'
const DEFAULT_ELEMENT = 'air'
const DEFAULT_MINUTES = 5
const DEFAULT_BREATH = 'deep'
const MINUTES_OPTIONS = [5, 10, 15, 20]

function detectLang() {
  const stored = localStorage.getItem(LANG_KEY)
  if (stored === 'ru' || stored === 'en') return stored
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

let lang = detectLang()
let t = LOCALES[lang]

function sourceLinks(sources) {
  return sources
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="prep-source">${s.name}</a>`,
    )
    .join('<span class="prep-source-sep">·</span>')
}

function getModeCopy(id) {
  return t.modes[id] ?? t.modes[DEFAULT_BREATH]
}

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="app-shell relative flex min-h-dvh flex-col items-center px-16 pb-[max(2.75rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
    <header class="relative z-10 flex w-full max-w-md items-center justify-center">
      <p class="text-sm font-medium tracking-[0.2em] uppercase text-[var(--fg-muted)]">
        Vydokh
      </p>
      <div class="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
        <button
          type="button"
          id="lang-toggle"
          class="flex h-11 min-w-11 items-center justify-center rounded-full bg-[var(--surface)] px-2.5 text-xs font-semibold tracking-[0.12em] text-[var(--fg)] transition-colors hover:opacity-80 active:scale-95"
          aria-label=""
        >
          <span id="lang-code"></span>
        </button>
        <button
          type="button"
          id="theme-toggle"
          class="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--fg)] transition-colors hover:opacity-80 active:scale-95"
          aria-label=""
        >
          <i data-lucide="sun" class="hidden size-5 dark:block" aria-hidden="true"></i>
          <i data-lucide="moon" class="size-5 dark:hidden" aria-hidden="true"></i>
        </button>
      </div>
    </header>

    <main class="flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
      <p
        id="timer"
        class="timer-digits text-[clamp(4rem,20vw,7rem)] font-light leading-none select-none"
        aria-live="polite"
        aria-atomic="true"
      >
        5:00
      </p>

      <div class="flex flex-col items-center gap-5">
        <div class="relative flex h-[min(48vw,200px)] w-[min(48vw,200px)] items-center justify-center">
          <div id="breath-stage" class="absolute inset-0 hidden items-center justify-center" aria-hidden="true">
            <div id="breath-pulse" class="breath-pulse">
              <div class="breath-orb"></div>
              <div id="breath-center-icon" class="breath-center-icon"></div>
            </div>
          </div>

          <button
            type="button"
            id="play-btn"
            class="relative z-10 flex size-[min(26vw,110px)] items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_8px_32px_var(--orb-glow)] transition-[transform,background-color,box-shadow] duration-200 hover:bg-[var(--accent-hover)] active:scale-95"
            aria-label=""
          >
            <i data-lucide="play" class="ml-1 size-[42%]" aria-hidden="true"></i>
          </button>
        </div>

        <div
          id="breath-guide"
          class="breath-guide text-sm font-medium tracking-[0.18em] uppercase text-[var(--fg-muted)]"
          aria-live="polite"
          hidden
        >
          <span class="guide-word guide-inhale" data-i18n="inhale"></span>
          <span class="guide-word guide-hold" data-i18n="hold"></span>
          <span class="guide-word guide-exhale" data-i18n="exhale"></span>
        </div>
      </div>

      <section id="prep-copy" class="prep-copy" aria-live="polite">
        <p class="prep-kicker" data-i18n="introTitle"></p>
        <p class="prep-intro" data-i18n="introBody"></p>
        <div class="prep-sources" data-i18n="introSources"></div>
        <div class="prep-divider" aria-hidden="true"></div>
        <h2 id="prep-title" class="prep-title"></h2>
        <p id="prep-essence" class="prep-text"></p>
        <p id="prep-helps" class="prep-text"></p>
        <div id="prep-sources" class="prep-sources"></div>
      </section>

      <button
        type="button"
        id="stop-btn"
        class="items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)] active:scale-95"
        aria-label=""
        hidden
      >
        <i data-lucide="square" class="size-3.5 fill-current" aria-hidden="true"></i>
        <span data-i18n="stopLabel"></span>
      </button>
    </main>

    <aside class="side-rail side-rail-left" data-i18n-aria="sessionSettings">
      <div class="flex flex-col gap-3" role="group" data-i18n-aria="duration">
        ${MINUTES_OPTIONS.map(
          (m) => `
          <button
            type="button"
            class="rail-btn"
            data-minutes="${m}"
            aria-pressed="false"
          >${m}</button>
        `,
        ).join('')}
      </div>
      <div class="rail-divider" aria-hidden="true"></div>
      <div class="flex flex-col gap-3" role="group" data-i18n-aria="breathMode">
        ${BREATH_MODE_META.map(
          (mode) => `
          <button
            type="button"
            class="rail-btn ${mode.caption ? 'rail-btn-captioned' : ''}"
            data-breath-id="${mode.id}"
            aria-pressed="false"
          >
            <i data-lucide="${mode.icon}" class="rail-icon" aria-hidden="true"></i>
            ${mode.caption ? `<span class="rail-caption">${mode.caption}</span>` : ''}
          </button>
        `,
        ).join('')}
      </div>
    </aside>

    <nav class="side-rail side-rail-right" data-i18n-aria="colorElement">
      ${ELEMENT_META.map(
        (el) => `
        <button
          type="button"
          class="rail-btn"
          data-element-id="${el.id}"
          aria-pressed="false"
        >
          <i data-lucide="${el.icon}" class="rail-icon" aria-hidden="true"></i>
        </button>
      `,
      ).join('')}
    </nav>

    <footer class="site-footer">
      <span data-i18n="author"></span>
      <span aria-hidden="true">©</span>
      <a
        id="author-link"
        href="https://arturbasak.dev"
        target="_blank"
        rel="noopener noreferrer"
        data-i18n="authorSite"
      ></a>
    </footer>
  </div>
`

createIcons({
  icons: { Waves, TreePine, Sun, Wind, Moon, Play, Square, Box, Timer, Circle },
  attrs: {
    'stroke-width': 1.75,
  },
})

const timerEl = document.querySelector('#timer')
const playBtn = document.querySelector('#play-btn')
const stopBtn = document.querySelector('#stop-btn')
const breathStage = document.querySelector('#breath-stage')
const breathPulse = document.querySelector('#breath-pulse')
const breathCenterIcon = document.querySelector('#breath-center-icon')
const breathGuide = document.querySelector('#breath-guide')
const prepCopy = document.querySelector('#prep-copy')
const prepKicker = document.querySelector('[data-i18n="introTitle"]')
const prepIntro = document.querySelector('[data-i18n="introBody"]')
const prepIntroSources = document.querySelector('[data-i18n="introSources"]')
const prepTitle = document.querySelector('#prep-title')
const prepEssence = document.querySelector('#prep-essence')
const prepHelps = document.querySelector('#prep-helps')
const prepSources = document.querySelector('#prep-sources')
const themeToggle = document.querySelector('#theme-toggle')
const langToggle = document.querySelector('#lang-toggle')
const langCode = document.querySelector('#lang-code')
const authorLink = document.querySelector('#author-link')
const authorName = document.querySelector('[data-i18n="author"]')
const authorSite = document.querySelector('[data-i18n="authorSite"]')
const stopLabel = document.querySelector('[data-i18n="stopLabel"]')
const guideInhale = document.querySelector('[data-i18n="inhale"]')
const guideHold = document.querySelector('[data-i18n="hold"]')
const guideExhale = document.querySelector('[data-i18n="exhale"]')
const elementButtons = [...document.querySelectorAll('[data-element-id]')]
const minuteButtons = [...document.querySelectorAll('[data-minutes]')]
const breathButtons = [...document.querySelectorAll('[data-breath-id]')]
const ariaNodes = [...document.querySelectorAll('[data-i18n-aria]')]
const metaDescription = document.querySelector('meta[name="description"]')

let state = 'idle'
let minutes = DEFAULT_MINUTES
let durationSec = minutes * 60
let remaining = durationSec
let endsAt = 0
let rafId = 0
let currentBreathId = DEFAULT_BREATH

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function getElementMeta(id) {
  return ELEMENT_META.find((el) => el.id === id) ?? ELEMENT_META.find((el) => el.id === DEFAULT_ELEMENT)
}

function restartBreathAnimation() {
  if (!breathPulse.classList.contains('is-active')) return
  breathPulse.classList.remove('is-active')
  breathGuide.classList.remove('is-active')
  void breathPulse.offsetWidth
  breathPulse.classList.add('is-active')
  breathGuide.classList.add('is-active')
}

function updateOrbIcon() {
  const meta = getElementMeta(document.documentElement.dataset.element)
  breathCenterIcon.innerHTML = `<i data-lucide="${meta.icon}" aria-hidden="true"></i>`
  createIcons({
    icons: { Waves, TreePine, Sun, Wind },
    attrs: { 'stroke-width': 1.5 },
    root: breathCenterIcon,
  })
}

function updatePrepCopy() {
  const mode = getModeCopy(currentBreathId)
  prepKicker.textContent = t.intro.title
  prepIntro.textContent = t.intro.body
  prepIntroSources.innerHTML = sourceLinks(t.intro.sources)
  prepTitle.textContent = mode.title
  prepEssence.textContent = mode.essence
  prepHelps.textContent = mode.helps
  prepSources.innerHTML = sourceLinks(mode.sources)
}

function applyLocale() {
  t = LOCALES[lang]
  document.documentElement.lang = lang
  if (metaDescription) metaDescription.content = t.metaDescription

  langCode.textContent = t.langCode
  langToggle.setAttribute('aria-label', t.langToggle)
  themeToggle.setAttribute('aria-label', t.themeToggle)
  playBtn.setAttribute('aria-label', t.start)
  stopBtn.setAttribute('aria-label', t.stop)
  stopLabel.textContent = t.stop
  guideInhale.textContent = t.inhale
  guideHold.textContent = t.hold
  guideExhale.textContent = t.exhale
  authorName.textContent = t.author
  authorSite.textContent = t.authorSite
  authorLink.href = t.authorHref

  ariaNodes.forEach((node) => {
    const key = node.dataset.i18nAria
    if (typeof t[key] === 'string') node.setAttribute('aria-label', t[key])
  })

  minuteButtons.forEach((btn) => {
    const m = Number(btn.dataset.minutes)
    btn.setAttribute('aria-label', t.minutesLabel(m))
  })

  breathButtons.forEach((btn) => {
    const mode = getModeCopy(btn.dataset.breathId)
    btn.setAttribute('aria-label', mode.label)
    btn.title = mode.label
  })

  elementButtons.forEach((btn) => {
    const label = t.elements[btn.dataset.elementId]
    btn.setAttribute('aria-label', label)
  })

  updatePrepCopy()
}

function applyElement(id) {
  const meta = getElementMeta(id)
  document.documentElement.dataset.element = meta.id
  localStorage.setItem(ELEMENT_KEY, meta.id)

  elementButtons.forEach((btn) => {
    const selected = btn.dataset.elementId === meta.id
    btn.classList.toggle('is-selected', selected)
    btn.setAttribute('aria-pressed', String(selected))
  })

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

  minuteButtons.forEach((btn) => {
    const selected = Number(btn.dataset.minutes) === minutes
    btn.classList.toggle('is-selected', selected)
    btn.setAttribute('aria-pressed', String(selected))
  })

  timerEl.textContent = formatTime(remaining)
}

function applyBreath(id) {
  const valid = BREATH_MODE_META.some((m) => m.id === id)
  currentBreathId = valid ? id : DEFAULT_BREATH
  document.documentElement.dataset.breath = currentBreathId
  localStorage.setItem(BREATH_KEY, currentBreathId)

  breathButtons.forEach((btn) => {
    const selected = btn.dataset.breathId === currentBreathId
    btn.classList.toggle('is-selected', selected)
    btn.setAttribute('aria-pressed', String(selected))
  })

  updatePrepCopy()
  restartBreathAnimation()
}

function applyLang(next) {
  lang = next === 'en' ? 'en' : 'ru'
  localStorage.setItem(LANG_KEY, lang)
  applyLocale()
}

function updateThemeColorMeta() {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) return
  const element = getElementMeta(document.documentElement.dataset.element)
  const dark = document.documentElement.classList.contains('dark')
  meta.content = dark ? element.themeColorDark : element.themeColorLight
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(THEME_KEY, theme)
  updateThemeColorMeta()
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored)
    return
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(prefersDark ? 'dark' : 'light')
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

function render() {
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
  breathGuide.classList.toggle('is-active', running)
  prepCopy.hidden = running

  minuteButtons.forEach((btn) => {
    btn.disabled = running
  })
}

function tick() {
  const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
  if (left !== remaining) {
    remaining = left
    timerEl.textContent = formatTime(remaining)
  }
  if (remaining <= 0) {
    stop()
    return
  }
  rafId = requestAnimationFrame(tick)
}

function start() {
  if (state === 'running') return
  state = 'running'
  remaining = durationSec
  endsAt = Date.now() + durationSec * 1000
  render()
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(tick)
}

function stop() {
  cancelAnimationFrame(rafId)
  rafId = 0
  state = 'idle'
  remaining = durationSec
  endsAt = 0
  render()
}

playBtn.addEventListener('click', start)
stopBtn.addEventListener('click', stop)

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

initTheme()
initElement()
initMinutes()
initBreath()
applyLocale()
render()
