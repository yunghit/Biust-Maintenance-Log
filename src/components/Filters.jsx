import { STATUSES, CATEGORIES } from '../utils/constants';
import { isArchived } from '../utils/helpers';

function Chip({ active, color, onClick, children }) {
  const bg = active ? (color || '#E8ECF4') : 'transparent';
  const bd = active ? (color || '#E8ECF4') : '#2A3550';
  const fg = active ? '#0B1220' : '#8B96AD';
  return (
    <button type="button" className="chip" style={{ background: bg, borderColor: bd, color: fg }} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Filters({ tickets, search, setSearch, filterStatus, setFilterStatus, filterCategory, setFilterCategory, filterUrgent, setFilterUrgent }) {
  const archivedCount = tickets.filter(isArchived).length;
  const urgentCount = tickets.filter((t) => t.urgent && t.status !== 'done' && !isArchived(t)).length;

  return (
    <>
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          id="searchInput"
          className="input"
          placeholder="Search room, location, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="chip-row">
        <Chip active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>All status</Chip>
        {STATUSES.map((s) => (
          <Chip key={s.id} active={filterStatus === s.id} color={s.color} onClick={() => setFilterStatus(s.id)}>{s.label}</Chip>
        ))}
        <Chip active={filterStatus === 'archived'} color="#8B96AD" onClick={() => setFilterStatus('archived')}>Archived ({archivedCount})</Chip>
      </div>
      <div className="chip-row">
        <Chip active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>All types</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={filterCategory === c.id} onClick={() => setFilterCategory(c.id)}>{c.icon} {c.label}</Chip>
        ))}
        <button
          type="button"
          className={'chip' + (filterUrgent ? ' chip-urgent-active' : '')}
          onClick={() => setFilterUrgent((u) => !u)}
        >
          🚩 Urgent ({urgentCount})
        </button>
      </div>
    </>
  );
}
