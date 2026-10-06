import type { Locale, YearMonth } from '@/types'

/**
 * Month arithmetic for the experience screen. Everything works on a single month
 * index (`year * 12 + month0`) so spans and timeline offsets are plain subtraction.
 */

/** Month index of a CV date. */
export const monthIndex = ([year, month]: YearMonth) => year * 12 + (month - 1)

/** Month index of the given instant, in the runtime's local time. */
export const currentMonth = (date = new Date()) => date.getFullYear() * 12 + date.getMonth()

export const yearOf = (index: number) => Math.floor(index / 12)

/** LinkedIn's short month labels. */
const MONTHS: Record<Locale, readonly string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'],
}

const PRESENT: Record<Locale, string> = { en: 'Present', pt: 'o momento' }

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

function formatMonth([year, month]: YearMonth, locale: Locale) {
  const label = MONTHS[locale][month - 1]
  return locale === 'pt' ? `${label} de ${year}` : `${label} ${year}`
}

/**
 * Inclusive month count, the way LinkedIn reports it: Sep to Oct is "2 mos".
 * `end === null` means the role is ongoing and runs to `now`.
 */
export function spanInMonths(start: YearMonth, end: YearMonth | null, now: number) {
  return (end ? monthIndex(end) : now) - monthIndex(start) + 1
}

/** `1 yr 6 mos` / `1 ano 6 meses`. */
export function formatDuration(months: number, locale: Locale) {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts =
    locale === 'pt'
      ? [years && plural(years, 'ano', 'anos'), rest && plural(rest, 'mês', 'meses')]
      : [years && plural(years, 'yr', 'yrs'), rest && plural(rest, 'mo', 'mos')]
  return parts.filter(Boolean).join(' ')
}

/** `Sep 2026 → Present · 2 mos` / `set. de 2026 → o momento · 2 meses`. */
export function formatPeriod(
  start: YearMonth,
  end: YearMonth | null,
  now: number,
  locale: Locale,
) {
  const until = end ? formatMonth(end, locale) : PRESENT[locale]
  const duration = formatDuration(spanInMonths(start, end, now), locale)
  return `${formatMonth(start, locale)} → ${until} · ${duration}`
}
