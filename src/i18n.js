const SOURCES = {
  clevelandDiaphragm: {
    name: 'Cleveland Clinic',
    url: 'https://my.clevelandclinic.org/health/articles/9445-diaphragmatic-breathing',
  },
  harvardDiaphragm: {
    name: 'Harvard Health',
    url: 'https://www.health.harvard.edu/lung-cancer/learning-diaphragmatic-breathing',
  },
  nhsAbdominal: {
    name: 'NHS Guy’s and St Thomas’',
    url: 'https://www.guysandstthomas.nhs.uk/health-information/abdominal-breathing',
  },
  clevelandBox: {
    name: 'Cleveland Clinic',
    url: 'https://health.clevelandclinic.org/box-breathing-benefits',
  },
  harvardTactical: {
    name: 'Harvard Health',
    url: 'https://www.health.harvard.edu/mind-and-mood/try-this-take-a-tactical-breather',
  },
  cleveland478: {
    name: 'Cleveland Clinic',
    url: 'https://health.clevelandclinic.org/4-7-8-breathing',
  },
  weil478: {
    name: 'Andrew Weil Center',
    url: 'https://awcim.arizona.edu/content/CLH00048.html',
  },
  nccih: {
    name: 'NCCIH (NIH)',
    url: 'https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know',
  },
  clevelandAnb: {
    name: 'Cleveland Clinic',
    url: 'https://health.clevelandclinic.org/alternate-nostril-breathing',
  },
  pmcAnb: {
    name: 'PMC (NIH)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4097918/',
  },
}

export const LOCALES = {
  ru: {
    metaDescription: 'Vydokh — осознанное дыхание и медитация',
    documentTitle: 'Vydokh — осознанное дыхание и медитация | Box 4×4, 4-7-8, nadi shodhana',
    themeToggle: 'Сменить тему',
    langToggle: 'Switch to English',
    langCode: 'EN',
    start: 'Старт',
    stop: 'Стоп',
    inhale: 'Вдох',
    hold: 'Пауза',
    exhale: 'Выдох',
    sessionSettings: 'Настройки сессии',
    duration: 'Длительность',
    minutesLabel: (m) => `${m} минут`,
    breathMode: 'Режим дыхания',
    colorElement: 'Стихия цвета',
    author: 'Artur Basak',
    authorSite: 'arturbasak.dev',
    authorHref: 'https://arturbasak.dev',
    readInstructions: 'Перед началом прочтите <span class="guide-link-word">инструкцию</span>',
    guide: {
      pageTitle: 'Инструкция',
      back: 'Назад',
      app: {
        title: 'О приложении Vydokh',
        body:
          'Vydokh — спокойная практика осознанного дыхания. На главном экране слева можно выбрать длительность сессии — 5, 10, 15 или 20 минут. Справа — цветовую гамму, связанную с природными стихиями: вода, земля, солнце и воздух. Многие культуры связывают их с внутренней силой и опорой — выберите ту, что откликается сейчас, и пульсирующий шар подстроится под её ритм и оттенок.',
      },
      beforeBegin: {
        title: 'Перед началом',
        body:
          'Дышите животом: при вдохе диафрагма опускается, живот мягко поднимается, плечи и грудь почти неподвижны. Сядьте или лягте удобно, расслабьте шею и плечи. Выберите тихое комфортное место без спешки — так телу проще перейти от «тревоги» к отдыху.',
        sources: [SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm, SOURCES.nhsAbdominal],
      },
      labels: {
        what: 'Что это',
        why: 'Зачем нужна',
        helps: 'Чем помогает',
        howToUse: 'Как включить в приложении',
        sources: 'Источники',
      },
    },
    elements: {
      water: 'Вода',
      earth: 'Земля',
      sun: 'Солнце',
      air: 'Воздух',
    },
    modes: {
      box: {
        label: 'Квадрат 4×4',
        title: 'Квадратное дыхание (4×4)',
        what:
          'Четыре равных шага по 4 счёта: вдох → пауза → выдох → пауза. Ритм напоминает обход «квадрата» и удерживает внимание на дыхании.',
        why:
          'Ровный счёт не даёт дыханию «разгоняться» при стрессе и помогает вернуть ощущение контроля над телом.',
        helps:
          'Подходит, когда нужно быстро собраться: перед сложным разговором, презентацией, экзаменом или в момент острого напряжения.',
        howToUse:
          'На главном экране слева, под выбором минут, нажмите кнопку с иконкой квадрата и подписью «4×4». Шар будет расширяться и сжиматься по циклу 4-4-4-4.',
        sources: [SOURCES.clevelandBox, SOURCES.harvardTactical],
      },
      '478': {
        label: 'Метод 4-7-8',
        title: 'Метод 4-7-8',
        what:
          'Вдох на 4, задержка на 7, выдох на 8. Важнее соотношение 4:7:8, чем абсолютная скорость: длинный выдох усиливает расслабление.',
        why:
          'Удлинённый выдох и пауза переключают нервную систему из режима «тревоги» в режим отдыха.',
        helps:
          'Хорошо работает при внутренней тревоге, перед сном и когда нужно «переключить» реакцию на стресс.',
        howToUse:
          'Слева выберите кнопку с таймером и подписью «4-7-8». Подсказки «Вдох», «Пауза» и «Выдох» будут следовать за ритмом 4-7-8.',
        sources: [SOURCES.cleveland478, SOURCES.weil478],
      },
      deep: {
        label: 'Глубокое дыхание',
        title: 'Глубокое диафрагмальное дыхание',
        what:
          'Плавный полный вдох и такой же спокойный выдох без жёстких пауз. Фокус — на работе диафрагмы и мягком движении живота.',
        why:
          'Это базовая техника релаксации: она замедляет пульс и поддерживает более полный газообмен.',
        helps:
          'Подходит для ежедневного снижения стресса, восстановления после напряжённого дня и как мягкая разминка перед другими техниками.',
        howToUse:
          'Слева выберите круглую кнопку без подписи — режим глубокого дыхания. Шар плавно растёт на вдохе и сжимается на выдохе.',
        sources: [SOURCES.nccih, SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm],
      },
      anb: {
        label: 'Попеременное дыхание ноздрями',
        title: 'Попеременное дыхание ноздрями',
        what:
          'Вдох через одну ноздрю, выдох через другую, затем наоборот. Свободную ноздрю мягко закрывают пальцем. Ритм в приложении тот же, что у глубокого дыхания: плавный вдох и такой же спокойный выдох.',
        why:
          'Техника удерживает внимание на дыхании и по очереди задействует обе стороны носового потока. В традиции йоги её связывают с «очищением каналов» (nadi shodhana / nadi shuddhi).',
        helps:
          'Cleveland Clinic отмечает, что практика может помочь успокоиться, поддержать сердечно-дыхательное самочувствие и вернуть ощущение баланса. В исследовании International Journal of Yoga после nadi shuddhi у тренированных участников снижались показатели пульса и давления по сравнению с обычным дыханием.',
        howToUse:
          'Слева выберите ту же круглую кнопку, что и для глубокого дыхания. Следуйте шару: на росте — вдох через левую ноздрю, на сжатии — выдох через правую; затем вдох справа и выдох слева. Если заложен нос или есть заболевания лёгких или сердца, сначала посоветуйтесь с врачом.',
        sources: [SOURCES.clevelandAnb, SOURCES.pmcAnb],
      },
    },
  },
  en: {
    metaDescription: 'Vydokh — mindful breathing and meditation',
    documentTitle: 'Vydokh — mindful breathing & meditation | Box 4×4, 4-7-8, nadi shodhana',
    themeToggle: 'Toggle theme',
    langToggle: 'Переключить на русский',
    langCode: 'RU',
    start: 'Start',
    stop: 'Stop',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    sessionSettings: 'Session settings',
    duration: 'Duration',
    minutesLabel: (m) => `${m} minutes`,
    breathMode: 'Breathing mode',
    colorElement: 'Color element',
    author: 'Artur Basak',
    authorSite: 'arturbasak.dev',
    authorHref: 'https://arturbasak.dev',
    readInstructions: 'Read the <span class="guide-link-word">instructions</span> before you begin',
    guide: {
      pageTitle: 'Instructions',
      back: 'Back',
      app: {
        title: 'About Vydokh',
        body:
          'Vydokh is a calm mindful breathing practice. On the home screen, use the left rail to pick session length — 5, 10, 15, or 20 minutes. On the right, choose a color palette tied to natural elements: water, earth, sun, and air. Many traditions link them to inner strength and grounding — pick what resonates now, and the pulsing orb will match its rhythm and hue.',
      },
      beforeBegin: {
        title: 'Before you begin',
        body:
          'Breathe with your belly: as you inhale, the diaphragm lowers and the abdomen gently rises while the shoulders and chest stay mostly still. Sit or lie comfortably with a relaxed neck and shoulders. Choose a quiet, comfortable space without rush — this helps the body shift from “alert” to rest.',
        sources: [SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm, SOURCES.nhsAbdominal],
      },
      labels: {
        what: 'What it is',
        why: 'Why practice it',
        helps: 'How it helps',
        howToUse: 'How to use it in the app',
        sources: 'Sources',
      },
    },
    elements: {
      water: 'Water',
      earth: 'Earth',
      sun: 'Sun',
      air: 'Air',
    },
    modes: {
      box: {
        label: 'Box 4×4',
        title: 'Box breathing (4×4)',
        what:
          'Four equal steps of 4 counts: inhale → hold → exhale → hold. The rhythm traces a “box” and keeps attention on the breath.',
        why:
          'Steady counting prevents stress-driven overbreathing and helps restore a sense of bodily control.',
        helps:
          'Useful when you need to regain composure quickly: before a hard conversation, presentation, exam, or a spike of tension.',
        howToUse:
          'On the home screen, left rail under minutes, tap the square icon labeled “4×4”. The orb will expand and contract in a 4-4-4-4 cycle.',
        sources: [SOURCES.clevelandBox, SOURCES.harvardTactical],
      },
      '478': {
        label: '4-7-8 method',
        title: '4-7-8 method',
        what:
          'Inhale for 4, hold for 7, exhale for 8. The 4:7:8 ratio matters more than absolute speed: a longer exhale supports relaxation.',
        why:
          'The extended exhale and hold shift the nervous system from “alert” toward rest.',
        helps:
          'Helpful for inner anxiety, before sleep, and when you want to reset a stress reaction.',
        howToUse:
          'On the left rail, tap the timer icon labeled “4-7-8”. “Inhale”, “Hold”, and “Exhale” cues will follow the 4-7-8 rhythm.',
        sources: [SOURCES.cleveland478, SOURCES.weil478],
      },
      deep: {
        label: 'Deep breathing',
        title: 'Deep diaphragmatic breathing',
        what:
          'A smooth full inhale and an equally calm exhale without strict holds. Focus on the diaphragm and a soft belly movement.',
        why:
          'This is a foundational relaxation technique: it slows the pulse and supports fuller gas exchange.',
        helps:
          'Good for daily stress relief, unwinding after a tense day, and as a gentle warm-up before other techniques.',
        howToUse:
          'On the left rail, tap the plain circle button — deep breathing mode. The orb will smoothly grow on inhale and shrink on exhale.',
        sources: [SOURCES.nccih, SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm],
      },
      anb: {
        label: 'Alternate nostril breathing',
        title: 'Alternate nostril breathing',
        what:
          'Inhale through one nostril, exhale through the other, then reverse. Gently close the unused nostril with a finger. The app rhythm is the same as deep breathing: a smooth inhale and an equally calm exhale.',
        why:
          'The practice keeps attention on the breath and alternates airflow through each nostril. In yoga it is often called nadi shodhana or nadi shuddhi — “channel-cleansing” breath.',
        helps:
          'Cleveland Clinic notes that it may help you feel calmer, support cardiorespiratory wellbeing, and restore a sense of balance. In an International Journal of Yoga study, nadi shuddhi was followed by lower heart-rate and blood-pressure measures versus normal breathing in yoga-trained participants.',
        howToUse:
          'On the left rail, tap the same plain circle used for deep breathing. Follow the orb: as it grows, inhale through the left nostril; as it shrinks, exhale through the right; then inhale right and exhale left. If you have a blocked nose or a lung or heart condition, check with a clinician first.',
        sources: [SOURCES.clevelandAnb, SOURCES.pmcAnb],
      },
    },
  },
}

export const BREATH_MODE_META = [
  { id: 'box', caption: '4×4', icon: 'box' },
  { id: '478', caption: '4-7-8', icon: 'timer' },
  { id: 'deep', caption: '', icon: 'circle' },
]

export const GUIDE_TECHNIQUE_META = [
  ...BREATH_MODE_META,
  { id: 'anb', icon: 'circle' },
]

export const ELEMENT_META = [
  { id: 'water', icon: 'waves', themeColorLight: '#dbeafe', themeColorDark: '#0c1929' },
  { id: 'earth', icon: 'tree-pine', themeColorLight: '#dcfce7', themeColorDark: '#0a1f14' },
  { id: 'sun', icon: 'sun', themeColorLight: '#fef3c7', themeColorDark: '#1c1508' },
  { id: 'air', icon: 'wind', themeColorLight: '#ccfbf1', themeColorDark: '#0a1c1a' },
]

export function sourceLinks(sources) {
  return sources
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="guide-source">${s.name}</a>`,
    )
    .join('<span class="guide-source-sep">·</span>')
}
