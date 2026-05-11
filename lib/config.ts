// 网站配置
export const siteConfig = {
  name: "Sudoku Studio",
  description: "Play free sudoku puzzles online with multiple difficulty levels, hints, and solving techniques.",
  url: "https://sudokustudio.app",
  ogImage: "https://sudokustudio.app/og-image.png",
  links: {
    twitter: "https://twitter.com/sudokustudio",
    github: "https://github.com/sudokustudio",
    facebook: "https://facebook.com/sudokustudio",
    instagram: "https://instagram.com/sudokustudio",
  },
  creator: "Sudoku Studio Team",
  keywords: [
    "sudoku",
    "free sudoku",
    "sudoku online",
    "sudoku game",
    "sudoku puzzles",
    "sudoku solver",
    "printable sudoku",
    "killer sudoku",
    "sudoku strategies",
    "brain training",
    "puzzle game",
    "logic puzzle",
    "sudoku hints",
    "sudoku tutorial",
    "learn sudoku",
    "sudoku studio",
  ],
}

// API配置
export const apiConfig = {
  baseUrl: process.env.NODE_ENV === "production" ? "https://sudokustudio.app/api" : "http://localhost:3000/api",
}

// 社交媒体分享配置
export const shareConfig = {
  twitter: {
    site: "@sudokustudio",
    creator: "@sudokustudio",
  },
  facebook: {
    appId: "your-facebook-app-id", // 如果有的话
  },
}
