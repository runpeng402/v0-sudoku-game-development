"use client"

import Link from "next/link"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Clock, User, Calendar, Share2, BookOpen, Brain, Target } from "lucide-react"
import { I18nProvider } from "@/components/i18n-provider"

interface ArticleDetailContentProps {
  articleId: string
}

function ArticleDetailContent({ articleId }: ArticleDetailContentProps) {
  const { t } = useTranslation()
  const [shareOpen, setShareOpen] = useState(false)

  const articles: Record<string, any> = {
    "beginner-guide": {
      title: "Complete Beginner's Guide to Sudoku",
      description: "Everything you need to know to start your Sudoku journey",
      author: "Sarah Chen",
      readTime: "15 min read",
      category: "Beginner",
      date: "2024-01-15",
      content: `
        <h2>What is Sudoku?</h2>
        <p>Sudoku is a logic-based number puzzle that has captivated millions of people worldwide. The objective is simple: fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids contains all of the digits from 1 to 9.</p>
        
        <h2>Basic Rules</h2>
        <p>The rules of Sudoku are straightforward:</p>
        <ul>
          <li>Each row must contain the numbers 1-9 with no repetition</li>
          <li>Each column must contain the numbers 1-9 with no repetition</li>
          <li>Each 3×3 box must contain the numbers 1-9 with no repetition</li>
        </ul>
        
        <h2>Getting Started</h2>
        <p>When you first look at a Sudoku puzzle, it might seem overwhelming. Here's how to approach it:</p>
        <ol>
          <li>Start with the easiest cells - look for rows, columns, or boxes that are almost complete</li>
          <li>Use the process of elimination</li>
          <li>Look for naked singles (cells where only one number can fit)</li>
          <li>Practice regularly to improve your skills</li>
        </ol>
        
        <h2>Common Beginner Mistakes</h2>
        <p>Avoid these common pitfalls:</p>
        <ul>
          <li>Guessing instead of using logic</li>
          <li>Not checking your work regularly</li>
          <li>Focusing on difficult cells instead of easy ones</li>
          <li>Getting frustrated and giving up too quickly</li>
        </ul>
        
        <h2>Practice Tips</h2>
        <p>To improve your Sudoku skills:</p>
        <ul>
          <li>Start with easy puzzles and gradually increase difficulty</li>
          <li>Time yourself to track improvement</li>
          <li>Learn from your mistakes</li>
          <li>Join online communities for tips and support</li>
        </ul>
      `,
    },
    "advanced-techniques": {
      title: "Mastering Advanced Sudoku Techniques",
      description: "Learn X-Wing, Swordfish, and other expert-level strategies",
      author: "Dr. Michael Rodriguez",
      readTime: "25 min read",
      category: "Advanced",
      date: "2024-01-10",
      content: `
        <h2>Beyond Basic Techniques</h2>
        <p>Once you've mastered the basic Sudoku solving techniques, it's time to learn advanced strategies that will help you solve even the most challenging puzzles.</p>
        
        <h2>X-Wing Technique</h2>
        <p>The X-Wing is one of the most important advanced techniques. It occurs when a candidate number appears in exactly two cells in two different rows, and these cells are aligned in the same two columns.</p>
        <p>When you identify an X-Wing pattern, you can eliminate that candidate from all other cells in those two columns.</p>
        
        <h2>Swordfish Pattern</h2>
        <p>Swordfish is an extension of the X-Wing technique, involving three rows and three columns. This technique can eliminate candidates and help solve complex puzzles.</p>
        <p>The Swordfish pattern is more complex but follows similar logic to X-Wing, just with an additional row and column.</p>
        
        <h2>Y-Wing Strategy</h2>
        <p>The Y-Wing involves three cells that form a Y shape. This technique uses the relationships between these cells to eliminate candidates from other cells.</p>
        <p>Look for a pivot cell with two candidates, and two wing cells that each share one candidate with the pivot.</p>
        
        <h2>Coloring Technique</h2>
        <p>Coloring involves marking candidates with different colors to track their relationships and find contradictions that lead to eliminations.</p>
        <p>This technique is particularly useful for complex puzzles where traditional methods aren't sufficient.</p>
        
        <h2>XY-Chain Method</h2>
        <p>XY-Chains connect cells with exactly two candidates, creating a chain that can eliminate candidates from cells that see both ends of the chain.</p>
      `,
    },
    "sudoku-history": {
      title: "The Fascinating History of Sudoku",
      description: "From ancient Latin squares to modern puzzle phenomenon",
      author: "Emma Thompson",
      readTime: "12 min read",
      category: "History",
      date: "2024-01-05",
      content: `
        <h2>Ancient Origins</h2>
        <p>While Sudoku as we know it today is relatively modern, its roots can be traced back to ancient mathematical concepts, particularly Latin squares developed by Leonhard Euler in the 18th century.</p>
        
        <h2>Modern Development</h2>
        <p>The modern Sudoku puzzle was created by Howard Garns, an American architect, in 1979. It was first published in Dell Magazines as "Number Place."</p>
        
        <h2>Japanese Influence</h2>
        <p>The puzzle gained popularity in Japan in the 1980s, where it was given the name "Sudoku," which means "single number" in Japanese.</p>
        <p>The Japanese publisher Nikoli refined the puzzle format and established many of the conventions we use today.</p>
        
        <h2>Global Phenomenon</h2>
        <p>Sudoku became a worldwide sensation in 2005 when The Times of London began publishing daily Sudoku puzzles, sparking a global craze that continues today.</p>
        
        <h2>Cultural Impact</h2>
        <p>Sudoku has become more than just a puzzle - it's a cultural phenomenon that has inspired books, competitions, and even academic research into its mathematical properties.</p>
        
        <h2>Digital Age</h2>
        <p>With the rise of smartphones and tablets, Sudoku has found new life in digital formats, making it more accessible than ever before.</p>
      `,
    },
    "mental-benefits": {
      title: "The Mental Health Benefits of Sudoku",
      description: "How solving puzzles can improve cognitive function and reduce stress",
      author: "Dr. James Wilson",
      readTime: "10 min read",
      category: "Health",
      date: "2024-01-20",
      content: `
        <h2>Cognitive Enhancement</h2>
        <p>Regular Sudoku practice has been shown to improve various cognitive functions, including memory, concentration, and logical reasoning skills.</p>
        
        <h2>Stress Reduction</h2>
        <p>Engaging in Sudoku puzzles can serve as a form of meditation, helping to reduce stress and anxiety by focusing the mind on a single, manageable task.</p>
        
        <h2>Brain Training</h2>
        <p>Sudoku exercises multiple areas of the brain simultaneously, including:</p>
        <ul>
          <li>Working memory</li>
          <li>Pattern recognition</li>
          <li>Logical reasoning</li>
          <li>Attention to detail</li>
        </ul>
        
        <h2>Age-Related Benefits</h2>
        <p>For older adults, regular puzzle-solving may help maintain cognitive function and potentially delay the onset of age-related cognitive decline.</p>
        
        <h2>Mood Improvement</h2>
        <p>Successfully completing Sudoku puzzles releases dopamine, the "feel-good" neurotransmitter, which can improve mood and motivation.</p>
        
        <h2>Mindfulness Practice</h2>
        <p>Sudoku naturally promotes mindfulness by requiring complete focus on the present moment, similar to meditation practices.</p>
        
        <h2>Social Benefits</h2>
        <p>Sharing Sudoku experiences with others can foster social connections and provide opportunities for collaborative problem-solving.</p>
      `,
    },
    "teaching-sudoku": {
      title: "Teaching Sudoku to Children",
      description: "Effective methods for introducing kids to logical thinking",
      author: "Maria Garcia",
      readTime: "8 min read",
      category: "Education",
      date: "2024-01-18",
      content: `
        <h2>Age-Appropriate Introduction</h2>
        <p>Children as young as 6 can begin learning Sudoku with simplified 4x4 grids. This builds foundational logical thinking skills without overwhelming them.</p>
        
        <h2>Starting with Mini Sudoku</h2>
        <p>Begin with 4x4 grids using numbers 1-4, or even use pictures or colors instead of numbers to make it more engaging for younger children.</p>
        
        <h2>Visual Learning Techniques</h2>
        <p>Use colorful grids, stickers, or manipulatives to make the learning process more interactive and fun:</p>
        <ul>
          <li>Color-coded regions</li>
          <li>Physical number tiles</li>
          <li>Interactive digital apps</li>
          <li>Reward systems for completion</li>
        </ul>
        
        <h2>Step-by-Step Progression</h2>
        <p>Gradually increase complexity:</p>
        <ol>
          <li>4x4 grids with pictures</li>
          <li>4x4 grids with numbers</li>
          <li>6x6 grids</li>
          <li>Traditional 9x9 grids</li>
        </ol>
        
        <h2>Educational Benefits</h2>
        <p>Teaching Sudoku to children develops:</p>
        <ul>
          <li>Logical reasoning</li>
          <li>Problem-solving skills</li>
          <li>Patience and persistence</li>
          <li>Pattern recognition</li>
          <li>Mathematical thinking</li>
        </ul>
        
        <h2>Common Challenges</h2>
        <p>Address these typical issues when teaching children:</p>
        <ul>
          <li>Frustration with difficulty</li>
          <li>Lack of patience</li>
          <li>Difficulty understanding rules</li>
          <li>Loss of interest</li>
        </ul>
        
        <h2>Making it Fun</h2>
        <p>Keep children engaged with:</p>
        <ul>
          <li>Themed puzzles (animals, cartoons)</li>
          <li>Group solving activities</li>
          <li>Celebration of achievements</li>
          <li>Progress tracking charts</li>
        </ul>
      `,
    },
    "sudoku-variants-guide": {
      title: "Exploring Sudoku Variants: Beyond the Classic 9x9",
      description: "Discover killer sudoku, samurai puzzles, and other exciting variations",
      author: "Alex Kim",
      readTime: "20 min read",
      category: "Variants",
      date: "2024-01-12",
      content: `
        <h2>Introduction to Sudoku Variants</h2>
        <p>While the classic 9x9 Sudoku is beloved worldwide, there are numerous exciting variants that add new challenges and dimensions to the puzzle-solving experience.</p>
        
        <h2>Killer Sudoku</h2>
        <p>Killer Sudoku combines elements of Sudoku with mathematical calculations. Cages (outlined areas) must sum to specific totals while following traditional Sudoku rules.</p>
        <p>Key strategies for Killer Sudoku:</p>
        <ul>
          <li>Learn common cage combinations</li>
          <li>Use elimination based on sums</li>
          <li>Look for unique combinations</li>
        </ul>
        
        <h2>Samurai Sudoku</h2>
        <p>Samurai Sudoku consists of five interconnected 9x9 grids arranged in a cross pattern. The overlapping regions must satisfy the rules of both grids they belong to.</p>
        
        <h2>Diagonal Sudoku (X-Sudoku)</h2>
        <p>In addition to regular Sudoku rules, the two main diagonals must also contain all digits 1-9 without repetition.</p>
        
        <h2>Irregular Sudoku (Jigsaw Sudoku)</h2>
        <p>Instead of 3x3 boxes, irregular Sudoku uses uniquely shaped regions of 9 cells each. This adds a visual puzzle element to the logical challenge.</p>
        
        <h2>Multi-Grid Variants</h2>
        <p>Explore puzzles with multiple interconnected grids:</p>
        <ul>
          <li>Twin Sudoku (two overlapping grids)</li>
          <li>Triple Sudoku (three connected grids)</li>
          <li>Flower Sudoku (six grids in a flower pattern)</li>
        </ul>
        
        <h2>Size Variants</h2>
        <p>Sudoku isn't limited to 9x9:</p>
        <ul>
          <li>Mini Sudoku (4x4, 6x6)</li>
          <li>Mega Sudoku (12x12, 16x16, 25x25)</li>
          <li>Rectangular variants</li>
        </ul>
        
        <h2>Mathematical Variants</h2>
        <p>These variants add mathematical operations:</p>
        <ul>
          <li>Greater Than Sudoku (inequality symbols)</li>
          <li>Consecutive Sudoku (adjacent number relationships)</li>
          <li>Sum Sudoku (arithmetic relationships)</li>
        </ul>
      `,
    },
    "speed-solving": {
      title: "Speed Solving Techniques for Competitive Sudoku",
      description: "Tips and tricks used by world championship competitors",
      author: "Yuki Tanaka",
      readTime: "18 min read",
      category: "Competition",
      date: "2024-01-08",
      content: `
        <h2>The World of Competitive Sudoku</h2>
        <p>Competitive Sudoku solving requires not just accuracy, but incredible speed. World champions can solve expert-level puzzles in under 2 minutes.</p>
        
        <h2>Essential Speed Techniques</h2>
        <p>Master these fundamental speed-solving methods:</p>
        <ul>
          <li>Scanning patterns for quick identification</li>
          <li>Pencil mark optimization</li>
          <li>Efficient elimination strategies</li>
          <li>Pattern recognition shortcuts</li>
        </ul>
        
        <h2>Mental Preparation</h2>
        <p>Competitive solving requires mental conditioning:</p>
        <ul>
          <li>Concentration training</li>
          <li>Stress management</li>
          <li>Visualization techniques</li>
          <li>Consistent practice routines</li>
        </ul>
        
        <h2>Physical Techniques</h2>
        <p>Optimize your physical approach:</p>
        <ul>
          <li>Proper pencil grip and writing technique</li>
          <li>Efficient eye movement patterns</li>
          <li>Comfortable seating and posture</li>
          <li>Hand and wrist exercises</li>
        </ul>
        
        <h2>Training Regimens</h2>
        <p>Develop a structured practice schedule:</p>
        <ol>
          <li>Daily solving sessions (30-60 minutes)</li>
          <li>Timed practice with various difficulties</li>
          <li>Technique-specific drills</li>
          <li>Competition simulation</li>
        </ol>
        
        <h2>Competition Strategies</h2>
        <p>Succeed in tournament settings:</p>
        <ul>
          <li>Time management across multiple puzzles</li>
          <li>Error prevention and quick correction</li>
          <li>Maintaining focus under pressure</li>
          <li>Strategic puzzle selection</li>
        </ul>
        
        <h2>Advanced Pattern Recognition</h2>
        <p>Develop instant recognition of:</p>
        <ul>
          <li>Common number placements</li>
          <li>Elimination patterns</li>
          <li>Advanced technique triggers</li>
          <li>Symmetry and structure clues</li>
        </ul>
        
        <h2>Technology and Tools</h2>
        <p>Leverage technology for training:</p>
        <ul>
          <li>Timing apps and software</li>
          <li>Pattern recognition trainers</li>
          <li>Online competition platforms</li>
          <li>Performance analytics tools</li>
        </ul>
      `,
    },
    "puzzle-creation": {
      title: "The Art of Creating Sudoku Puzzles",
      description: "Behind the scenes of puzzle design and difficulty balancing",
      author: "Robert Smith",
      readTime: "22 min read",
      category: "Design",
      date: "2024-01-03",
      content: `
        <h2>The Science Behind Sudoku Creation</h2>
        <p>Creating a quality Sudoku puzzle is both an art and a science, requiring mathematical precision and creative intuition.</p>
        
        <h2>Fundamental Principles</h2>
        <p>Every good Sudoku puzzle must have:</p>
        <ul>
          <li>Exactly one unique solution</li>
          <li>Logical solvability without guessing</li>
          <li>Appropriate difficulty level</li>
          <li>Aesthetic symmetry (often)</li>
        </ul>
        
        <h2>The Creation Process</h2>
        <p>Professional puzzle creation follows these steps:</p>
        <ol>
          <li>Generate a complete valid solution grid</li>
          <li>Remove numbers systematically</li>
          <li>Test for unique solvability</li>
          <li>Adjust difficulty by adding/removing clues</li>
          <li>Verify logical solution path</li>
        </ol>
        
        <h2>Difficulty Calibration</h2>
        <p>Difficulty is determined by:</p>
        <ul>
          <li>Number of given clues</li>
          <li>Complexity of required techniques</li>
          <li>Length of logical chains</li>
          <li>Frequency of advanced patterns</li>
        </ul>
        
        <h2>Symmetry and Aesthetics</h2>
        <p>Many puzzles feature symmetrical clue placement:</p>
        <ul>
          <li>Rotational symmetry (180°)</li>
          <li>Reflective symmetry</li>
          <li>Point symmetry</li>
          <li>Asymmetrical designs for variety</li>
        </ul>
        
        <h2>Quality Control</h2>
        <p>Professional puzzle testing involves:</p>
        <ul>
          <li>Multiple solver verification</li>
          <li>Computer algorithm validation</li>
          <li>Difficulty rating consistency</li>
          <li>Solution path analysis</li>
        </ul>
        
        <h2>Tools and Software</h2>
        <p>Modern puzzle creation uses:</p>
        <ul>
          <li>Automated generation algorithms</li>
          <li>Constraint satisfaction solvers</li>
          <li>Difficulty analysis tools</li>
          <li>Symmetry pattern generators</li>
        </ul>
        
        <h2>Creative Challenges</h2>
        <p>Puzzle creators face unique challenges:</p>
        <ul>
          <li>Balancing difficulty and solvability</li>
          <li>Creating engaging visual patterns</li>
          <li>Avoiding repetitive solving experiences</li>
          <li>Meeting publication deadlines</li>
        </ul>
        
        <h2>The Future of Puzzle Design</h2>
        <p>Emerging trends include:</p>
        <ul>
          <li>AI-assisted creation</li>
          <li>Personalized difficulty adaptation</li>
          <li>Interactive digital formats</li>
          <li>Collaborative puzzle creation</li>
        </ul>
      `,
    },
  }

  const article = articles[articleId] || {
    title: "Article Not Found",
    description: "The requested article could not be found.",
    author: "Unknown",
    readTime: "0 min read",
    category: "General",
    date: "2024-01-01",
    content: "<p>Sorry, this article is not available yet. Please check back later or browse our other articles.</p>",
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      case "History":
        return "bg-blue-100 text-blue-700"
      case "Health":
        return "bg-purple-100 text-purple-700"
      case "Education":
        return "bg-yellow-100 text-yellow-700"
      case "Variants":
        return "bg-indigo-100 text-indigo-700"
      case "Competition":
        return "bg-orange-100 text-orange-700"
      case "Design":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const shareToSocialMedia = (platform: string) => {
    const url = `https://www.sudokustudio.app/articles/${articleId}`
    const title = article.title
    const description = article.description

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + "\n\n" + url)}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
    setShareOpen(false)
  }

  const copyToClipboard = () => {
    const url = `https://www.sudokustudio.app/articles/${articleId}`
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!")
      setShareOpen(false)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/articles">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {article.readTime}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {article.date}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{article.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">By {article.author}</span>
            </div>

            <DropdownMenu open={shareOpen} onOpenChange={setShareOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => shareToSocialMedia("twitter")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-blue-400 rounded"></div>
                    Share on X (Twitter)
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocialMedia("facebook")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-blue-600 rounded"></div>
                    Share on Facebook
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocialMedia("linkedin")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-blue-700 rounded"></div>
                    Share on LinkedIn
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocialMedia("reddit")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-orange-600 rounded"></div>
                    Share on Reddit
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocialMedia("pinterest")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-red-600 rounded"></div>
                    Share on Pinterest
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocialMedia("whatsapp")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-green-500 rounded"></div>
                    Share on WhatsApp
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocialMedia("telegram")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-blue-500 rounded"></div>
                    Share on Telegram
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocialMedia("email")}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-gray-600 rounded"></div>
                    Share via Email
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyToClipboard}>
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-gray-400 rounded"></div>
                    Copy Link
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Article Content */}
        <Card className="border-0 shadow-lg mb-12">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Continue Learning</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/how-to-play">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">How to Play</h4>
                  <p className="text-gray-600 text-sm">Learn the basics of Sudoku</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/strategies">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Strategies</h4>
                  <p className="text-gray-600 text-sm">Master solving techniques</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/variants">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Variants</h4>
                  <p className="text-gray-600 text-sm">Explore different puzzle types</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ArticleDetailPageContent({ articleId }: ArticleDetailContentProps) {
  return (
    <I18nProvider>
      <ArticleDetailContent articleId={articleId} />
    </I18nProvider>
  )
}
