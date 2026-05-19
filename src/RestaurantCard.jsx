import styles from './RestaurantCard.module.css'

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

export default function RestaurantCard({ restaurant, onClick }) {
  const { name, address, neighborhood, latestStatus, latestDate, latestViolationCount } = restaurant
  const statusCfg = STATUS_CONFIG[latestStatus] || STATUS_CONFIG['']

  const violationClass =
    latestViolationCount >= 5 ? styles.violationCountHigh :
    latestViolationCount >= 3 ? styles.violationCountMid :
    styles.violationCountLow

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={`${styles.statusStripe} ${styles['stripe_' + statusCfg.className]}`} />
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={`${styles.badge} ${styles['badge_' + statusCfg.className]}`}>
            {statusCfg.label}
          </span>
          {latestDate && <span className={styles.date}>{formatDate(latestDate)}</span>}
        </div>

        <h2 className={styles.name}>{name}</h2>
        <p className={styles.address}>{address}</p>
        {neighborhood && <p className={styles.neighborhood}>{neighborhood}</p>}

        <div className={styles.footer}>
          {latestViolationCount > 0 ? (
            <span className={`${styles.violationCount} ${violationClass}`}>
              <span className={styles.violationNumber}>{latestViolationCount}</span>
              <span className={styles.violationLabel}> violation{latestViolationCount !== 1 ? 's' : ''}</span>
            </span>
          ) : (
            <span className={styles.clean}>No violations</span>
          )}
          <span className={styles.detailHint}>View details →</span>
        </div>
      </div>
    </div>
  )
}
