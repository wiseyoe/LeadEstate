import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import logo from "../assets/leadestate-logo.png";
import { useNavigate } from "react-router-dom";

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
  // Cegah error jika data kosong
  const max = data.length > 0 ? Math.max(...data.map((d) => d.leads || 0)) : 10;
  
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
          {data.map((d, index) => {
            const h1 = Math.round(((d.leads || 0) / max) * 110);
            const h2 = Math.round(((d.closing || 0) / max) * 110);
            return (
              <div className="le-bar-group" key={index}>
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
        {data.length > 0 ? data.map((s, index) => (
          <div className="le-leader-item" key={index}>
            <div className={`le-leader-rank ${rankClass(index + 1)}`}>{index + 1}</div>
            <div className="le-leader-av" style={{ background: s.color || "#6366f1" }}>{s.initials}</div>
            <div className="le-leader-info">
              <div className="le-leader-name">{s.name}</div>
              <span className="le-leader-badge">{s.followUp} follow-up</span>
            </div>
            <div className="le-leader-closing">{s.closing} ✅</div>
          </div>
        )) : <div className="le-view-all">Belum ada data sales</div>}
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
        {data.length > 0 ? data.map((r, index) => (
          <div className="le-reminder-item" key={index}>
            <div className="le-ri-avatar" style={{ background: r.color || "#f59e0b" }}>{r.initials}</div>
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
        )) : <div className="le-view-all">Tidak ada reminder hari ini</div>}
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
  
  // 1. Integrasi API
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/api/dashboard`);
      console.log("DASHBOARD DATA:", res.data);
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="le-root" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="le-card-title">Memuat data Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="le-root">

      {/* ── SIDEBAR ── */}
      <aside className="le-sidebar">
        {/* Brand */}
        <div className="le-brand">
          <img src={logo} alt="LeadEstate Logo" className="brand-logo" />
          <div className="le-brand-name">Lead<span>Estate</span></div>
        </div>

        {/* Nav - Menu Utama tetap dipertahankan */}
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
            <span className="le-nav-badge">{dashboardData?.todayFollowups || 0}</span>
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
          <div className="le-topbar-title">Dashboard Overview</div>
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
            <StatCard 
              color="gold" 
              icon="📋" 
              trend="↑ 12%" 
              trendDir="up" 
              value={dashboardData?.totalLeads || 0} 
              label="Total Lead Aktif" 
              sub="+17 lead baru minggu ini" 
            />
            <StatCard 
              color="blue" 
              icon="🔔" 
              trend="↑ 3" 
              trendDir="up" 
              value={dashboardData?.todayFollowups || 0} 
              label="Follow Up Hari Ini" 
              sub="Lihat semua reminder" 
            />
            <StatCard 
              color="red" 
              icon="⏳" 
              trend="↑ 4" 
              trendDir="down" 
              value={dashboardData?.pendingLeads || 0} 
              label="Lead Tertunda" 
              sub="Perlu tindakan segera" 
            />
            <StatCard 
              color="green" 
              icon="✅" 
              trend="↑ 22%" 
              trendDir="up" 
              value={dashboardData?.monthlyClosing || 0} 
              label="Closing Bulan Ini" 
              sub="Target: 15" 
            />
          </div>

          <div className="le-mid-row">
            <BarChart 
              data={dashboardData?.chartData || []} 
              activeTab={chartTab} 
              onTabChange={setChartTab} 
            />
            <Leaderboard data={dashboardData?.topSales || []} />
          </div>

          <ReminderSection 
            data={dashboardData?.reminders || []} 
            activeFilter={reminderFilter} 
            onFilterChange={setReminderFilter} 
          />
        </div>
      </main>

    </div>
  );
}