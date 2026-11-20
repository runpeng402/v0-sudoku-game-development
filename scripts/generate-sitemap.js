const fs = require("fs")
const path = require("path")

const baseUrl = "https://sudokustudio.app"
const currentDate = new Date().toISOString().split("T")[0]

// 定义所有页面
const pages = [
  // 主页面
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/zh", priority: "0.9", changefreq: "daily" },
  { url: "/es", priority: "0.9", changefreq: "daily" },

  // 游戏页面
  { url: "/play", priority: "0.9", changefreq: "daily" },
  { url: "/zh/play", priority: "0.8", changefreq: "daily" },
  { url: "/es/play", priority: "0.8", changefreq: "daily" },

  // 难度级别
  { url: "/play/easy", priority: "0.8", changefreq: "daily" },
  { url: "/play/medium", priority: "0.8", changefreq: "daily" },
  { url: "/play/hard", priority: "0.8", changefreq: "daily" },
  { url: "/play/expert", priority: "0.8", changefreq: "daily" },
  { url: "/play/evil", priority: "0.8", changefreq: "daily" },

  // 教程页面
  { url: "/how-to-play", priority: "0.8", changefreq: "weekly" },
  { url: "/zh/how-to-play", priority: "0.7", changefreq: "weekly" },
  { url: "/es/how-to-play", priority: "0.7", changefreq: "weekly" },

  // 策略页面
  { url: "/sudoku-practice", priority: "0.7", changefreq: "monthly" },
  { url: "/strategies", priority: "0.8", changefreq: "weekly" },
  { url: "/zh/strategies", priority: "0.7", changefreq: "weekly" },
  { url: "/es/strategies", priority: "0.7", changefreq: "weekly" },

  // 文章页面
  { url: "/articles", priority: "0.8", changefreq: "weekly" },
  { url: "/zh/articles", priority: "0.7", changefreq: "weekly" },
  { url: "/es/articles", priority: "0.7", changefreq: "weekly" },

  // 变体页面
  { url: "/variants", priority: "0.7", changefreq: "weekly" },
  { url: "/zh/variants", priority: "0.6", changefreq: "weekly" },
  { url: "/es/variants", priority: "0.6", changefreq: "weekly" },

  // 排行榜
  { url: "/leaderboard", priority: "0.6", changefreq: "daily" },
  { url: "/zh/leaderboard", priority: "0.5", changefreq: "daily" },
  { url: "/es/leaderboard", priority: "0.5", changefreq: "daily" },

  // 用户中心
  { url: "/user-center", priority: "0.5", changefreq: "weekly" },
  { url: "/zh/user-center", priority: "0.4", changefreq: "weekly" },
  { url: "/es/user-center", priority: "0.4", changefreq: "weekly" },

  // 登录页面
  { url: "/login", priority: "0.3", changefreq: "monthly" },
]

// 生成XML内容
const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`

  pages.forEach((page) => {
    xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`

    // 为主要页面添加多语言链接
    if (page.url === "/" || page.url === "/zh" || page.url === "/es") {
      xml += `
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh" />
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es" />`
    }

    xml += `
  </url>`
  })

  xml += `
</urlset>`

  return xml
}

// 写入文件
const sitemapContent = generateSitemap()
fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), sitemapContent)

console.log("✅ Sitemap generated successfully!")
console.log(`📍 Location: public/sitemap.xml`)
console.log(`🔗 URL: ${baseUrl}/sitemap.xml`)
console.log(`📊 Total URLs: ${pages.length}`)
