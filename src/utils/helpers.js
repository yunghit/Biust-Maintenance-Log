import { CATEGORIES, STATUSES, SPECIALTIES, ARCHIVE_MS, RESIDENTIAL_BLOCKS } from './constants';

export function categoryMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[3];
}
export function statusMeta(id) {
  return STATUSES.find((s) => s.id === id) || STATUSES[0];
}
export function specialtyLabel(id) {
  const s = SPECIALTIES.find((x) => x.id === id);
  return s ? s.label : 'All categories';
}
export function isArchived(t) {
  return t.status === 'done' && t.resolvedAt && Date.now() - new Date(t.resolvedAt).getTime() > ARCHIVE_MS;
}
export function isResidentialBlock(b) {
  return RESIDENTIAL_BLOCKS.includes(b);
}
export function formatDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) +
    ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
}
export function friendlyAuthError(e) {
  const code = e && e.code ? e.code : '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return 'Incorrect email or password.';
  if (code === 'auth/email-already-in-use') return 'An account with this email already exists — try logging in instead.';
  if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
  if (code === 'auth/invalid-email') return 'That email address looks invalid.';
  if (code === 'auth/too-many-requests') return 'Too many attempts — wait a moment and try again.';
  if (code === 'auth/configuration-not-found') return 'That sign-in method isn\u2019t turned on yet in Firebase — check Authentication > Sign-in method.';
  return (e && e.message) || 'Something went wrong. Try again.';
}
export function makeTicketCode(block, room) {
  return (
    block.replace(/\s+/g, '').slice(0, 3).toUpperCase() +
    '-' + room + '-' +
    Date.now().toString(36).toUpperCase().slice(-4)
  );
}
export function publicMirror(ticket) {
  return {
    code: ticket.code, block: ticket.block, room: ticket.room, category: ticket.category,
    description: ticket.description, status: ticket.status, urgent: !!ticket.urgent,
    reportedAt: ticket.reportedAt, resolvedAt: ticket.resolvedAt || null,
  };
}

// Natural search: strips filler words ("room", "block", etc.) and matches each
// remaining word separately, so "room 20" or "block f room 20" find a ticket
// even though the stored data never literally contains the word "room".
const SEARCH_NOISE_WORDS = new Set(['room', 'rm', 'block', 'blk', 'the', 'in', 'at', 'no', 'number']);

export function ticketMatchesSearch(t, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return true;
  const tokens = q.split(/\s+/).filter((tok) => tok && !SEARCH_NOISE_WORDS.has(tok));
  if (tokens.length === 0) return true;
  const blockLower = (t.block || '').toLowerCase();
  const roomLower = (t.room || '').toLowerCase();
  const freeText = [t.description, t.reportedBy, t.code].filter(Boolean).join(' ').toLowerCase();
  return tokens.every((tok) =>
    blockLower === tok ||
    blockLower.startsWith(tok) ||
    roomLower === tok ||
    roomLower.includes(tok) ||
    freeText.includes(tok)
  );
}
