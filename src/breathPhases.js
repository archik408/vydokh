/** Phase timings in ms — must match CSS --breath-duration ratios */
export const BREATH_CYCLES = {
  deep: [
    { phase: 'inhale', duration: 4000 },
    { phase: 'exhale', duration: 4000 },
  ],
  box: [
    { phase: 'inhale', duration: 4000 },
    { phase: 'hold', duration: 4000 },
    { phase: 'exhale', duration: 4000 },
    { phase: 'hold', duration: 4000 },
  ],
  '478': [
    { phase: 'inhale', duration: 4000 },
    { phase: 'hold', duration: 7000 },
    { phase: 'exhale', duration: 8000 },
  ],
}

export function getCycleDuration(modeId) {
  const cycle = BREATH_CYCLES[modeId] ?? BREATH_CYCLES.deep
  return cycle.reduce((sum, step) => sum + step.duration, 0)
}
