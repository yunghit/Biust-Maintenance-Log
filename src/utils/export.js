import * as XLSX from 'xlsx';
import { categoryMeta, statusMeta } from './helpers';

export function downloadWorkbook(list, filenameHint) {
  const headers = ['Code', 'Location', 'Room', 'Category', 'Description', 'Status', 'Urgent', 'Reported By', 'Reported At', 'Resolved At', 'Notes'];
  const rows = list.map((t) => [
    t.code || '', t.block || '', t.room || '', categoryMeta(t.category).label, t.description || '',
    statusMeta(t.status).label, t.urgent ? 'Yes' : 'No', t.reportedBy || '', t.reportedAt || '', t.resolvedAt || '',
    Array.isArray(t.notes) ? t.notes.map((n) => n.byName + ': ' + n.text).join(' | ') : '',
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 8 }, { wch: 12 }, { wch: 36 }, { wch: 12 }, { wch: 7 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 40 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tickets');
  XLSX.writeFile(wb, 'bmf-log-' + String(filenameHint).replace(/\s+/g, '-').toLowerCase() + '-' + new Date().toISOString().slice(0, 10) + '.xlsx');
}
