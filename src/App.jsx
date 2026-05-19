import { useState, useEffect, useMemo } from 'react'
import RestaurantCard from './RestaurantCard.jsx'
import styles from './App.module.css'

const STATUS_ORDER = { 'Closure': 0, 'Conditional Pass': 1, 'Pass': 2, '': 3 }

export default function App() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetch('/restaurants.json')
      .then(r => r.json())
      .then(data => { setRestaurants(data); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    let result = restaurants

    if (q) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.neighborhood.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter(r => r.latestStatus === statusFilter)
    }

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'violations_desc') {
      result = [...result].sort((a, b) => b.latestViolationCount - a.latestViolationCount)
    } else if (sortBy === 'status') {
      result = [...result].sort((a, b) =>
        (STATUS_ORDER[a.latestStatus] ?? 3) - (STATUS_ORDER[b.latestStatus] ?? 3)
      )
    } else if (sortBy === 'date') {
      result = [...result].sort((a, b) => b.latestDate.localeCompare(a.latestDate))
    }

    return result
  }, [restaurants, query, statusFilter, sortBy])

  const counts = useMemo(() => {
    const c = { Pass: 0, 'Conditional Pass': 0, Closure: 0, '': 0 }
    restaurants.forEach(r => { c[r.latestStatus] = (c[r.latestStatus] || 0) + 1 })
    return c
  }, [restaurants])

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>SF Restaurant Health Inspections</h1>
          <p className={styles.subtitle}>{restaurants.length.toLocaleString()} establishments · 2024–present</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name, address, or neighborhood…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        <div className={styles.filters}>
          <div className={styles.statusPills}>
            {['All', 'Pass', 'Conditional Pass', 'Closure'].map(s => (
              <button
                key={s}
                className={`${styles.pill} ${statusFilter === s ? styles.pillActive : ''} ${styles['pill_' + s.replace(' ', '_')]}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
                {s !== 'All' && <span className={styles.pillCount}>{(counts[s] || 0).toLocaleString()}</span>}
                {s === 'All' && <span className={styles.pillCount}>{restaurants.length.toLocaleString()}</span>}
              </button>
            ))}
          </div>

          <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Sort: Name A–Z</option>
            <option value="violations_desc">Sort: Most Violations</option>
            <option value="status">Sort: Worst Status First</option>
            <option value="date">Sort: Most Recent</option>
          </select>
        </div>
      </div>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.empty}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No results for "{query}"</div>
        ) : (
          <>
            <p className={styles.resultCount}>
              {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className={styles.list}>
              {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
