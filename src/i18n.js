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
}

export const LOCALES = {
  ru: {
    metaDescription: 'Vydokh — осознанное дыхание и медитация',
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
    elements: {
      water: 'Вода',
      earth: 'Земля',
      sun: 'Солнце',
      air: 'Воздух',
    },
    intro: {
      title: 'Перед началом',
      body: 'Дышите животом: при вдохе диафрагма опускается, живот мягко поднимается, плечи и грудь почти неподвижны. Сядьте или лягте удобно, расслабьте шею и плечи. Выберите тихое комфортное место без спешки — так телу проще перейти от «тревоги» к отдыху.',
      sources: [SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm, SOURCES.nhsAbdominal],
    },
    modes: {
      box: {
        label: 'Квадрат 4×4',
        title: 'Квадратное дыхание (4×4)',
        essence:
          'Четыре равных шага по 4 счёта: вдох → пауза → выдох → пауза. Ровный ритм помогает удержать внимание на дыхании и не «разгонять» дыхание при стрессе.',
        helps:
          'Подходит, когда нужно быстро собраться: перед сложным разговором, презентацией, экзаменом или в момент острого напряжения. По данным клиник, такая практика помогает снизить реакцию «бей или беги» и вернуть чувство контроля.',
        sources: [SOURCES.clevelandBox, SOURCES.harvardTactical],
      },
      '478': {
        label: 'Метод 4-7-8',
        title: 'Метод 4-7-8',
        essence:
          'Вдох на 4, задержка на 7, выдох на 8. Важнее соотношение 4:7:8, чем абсолютная скорость: длинный выдох усиливает расслабление нервной системы.',
        helps:
          'Хорошо работает при внутренней тревоге, перед сном и когда нужно «переключить» реакцию на стресс. Технику популяризировал Andrew Weil, M.D. (University of Arizona); Cleveland Clinic отмечает её роль в активации парасимпатической системы и поддержке спокойствия и сна.',
        sources: [SOURCES.cleveland478, SOURCES.weil478],
      },
      deep: {
        label: 'Глубокое дыхание',
        title: 'Глубокое диафрагмальное дыхание',
        essence:
          'Плавный полный вдох и такой же спокойный выдох без жёстких пауз. Фокус — на работе диафрагмы и мягком движении живота, а не на «накачке» грудью.',
        helps:
          'Базовая практика для снижения стресса, замедления пульса и более полного газообмена. NCCIH относит медленное глубокое дыхание к техникам релаксации; Cleveland Clinic и Harvard Health связывают его с расслаблением и стабилизацией давления и сердечного ритма.',
        sources: [SOURCES.nccih, SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm],
      },
    },
  },
  en: {
    metaDescription: 'Vydokh — mindful breathing and meditation',
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
    elements: {
      water: 'Water',
      earth: 'Earth',
      sun: 'Sun',
      air: 'Air',
    },
    intro: {
      title: 'Before you begin',
      body: 'Breathe with your belly: as you inhale, the diaphragm lowers and the abdomen gently rises while the shoulders and chest stay mostly still. Sit or lie comfortably with a relaxed neck and shoulders. Choose a quiet, comfortable space without rush — this helps the body shift from “alert” to rest.',
      sources: [SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm, SOURCES.nhsAbdominal],
    },
    modes: {
      box: {
        label: 'Box 4×4',
        title: 'Box breathing (4×4)',
        essence:
          'Four equal steps of 4 counts: inhale → hold → exhale → hold. The even rhythm keeps attention on the breath and helps prevent stress-driven overbreathing.',
        helps:
          'Useful when you need to regain composure quickly: before a hard conversation, presentation, exam, or a spike of tension. Clinics note that this practice can ease the fight-or-flight response and restore a sense of control.',
        sources: [SOURCES.clevelandBox, SOURCES.harvardTactical],
      },
      '478': {
        label: '4-7-8 method',
        title: '4-7-8 method',
        essence:
          'Inhale for 4, hold for 7, exhale for 8. The 4:7:8 ratio matters more than absolute speed: a longer exhale supports nervous-system relaxation.',
        helps:
          'Helpful for inner anxiety, before sleep, and when you want to reset a stress reaction. Popularized by Andrew Weil, M.D. (University of Arizona); Cleveland Clinic notes its role in engaging the parasympathetic system and supporting calm and sleep.',
        sources: [SOURCES.cleveland478, SOURCES.weil478],
      },
      deep: {
        label: 'Deep breathing',
        title: 'Deep diaphragmatic breathing',
        essence:
          'A smooth full inhale and an equally calm exhale without strict holds. Focus on the diaphragm and a soft belly movement — not chest “pumping.”',
        helps:
          'A foundational practice for lowering stress, slowing the pulse, and supporting fuller gas exchange. NCCIH lists slow deep breathing among relaxation techniques; Cleveland Clinic and Harvard Health link it with relaxation and steadier blood pressure and heart rate.',
        sources: [SOURCES.nccih, SOURCES.clevelandDiaphragm, SOURCES.harvardDiaphragm],
      },
    },
  },
}

export const BREATH_MODE_META = [
  { id: 'box', caption: '4×4', icon: 'box' },
  { id: '478', caption: '4-7-8', icon: 'timer' },
  { id: 'deep', caption: '', icon: 'circle' },
]

export const ELEMENT_META = [
  { id: 'water', icon: 'waves', themeColorLight: '#dbeafe', themeColorDark: '#0c1929' },
  { id: 'earth', icon: 'tree-pine', themeColorLight: '#dcfce7', themeColorDark: '#0a1f14' },
  { id: 'sun', icon: 'sun', themeColorLight: '#fef3c7', themeColorDark: '#1c1508' },
  { id: 'air', icon: 'wind', themeColorLight: '#ccfbf1', themeColorDark: '#0a1c1a' },
]
