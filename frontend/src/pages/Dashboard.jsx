import { useState } from "react";
import "../styles/Dashboard.css";
import logo from "../assets/leadestate-logo.png";
import { useNavigate } from "react-router-dom";

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

// ── COMPONENTS ────────────────────────────────────────────────────────────────

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
              <span className="le-leader-badge">{s.followUp} follow-up</span>
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
  const navigate = useNavigate();


  return (
    <div className="le-root">

      {/* ── SIDEBAR ── */}
      <aside className="le-sidebar">

        {/* Brand */}
        <div className="le-brand">
          <img src={logo} alt="LeadEstate Logo" className="brand-logo" />
          <div className="le-brand-name">Lead<span>Estate</span></div>
        </div>


        {/* Nav */}
        <nav className="le-nav">

          <div className="le-nav-label">Menu Utama</div>

          <div
            className={`le-nav-item${activeNav === "dashboard" ? " active" : ""}`}
            onClick={() => setActiveNav("dashboard")}
          >
            <span className="le-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>
            Dashboard
          </div>

          <div
            className={`le-nav-item${activeNav === "reminder" ? " active" : ""}`}
            onClick={() => setActiveNav("reminder")}
          >
            <span className="le-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
              </svg>
            </span>
            Reminder &amp; Follow-Up
            <span className="le-nav-badge">5</span>
          </div>

          <div
            className={`le-nav-item${activeNav === "lead" ? " active" : ""}`}
            onClick={() => setActiveNav("lead")}
          >
            <span className="le-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            Data Lead
          </div>

          <div
            className={`le-nav-item${activeNav === "sales" ? " active" : ""}`}
            onClick={() => setActiveNav("sales")}
          >
            <span className="le-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 21v-1a5 5 0 0 1 10 0v1" />
              </svg>
            </span>
            Manajemen Sales
          </div>

          <div className="le-nav-label">Laporan</div>

          <div
            className={`le-nav-item${activeNav === "report" ? " active" : ""}`}
            onClick={() => setActiveNav("report")}
          >
            <span className="le-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4"  />
                <line x1="6"  y1="20" x2="6"  y2="14" />
              </svg>
            </span>
            Laporan &amp; Statistik
          </div>

          <div
            className={`le-nav-item${activeNav === "settings" ? " active" : ""}`}
            onClick={() => {
              setActiveNav("settings");
              navigate("/settings");
            }}
          >
            <span className="le-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
              </svg>
            </span>
            Pengaturan
          </div>

        </nav>

        {/* Footer */}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <div className="le-notif-dot" />
            </div>
          </div>
        </div>

        <div className="le-content">
          <div className="le-stats-grid">
            <StatCard color="gold"  icon="📋" trend="↑ 12%" trendDir="up"   value="142" label="Total Lead Aktif"    sub="+17 lead baru minggu ini" />
            <StatCard color="blue"  icon="🔔" trend="↑ 3"   trendDir="up"   value="12"  label="Follow Up Hari Ini"  sub="5 belum dikerjakan" />
            <StatCard color="red"   icon="⏳" trend="↑ 4"   trendDir="down" value="8"   label="Lead Tertunda"       sub="Perlu tindakan segera" />
            <StatCard color="green" icon="✅" trend="↑ 22%" trendDir="up"   value="11"  label="Closing Bulan Ini"   sub="Target: 15 | Sisa 4 lagi" />
          </div>

          <div className="le-mid-row">
            <BarChart data={chartData} activeTab={chartTab} onTabChange={setChartTab} />
            <Leaderboard data={topSales} />
          </div>

          <ReminderSection data={reminders} activeFilter={reminderFilter} onFilterChange={setReminderFilter} />
        </div>
      </main>

    </div>
  );
}
