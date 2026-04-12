import { useState } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const chartData = [
  { m: "Okt", leads: 28, closing: 6 },
  { m: "Nov", leads: 34, closing: 8 },
  { m: "Des", leads: 30, closing: 9 },
  { m: "Jan", leads: 38, closing: 7 },
  { m: "Feb", leads: 42, closing: 10 },
  { m: "Mar", leads: 45, closing: 11 },
];

const topSales = [
  { rank: 1, initials: "BW", name: "Budi Wicaksono", followUp: 28, closing: 5, color: "#f59e0b" },
  { rank: 2, initials: "SR", name: "Sari Rahayu",    followUp: 22, closing: 3, color: "#6366f1" },
  { rank: 3, initials: "DH", name: "Dian Hartono",   followUp: 18, closing: 2, color: "#10b981" },
  { rank: 4, initials: "FK", name: "Fajar Kusuma",   followUp: 14, closing: 1, color: "#8b5cf6" },
  { rank: 5, initials: "NA", name: "Nina Amelia",    followUp: 10, closing: 0, color: "#ef4444" },
];

const reminders = [
  { initials: "RK", name: "Rafi Kennedy",  prop: "🏠 Rumah Di Cibaduyut · Sales: Budi W.", h: "H+1", time: "10.30", tag: "today", color: "#f59e0b" },
  { initials: "FY", name: "Firasy Yaeger", prop: "🏠 Rumah Di Banjar · Sales: Sari R.",     h: "H+3", time: "12.45", tag: "today", color: "#6366f1" },
  { initials: "KU", name: "Kevin Ukinami", prop: "🏠 Rumah Di Karawang · Sales: Dian H.",   h: "H+7", time: "13.09", tag: "soon",  color: "#10b981" },
  { initials: "AM", name: "Andi Maulana",  prop: "🏠 Apartemen Bekasi · Sales: Fajar K.",   h: "-2",  time: "08.00", tag: "late",  color: "#ef4444", hStyle: { background: "#fee2e2", color: "#dc2626" } },
];

// ── ICONS ─────────────────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);
const IconReminder = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
);
const IconLead = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);
const IconSales = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
  </svg>
);
const IconReport = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);
const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

// ── STYLES ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --sidebar-bg: #0f1923;
    --sidebar-accent: #1a2a38;
    --brand-gold: #c9a84c;
    --brand-gold-light: #e8c97a;
    --content-bg: #f5f4f0;
    --card-bg: #ffffff;
    --text-primary: #1a1a2e;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --border: #e5e7eb;
    --success: #22c55e;
    --warning: #f59e0b;
    --danger: #ef4444;
    --info: #3b82f6;
    --sidebar-w: 256px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .le-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--content-bg);
    color: var(--text-primary);
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* SIDEBAR */
  .le-sidebar {
    width: var(--sidebar-w);
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    border-right: 1px solid #1e3040;
  }
  .le-brand {
    padding: 24px 20px 20px;
    border-bottom: 1px solid #1e3040;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .le-brand-icon {
    width: 38px; height: 38px;
    background: var(--brand-gold);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-weight: 700; color: var(--sidebar-bg); font-size: 18px;
  }
  .le-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: #ffffff; letter-spacing: -0.3px;
  }
  .le-brand-name span { color: var(--brand-gold); }

  .le-nav { padding: 16px 12px; flex: 1; }
  .le-nav-label {
    font-size: 10px; font-weight: 600; color: #3a5068;
    text-transform: uppercase; letter-spacing: 1.2px;
    padding: 0 8px; margin-bottom: 8px; margin-top: 16px;
  }
  .le-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    color: #7a99b2; font-size: 14px; font-weight: 400;
    cursor: pointer; transition: all .18s;
    margin-bottom: 2px;
  }
  .le-nav-item:hover { background: #1a2a38; color: #ffffff; }
  .le-nav-item.active { background: var(--brand-gold); color: var(--sidebar-bg); font-weight: 600; }
  .le-nav-badge {
    margin-left: auto; background: var(--danger);
    color: #fff; font-size: 10px; font-weight: 700;
    padding: 2px 7px; border-radius: 20px;
  }
  .le-nav-item.active .le-nav-badge { background: rgba(0,0,0,0.25); }

  .le-sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid #1e3040;
    display: flex; align-items: center; gap: 10px;
  }
  .le-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--brand-gold), #e8c97a);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--sidebar-bg);
    flex-shrink: 0;
  }
  .le-user-name { font-size: 13px; font-weight: 600; color: #ffffff; }
  .le-user-role { font-size: 11px; color: #5a7a94; }

  /* MAIN */
  .le-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .le-topbar {
    background: #ffffff;
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
    height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .le-topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 600; color: var(--text-primary);
  }
  .le-topbar-right { display: flex; align-items: center; gap: 14px; }
  .le-date-chip {
    background: var(--content-bg); border: 1px solid var(--border);
    border-radius: 20px; padding: 5px 14px;
    font-size: 12px; color: var(--text-secondary); font-weight: 500;
  }
  .le-notif-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--content-bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative;
  }
  .le-notif-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--danger); position: absolute; top: 6px; right: 6px;
    border: 2px solid #fff;
  }

  .le-content { flex: 1; overflow-y: auto; padding: 24px 28px; }

  /* STAT CARDS */
  .le-stats-grid {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 16px; margin-bottom: 20px;
  }
  .le-stat-card {
    background: var(--card-bg);
    border-radius: 14px; padding: 20px;
    border: 1px solid var(--border);
    position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .le-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
  .le-stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .le-stat-card.gold::before { background: var(--brand-gold); }
  .le-stat-card.blue::before { background: var(--info); }
  .le-stat-card.red::before { background: var(--danger); }
  .le-stat-card.green::before { background: var(--success); }

  .le-stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .le-stat-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .le-stat-icon.gold { background: #fef3cd; }
  .le-stat-icon.blue { background: #dbeafe; }
  .le-stat-icon.red { background: #fee2e2; }
  .le-stat-icon.green { background: #dcfce7; }
  .le-stat-trend { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
  .le-stat-trend.up { background: #dcfce7; color: #16a34a; }
  .le-stat-trend.down { background: #fee2e2; color: #dc2626; }
  .le-stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); line-height: 1; margin-bottom: 4px; }
  .le-stat-label { font-size: 12px; color: var(--text-secondary); font-weight: 400; }
  .le-stat-sub { font-size: 11px; color: var(--text-muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }

  /* MID ROW */
  .le-mid-row { display: grid; grid-template-columns: 1fr 340px; gap: 16px; margin-bottom: 20px; }

  .le-card { background: var(--card-bg); border-radius: 14px; border: 1px solid var(--border); overflow: hidden; }
  .le-card-header {
    padding: 18px 20px 14px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
  }
  .le-card-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .le-card-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
  .le-chip {
    font-size: 11px; font-weight: 500; padding: 4px 10px;
    border-radius: 20px; border: 1px solid var(--border);
    color: var(--text-secondary); cursor: pointer;
    background: var(--content-bg);
  }
  .le-chip.active { background: var(--brand-gold); border-color: var(--brand-gold); color: var(--sidebar-bg); font-weight: 600; }

  /* BAR CHART */
  .le-chart-area { padding: 16px 20px 8px; }
  .le-bar-chart { display: flex; align-items: flex-end; gap: 10px; height: 140px; }
  .le-bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .le-bars { display: flex; gap: 3px; align-items: flex-end; height: 120px; }
  .le-bar {
    width: 14px; border-radius: 4px 4px 0 0;
    transition: opacity .2s;
  }
  .le-bar:hover { opacity: .75; }
  .le-bar.b1 { background: var(--brand-gold); }
  .le-bar.b2 { background: #dbeafe; border: 1px solid #93c5fd; }
  .le-bar-month { font-size: 10px; color: var(--text-muted); }
  .le-chart-legend { display: flex; gap: 16px; padding: 8px 20px 16px; }
  .le-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-secondary); }
  .le-legend-dot { width: 8px; height: 8px; border-radius: 2px; }

  /* LEADERBOARD */
  .le-leader-list { padding: 8px 0; }
  .le-leader-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 20px; transition: background .15s; cursor: default;
  }
  .le-leader-item:hover { background: var(--content-bg); }
  .le-leader-rank {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .le-rank-1 { background: var(--brand-gold); color: var(--sidebar-bg); }
  .le-rank-2 { background: #e5e7eb; color: #374151; }
  .le-rank-3 { background: #fed7aa; color: #9a3412; }
  .le-rank-other { background: var(--content-bg); color: var(--text-muted); }
  .le-leader-av {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .le-leader-info { flex: 1; min-width: 0; }
  .le-leader-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .le-leader-badge { font-size: 10px; color: var(--text-muted); }
  .le-leader-closing { font-size: 13px; font-weight: 700; color: var(--success); }

  /* REMINDERS */
  .le-reminder-list { padding: 4px 0 8px; }
  .le-reminder-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 20px; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background .15s;
  }
  .le-reminder-item:last-child { border-bottom: none; }
  .le-reminder-item:hover { background: #fffbf0; }
  .le-ri-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .le-ri-info { flex: 1; min-width: 0; }
  .le-ri-name { font-size: 13px; font-weight: 600; }
  .le-ri-prop { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
  .le-ri-right { text-align: right; flex-shrink: 0; }
  .le-ri-time { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
  .le-ri-tag {
    display: inline-block; margin-top: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
  }
  .tag-today { background: #dcfce7; color: #16a34a; }
  .tag-late { background: #fee2e2; color: #dc2626; }
  .tag-soon { background: #fef3cd; color: #b45309; }
  .le-ri-h {
    font-size: 11px; font-weight: 700; width: 34px; height: 22px;
    border-radius: 20px; display: flex; align-items: center; justify-content: center;
    background: var(--content-bg); color: var(--text-secondary); flex-shrink: 0;
  }
  .le-view-all {
    display: block; text-align: center; padding: 10px;
    font-size: 12px; color: var(--brand-gold); font-weight: 600;
    cursor: pointer; border-top: 1px solid var(--border);
  }
  .le-view-all:hover { background: #fffbf0; }

  /* SCROLLBAR */
  .le-content::-webkit-scrollbar { width: 5px; }
  .le-content::-webkit-scrollbar-track { background: transparent; }
  .le-content::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
`;

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function NavItem({ icon, label, badge, active, onClick }) {
  return (
    <div className={`le-nav-item${active ? " active" : ""}`} onClick={onClick}>
      {icon}
      {label}
      {badge && <span className="le-nav-badge">{badge}</span>}
    </div>
  );
}

function StatCard({ color, icon, trend, trendDir, value, label, sub }) {
  return (
    <div className={`le-stat-card ${color}`}>
      <div className="le-stat-header">
        <div className={`le-stat-icon ${color}`}>{icon}</div>
        <div className={`le-stat-trend ${trendDir}`}>{trend}</div>
      </div>
      <div className="le-stat-value">{value}</div>
      <div className="le-stat-label">{label}</div>
      <div className="le-stat-sub">{sub}</div>
    </div>
  );
}

function BarChart({ data, activeTab, onTabChange }) {
  const max = Math.max(...data.map((d) => d.leads));
  return (
    <div className="le-card">
      <div className="le-card-header">
        <div>
          <div className="le-card-title">Grafik Closing Rate</div>
          <div className="le-card-sub">Perbandingan lead masuk vs closing per bulan</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div className={`le-chip${activeTab === "6" ? " active" : ""}`} onClick={() => onTabChange("6")}>6 Bulan</div>
          <div className={`le-chip${activeTab === "12" ? " active" : ""}`} onClick={() => onTabChange("12")}>1 Tahun</div>
        </div>
      </div>
      <div className="le-chart-area">
        <div className="le-bar-chart">
          {data.map((d) => {
            const h1 = Math.round((d.leads / max) * 110);
            const h2 = Math.round((d.closing / max) * 110);
            return (
              <div className="le-bar-group" key={d.m}>
                <div className="le-bars">
                  <div className="le-bar b1" style={{ height: h1 }} title={`${d.leads} leads`} />
                  <div className="le-bar b2" style={{ height: h2 }} title={`${d.closing} closing`} />
                </div>
                <div className="le-bar-month">{d.m}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="le-chart-legend">
        <div className="le-legend-item">
          <div className="le-legend-dot" style={{ background: "var(--brand-gold)" }} />
          Lead Masuk
        </div>
        <div className="le-legend-item">
          <div className="le-legend-dot" style={{ background: "#93c5fd" }} />
          Closing
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ data }) {
  const rankClass = (rank) => {
    if (rank === 1) return "le-rank-1";
    if (rank === 2) return "le-rank-2";
    if (rank === 3) return "le-rank-3";
    return "le-rank-other";
  };
  return (
    <div className="le-card">
      <div className="le-card-header">
        <div>
          <div className="le-card-title">🏆 Top Sales</div>
          <div className="le-card-sub">Performa bulan ini</div>
        </div>
        <div className="le-chip">Maret 2026</div>
      </div>
      <div className="le-leader-list">
        {data.map((s) => (
          <div className="le-leader-item" key={s.rank}>
            <div className={`le-leader-rank ${rankClass(s.rank)}`}>{s.rank}</div>
            <div className="le-leader-av" style={{ background: s.color }}>{s.initials}</div>
            <div className="le-leader-info">
              <div className="le-leader-name">{s.name}</div>
              <span className="le-leader-badge">{s.followUp} follow up</span>
            </div>
            <div className="le-leader-closing">{s.closing} ✅</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReminderSection({ data, activeFilter, onFilterChange }) {
  const tagLabel = { today: "Hari ini", late: "Terlambat", soon: "Segera" };
  return (
    <div className="le-card">
      <div className="le-card-header">
        <div>
          <div className="le-card-title">🔔 Reminder Hari Ini</div>
          <div className="le-card-sub">Lead yang perlu di-follow up sekarang</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Semua", "Tertunda", "Selesai"].map((f) => (
            <div
              key={f}
              className={`le-chip${activeFilter === f ? " active" : ""}`}
              onClick={() => onFilterChange(f)}
            >{f}</div>
          ))}
        </div>
      </div>
      <div className="le-reminder-list">
        {data.map((r) => (
          <div className="le-reminder-item" key={r.name}>
            <div className="le-ri-avatar" style={{ background: r.color }}>{r.initials}</div>
            <div className="le-ri-info">
              <div className="le-ri-name">{r.name}</div>
              <div className="le-ri-prop">{r.prop}</div>
            </div>
            <div className="le-ri-h" style={r.hStyle || {}}>{r.h}</div>
            <div className="le-ri-right">
              <div className="le-ri-time">{r.time}</div>
              <div className={`le-ri-tag tag-${r.tag}`}>{tagLabel[r.tag]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="le-view-all">Lihat semua reminder →</div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function LeadEstateDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [chartTab, setChartTab] = useState("6");
  const [reminderFilter, setReminderFilter] = useState("Semua");

  return (
    <>
      <style>{css}</style>
      <div className="le-root">
        {/* SIDEBAR */}
        <aside className="le-sidebar">
          <div className="le-brand">
            <div className="le-brand-icon">L</div>
            <div className="le-brand-name">Lead<span>Estate</span></div>
          </div>
          <nav className="le-nav">
            <div className="le-nav-label">Menu Utama</div>
            <NavItem icon={<IconDashboard />} label="Dashboard"          active={activeNav === "dashboard"} onClick={() => setActiveNav("dashboard")} />
            <NavItem icon={<IconReminder />}  label="Reminder & Follow Up" badge="5" active={activeNav === "reminder"} onClick={() => setActiveNav("reminder")} />
            <NavItem icon={<IconLead />}      label="Data Lead"           active={activeNav === "lead"}      onClick={() => setActiveNav("lead")} />
            <NavItem icon={<IconSales />}     label="Manajemen Sales"     active={activeNav === "sales"}     onClick={() => setActiveNav("sales")} />
            <div className="le-nav-label">Laporan</div>
            <NavItem icon={<IconReport />}    label="Laporan & Statistik" active={activeNav === "report"}    onClick={() => setActiveNav("report")} />
            <NavItem icon={<IconSettings />}  label="Pengaturan"          active={activeNav === "settings"}  onClick={() => setActiveNav("settings")} />
          </nav>
          <div className="le-sidebar-footer">
            <div className="le-avatar">AR</div>
            <div>
              <div className="le-user-name">Admin Rafi</div>
              <div className="le-user-role">Administrator</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="le-main">
          <div className="le-topbar">
            <div className="le-topbar-title">Dashboard</div>
            <div className="le-topbar-right">
              <div className="le-date-chip">📅 Jum'at, 20 Maret 2026</div>
              <div className="le-notif-btn">
                <IconBell />
                <div className="le-notif-dot" />
              </div>
            </div>
          </div>

          <div className="le-content">
            {/* STAT CARDS */}
            <div className="le-stats-grid">
              <StatCard color="gold"  icon="📋" trend="↑ 12%" trendDir="up"   value="142" label="Total Lead Aktif"    sub="+17 lead baru minggu ini" />
              <StatCard color="blue"  icon="🔔" trend="↑ 3"   trendDir="up"   value="12"  label="Follow Up Hari Ini"  sub="5 belum dikerjakan" />
              <StatCard color="red"   icon="⏳" trend="↑ 4"   trendDir="down" value="8"   label="Lead Tertunda"       sub="Perlu tindakan segera" />
              <StatCard color="green" icon="✅" trend="↑ 22%" trendDir="up"   value="11"  label="Closing Bulan Ini"   sub="Target: 15 | Sisa 4 lagi" />
            </div>

            {/* MID ROW */}
            <div className="le-mid-row">
              <BarChart data={chartData} activeTab={chartTab} onTabChange={setChartTab} />
              <Leaderboard data={topSales} />
            </div>

            {/* REMINDERS */}
            <ReminderSection data={reminders} activeFilter={reminderFilter} onFilterChange={setReminderFilter} />
          </div>
        </main>
      </div>
    </>
  );
}
