import { useEffect } from 'react';

const REDIRECT_URL = 'https://design-system-calendar.figma.site/';

export function DesignSystemCalendarRedirect() {
  useEffect(() => {
    window.location.href = REDIRECT_URL;
  }, []);

  return (
    <div style={{ padding: 48, textAlign: 'center', fontFamily: 'Epilogue, sans-serif' }}>
      <p>Redirecting to Design System Calendar…</p>
      <p>
        <a href={REDIRECT_URL}>Click here</a> if you are not redirected.
      </p>
    </div>
  );
}
