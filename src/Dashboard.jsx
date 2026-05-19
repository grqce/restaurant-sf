import { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'
import styles from './Dashboard.module.css'

// ── Data ────────────────────────────────────────────────────────────────────

const nb = [{"analysis_neighborhood":"Japantown","total":227,"failures":30,"closures":7,"avg_violations":4.18,"failure_rate":13.2,"closure_rate":3.1},{"analysis_neighborhood":"Oceanview/Merced/Ingleside","total":124,"failures":13,"closures":9,"avg_violations":7.06,"failure_rate":10.5,"closure_rate":7.3},{"analysis_neighborhood":"Glen Park","total":64,"failures":5,"closures":2,"avg_violations":4.25,"failure_rate":7.8,"closure_rate":3.1},{"analysis_neighborhood":"Bernal Heights","total":333,"failures":26,"closures":13,"avg_violations":5.01,"failure_rate":7.8,"closure_rate":3.9},{"analysis_neighborhood":"North Beach","total":999,"failures":78,"closures":36,"avg_violations":4.49,"failure_rate":7.8,"closure_rate":3.6},{"analysis_neighborhood":"Mission","total":2685,"failures":204,"closures":72,"avg_violations":5.07,"failure_rate":7.6,"closure_rate":2.7},{"analysis_neighborhood":"Chinatown","total":1372,"failures":100,"closures":44,"avg_violations":4.54,"failure_rate":7.3,"closure_rate":3.2},{"analysis_neighborhood":"Outer Mission","total":154,"failures":11,"closures":5,"avg_violations":3.75,"failure_rate":7.1,"closure_rate":3.2},{"analysis_neighborhood":"Marina","total":588,"failures":42,"closures":6,"avg_violations":3.16,"failure_rate":7.1,"closure_rate":1.0},{"analysis_neighborhood":"Lakeshore","total":300,"failures":21,"closures":13,"avg_violations":5.64,"failure_rate":7.0,"closure_rate":4.3},{"analysis_neighborhood":"Castro/Upper Market","total":468,"failures":32,"closures":12,"avg_violations":3.47,"failure_rate":6.8,"closure_rate":2.6},{"analysis_neighborhood":"Sunset/Parkside","total":1061,"failures":72,"closures":32,"avg_violations":3.51,"failure_rate":6.8,"closure_rate":3.0},{"analysis_neighborhood":"Noe Valley","total":300,"failures":19,"closures":9,"avg_violations":4.89,"failure_rate":6.3,"closure_rate":3.0},{"analysis_neighborhood":"Excelsior","total":247,"failures":14,"closures":7,"avg_violations":3.44,"failure_rate":5.7,"closure_rate":2.8},{"analysis_neighborhood":"West of Twin Peaks","total":413,"failures":23,"closures":11,"avg_violations":4.97,"failure_rate":5.6,"closure_rate":2.7},{"analysis_neighborhood":"South of Market","total":760,"failures":40,"closures":22,"avg_violations":4.03,"failure_rate":5.3,"closure_rate":2.9},{"analysis_neighborhood":"Lone Mountain/USF","total":165,"failures":8,"closures":1,"avg_violations":3.63,"failure_rate":4.8,"closure_rate":0.6},{"analysis_neighborhood":"Outer Richmond","total":687,"failures":32,"closures":11,"avg_violations":3.86,"failure_rate":4.7,"closure_rate":1.6},{"analysis_neighborhood":"Hayes Valley","total":514,"failures":23,"closures":12,"avg_violations":3.0,"failure_rate":4.5,"closure_rate":2.3},{"analysis_neighborhood":"Presidio Heights","total":112,"failures":5,"closures":1,"avg_violations":3.45,"failure_rate":4.5,"closure_rate":0.9},{"analysis_neighborhood":"Financial District/South Beach","total":2429,"failures":91,"closures":35,"avg_violations":3.49,"failure_rate":3.7,"closure_rate":1.4},{"analysis_neighborhood":"Inner Sunset","total":533,"failures":20,"closures":2,"avg_violations":3.14,"failure_rate":3.8,"closure_rate":0.4},{"analysis_neighborhood":"Tenderloin","total":1728,"failures":63,"closures":35,"avg_violations":3.65,"failure_rate":3.6,"closure_rate":2.0},{"analysis_neighborhood":"Inner Richmond","total":459,"failures":15,"closures":7,"avg_violations":3.78,"failure_rate":3.3,"closure_rate":1.5},{"analysis_neighborhood":"Nob Hill","total":695,"failures":30,"closures":12,"avg_violations":3.83,"failure_rate":4.3,"closure_rate":1.7},{"analysis_neighborhood":"Haight Ashbury","total":277,"failures":7,"closures":2,"avg_violations":4.33,"failure_rate":2.5,"closure_rate":0.7},{"analysis_neighborhood":"Western Addition","total":315,"failures":8,"closures":3,"avg_violations":3.2,"failure_rate":2.5,"closure_rate":1.0},{"analysis_neighborhood":"Bayview Hunters Point","total":734,"failures":22,"closures":11,"avg_violations":3.52,"failure_rate":3.0,"closure_rate":1.5},{"analysis_neighborhood":"Mission Bay","total":1088,"failures":32,"closures":7,"avg_violations":3.07,"failure_rate":2.9,"closure_rate":0.6},{"analysis_neighborhood":"Pacific Heights","total":353,"failures":4,"closures":2,"avg_violations":3.75,"failure_rate":1.1,"closure_rate":0.6},{"analysis_neighborhood":"Potrero Hill","total":412,"failures":1,"closures":0,"avg_violations":3.68,"failure_rate":0.2,"closure_rate":0.0}]

const ins = [{"inspector":"Cristina Fung-Autry","total":408,"failures":63,"avg_violations":8.04,"failure_rate":15.4},{"inspector":"Michael Mooney","total":1380,"failures":180,"avg_violations":4.71,"failure_rate":13.0},{"inspector":"Amelia Castelli","total":496,"failures":56,"avg_violations":2.5,"failure_rate":11.3},{"inspector":"Usman Javaid","total":154,"failures":17,"avg_violations":3.85,"failure_rate":11.0},{"inspector":"Carlos Barragan","total":483,"failures":47,"avg_violations":5.23,"failure_rate":9.7},{"inspector":"Maribel Rodriguez","total":807,"failures":69,"avg_violations":5.12,"failure_rate":8.6},{"inspector":"Katie Dea","total":998,"failures":83,"avg_violations":4.03,"failure_rate":8.3},{"inspector":"Tiombe Wiley","total":575,"failures":42,"avg_violations":3.87,"failure_rate":7.3},{"inspector":"Sojeatta Khim","total":130,"failures":9,"avg_violations":4.57,"failure_rate":6.9},{"inspector":"Jessica Jang","total":403,"failures":28,"avg_violations":4.57,"failure_rate":6.9},{"inspector":"Patrick Wood","total":1192,"failures":80,"avg_violations":3.01,"failure_rate":6.7},{"inspector":"Katherine Tuazon","total":167,"failures":11,"avg_violations":4.22,"failure_rate":6.6},{"inspector":"Christina Lee","total":307,"failures":19,"avg_violations":3.41,"failure_rate":6.2},{"inspector":"Alyssa Manzano","total":456,"failures":28,"avg_violations":3.89,"failure_rate":6.1},{"inspector":"William Bajjalieh","total":1133,"failures":68,"avg_violations":2.81,"failure_rate":6.0},{"inspector":"Roy Bwogi","total":388,"failures":21,"avg_violations":3.95,"failure_rate":5.4},{"inspector":"Aron Wong","total":414,"failures":22,"avg_violations":2.67,"failure_rate":5.3},{"inspector":"Luz Brown","total":822,"failures":35,"avg_violations":6.74,"failure_rate":4.3},{"inspector":"John Wells","total":1475,"failures":58,"avg_violations":4.08,"failure_rate":3.9},{"inspector":"Montre Tieu","total":126,"failures":4,"avg_violations":4.28,"failure_rate":3.2},{"inspector":"Abel Simon","total":258,"failures":8,"avg_violations":3.1,"failure_rate":3.1},{"inspector":"Joanna Huber","total":416,"failures":12,"avg_violations":5.75,"failure_rate":2.9},{"inspector":"Amy Johnson","total":861,"failures":24,"avg_violations":4.18,"failure_rate":2.8},{"inspector":"Kristine Der","total":462,"failures":12,"avg_violations":6.71,"failure_rate":2.6},{"inspector":"Farhan Khan","total":675,"failures":17,"avg_violations":2.83,"failure_rate":2.5},{"inspector":"Sharon Aguila-Leonard","total":941,"failures":22,"avg_violations":2.59,"failure_rate":2.3},{"inspector":"Sophia Huie","total":943,"failures":21,"avg_violations":3.28,"failure_rate":2.2},{"inspector":"Jesus Zapien","total":754,"failures":11,"avg_violations":2.31,"failure_rate":1.5},{"inspector":"Zack Parsons","total":686,"failures":9,"avg_violations":3.1,"failure_rate":1.3},{"inspector":"Danny Nguyen","total":253,"failures":2,"avg_violations":2.4,"failure_rate":0.8},{"inspector":"Rochelle Veloso","total":637,"failures":1,"avg_violations":5.62,"failure_rate":0.2},{"inspector":"Albert Felipe","total":112,"failures":0,"avg_violations":1.83,"failure_rate":0.0},{"inspector":"Ivy Phan","total":148,"failures":0,"avg_violations":1.41,"failure_rate":0.0}]

const dow = [{"dow":"Monday","total":2276,"failures":164,"avg_violations":4.54,"failure_rate":7.2},{"dow":"Tuesday","total":5033,"failures":302,"avg_violations":4.17,"failure_rate":6.0},{"dow":"Wednesday","total":5368,"failures":280,"avg_violations":4.04,"failure_rate":5.2},{"dow":"Thursday","total":4820,"failures":224,"avg_violations":4.0,"failure_rate":4.6},{"dow":"Friday","total":3613,"failures":132,"avg_violations":3.59,"failure_rate":3.7},{"dow":"Saturday","total":125,"failures":1,"avg_violations":2.29,"failure_rate":0.8},{"dow":"Sunday","total":159,"failures":10,"avg_violations":1.61,"failure_rate":6.3}]

const monthly = [{"month":1,"total":2322,"failures":129,"avg_violations":3.93,"failure_rate":5.6,"month_name":"Jan"},{"month":2,"total":2188,"failures":117,"avg_violations":3.98,"failure_rate":5.3,"month_name":"Feb"},{"month":3,"total":2306,"failures":104,"avg_violations":4.09,"failure_rate":4.5,"month_name":"Mar"},{"month":4,"total":2642,"failures":107,"avg_violations":3.99,"failure_rate":4.0,"month_name":"Apr"},{"month":5,"total":2518,"failures":114,"avg_violations":3.81,"failure_rate":4.5,"month_name":"May"},{"month":6,"total":1825,"failures":110,"avg_violations":4.04,"failure_rate":6.0,"month_name":"Jun"},{"month":7,"total":1277,"failures":66,"avg_violations":4.19,"failure_rate":5.2,"month_name":"Jul"},{"month":8,"total":1411,"failures":89,"avg_violations":4.37,"failure_rate":6.3,"month_name":"Aug"},{"month":9,"total":1092,"failures":70,"avg_violations":4.42,"failure_rate":6.4,"month_name":"Sep"},{"month":10,"total":1317,"failures":77,"avg_violations":3.93,"failure_rate":5.8,"month_name":"Oct"},{"month":11,"total":1197,"failures":62,"avg_violations":3.94,"failure_rate":5.2,"month_name":"Nov"},{"month":12,"total":1299,"failures":68,"avg_violations":3.94,"failure_rate":5.2,"month_name":"Dec"}]

const pt = [{"label":"RETAIL MKTS W/O PREP (OVER 20000)","failure_rate":12.9,"closure_rate":3.2,"total":31},{"label":"RETAIL MKTS W/FOOD PREP (5001-10000)","failure_rate":8.0,"closure_rate":5.3,"total":75},{"label":"RESTAURANT 1,000-2,000 SQFT","failure_rate":7.5,"closure_rate":3.2,"total":4762},{"label":"RESTAURANT OVER 2,000 SQFT","failure_rate":7.3,"closure_rate":2.6,"total":3681},{"label":"TAKE-OUTS","failure_rate":7.2,"closure_rate":2.8,"total":432},{"label":"CERTIFIED FARMERS MARKETS","failure_rate":7.2,"closure_rate":6.5,"total":153},{"label":"RETAIL MKTS W/O PREP (5001-10000)","failure_rate":7.0,"closure_rate":0.0,"total":71},{"label":"RESTAURANT UNDER 1,000 SQFT","failure_rate":6.6,"closure_rate":2.7,"total":3843},{"label":"SUPERMARKETS >20K SQFT","failure_rate":6.5,"closure_rate":4.3,"total":46},{"label":"RETAIL MKTS W/O PREP (10001-20000)","failure_rate":6.2,"closure_rate":1.5,"total":65},{"label":"RETAIL BAKERIES WITH FOOD PREP","failure_rate":5.5,"closure_rate":3.0,"total":200},{"label":"RETAIL MKTS W/FOOD PREP <5001","failure_rate":5.4,"closure_rate":1.6,"total":1015},{"label":"FOOD PREP AND SERVICE (FEE EXEMPT)","failure_rate":5.0,"closure_rate":3.4,"total":179},{"label":"RETAIL MKTS W/FOOD PREP (10001-20000)","failure_rate":4.7,"closure_rate":0.9,"total":106},{"label":"COMMISSARIES","failure_rate":4.0,"closure_rate":3.0,"total":100}]

const repeat = [{"dba":"YARSA NEPALESE CUISINE","neighborhood":"North Beach","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":5},{"dba":"GOLDEN FLOWER VIETNAMESE RESTA","neighborhood":"Chinatown","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":5},{"dba":"PICA PICA","neighborhood":"Mission","permit_type":"H25 - RESTAURANT 1,000 - 2,000 SQFT","closure_count":4},{"dba":"LA FLOR DE IZOTE","neighborhood":"Bernal Heights","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":4},{"dba":"LINDO YUCATAN","neighborhood":"Tenderloin","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":4},{"dba":"AGRICULTURAL INSTITUTE OF MARIN","neighborhood":"Inner Richmond","permit_type":"H14 - CERTIFIED FARMERS MARKETS","closure_count":3},{"dba":"DIVISADERO CFM","neighborhood":"Hayes Valley","permit_type":"H14 - CERTIFIED FARMERS MARKETS","closure_count":3},{"dba":"SUNSET MERCANTILE / OUTER SUNSET FARMERS MARKET","neighborhood":"Sunset/Parkside","permit_type":"H14 - CERTIFIED FARMERS MARKETS","closure_count":3},{"dba":"B & J 1/4LB BURGER","neighborhood":"Bayview Hunters Point","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":3},{"dba":"NEW CHEUNG HING RESTAURANT","neighborhood":"Sunset/Parkside","permit_type":"H25 - RESTAURANT 1,000 - 2,000 SQFT","closure_count":3},{"dba":"VANIDA THAI KITCHEN","neighborhood":"Sunset/Parkside","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":3},{"dba":"DELICIOUS DIMSUM","neighborhood":"Chinatown","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":3},{"dba":"COCOBANG","neighborhood":"Tenderloin","permit_type":"H24 - RESTAURANT UNDER 1,000 SQFT","closure_count":3},{"dba":"NOE INDIAN CUISINE","neighborhood":"Noe Valley","permit_type":"H25 - RESTAURANT 1,000 - 2,000 SQFT","closure_count":3},{"dba":"RHEA'S MARKET & DELI","neighborhood":"Mission","permit_type":"H07 - RETAIL MKTS W/FOOD PREP","closure_count":3},{"dba":"CHEESEBOAT","neighborhood":"North Beach","permit_type":"H25 - RESTAURANT 1,000 - 2,000 SQFT","closure_count":3},{"dba":"NICK'S LIGHTHOUSE","neighborhood":"Financial District/South Beach","permit_type":"H33 - COMMISSARIES","closure_count":3},{"dba":"DOSA CORNER INDIAN CUISINE","neighborhood":"Mission","permit_type":"H25 - RESTAURANT 1,000 - 2,000 SQFT","closure_count":3},{"dba":"FAIRMONT SAN FRANCISCO","neighborhood":"Nob Hill","permit_type":"H26 - RESTAURANT OVER 2,000 SQFT","closure_count":3},{"dba":"TCM FORTUNE","neighborhood":"Outer Richmond","permit_type":"H25 - RESTAURANT 1,000 - 2,000 SQFT","closure_count":3}]

const AVG_FR = 5.4

// ── Chart canvas helper ──────────────────────────────────────────────────────

function ChartBox({ config, height = 300, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const chart = new Chart(ref.current, config)
    return () => chart.destroy()
  }, [])
  return (
    <div style={{ position: 'relative', height }}>
      <canvas ref={ref} aria-label={label} />
    </div>
  )
}

// ── Panels ───────────────────────────────────────────────────────────────────

function NeighborhoodPanel() {
  const nbSorted = [...nb].sort((a, b) => b.failure_rate - a.failure_rate)
  const nbViolSorted = [...nb].sort((a, b) => b.avg_violations - a.avg_violations)

  const nbChartConfig = {
    type: 'bar',
    data: {
      labels: nbSorted.map(d => d.analysis_neighborhood),
      datasets: [{
        label: 'Failure rate %',
        data: nbSorted.map(d => d.failure_rate),
        backgroundColor: nbSorted.map(d => d.failure_rate > AVG_FR ? '#E24B4A' : '#85B7EB'),
      }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { title: { display: true, text: 'Failure rate (%)' } } }
    }
  }

  const nbViolChartConfig = {
    type: 'bar',
    data: {
      labels: nbViolSorted.map(d => d.analysis_neighborhood),
      datasets: [{
        label: 'Avg violations',
        data: nbViolSorted.map(d => d.avg_violations),
        backgroundColor: '#85B7EB',
      }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { title: { display: true, text: 'Avg violations per inspection' } } }
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Failure rate by neighborhood</div>
          <div className={styles.cardSub}>% of inspections resulting in Closure or Conditional Pass (min 20 inspections)</div>
          <ChartBox config={nbChartConfig} height={520} label="Bar chart of failure rates by SF neighborhood" />
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Average violations by neighborhood</div>
          <div className={styles.cardSub}>Mean violation count per inspection (includes pass inspections)</div>
          <ChartBox config={nbViolChartConfig} height={520} label="Bar chart of average violations by neighborhood" />
        </div>
      </div>
    </div>
  )
}

function InspectorPanel() {
  const insSorted = [...ins].sort((a, b) => b.failure_rate - a.failure_rate)

  const insBarConfig = {
    type: 'bar',
    data: {
      labels: insSorted.map(d => d.inspector),
      datasets: [{
        label: 'Failure rate %',
        data: insSorted.map(d => d.failure_rate),
        backgroundColor: insSorted.map(d => d.failure_rate > AVG_FR ? '#E24B4A' : '#85B7EB'),
      }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { title: { display: true, text: 'Failure rate (%)' } } }
    }
  }

  const insScatterConfig = {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Inspector',
        data: ins.map(d => ({ x: d.avg_violations, y: d.failure_rate, label: d.inspector })),
        backgroundColor: ins.map(d => d.failure_rate > AVG_FR ? 'rgba(226,75,74,0.7)' : 'rgba(55,138,221,0.7)'),
        pointRadius: ins.map(d => Math.max(4, Math.sqrt(d.total) * 0.4)),
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw.label}: ${ctx.raw.y}% fail, ${ctx.raw.x} avg violations` } }
      },
      scales: {
        x: { title: { display: true, text: 'Avg violations cited' } },
        y: { title: { display: true, text: 'Failure rate (%)' } }
      }
    }
  }

  return (
    <div className={styles.panel}>
      <div className={`${styles.insightBox} ${styles.insightRed}`}>
        <strong>Major finding:</strong> Inspector failure rates span 0% to 15.4% — a 15x gap that can't be explained by territory alone. In the Mission, the same block can see a 0% or 20% failure rate depending purely on who shows up.
      </div>
      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Inspector failure rates</div>
          <div className={styles.cardSub}>Inspectors with ≥100 inspections. Red = above-average failure rate.</div>
          <ChartBox config={insBarConfig} height={600} label="Horizontal bar chart of inspector failure rates" />
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Inspector avg violations vs failure rate</div>
          <div className={styles.cardSub}>High violations + high failures = strict. High violations + low failures = lenient on pass/fail threshold.</div>
          <ChartBox config={insScatterConfig} height={600} label="Scatter plot of inspector violations vs failure rate" />
        </div>
      </div>
    </div>
  )
}

function TimingPanel() {
  const dowConfig = {
    type: 'bar',
    data: {
      labels: dow.map(d => d.dow),
      datasets: [{
        label: 'Failure rate %',
        data: dow.map(d => d.failure_rate),
        backgroundColor: dow.map(d => d.failure_rate > AVG_FR ? '#E24B4A' : d.failure_rate > 4 ? '#EF9F27' : '#1D9E75'),
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { title: { display: true, text: 'Failure rate (%)' } } }
    }
  }

  const monthConfig = {
    type: 'line',
    data: {
      labels: monthly.map(d => d.month_name),
      datasets: [{
        label: 'Failure rate %',
        data: monthly.map(d => d.failure_rate),
        borderColor: '#378ADD', backgroundColor: 'rgba(55,138,221,0.1)',
        tension: 0.3, fill: true, pointRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { title: { display: true, text: 'Failure rate (%)' } } }
    }
  }

  const dowViolConfig = {
    type: 'bar',
    data: {
      labels: dow.map(d => d.dow),
      datasets: [{ label: 'Avg violations', data: dow.map(d => d.avg_violations), backgroundColor: '#85B7EB' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  }

  const monthViolConfig = {
    type: 'line',
    data: {
      labels: monthly.map(d => d.month_name),
      datasets: [{ label: 'Avg violations', data: monthly.map(d => d.avg_violations), borderColor: '#EF9F27', backgroundColor: 'rgba(239,159,39,0.1)', tension: 0.3, fill: true, pointRadius: 4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  }

  return (
    <div className={styles.panel}>
      <div className={`${styles.insightBox} ${styles.insightAmber}`}>
        <strong>Timing matters:</strong> Monday inspections fail at 7.2% vs 3.7% on Fridays. Summer/fall failure rates run 60% higher than spring. When you get inspected predicts outcomes almost as much as what the inspector finds.
      </div>
      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Failure rate by day of week</div>
          <div className={styles.cardSub}>Monday inspections fail at nearly double the Friday rate</div>
          <ChartBox config={dowConfig} height={280} label="Bar chart of failure rate by day of week" />
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Failure rate by month</div>
          <div className={styles.cardSub}>Summer spike likely reflects temperature-driven food safety failures</div>
          <ChartBox config={monthConfig} height={280} label="Line chart of failure rate by month" />
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Avg violations by day of week</div>
          <div className={styles.cardSub}>Violations also peak on Monday — consistent signal, not just threshold-setting</div>
          <ChartBox config={dowViolConfig} height={280} label="Bar chart of avg violations by day of week" />
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Avg violations by month</div>
          <div className={styles.cardSub}>Violation counts track failure rates — summer is genuinely worse</div>
          <ChartBox config={monthViolConfig} height={280} label="Line chart of avg violations by month" />
        </div>
      </div>
    </div>
  )
}

function RepeatPanel() {
  return (
    <div className={styles.panel}>
      <div className={`${styles.insightBox} ${styles.insightRed}`}>
        <strong>Enforcement gap:</strong> Two restaurants have been closed 5 times since January 2024. Five have been closed 4 times. All are still operating. The city's closure-and-reopen cycle appears to have no escalation mechanism.
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Businesses with 2+ closures since Jan 2024</div>
        <div className={styles.cardSub}>Sorted by closure count</div>
        <table className={styles.table}>
          <thead>
            <tr><th>Business</th><th>Neighborhood</th><th>Type</th><th>Closures</th></tr>
          </thead>
          <tbody>
            {repeat.map(d => {
              const pill = d.closure_count >= 5 ? styles.pillRed : d.closure_count >= 4 ? styles.pillAmber : styles.pillBlue
              return (
                <tr key={d.dba}>
                  <td><strong>{d.dba}</strong></td>
                  <td>{d.neighborhood}</td>
                  <td className={styles.permitCell}>{d.permit_type.replace(/^H\d+ - /, '')}</td>
                  <td><span className={`${styles.pill} ${pill}`}>{d.closure_count}x</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'neighborhood', label: 'By Neighborhood' },
  { id: 'inspector',    label: 'Inspector Variance' },
  { id: 'timing',       label: 'Timing Patterns' },
  { id: 'repeat',       label: 'Repeat Offenders' },
]

export default function Dashboard() {
  const [tab, setTab] = useState('neighborhood')

  return (
    <div className={styles.dashboard}>
      <div className={styles.metricsRow}>
        <div className={styles.metric}><div className={styles.metricLabel}>Total inspections</div><div className={styles.metricValue}>21,394</div></div>
        <div className={styles.metric}><div className={styles.metricLabel}>Closures</div><div className={`${styles.metricValue} ${styles.metricRed}`}>450</div></div>
        <div className={styles.metric}><div className={styles.metricLabel}>Conditional pass</div><div className={`${styles.metricValue} ${styles.metricAmber}`}>663</div></div>
        <div className={styles.metric}><div className={styles.metricLabel}>Pass rate</div><div className={`${styles.metricValue} ${styles.metricGreen}`}>87.2%</div></div>
        <div className={styles.metric}><div className={styles.metricLabel}>Avg violations</div><div className={styles.metricValue}>4.0</div></div>
        <div className={styles.metric}><div className={styles.metricLabel}>Worst inspector FR</div><div className={`${styles.metricValue} ${styles.metricRed}`}>15.4%</div></div>
        <div className={styles.metric}><div className={styles.metricLabel}>Best inspector FR</div><div className={`${styles.metricValue} ${styles.metricGreen}`}>0.0%</div></div>
      </div>

      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.subTab} ${tab === t.id ? styles.subTabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'neighborhood' && <NeighborhoodPanel />}
      {tab === 'inspector'    && <InspectorPanel />}
      {tab === 'timing'       && <TimingPanel />}
      {tab === 'repeat'       && <RepeatPanel />}
    </div>
  )
}
