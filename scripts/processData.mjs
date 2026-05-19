import { createReadStream } from 'fs'
import { writeFile, mkdir } from 'fs/promises'
import { createInterface } from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSV_PATH = '/Users/grace/Downloads/Health_Inspection_Scores_(2024-Present)_20260519.csv'
const OUT_PATH = path.join(__dirname, '../public/restaurants.json')

function parseCSVLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

// Split the violation_codes blob into individual violations.
// Each violation looks like:  "12345, 12345.1 - Description text."
// Multiple violations are joined with ", " after the period, so we split on /\.\s*,\s*(?=\d)/
function parseViolations(raw) {
  if (!raw || !raw.trim()) return []
  const parts = raw.split(/\.\s*,\s*(?=\d)/)
  return parts.map(p => p.trim()).filter(Boolean).map(p => {
    const dashIdx = p.indexOf(' - ')
    if (dashIdx === -1) return { codes: p.trim(), description: '' }
    const codes = p.slice(0, dashIdx).trim()
    const description = p.slice(dashIdx + 3).trim()
    // Ensure description ends with period
    return { codes, description: description.endsWith('.') ? description : description + '.' }
  })
}

async function main() {
  const rl = createInterface({ input: createReadStream(CSV_PATH) })
  let headers = null
  const byPermit = {}

  for await (const line of rl) {
    if (!line.trim()) continue
    const fields = parseCSVLine(line)
    if (!headers) { headers = fields; continue }

    const row = {}
    headers.forEach((h, i) => { row[h] = fields[i] ?? '' })

    const key = row.permit_number
    if (!key) continue

    const inspection = {
      date: row.inspection_date ? row.inspection_date.split(' ')[0] : '',
      status: row.facility_rating_status,
      violationCount: parseInt(row.violation_count) || 0,
      violations: parseViolations(row.violation_codes),
      inspectionType: row.inspection_type,
      inspector: row.inspector,
      notes: row.inspection_notes,
    }

    if (!byPermit[key]) {
      byPermit[key] = {
        id: key,
        name: row.dba,
        address: row.street_address_clean || row.street_address,
        permitType: row.permit_type,
        neighborhood: row.analysis_neighborhood,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        inspections: [],
      }
    }
    byPermit[key].inspections.push(inspection)
  }

  const restaurants = Object.values(byPermit).map(r => {
    // Sort inspections newest first
    r.inspections.sort((a, b) => b.date.localeCompare(a.date))
    const latest = r.inspections[0]
    return {
      ...r,
      latestStatus: latest?.status || '',
      latestDate: latest?.date || '',
      latestViolationCount: latest?.violationCount || 0,
      latestViolations: latest?.violations || [],
    }
  })

  // Sort alphabetically by name
  restaurants.sort((a, b) => a.name.localeCompare(b.name))

  await writeFile(OUT_PATH, JSON.stringify(restaurants))
  console.log(`Wrote ${restaurants.length} restaurants to ${OUT_PATH}`)
}

main().catch(err => { console.error(err); process.exit(1) })
