import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DAY = 86_400_000
const USER = 'Godavenger'
const sourceUrl = `https://github.com/users/${USER}/contributions`
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]))
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]))

// Use the same anonymous calendar visible on the public profile. No token,
// private repository API, third-party stats service or estimated counts.
export function parseCalendar(html) {
  const counts = new Map()
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attributes(match[1]).for
    const label = match[2].replace(/<[^>]+>/g, '').trim()
    const count = label.match(/^(No|\d[\d,]*) contributions? on\b/i)
    if (id && count) counts.set(id, count[1].toLowerCase() === 'no' ? 0 : Number(count[1].replaceAll(',', '')))
  }
  const calendar = new Map()
  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const attrs = attributes(match[0])
    if (!attrs['data-date']) continue
    const date = attrs['data-date']
    const count = counts.get(attrs.id)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || !Number.isSafeInteger(count) || count < 0 || calendar.has(date)) {
      throw new Error('The public calendar format changed; existing artwork has been preserved.')
    }
    calendar.set(date, { date, count })
  }
  const days = [...calendar.values()].sort((a, b) => a.date.localeCompare(b.date))
  if (days.length < 350 || days.length > 380) throw new Error('The public calendar is incomplete; existing artwork has been preserved.')
  for (let i = 1; i < days.length; i++) {
    if (Date.parse(days[i].date) - Date.parse(days[i - 1].date) !== DAY) throw new Error('The public calendar has missing dates; existing artwork has been preserved.')
  }
  return days
}

export function activityWindow(calendar, today = new Date().toISOString().slice(0, 10)) {
  const end = calendar.at(-1).date
  if (end > today || Date.parse(today) - Date.parse(end) > 2 * DAY) throw new Error('The public calendar is stale; existing artwork has been preserved.')
  const days = calendar.slice(-84)
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const slice = days.slice(i * 7, i * 7 + 7)
    return { from: slice[0].date, to: slice.at(-1).date, count: slice.reduce((sum, day) => sum + day.count, 0) }
  })
  return { username: USER, source: sourceUrl, from: days[0].date, to: end,
    total: days.reduce((sum, day) => sum + day.count, 0), activeDays: days.filter(day => day.count > 0).length, days, weeks }
}

export function renderActivity(data) {
  const left = 64, right = 932, top = 156, bottom = 290
  const max = Math.max(4, ...data.weeks.map(week => week.count))
  const ceiling = Math.ceil(max / 4) * 4
  const points = data.weeks.map((week, index) => [left + index * (right - left) / 11, bottom - week.count / ceiling * (bottom - top)])
  const coords = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
  const graph = `M${coords.join(' L')}`
  const area = `${graph} L${right},${bottom} L${left},${bottom} Z`
  const dateLabel = date => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const description = `${data.total} public contributions across ${data.activeDays} active days, from ${data.from} to ${data.to}. Each point is a seven-day total from GitHub's public contribution calendar.`
  const ticks = Array.from({ length: 5 }, (_, i) => {
    const y = bottom - i / 4 * (bottom - top)
    return `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="#1b293b"/><text x="46" y="${y + 4}" text-anchor="end" class="tick">${ceiling * i / 4}</text>`
  }).join('')
  const labels = data.weeks.map((week, index) => index % 2 === 0 || index === 11 ? `<text x="${points[index][0]}" y="316" text-anchor="middle" class="tick">${dateLabel(week.to)}</text>` : '').join('')
  const dots = points.map(([x, y], index) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.8" fill="#8ce8f3" stroke="#0a1321" stroke-width="2"><title>${escape(`${data.weeks[index].from} to ${data.weeks[index].to}: ${data.weeks[index].count} contributions`)}</title></circle>`).join('')
  const [lastX, lastY] = points.at(-1)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 370" width="1000" height="370" role="img" aria-labelledby="title description">
<title id="title">Building in the open — ${USER}</title><desc id="description">${escape(description)}</desc>
<defs><linearGradient id="background" x2="1" y2="1"><stop stop-color="#0c1625"/><stop offset="1" stop-color="#080e18"/></linearGradient><linearGradient id="fill" x2="0" y2="1"><stop stop-color="#56d8e8" stop-opacity=".2"/><stop offset="1" stop-color="#56d8e8" stop-opacity="0"/></linearGradient></defs>
<style>text{font-family:Inter,Segoe UI,Arial,sans-serif}.tick{font-size:13px;fill:#8c9db4}.trace{stroke-dasharray:1;animation:reveal 2.3s ease-out both}.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 3s ease-in-out infinite}@keyframes reveal{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes pulse{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:.6;transform:scale(1.45)}}@media(prefers-reduced-motion:reduce){.trace,.pulse{animation:none}}</style>
<rect x=".5" y=".5" width="999" height="369" rx="20" fill="url(#background)" stroke="#203247"/>
<rect x="34" y="35" width="4" height="44" rx="2" fill="#6edce9"/>
<text x="52" y="48" fill="#68d9e7" font-size="11" font-weight="600" letter-spacing="2.8">THE WORK, OVER TIME</text>
<text x="52" y="79" fill="#eef5ff" font-size="27" font-weight="600">Building in the open.</text>
<text x="52" y="105" fill="#91a4bd" font-size="14">Public GitHub contributions · twelve weeks · seven-day totals</text>
<text x="735" y="59" fill="#e8f8ff" font-size="32" font-weight="600" text-anchor="end">${data.total}</text><text x="735" y="82" fill="#91a4bd" font-size="12" text-anchor="end">contributions</text>
<line x1="774" y1="35" x2="774" y2="86" stroke="#25374c"/>
<text x="931" y="59" fill="#e8f8ff" font-size="32" font-weight="600" text-anchor="end">${data.activeDays}<tspan fill="#697e98" font-size="18"> / 84</tspan></text><text x="931" y="82" fill="#91a4bd" font-size="12" text-anchor="end">days with activity</text>
${ticks}<path d="${area}" fill="url(#fill)"/><path d="${graph}" fill="none" stroke="#67dcea" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" pathLength="1" class="trace"/>${dots}<circle cx="${lastX}" cy="${lastY}" r="8" fill="#67dcea" opacity=".25" class="pulse"/>${labels}
<text x="52" y="348" fill="#6f859f" font-size="11">GITHUB PUBLIC CALENDAR · THROUGH ${escape(data.to)}</text><text x="947" y="348" fill="#6f859f" font-size="11" text-anchor="end">LEARN / EXPERIMENT / BUILD / IMPROVE</text>
</svg>\n`
}

async function main() {
  const index = process.argv.indexOf('--source')
  let html
  if (index >= 0) html = await readFile(process.argv[index + 1], 'utf8')
  else {
    const response = await fetch(sourceUrl, { headers: { Accept: 'text/html', 'Accept-Language': 'en-US', 'User-Agent': 'Godavenger-Profile-Activity' }, signal: AbortSignal.timeout(30_000) })
    if (!response.ok) throw new Error(`Public calendar request returned HTTP ${response.status}; existing artwork has been preserved.`)
    html = await response.text()
  }
  if (Buffer.byteLength(html) > 2_000_000) throw new Error('Unexpected calendar response size.')
  const data = activityWindow(parseCalendar(html))
  await mkdir(path.join(root, 'assets'), { recursive: true })
  await mkdir(path.join(root, 'data'), { recursive: true })
  await writeFile(path.join(root, 'assets/activity.svg'), renderActivity(data))
  await writeFile(path.join(root, 'data/activity.json'), `${JSON.stringify(data, null, 2)}\n`)
  console.log(`Updated ${USER}: ${data.total} public contributions across ${data.activeDays} days (${data.from} to ${data.to}).`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1 })
