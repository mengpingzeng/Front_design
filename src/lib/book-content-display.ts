/** 正文开头的「# 第N章」行 */
const CHAPTER_HEADING_LINE_RE = /^#\s*第\s*[\d一二三四五六七八九十百千零两]+章\s*$/u

/** 正文开头的任意「# 标题」行（捕获标题文本） */
const TITLE_HEADING_LINE_RE = /^#\s+(.+?)\s*$/u

export type BookContentLeadingParts = {
  chapterLine: string | null
  titleLine: string | null
  /** 从「# 章节名」行解析出的标题（不含 #） */
  extractedTitle: string | null
  body: string
}

/**
 * 拆分正文开头的 Markdown 章节号行 / 章节标题行与正文。
 */
export function splitBookContentLeading(content: string): BookContentLeadingParts {
  const lines = content.split("\n")
  let i = 0

  while (i < lines.length && lines[i].trim() === "") i++

  let chapterLine: string | null = null
  if (i < lines.length && CHAPTER_HEADING_LINE_RE.test(lines[i].trim())) {
    chapterLine = lines[i]
    i++
    while (i < lines.length && lines[i].trim() === "") i++
  }

  let titleLine: string | null = null
  let extractedTitle: string | null = null
  if (i < lines.length) {
    const trimmed = lines[i].trim()
    const match = trimmed.match(TITLE_HEADING_LINE_RE)
    if (match && !CHAPTER_HEADING_LINE_RE.test(trimmed)) {
      titleLine = lines[i]
      extractedTitle = match[1].trim()
      i++
    }
  }

  while (i < lines.length && lines[i].trim() === "") i++

  return {
    chapterLine,
    titleLine,
    extractedTitle,
    body: lines.slice(i).join("\n"),
  }
}

export type BuildDisplayBookContentOptions = {
  /** 顶栏已展示卷章时，去掉正文开头的「# 第N章」 */
  stripChapterLine: boolean
  /** 顶栏已展示章节名时，去掉正文开头的「# 章节名」 */
  stripTitleLine: boolean
}

/** 根据顶栏状态决定正文展示用 Markdown（去掉与顶栏重复的开头标题行） */
export function buildDisplayBookContent(
  content: string,
  opts: BuildDisplayBookContentOptions,
): string {
  const parts = splitBookContentLeading(content)
  const blocks: string[] = []

  if (!opts.stripChapterLine && parts.chapterLine) {
    blocks.push(parts.chapterLine)
  }
  if (!opts.stripTitleLine && parts.titleLine) {
    blocks.push(parts.titleLine)
  }

  if (blocks.length === 0) return parts.body
  return `${blocks.join("\n")}\n\n${parts.body}`
}

/** 顶栏章节名：元数据优先，否则取正文首个「# 标题」 */
export function resolveHeaderChapterTitle(
  metaTitle: string | undefined,
  content: string,
): string {
  const fromMeta = metaTitle?.trim() ?? ""
  if (fromMeta) return fromMeta
  if (!content.trim()) return ""
  return splitBookContentLeading(content).extractedTitle ?? ""
}
