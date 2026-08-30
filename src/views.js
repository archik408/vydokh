import { BREATH_MODE_META, ELEMENT_META, GUIDE_TECHNIQUE_META } from './i18n.js'

const MINUTES_OPTIONS = [5, 10, 15, 20]

export function renderShell() {
  return `
    <div class="app-shell">
      <div class="brand-bar">
        <p class="brand-title">Vydokh</p>
      </div>

      <div id="view-root" class="view-root"></div>

      <aside class="side-rail side-rail-left" data-i18n-aria="sessionSettings">
        <div class="flex flex-col gap-3" role="group" data-i18n-aria="duration">
          ${MINUTES_OPTIONS.map(
            (m) => `
            <button type="button" class="rail-btn" data-minutes="${m}" aria-pressed="false">${m}</button>
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

      <nav class="side-rail side-rail-right" aria-label="Appearance">
        <div class="flex flex-col gap-3" role="group" data-i18n-aria="colorElement">
          ${ELEMENT_META.map(
            (el) => `
            <button type="button" class="rail-btn" data-element-id="${el.id}" aria-pressed="false">
              <i data-lucide="${el.icon}" class="rail-icon" aria-hidden="true"></i>
            </button>
          `,
          ).join('')}
        </div>
        <div class="rail-divider" aria-hidden="true"></div>
        <div class="flex flex-col gap-3" role="group" aria-label="Language and theme">
          <button type="button" id="lang-toggle" class="rail-btn" aria-label="">
            <span id="lang-code" class="text-[0.7rem] font-semibold tracking-[0.12em]"></span>
          </button>
          <button type="button" id="theme-toggle" class="rail-btn" aria-label="">
            <i data-lucide="sun" class="rail-icon rail-icon-sm hidden dark:block" aria-hidden="true"></i>
            <i data-lucide="moon" class="rail-icon rail-icon-sm dark:hidden" aria-hidden="true"></i>
          </button>
        </div>
      </nav>

      <p class="site-footer">
        <span data-i18n="author"></span>
        <span aria-hidden="true">©</span>
        <a id="author-link" href="https://arturbasak.dev" target="_blank" rel="noopener noreferrer" data-i18n="authorSite"></a>
      </p>
    </div>
  `
}

export function renderHomeView(t) {
  return `
    <main class="view-page view-page-home">
      <p id="timer" class="timer-digits text-[clamp(4rem,20vw,7rem)] font-light leading-none select-none" aria-live="polite" aria-atomic="true">5:00</p>

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

        <div id="breath-guide" class="breath-guide text-sm font-medium tracking-[0.18em] uppercase text-[var(--fg-muted)]" aria-live="polite" hidden>
          <span class="guide-word guide-inhale" data-i18n="inhale"></span>
          <span class="guide-word guide-hold" data-i18n="hold"></span>
          <span class="guide-word guide-exhale" data-i18n="exhale"></span>
        </div>
      </div>

      <a href="/guide" id="guide-link" class="guide-link" data-nav>${t.readInstructions}</a>

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
  `
}

export function renderGuideView(t, sourceLinks) {
  const { guide, modes } = t
  const techniqueSections = GUIDE_TECHNIQUE_META.map((meta) => {
    const mode = modes[meta.id]
    return `
      <section class="guide-section">
        <header class="guide-section-head">
          <span class="guide-section-icon" aria-hidden="true">
            <i data-lucide="${meta.icon}"></i>
          </span>
          <h2 class="guide-section-title">${mode.title}</h2>
        </header>
        <dl class="guide-dl">
          <div class="guide-dl-row">
            <dt>${guide.labels.what}</dt>
            <dd>${mode.what}</dd>
          </div>
          <div class="guide-dl-row">
            <dt>${guide.labels.why}</dt>
            <dd>${mode.why}</dd>
          </div>
          <div class="guide-dl-row">
            <dt>${guide.labels.helps}</dt>
            <dd>${mode.helps}</dd>
          </div>
          <div class="guide-dl-row">
            <dt>${guide.labels.howToUse}</dt>
            <dd>${mode.howToUse}</dd>
          </div>
          <div class="guide-dl-row">
            <dt>${guide.labels.sources}</dt>
            <dd class="guide-sources">${sourceLinks(mode.sources)}</dd>
          </div>
        </dl>
      </section>
    `
  }).join('')

  return `
    <main class="view-page view-page-guide">
      <div class="guide-top">
        <a href="/" class="guide-back" data-nav aria-label="${guide.back}">
          <i data-lucide="arrow-left" aria-hidden="true"></i>
          <span>${guide.back}</span>
        </a>
        <h1 class="guide-page-title">${guide.pageTitle}</h1>
      </div>

      <div class="guide-content">
        <section class="guide-section">
          <h2 class="guide-section-title">${guide.app.title}</h2>
          <p class="guide-text">${guide.app.body}</p>
        </section>

        <section class="guide-section">
          <h2 class="guide-section-title">${guide.beforeBegin.title}</h2>
          <p class="guide-text">${guide.beforeBegin.body}</p>
          <div class="guide-sources">${sourceLinks(guide.beforeBegin.sources)}</div>
        </section>

        ${techniqueSections}
      </div>
    </main>
  `
}
