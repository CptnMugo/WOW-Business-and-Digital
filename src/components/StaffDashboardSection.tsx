import React from 'react';

export function StaffDashboardSection({
  id, title, description, open, onToggle, children,
}: {
  id: string;
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="ad-card" style={{ marginBottom: 18, padding: 0, overflow: 'hidden' }}>
      <h2 style={{ margin: 0 }}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, width: '100%', padding: '22px 26px', textAlign: 'left',
            background: 'transparent', border: 0, color: '#0b2d5b', cursor: 'pointer',
          }}
        >
          <span style={{ display: 'grid', gap: 5 }}>
            <strong style={{ fontSize: '1.2rem' }}>{title}</strong>
            <span style={{ fontSize: '.87rem', fontWeight: 400 }}>{description}</span>
          </span>
          <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 17, fontWeight: 700 }}>{open ? '▲ Close' : '▼ Open'}</span>
        </button>
      </h2>
      {open && <div id={id} style={{ padding: '0 26px 26px', borderTop: '1px solid #e5dccf' }}>{children}</div>}
    </section>
  );
}
