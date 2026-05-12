/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/how-to-play",
        destination: "/how-to-play-sudoku",
        permanent: true,
      },
      {
        source: "/articles/beginner-guide",
        destination: "/articles/beginner-sudoku-guide",
        permanent: true,
      },
      {
        source: "/articles/printable-puzzles",
        destination: "/articles/printable-sudoku-with-answers",
        permanent: true,
      },
      {
        source: "/articles/advanced-techniques",
        destination: "/articles/basic-sudoku-strategies",
        permanent: true,
      },
      {
        source: "/articles/teaching-sudoku",
        destination: "/articles/teaching-sudoku-to-kids",
        permanent: true,
      },
      {
        source: "/articles/sudoku-variants-guide",
        destination: "/variants",
        permanent: true,
      },
      {
        source: "/articles/sudoku-history",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/articles/mental-benefits",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/articles/speed-solving",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/articles/puzzle-creation",
        destination: "/articles",
        permanent: true,
      },
    ]
  },
  images: {
    unoptimized: true,
  },
 
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
