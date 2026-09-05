import { useState } from 'react';
import { BLOCKS, BLOCK_GROUPS } from '../utils/constants';
import { downloadWorkbook } from '../utils/export';

export default function SummaryPanel({ tickets, onClose }) {
  const [exportBlock, setExportBlock] = useState('__all__');

  const byBlock = new Map();
  BLOCKS.forEach((b) => byBlock.set(b, { pending: 0, in_progress: 0, no_access: 0, done: 0, urgent: 0, total: 0 }));
  tickets.forEach((t) => {
    if (!byBlock.has(t.block)) byBlock.set(t.block, { pending: 0, in_progress: 0, no_access: 0, done: 0, urgent: 0, total: 0 });
    const row = byBlock.get(t.block);
    row[t.status] = (row[t.status] || 0) + 1;
    row.total++;
    if (t.urgent && t.status !== 'done') row.urgent++;
  });

  function handleExport() {
    const list = exportBlock === '__all__' ? tickets : tickets.filter((t) => t.block === exportBlock);
    downloadWorkbook(list, exportBlock === '__all__' ? 'all' : exportBlock);
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="display">Summary by location</h2>
          <button type="button" className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <table className="summary-table">
          <thead>
            <tr><th>Location</th><th>Pend</th><th>Prog</th><th>No acc</th><th>Done</th><th>Total</th></tr>
          </thead>
          <tbody>
            {[...byBlock.entries()].map(([b, r]) => (
              <tr key={b}>
                <td>{b}{r.urgent ? ' 🚩' : ''}</td>
                <td>{r.pending}</td><td>{r.in_progress}</td><td>{r.no_access}</td><td>{r.done}</td><td>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="dash" style={{ margin: '16px 0 12px' }}></div>
        <label className="field-label">Export</label>
        <select className="input" style={{ margin: '6px 0' }} value={exportBlock} onChange={(e) => setExportBlock(e.target.value)}>
          <option value="__all__">All locations</option>
          {BLOCK_GROUPS.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((b) => <option key={b} value={b}>{b}</option>)}
            </optgroup>
          ))}
        </select>
        <button type="button" className="submit-btn" style={{ background: '#5B9BD5' }} onClick={handleExport}>Download Excel</button>
      </div>
    </div>
  );
}
