export default function Spinner() {
  return (
    <div className="spinner" role="status" aria-label="Loading">
      <div className="spinner-circle" />
      <span>Loading...</span>
    </div>
  );
}
