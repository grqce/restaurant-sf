import { useEffect } from 'react'
import styles from './Modal.module.css'

const STATUS_CONFIG = {
  'Pass':             { label: 'Pass',             className: 'pass' },
  'Conditional Pass': { label: 'Conditional Pass', className: 'conditional' },
  'Closure':          { label: 'Closure',           className: 'closure' },
  '':                 { label: 'N/A',               className: 'na' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Modal({ restaurant, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const { name, address, neighborhood, permitType, latestStatus, latestDate, latestViolations, inspections } = restaurant
  const latestInspector = inspections[0]?.inspector
  const statusCfg = STATUS_CONFIG[latestStatus] || STATUS_CONFIG['']
  const hasViolations = latestViolations && latestViolations.length > 0
  const pastInspections = inspections.slice(1)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel} role="dialog" aria-modal="true">
        <div className={`${styles.stripe} ${styles['stripe_' + statusCfg.className]}`} />
        <div className={styles.content}>

          <div className={styles.topRow}>
            <span className={`${styles.badge} ${styles['badge_' + statusCfg.className]}`}>
              {statusCfg.label}
            </span>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
          </div>

          <h2 className={styles.name}>{name}</h2>
          <div className={styles.meta}>
            <span>{address}</span>
            {neighborhood && (
              <div className={styles.metaRow}>
                <span className={styles.metaDot}>·</span>
                <span>{neighborhood}</span>
              </div>
            )}
            {latestDate && (
              <div className={styles.metaRow}>
                <span className={styles.metaDot}>·</span>
                <span>Last inspected {formatDate(latestDate)}</span>
              </div>
            )}
            {latestInspector && (
              <div className={styles.metaRow}>
                <span className={styles.metaDot}>·</span>
                <span>Inspector: <strong>{latestInspector}</strong></span>
              </div>
            )}
          </div>
          {permitType && <span className={styles.permitType}>{permitType}</span>}

          <div className={styles.divider} />

          {hasViolations ? (
            <>
              <p className={styles.sectionTitle}>
                {latestViolations.length} Violation{latestViolations.length !== 1 ? 's' : ''} · Most Recent Inspection
              </p>
              <ul className={styles.violationList}>
                {latestViolations.map((v, i) => (
                  <li key={i} className={styles.violation}>
                    <span className={styles.violationCode}>{v.codes}</span>
                    {v.description && <span className={styles.violationDesc}>{v.description}</span>}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.passedNote}>
              Passed most recent inspection with no violations.
            </p>
          )}

          {inspections[0]?.notes && (
            <>
              <div className={styles.divider} />
              <div className={styles.notes}>
                <span className={styles.notesLabel}>Inspector Notes</span>
                {inspections[0].notes}
              </div>
            </>
          )}

          {pastInspections.length > 0 && (
            <>
              <div className={styles.divider} />
              <p className={styles.sectionTitle}>Inspection History</p>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Result</th>
                    <th>Violations</th>
                    <th>Inspector</th>
                  </tr>
                </thead>
                <tbody>
                  {pastInspections.map((insp, i) => {
                    const cfg = STATUS_CONFIG[insp.status] || STATUS_CONFIG['']
                    return (
                      <tr key={i}>
                        <td>{formatDate(insp.date)}</td>
                        <td>
                          <span className={`${styles.badgeSm} ${styles['badge_' + cfg.className]}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td>
                          {insp.violationCount > 0
                            ? `${insp.violationCount} violation${insp.violationCount !== 1 ? 's' : ''}`
                            : '—'}
                        </td>
                        <td>{insp.inspector || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
