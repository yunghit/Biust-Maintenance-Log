import { STATUSES } from '../utils/constants';
import { isArchived } from '../utils/helpers';

export default function StatsGrid({ tickets }) {
  const counts = { pending: 0, in_progress: 0, no_access: 0, done: 0 };
  tickets.forEach((t) => { if (!isArchived(t)) counts[t.status] = (counts[t.status] || 0) + 1; });

  return (
    <div className="stats-grid">
      {STATUSES.map((s) => (
        <div key={s.id} className="stat-card">
          <div className="mono stat-num" style={{ color: s.color }}>{counts[s.id] || 0}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
