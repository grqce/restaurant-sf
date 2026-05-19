import { useState } from 'react'
import styles from './RestaurantCard.module.css'

const STATUS_CONFIG = {
  'Pass': { label: 'Pass', className: 'pass' },
  'Conditional Pass': { label: 'Conditional Pass', className: 'conditional' },
  'Closure': { label: 'Closure', className: 'closure' },
  '': { label: 'N/A', className: 'na' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('/')
  if (!y || !m || !d) return dateStr
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function RestaurantCard({ restaurant }) {
  const [expanded, setExpanded] = useState(false)
  const [showAllInspections, setShowAllInspections] = useState(false)

  const { name, address, neighborhood, permitType, latestStatus, latestDate, latestViolationCount, latestViolations, inspections } = restaurant
  const statusCfg = STATUS_CONFIG[latestStatus] || STATUS_CONFIG['']
  const hasViolations = latestViolations && latestViolations.length > 0
  const pastInspections = inspections.slice(1)

  return (
    <div className={`${styles.card} ${styles['card_' + statusCfg.className]}`}>
      <div className={styles.header} onClick={() => setExpanded(v => !v)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}>
        <div className={styles.headerLeft}>
          <span className={`${styles.badge} ${styles['badge_' + statusCfg.className]}`}>
            {statusCfg.label}
          </span>
          <div>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.meta}>
              {address}
              {neighborhood && <> · {neighborhood}</>}
            </p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.stats}>
            {latestViolationCount > 0 ? (
              <span className={`${styles.violationCount} ${latestViolationCount >= 5 ? styles.violationCountHigh : latestViolationCount >= 3 ? styles.violationCountMid : ''}`}>
                {latestViolationCount} violation{latestViolationCount !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className={styles.noViolations}>No violations</span>
            )}
            {latestDate && <span className={styles.date}>{formatDate(latestDate)}</span>}
          </div>
          <svg className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {expanded && (
        <div className={styles.body}>
          {permitType && (
            <p className={styles.permitType}>{permitType}</p>
          )}

          {hasViolations ? (
            <div className={styles.violations}>
              <h3 className={styles.violationsTitle}>
                Violations from inspection on {formatDate(latestDate)}
              </h3>
              <ul className={styles.violationList}>
                {latestViolations.map((v, i) => (
                  <li key={i} className={styles.violation}>
                    <span className={styles.violationCode}>{v.codes}</span>
                    {v.description && <span className={styles.violationDesc}>{v.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.passedNote}>
              {latestStatus === 'Pass'
                ? 'Passed most recent inspection with no violations.'
                : latestStatus === ''
                ? 'No inspection result recorded.'
                : 'See inspection notes below.'}
            </p>
          )}

          {inspections[0]?.notes && (
            <div className={styles.notes}>
              <strong>Inspector notes:</strong> {inspections[0].notes}
            </div>
          )}

          {pastInspections.length > 0 && (
            <div className={styles.history}>
              <button className={styles.historyToggle} onClick={() => setShowAllInspections(v => !v)}>
                {showAllInspections ? 'Hide' : 'Show'} {pastInspections.length} past inspection{pastInspections.length !== 1 ? 's' : ''}
              </button>
              {showAllInspections && (
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Result</th>
                      <th>Violations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastInspections.map((insp, i) => {
                      const cfg = STATUS_CONFIG[insp.status] || STATUS_CONFIG['']
                      return (
                        <tr key={i}>
                          <td>{formatDate(insp.date)}</td>
                          <td>
                            <span className={`${styles.badge} ${styles['badge_' + cfg.className]} ${styles.badgeSm}`}>
                              {cfg.label}
                            </span>
                          </td>
                          <td>{insp.violationCount > 0 ? `${insp.violationCount} violation${insp.violationCount !== 1 ? 's' : ''}` : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
