// Regenerates public/sitemap.xml. Run with `node scripts/generate-sitemap.js` after adding or editing indexable pages.
const fs = require("fs")
const path = require("path")
const { execFileSync } = require("child_process")

const root = path.join(__dirname, "..")
const baseUrl = "https://www.sudokustudio.app"
const today = new Date().toISOString().split("T")[0]

function lastModified(files) {
  const dates = files.map((file) => {
    const dirty = execFileSync("git", ["status", "--porcelain", "--", file], { cwd: root }).toString().trim()
    if (dirty) return today
    return execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { cwd: root }).toString().trim() || today
  })
  return dates.sort().at(-1)
}

const url = (p) => `${baseUrl}${p === "/" ? "/" : p}`
const localized = (locale, p) => (locale === "en" ? p : `/${locale}${p === "/" ? "" : p}`)

// Pages listed here must be indexable (no noindex). Translated pages list their locales for hreflang.
const pages = [
  { path: "/", locales: ["en", "zh", "es"], files: ["app/page.tsx", "components/seo-home-page.tsx", "lib/seo-locales.ts"], priority: "1.0" },
  { path: "/play", locales: ["en", "es"], files: ["app/play/page.tsx", "components/sudoku-game-page.tsx"], priority: "0.9" },
  { path: "/how-to-play-sudoku", locales: ["en", "zh", "es"], files: ["app/how-to-play-sudoku/page.tsx", "components/sudoku-beginner-lesson.tsx"], priority: "0.9" },
  { path: "/sudoku-rules", locales: ["en", "zh", "es"], files: ["app/sudoku-rules/page.tsx"], priority: "0.9" },
  { path: "/printable-sudoku", locales: ["en", "zh", "es"], files: ["app/printable-sudoku/page.tsx", "lib/printable-sudoku-pdf.ts"], priority: "0.8" },
  { path: "/strategies", locales: ["en", "zh", "es"], files: ["app/strategies/page.tsx", "components/strategies-page.tsx", "components/i18n-provider.tsx"], priority: "0.8" },
  { path: "/daily-sudoku", locales: ["en"], lastmod: today, priority: "0.8" },
  { path: "/sudoku-solver", locales: ["en"], files: ["app/sudoku-solver/page.tsx", "components/sudoku-solver.tsx"], priority: "0.8" },
  { path: "/sudoku-practice", locales: ["en"], files: ["app/sudoku-practice/page.tsx", "components/sudoku-training.tsx", "lib/sudoku-training-exercises.json"], priority: "0.8" },
  { path: "/variants", locales: ["en"], files: ["app/variants/page.tsx", "components/variants-page.tsx"], priority: "0.6" },
  { path: "/articles", locales: ["en"], files: ["app/articles/page.tsx", "lib/articles.ts"], priority: "0.6" },
  { path: "/sitemap", locales: ["en"], files: ["app/sitemap/page.tsx"], priority: "0.3" },
]

const guideSource = fs.readFileSync(path.join(root, "lib/technique-guides.ts"), "utf8")
for (const match of guideSource.matchAll(/slug: "([^"]+)"/g)) {
  pages.push({ path: `/strategies/${match[1]}`, locales: ["en"], files: ["lib/technique-guides.ts", "app/strategies/[slug]/page.tsx"], priority: "0.7" })
}

for (const slug of ["easy", "with-answers", "large-print"]) {
  pages.push({ path: `/printable-sudoku/${slug}`, locales: ["en"], files: ["app/printable-sudoku/[topic]/page.tsx"], priority: "0.7" })
}

const articleSource = fs.readFileSync(path.join(root, "lib/articles.ts"), "utf8")
for (const match of articleSource.matchAll(/slug: "([^"]+)"[\s\S]*?dateModified: "([^"]+)"/g)) {
  pages.push({ path: `/articles/${match[1]}`, locales: ["en"], lastmod: match[2], priority: "0.6" })
}

function localeFile(locale, file) {
  return locale === "en" || !file.startsWith("app/") ? file : file.replace(/^app\//, `app/${locale}/`)
}

const entries = pages.flatMap((page) =>
  page.locales.map((locale) => {
    const files = page.files
      ? page.files.map((file) => localeFile(locale, file)).filter((file) => fs.existsSync(path.join(root, file)))
      : []
    const lastmod = page.lastmod || lastModified(files)
    const alternates =
      page.locales.length > 1
        ? [
            ...page.locales.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${url(localized(alt, page.path))}" />`),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page.path)}" />`,
          ]
        : []
    return [
      "  <url>",
      `    <loc>${url(localized(locale, page.path))}</loc>`,
      ...alternates,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${locale === "en" ? page.priority : (Number(page.priority) - 0.1).toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n")
  }),
)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`

fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml)
console.log(`Wrote public/sitemap.xml with ${entries.length} URLs`)
