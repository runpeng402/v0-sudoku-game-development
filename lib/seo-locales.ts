import type { Metadata } from "next"

export type SeoLocale = "en" | "zh" | "es"

export const siteUrl = "https://www.sudokustudio.app"
export const locales: SeoLocale[] = ["en", "zh", "es"]

export const localeNames: Record<SeoLocale, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
}

export const htmlLangByLocale: Record<SeoLocale, string> = {
  en: "en",
  zh: "zh-CN",
  es: "es",
}

export function localizedPath(locale: SeoLocale, path = "/") {
  const normalizedPath = path === "/" ? "" : path
  return locale === "en" ? normalizedPath || "/" : `/${locale}${normalizedPath}`
}

export function localizedUrl(locale: SeoLocale, path = "/") {
  const pathValue = localizedPath(locale, path)
  return `${siteUrl}${pathValue === "/" ? "" : pathValue}`
}

export function localizedAlternates(locale: SeoLocale, path = "/"): Metadata["alternates"] {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      en: localizedUrl("en", path),
      zh: localizedUrl("zh", path),
      es: localizedUrl("es", path),
      "x-default": localizedUrl("en", path),
    },
  }
}

export const homeCopy = {
  en: {
    title: "Free Online Sudoku: Play Easy to Hard Puzzles with Hints | SudokuStudio",
    description:
      "Play free online Sudoku puzzles with easy, medium, and hard levels. No download required, with smart hints and beginner-friendly guides.",
    h1: "Free Online Sudoku",
    subtitle: "Play easy, medium, and hard Sudoku puzzles with hints and beginner-friendly guides.",
    intro:
      "SudokuStudio gives you a fast, clean place to play Sudoku online, learn the rules, and practice with printable puzzles.",
    play: "Play Sudoku",
    learn: "How to Play",
    rules: "Sudoku Rules",
    printable: "Printable Sudoku",
    featuresTitle: "Everything you need to play and learn Sudoku",
    features: [
      ["Three difficulty levels", "Play easy puzzles as a guest. Sign in to play medium and hard puzzles."],
      ["Smart hints", "Use hints when you are stuck without losing the logic of the puzzle."],
      ["Beginner guides", "Learn the rules, first solving steps, and common mistakes."],
      ["Printable puzzles", "Use printable Sudoku sheets for offline practice at home or in class."],
    ],
    learningTitle: "Sudoku learning hubs",
    learningDescription: "Use these focused pages to move from first puzzle to confident solving.",
    benefitsTitle: "Why play Sudoku regularly?",
    benefits: [
      ["Logic practice", "Sudoku trains careful elimination and pattern recognition."],
      ["Focused breaks", "A puzzle gives you a quiet, structured mental reset."],
      ["Skill progression", "Difficulty levels make improvement easy to track."],
    ],
  },
  zh: {
    title: "免费在线数独：简单到困难难度，带提示和入门教程 | SudokuStudio",
    description: "在线玩免费数独，包含简单、中等和困难难度。无需下载，支持提示、规则教程和可打印数独。",
    h1: "免费在线数独",
    subtitle: "在线游玩简单、中等和困难难度数独，支持提示和入门教程。",
    intro: "SudokuStudio 提供清爽的在线数独体验，帮助你练习解题、学习规则，并使用可打印题目离线练习。",
    play: "开始数独",
    learn: "数独怎么玩",
    rules: "数独规则",
    printable: "可打印数独",
    featuresTitle: "玩数独和学习数独所需的核心功能",
    features: [
      ["三种难度", "游客可玩简单难度。登录后可玩中等和困难难度。"],
      ["智能提示", "卡住时获得提示，同时保持逻辑推理的乐趣。"],
      ["入门教程", "学习基础规则、第一步解法和常见错误。"],
      ["可打印题目", "使用可打印数独题，在家中、课堂或离线场景练习。"],
    ],
    learningTitle: "数独学习入口",
    learningDescription: "从规则、入门步骤到打印练习，按主题逐步提升。",
    benefitsTitle: "为什么适合经常玩数独？",
    benefits: [
      ["逻辑训练", "数独能训练排除法、观察力和模式识别。"],
      ["专注休息", "一局数独可以提供安静、有结构的思维放松。"],
      ["进步清晰", "不同难度让你更容易看到自己的提升。"],
    ],
  },
  es: {
    title: "Sudoku gratis en línea: juega fácil a difícil con pistas | SudokuStudio",
    description:
      "Juega Sudoku gratis en línea con niveles fácil, medio y difícil. Sin descargas, con pistas, reglas y puzzles imprimibles.",
    h1: "Sudoku gratis en línea",
    subtitle: "Juega puzzles de Sudoku fáciles, medios y difíciles con pistas y guías para principiantes.",
    intro:
      "SudokuStudio ofrece una forma rápida y limpia de jugar Sudoku, aprender las reglas y practicar con puzzles imprimibles.",
    play: "Jugar Sudoku",
    learn: "Cómo jugar",
    rules: "Reglas de Sudoku",
    printable: "Sudoku imprimible",
    featuresTitle: "Todo lo necesario para jugar y aprender Sudoku",
    features: [
      ["Tres niveles", "Juega el nivel fácil como invitado. Inicia sesión para jugar los niveles medio y difícil."],
      ["Pistas útiles", "Usa pistas cuando te bloquees sin perder la lógica del puzzle."],
      ["Guías para empezar", "Aprende reglas, primeros pasos y errores comunes."],
      ["Puzzles imprimibles", "Practica sin conexión con hojas de Sudoku para casa o clase."],
    ],
    learningTitle: "Guías de aprendizaje de Sudoku",
    learningDescription: "Usa estas páginas para pasar del primer puzzle a una resolución más segura.",
    benefitsTitle: "¿Por qué jugar Sudoku con frecuencia?",
    benefits: [
      ["Práctica lógica", "Sudoku entrena eliminación cuidadosa y reconocimiento de patrones."],
      ["Descanso enfocado", "Un puzzle ofrece una pausa mental tranquila y estructurada."],
      ["Progreso visible", "Los niveles de dificultad ayudan a medir tu mejora."],
    ],
  },
} as const

export const pageCopy = {
  howToPlay: {
    path: "/how-to-play-sudoku",
    en: {
      title: "How to Play Sudoku: Easy Step-by-Step Guide for Beginners",
      description:
        "Learn how to play Sudoku with simple rules, step-by-step examples, beginner tips, and free online puzzles you can practice instantly.",
      h1: "How to Play Sudoku",
      intro: "Sudoku is a logic puzzle. Fill the grid so every row, column, and 3x3 box contains 1 to 9 exactly once.",
      sections: [
        ["1. Learn the goal", "A standard Sudoku grid has 81 cells. Some numbers are already given. Your job is to complete the empty cells using logic."],
        ["2. Check rows, columns, and boxes", "Before placing a number, make sure it does not already appear in the same row, column, or 3x3 box."],
        ["3. Start with easy spots", "Look for rows, columns, or boxes that already contain many numbers. These areas usually reveal the next move."],
        ["4. Avoid guessing", "Good Sudoku solving is based on elimination. If a number is not certain, use notes and keep scanning."],
      ],
    },
    zh: {
      title: "数独怎么玩：适合初学者的步骤教程 | SudokuStudio",
      description: "用简单规则和步骤示例学习数独怎么玩，了解行、列、宫的限制，并通过在线题目练习。",
      h1: "数独怎么玩",
      intro: "数独是逻辑谜题。目标是在 9x9 方格中填入 1 到 9，让每一行、每一列、每个 3x3 宫都不重复。",
      sections: [
        ["1. 理解目标", "标准数独共有 81 个格子，部分数字已经给出，你需要用逻辑补全空格。"],
        ["2. 检查行、列和宫", "填入数字前，确认同一行、同一列、同一 3x3 宫里没有相同数字。"],
        ["3. 从线索多的位置开始", "优先观察已经给出较多数字的行、列或宫，通常更容易找到下一步。"],
        ["4. 尽量不要猜", "数独应依靠排除法。不能确定时先做笔记，继续寻找更明确的线索。"],
      ],
    },
    es: {
      title: "Cómo jugar Sudoku: guía fácil paso a paso para principiantes",
      description: "Aprende a jugar Sudoku con reglas simples, ejemplos paso a paso, consejos para principiantes y puzzles gratis.",
      h1: "Cómo jugar Sudoku",
      intro: "Sudoku es un puzzle de lógica. Completa la cuadrícula para que cada fila, columna y caja 3x3 contenga 1 a 9 una sola vez.",
      sections: [
        ["1. Entiende el objetivo", "Un Sudoku estándar tiene 81 casillas. Algunas ya tienen números y debes completar las demás con lógica."],
        ["2. Revisa filas, columnas y cajas", "Antes de colocar un número, comprueba que no aparezca en la misma fila, columna o caja 3x3."],
        ["3. Empieza por zonas fáciles", "Busca filas, columnas o cajas con muchos números dados. Suelen mostrar el siguiente movimiento."],
        ["4. Evita adivinar", "Resolver bien Sudoku se basa en eliminación. Si no estás seguro, usa notas y sigue observando."],
      ],
    },
  },
  rules: {
    path: "/sudoku-rules",
    en: {
      title: "Sudoku Rules Explained: Simple Rules for Beginners",
      description:
        "Understand the basic rules of Sudoku in minutes. Learn row, column, and 3x3 box rules with clear examples.",
      h1: "Sudoku Rules Explained",
      intro: "The rules of Sudoku are simple: each row, column, and 3x3 box must contain the numbers 1 to 9 once.",
      sections: [
        ["Rows", "Every horizontal row must contain 1 to 9 with no repeated number."],
        ["Columns", "Every vertical column must contain 1 to 9 with no repeated number."],
        ["3x3 boxes", "Each smaller 3x3 box must also contain 1 to 9 once."],
        ["Valid moves", "A move is valid only when it satisfies all three rules at the same time."],
      ],
    },
    zh: {
      title: "数独规则说明：初学者也能快速理解 | SudokuStudio",
      description: "快速理解数独的基本规则：每行、每列、每个 3x3 宫都必须包含 1 到 9 且不能重复。",
      h1: "数独规则说明",
      intro: "数独规则很简单：每一行、每一列、每个 3x3 宫都必须包含 1 到 9，且每个数字只能出现一次。",
      sections: [
        ["行规则", "每一横行都必须包含 1 到 9，不能有重复数字。"],
        ["列规则", "每一竖列都必须包含 1 到 9，不能有重复数字。"],
        ["宫规则", "每个 3x3 小宫也必须包含 1 到 9，不能重复。"],
        ["有效填数", "一个填数只有同时满足行、列、宫三条规则，才是有效的。"],
      ],
    },
    es: {
      title: "Reglas de Sudoku explicadas: reglas simples para principiantes",
      description: "Entiende las reglas básicas de Sudoku en minutos: filas, columnas y cajas 3x3 con ejemplos claros.",
      h1: "Reglas de Sudoku explicadas",
      intro: "Las reglas de Sudoku son simples: cada fila, columna y caja 3x3 debe contener los números 1 a 9 una sola vez.",
      sections: [
        ["Filas", "Cada fila horizontal debe contener 1 a 9 sin repetir números."],
        ["Columnas", "Cada columna vertical debe contener 1 a 9 sin repetir números."],
        ["Cajas 3x3", "Cada caja pequeña de 3x3 también debe contener 1 a 9 una vez."],
        ["Movimientos válidos", "Un movimiento es válido solo si cumple las tres reglas al mismo tiempo."],
      ],
    },
  },
  printable: {
    path: "/printable-sudoku",
    en: {
      title: "Printable Sudoku Puzzles PDF: Free Easy to Hard Puzzles",
      description: "Get free printable Sudoku puzzles for easy, medium, and hard levels with answer-key planning.",
      h1: "Printable Sudoku Puzzles PDF",
      intro: "Use printable Sudoku puzzles for offline practice, classroom activities, travel, or screen-free breaks.",
      sections: [
        ["Easy printable Sudoku", "Best for beginners and kids who are still learning the rules."],
        ["Medium printable Sudoku", "Good for regular practice and improving solving speed."],
        ["Hard printable Sudoku", "Designed for experienced solvers who want a stronger challenge."],
        ["Answer keys", "Printable answer keys are planned so you can check progress after solving."],
      ],
    },
    zh: {
      title: "可打印数独 PDF：简单到困难题目 | SudokuStudio",
      description: "获取适合离线练习、课堂和家庭使用的可打印数独题目，覆盖简单、中等和困难难度。",
      h1: "可打印数独 PDF",
      intro: "可打印数独适合离线练习、课堂活动、旅行途中或减少屏幕使用时练习逻辑思维。",
      sections: [
        ["简单可打印数独", "适合初学者和正在学习规则的孩子。"],
        ["中等可打印数独", "适合日常练习和提升解题速度。"],
        ["困难可打印数独", "适合有经验的玩家挑战更复杂的题目。"],
        ["答案页", "后续会补充可打印答案页，方便做完后检查。"],
      ],
    },
    es: {
      title: "Sudoku imprimible PDF: puzzles gratis de fácil a difícil",
      description: "Obtén puzzles de Sudoku imprimibles para niveles fácil, medio y difícil, pensados para practicar sin conexión.",
      h1: "Sudoku imprimible PDF",
      intro: "Usa puzzles de Sudoku imprimibles para practicar sin conexión, en clase, de viaje o durante descansos sin pantalla.",
      sections: [
        ["Sudoku fácil imprimible", "Ideal para principiantes y niños que están aprendiendo las reglas."],
        ["Sudoku medio imprimible", "Bueno para práctica regular y mejorar la velocidad."],
        ["Sudoku difícil imprimible", "Pensado para jugadores con experiencia que quieren más reto."],
        ["Respuestas", "Las hojas de respuestas están planificadas para revisar el progreso después de resolver."],
      ],
    },
  },
} as const

export type SeoPageKey = keyof typeof pageCopy
