import Script from "next/script"
import { siteConfig } from "@/lib/config"

interface StructuredDataProps {
  type: "website" | "game" | "article" | "howto" | "organization"
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    const baseUrl = siteConfig.url

    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "SudokuStudio",
          alternateName: "Free Online Sudoku",
          description:
            "Play free sudoku puzzles online with multiple difficulty levels, hints, and solving techniques. Best online sudoku game with printable puzzles.",
          url: baseUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
          publisher: {
            "@type": "Organization",
            name: "SudokuStudio",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo.png`,
              width: 200,
              height: 200,
            },
          },
          sameAs: [siteConfig.links.twitter, siteConfig.links.facebook, siteConfig.links.instagram],
        }

      case "game":
        return {
          "@context": "https://schema.org",
          "@type": "Game",
          name: "Free Online Sudoku",
          description:
            "Play sudoku puzzles online for free with multiple difficulty levels, intelligent hints, and step-by-step solutions.",
          genre: ["Puzzle", "Logic", "Brain Training"],
          gamePlatform: ["Web Browser", "Mobile", "Desktop"],
          operatingSystem: "Any",
          applicationCategory: "Game",
          url: `${baseUrl}/play`,
          image: `${baseUrl}/game-screenshot.png`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          gameItem: [
            {
              "@type": "Thing",
              name: "Easy Sudoku",
              description: "Perfect for beginners",
            },
            {
              "@type": "Thing",
              name: "Hard Sudoku",
              description: "Challenge for experts",
            },
            {
              "@type": "Thing",
              name: "Killer Sudoku",
              description: "Advanced variant with math",
            },
          ],
        }

      case "article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.description,
          image: data.image || `${baseUrl}/article-default.png`,
          author: {
            "@type": "Organization",
            name: "SudokuStudio",
            url: baseUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "SudokuStudio",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo.png`,
              width: 200,
              height: 200,
            },
          },
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified: data.dateModified || new Date().toISOString(),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": data.url,
          },
          articleSection: "Sudoku Guide",
          wordCount: data.wordCount || 1000,
          keywords: data.keywords || ["sudoku", "puzzle", "strategy", "guide"],
        }

      case "howto":
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: data.name,
          description: data.description,
          image: data.image || `${baseUrl}/howto-default.png`,
          step: data.steps?.map((step: any, index: number) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
            image: step.image,
            url: step.url,
          })),
          totalTime: data.totalTime || "PT15M",
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: "0",
          },
          supply: data.supply || ["Computer", "Internet Connection"],
          tool: data.tool || ["Web Browser"],
          yield: data.yield || "Learn to solve Sudoku puzzles",
        }

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SudokuStudio",
          alternateName: "Free Online Sudoku",
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          description:
            "The best free online sudoku game platform with multiple difficulty levels, hints, and educational content.",
          foundingDate: "2024",
          sameAs: [siteConfig.links.twitter, siteConfig.links.facebook, siteConfig.links.instagram],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            email: "support@sudokustudio.app",
            availableLanguage: ["English", "Chinese", "Spanish"],
          },
        }

      default:
        return {
          "@context": "https://schema.org",
          "@type": "Thing",
          ...data,
        }
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateSchema()),
      }}
    />
  )
}
