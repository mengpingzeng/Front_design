import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
import type { BookChapter, BookInfoResponse } from "@/types"
import { formatChapterLabel } from "@/lib/utils"

/** 收集当前 book/info 中所有章节的 session_id */
export function collectChapterSessionIds(info: BookInfoResponse | null): Set<string> {
  const ids = new Set<string>()
  if (!info?.volumes) return ids
  for (const vol of info.volumes) {
    for (const ch of vol.chapters) {
      if (ch.session_id) ids.add(ch.session_id)
    }
  }
  return ids
}

/** 相对已知集合，返回本轮新出现的章节（按章号排序） */
export function findNewChapters(knownIds: Set<string>, info: BookInfoResponse): BookChapter[] {
  const added: BookChapter[] = []
  for (const vol of info.volumes ?? []) {
    for (const ch of vol.chapters) {
      if (ch.session_id && !knownIds.has(ch.session_id)) {
        added.push(ch)
      }
    }
  }
  added.sort((a, b) => a.chapter_number - b.chapter_number)
  return added
}

function chapterReadyMessage(ch: BookChapter): string {
  const label = formatChapterLabel(ch.chapter_number)
  const title = ch.title?.trim()
  if (title) return `${label}《${title}》创作完成`
  return `${label}创作完成`
}

/** 章节就绪提示：绿色信息样式，与 error toast 区分 */
export function toastChapterReady(ch: BookChapter) {
  const message = chapterReadyMessage(ch)
  toast.custom(
    () => (
      <div
        role="status"
        className="flex w-full max-w-sm items-start gap-3 rounded-xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50 to-white px-4 py-3 shadow-md shadow-emerald-100/80"
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600/90">
            章节更新
          </p>
          <p className="mt-0.5 text-sm font-medium leading-snug text-emerald-950">
            {message}
          </p>
          <p className="mt-1 text-xs text-emerald-700/80">已在左侧章节列表中显示</p>
        </div>
      </div>
    ),
    {
      duration: 5500,
      unstyled: true,
    },
  )
}

/**
 * 对比并提示新章节。首次调用只建立基线，不弹 toast。
 * @returns 更新后的已知 session_id 集合
 */
export function notifyNewChaptersIfAny(
  knownIds: Set<string>,
  info: BookInfoResponse,
  seeded: boolean,
): { nextKnown: Set<string>; nextSeeded: boolean } {
  const current = collectChapterSessionIds(info)
  if (!seeded) {
    return { nextKnown: current, nextSeeded: true }
  }
  const added = findNewChapters(knownIds, info)
  for (const ch of added) {
    toastChapterReady(ch)
  }
  return { nextKnown: current, nextSeeded: true }
}
