export default function OfflinePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#fdf8f4',
      fontFamily: 'Georgia, serif',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '3rem', color: '#c9a96e', marginBottom: '1rem' }}>GeeGees</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>You are offline</p>
      <p style={{ color: '#999', maxWidth: '400px' }}>
        Please check your internet connection and try again. Your appointments and bookings will sync when you are back online.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '2rem',
          padding: '12px 32px',
          backgroundColor: '#c9a96e',
          color: '#1a1a2e',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
}