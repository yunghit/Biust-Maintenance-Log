import { useMemo, useState } from 'react';
import { BLOCKS } from '../utils/constants';
import { isArchived, ticketMatchesSearch } from '../utils/helpers';
import TicketCard from './TicketCard';

export default function BoardList({ tickets, loading, search, filterStatus, filterCategory, filterUrgent, onOpen, onOpenPhoto }) {
  const [collapsedBlocks, setCollapsedBlocks] = useState(() => new Set());

  const filtered = useMemo(() => {
    return tickets
      .filter((t) => {
        const archived = isArchived(t);
        if (filterStatus === 'archived') return archived;
        if (archived) return false;
        if (filterStatus !== 'all' && t.status !== filterStatus) return false;
        if (filterCategory !== 'all' && t.category !== filterCategory) return false;
        if (filterUrgent && !t.urgent) return false;
        if (!ticketMatchesSearch(t, search)) return false;
        return true;
      })
      .sort((a, b) => {
        const aUrg = a.urgent && a.status !== 'done';
        const bUrg = b.urgent && b.status !== 'done';
        if (aUrg !== bUrg) return aUrg ? -1 : 1;
        return new Date(b.reportedAt) - new Date(a.reportedAt);
      });
  }, [tickets, search, filterStatus, filterCategory, filterUrgent]);

  if (loading) {
    return <div className="loading-wrap"><div className="spinner"></div></div>;
  }
  if (filtered.length === 0) {
    return <div className="empty-card">{tickets.length === 0 ? 'No issues logged yet.' : 'Nothing matches these filters.'}</div>;
  }

  const byBlock = new Map();
  filtered.forEach((t) => {
    if (!byBlock.has(t.block)) byBlock.set(t.block, []);
    byBlock.get(t.block).push(t);
  });
  const knownOrder = BLOCKS.filter((b) => byBlock.has(b));
  const extras = [...byBlock.keys()].filter((b) => !BLOCKS.includes(b)).sort();
  const orderedBlockNames = knownOrder.concat(extras);

  function toggle(block) {
    setCollapsedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(block)) next.delete(block); else next.add(block);
      return next;
    });
  }

  return (
    <div>
      {orderedBlockNames.map((block) => {
        const group = byBlock.get(block);
        const collapsed = collapsedBlocks.has(block);
        const urgentInGroup = group.some((t) => t.urgent && t.status !== 'done');
        return (
          <div key={block} className="block-group">
            <button type="button" className="block-group-header" onClick={() => toggle(block)}>
              <span className="block-group-title">{urgentInGroup ? '🚩 ' : ''}{block}</span>
              <span className="block-group-count">{group.length}</span>
              <span className="block-group-chevron">{collapsed ? '▸' : '▾'}</span>
            </button>
            {!collapsed && (
              <div className="block-group-body">
                {group.map((t) => (
                  <TicketCard key={t.id} ticket={t} onOpen={onOpen} onOpenPhoto={onOpenPhoto} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
