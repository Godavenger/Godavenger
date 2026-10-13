import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseCalendar, activityWindow, renderActivity } from './update-activity.mjs'

function fixture() {
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(Date.UTC(2025, 9, 14) + i * 86_400_000).toISOString().slice(0, 10)
    const count = i === 364 ? 1200 : i % 13 === 0 ? 1 : 0
    return `<td data-date="${date}" id="day-${i}"></td><tool-tip for="day-${i}">${count ? count.toLocaleString('en-US') : 'No'} contribution${count === 1 ? '' : 's'} on a day.</tool-tip>`
  }).reverse().join('\n')
}

test('calendar counts follow their date IDs, including zero, singular and comma-separated values', () => {
  const days = parseCalendar(fixture())
  assert.equal(days.length, 365)
  assert.deepEqual(days[0], { date: '2025-10-14', count: 1 })
  assert.deepEqual(days[1], { date: '2025-10-15', count: 0 })
  assert.deepEqual(days.at(-1), { date: '2026-10-13', count: 1200 })
  const data = activityWindow(days, '2026-10-13')
  assert.equal(data.days.length, 84)
  assert.equal(data.weeks.length, 12)
  assert.equal(data.total, 1206)
  assert.equal(data.activeDays, 7)
  assert.equal(data.weeks.reduce((sum, week) => sum + week.count, 0), data.total)
})

test('missing labels, dates, duplicate dates and non-calendar responses are rejected', () => {
  const html = fixture()
  assert.throws(() => parseCalendar(html.replace('for="day-0"', 'for="missing"')), /format changed/)
  assert.throws(() => parseCalendar(html.replace(/<td data-date="2025-10-15"[^>]+><\/td>/, '')), /missing dates/)
  assert.throws(() => parseCalendar(html.replace('data-date="2025-10-15"', 'data-date="2025-10-14"')), /format changed/)
  assert.throws(() => parseCalendar('<html>Request temporarily blocked.</html>'), /incomplete/)
})

test('stale or future calendars cannot be advertised as a current update', () => {
  const days = parseCalendar(fixture())
  assert.throws(() => activityWindow(days, '2026-10-16'), /stale/)
  assert.throws(() => activityWindow(days, '2026-10-12'), /stale/)
})

test('an entirely inactive window renders a zero baseline without invented activity or invalid coordinates', () => {
  const days = parseCalendar(fixture()).map(day => ({ ...day, count: 0 }))
  const data = activityWindow(days, '2026-10-13')
  const svg = renderActivity(data)
  assert.equal(data.total, 0)
  assert.equal(data.activeDays, 0)
  assert.doesNotMatch(svg, /NaN|Infinity|<script|<foreignObject/)
  assert.match(svg, /0 public contributions across 0 active days/)
  assert.match(svg, /prefers-reduced-motion:reduce/)
})
