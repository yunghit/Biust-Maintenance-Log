import TicketCard from './TicketCard';

export default function MyReportsList({ tickets, loading, onOpen, onOpenPhoto }) {
  if (loading) {
    return <div className="loading-wrap"><div className="spinner"></div></div>;
  }
  const sorted = [...tickets].sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
  if (sorted.length === 0) {
    return <div className="empty-card">You haven't reported anything yet. Tap + to report an issue.</div>;
  }
  return (
    <div>
      {sorted.map((t) => (
        <TicketCard key={t.id} ticket={t} onOpen={onOpen} onOpenPhoto={onOpenPhoto} />
      ))}
    </div>
  );
}
