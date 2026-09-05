export default function PhotoOverlay({ url, onClose }) {
  if (!url) return null;
  return (
    <div className="photo-overlay" onClick={onClose}>
      <img src={url} alt="issue full size" />
    </div>
  );
}
