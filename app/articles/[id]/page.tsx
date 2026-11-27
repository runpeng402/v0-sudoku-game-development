import type { Metadata } from "next"
import { defaultOgImage } from "@/lib/seo-locales"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { articles, articleUrl, getArticle } from "@/lib/articles"

type Props = {
  params: { id: string }
}

export function generateStaticParams() {
  return articles.map((article) => ({ id: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle(params.id)

  if (!article) {
    return {
      title: "Article Not Found | SudokuStudio",
    }
  }

  return {
    title: `${article.title} | SudokuStudio`,
    description: article.description,
    alternates: {
      canonical: articleUrl(article.slug),
    },
    openGraph: {
      images: [defaultOgImage],
      title: article.title,
      description: article.description,
      url: articleUrl(article.slug),
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
  }
}

export default function ArticleDetailPage({ params }: Props) {
  const article = getArticle(params.id)

  if (!article) {
    notFound()
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    mainEntityOfPage: articleUrl(article.slug),
    author: {
      "@type": "Organization",
      name: "SudokuStudio Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "SudokuStudio",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.sudokustudio.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sudoku Articles",
        item: "https://www.sudokustudio.app/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl(article.slug),
      },
    ],
  }

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="border-b bg-slate-50 px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <Link href="/articles" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge variant="outline">{article.category}</Badge>
            <span className="inline-flex items-center text-sm text-gray-600">
              <Clock className="mr-1 h-4 w-4" />
              {article.readTime}
            </span>
            <span className="inline-flex items-center text-sm text-gray-600">
              <Calendar className="mr-1 h-4 w-4" />
              Updated {article.dateModified}
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">{article.description}</p>
        </div>
      </section>

      <article className="px-4 py-12">
        <div className="prose prose-slate mx-auto max-w-3xl">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>

      <section className="border-t bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-950">Continue Learning</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {article.relatedLinks.map((link) => (
              <Button key={link.href} asChild variant="outline">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
