import fs from 'fs'
import path from 'path'

const KNOWLEDGE_PATH = path.join(process.cwd(), 'content/chatbot-knowledge.md')

export interface KnowledgeEntry {
  question: string
  keywords: string[]
  answer: string
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'do', 'does', 'you', 'your', 'i', 'to', 'of',
  'for', 'and', 'or', 'in', 'on', 'with', 'what', 'how', 'can', 'me', 'my',
  'it', 'this', 'that', 'be', 'have', 'has', 'about', 'get', 'we',
  // Generic verbs that show up across many unrelated FAQ entries — too
  // common to be a meaningful signal on their own (e.g. "can you help me
  // learn spanish" shouldn't match "help with" in an unrelated entry).
  'help', 'helps', 'offer', 'offers', 'provide', 'provides', 'need', 'needs',
  'want', 'wants', 'looking', 'know', 'tell', 'give', 'like', 'would',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w))
}

let cached: KnowledgeEntry[] | null = null

export function getKnowledgeBase(): KnowledgeEntry[] {
  if (cached) return cached

  const raw = fs.readFileSync(KNOWLEDGE_PATH, 'utf8')
  // Strip the leading HTML comment block, then split on "## " headings.
  const body = raw.replace(/^<!--[\s\S]*?-->/, '').trim()
  const sections = body.split(/\n(?=## )/).filter(s => s.trim())

  cached = sections.map(section => {
    const lines = section.trim().split('\n')
    const question = lines[0].replace(/^##\s*/, '').trim()

    let rest = lines.slice(1).join('\n').trim()
    let keywords: string[] = []
    const keywordMatch = rest.match(/^Keywords:\s*(.+)$/mi)
    if (keywordMatch) {
      keywords = keywordMatch[1].split(',').map(k => k.trim().toLowerCase()).filter(Boolean)
      rest = rest.replace(keywordMatch[0], '').trim()
    }

    return { question, keywords, answer: rest }
  })

  return cached
}

const FALLBACK_ANSWER =
  "I don't have specifics on that yet, but our team can help directly — try the \"Get Free Audit\" button for a look at your site, or use the contact form at the bottom of the page."

export function answerFromKnowledge(userMessage: string): string {
  const entries = getKnowledgeBase()
  const queryTokens = new Set(tokenize(userMessage))
  if (queryTokens.size === 0) return FALLBACK_ANSWER

  let bestScore = 0
  let bestAnswer = FALLBACK_ANSWER

  for (const entry of entries) {
    const entryTokens = new Set([
      ...tokenize(entry.question),
      ...entry.keywords.flatMap(k => tokenize(k)),
    ])

    let score = 0
    for (const token of queryTokens) {
      if (entryTokens.has(token)) score += 1
    }
    // Phrase-level keyword match (e.g. "free audit") counts extra —
    // catches multi-word keywords single-token overlap can miss.
    for (const keyword of entry.keywords) {
      if (keyword.includes(' ') && userMessage.toLowerCase().includes(keyword)) {
        score += 2
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestAnswer = entry.answer
    }
  }

  return bestScore > 0 ? bestAnswer : FALLBACK_ANSWER
}
