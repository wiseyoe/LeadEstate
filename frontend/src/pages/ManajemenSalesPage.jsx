import { useState, useEffect } from "react";
import "../styles/ManajemenSalesPage.css";
import { useNavigate } from "react-router-dom";  // ← tambah ini


const API = import.meta.env.VITE_API_URL;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const COLORS = [
  "#f59e0b", "#6366f1", "#10b981", "#ef4444",
  "#8b5cf6", "#0ea5e9", "#ec4899", "#14b8a6", "#f97316",
];

const LEAD_COLORS = [
  "#f59e0b", "#6366f1", "#10b981", "#ef4444", "#8b5cf6", "#0ea5e9",
];

const STATUS_MAP = {
  hot:     { cls: "tag-hot",     lbl: "🔥 Hot"      },
  warm:    { cls: "tag-warm",    lbl: "🌤 Warm"     },
  cold:    { cls: "tag-cold",    lbl: "❄️ Cold"     },
  new:     { cls: "tag-new",     lbl: "🆕 New"      },
  closing: { cls: "tag-closing", lbl: "✅ Closing"  },
};

const ROLE_OPTIONS = ["Senior Sales", "Sales Agent", "Junior Sales", "Team Leader"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function initials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getRankStyle(rank) {
  if (rank === 0) return { background: "var(--brand-gold)", color: "var(--sidebar-bg)" };
  if (rank === 1) return { background: "#e5e7eb", color: "#374151" };
  if (rank === 2) return { background: "#fed7aa", color: "#9a3412" };
  return null;
}

function formatJoinDate(dateStr) {
  if (!dateStr) return "–";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const navigate = useNavigate();

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();
  const userInitials = (currentUser.name || "U").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const userRole = currentUser.role === "Admin" ? "Administrator"
    : currentUser.role === "Supervisor" ? "Supervisor"
    : currentUser.role === "Sales" ? "Sales"
    : currentUser.role || "Administrator";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">L</div>
        <div className="brand-name">
          Lead<span>Estate</span>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-label">Menu Utama</div>

        <div className="nav-item" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          Dashboard
        </div>

        <div className="nav-item" onClick={() => navigate("/reminder")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          Reminder &amp; Follow Up
          <span className="nav-badge">5</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/dataLeads")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          Data Lead
        </div>

        <div className="nav-item active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
          </svg>
          Manajemen Sales
        </div>

        <div className="nav-label">Laporan</div>

        <div className="nav-item" onClick={() => navigate("/laporan")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
          Laporan &amp; Statistik
        </div>

        <div className="nav-item" onClick={() => navigate("/settings")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          Pengaturan
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="ms-avatar">{userInitials}</div>
        <div className="user-info">
          <div className="name">{currentUser.name || "User"}</div>
          <div className="role">{userRole}</div>
        </div>
      </div>
    </aside>
  );
}

// ── SALES ITEM ────────────────────────────────────────────────────────────────
function SalesItem({ sales, rank, selected, onClick }) {
  const pct = Math.round((sales.closing / sales.target) * 100);
  const barColor = pct >= 100 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
  const rankStyle = getRankStyle(rank);

  return (
    <div
      className={`sales-item${selected ? " selected" : ""}`}
      onClick={onClick}
    >
      <div className="si-av" style={{ background: sales.color }}>
        {initials(sales.name)}
        <div
          className="online-dot"
          style={{ background: sales.online ? "#22c55e" : "#9ca3af" }}
        />
      </div>

      <div className="si-info">
        <div className="si-name">{sales.name}</div>
        <div className="si-role">{sales.role}</div>
        <div className="si-progress">
          <div className="si-prog-label">
            <span>Target</span>
            <span>{sales.closing}/{sales.target}</span>
          </div>
          <div className="si-prog-track">
            <div
              className="si-prog-fill"
              style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
            />
          </div>
        </div>
      </div>

      <div className="si-right">
        <div className="si-closing">{sales.closing}</div>
        <div className="si-lbl">closing</div>
      </div>

      {rankStyle && rank < 3 && (
        <div className="rank-badge" style={rankStyle}>
          {rank + 1}
        </div>
      )}
    </div>
  );
}

// ── PROFILE CARD ──────────────────────────────────────────────────────────────
function ProfileCard({ sales, onEdit, onDelete }) {
  const joinDate = formatJoinDate(sales.join);

  return (
    <div className="profile-card">
      <div className="profile-banner" />
      <div className="profile-body">
        <div className="profile-av" style={{ background: sales.color }}>
          {initials(sales.name)}
        </div>

        <div className="profile-name-row">
          <div>
            <div className="profile-name">
              {sales.name}{" "}
              {sales.online ? (
                <span className="online-pill online">● Online</span>
              ) : (
                <span className="online-pill offline">Offline</span>
              )}
            </div>
            <div className="profile-role-txt">{sales.role}</div>
          </div>

          <div className="profile-actions">
            <button
              className="pa-btn wa"
              onClick={() => alert(`Buka WhatsApp untuk ${sales.name}`)}
            >
              💬 WA
            </button>
            <button className="pa-btn edit" onClick={() => onEdit(sales)}>
              ✏️ Edit
            </button>
            <button className="pa-btn del" onClick={() => onDelete(sales.id)}>
              🗑
            </button>
          </div>
        </div>

        <div className="profile-meta">
          <div className="pm-item">📞 {sales.phone}</div>
          <div className="pm-item">✉️ {sales.email}</div>
          <div className="pm-item">📅 Bergabung {joinDate}</div>
          <div className="pm-item">🎯 Target: {sales.target} closing/bulan</div>
        </div>
      </div>
    </div>
  );
}

// ── STATS ROW ─────────────────────────────────────────────────────────────────
function StatsRow({ sales }) {
  const pct = Math.round((sales.closing / sales.target) * 100);
  const rateColor = pct >= 100 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
  const subText =
    pct >= 100 ? "🎉 Target tercapai!" : pct >= 60 ? "🔥 Hampir sampai" : "⚠️ Perlu ditingkatkan";

  return (
    <div className="stats-row">
      <div className="stat-box sb-gold">
        <div className="stat-box-val">{sales.leads_total}</div>
        <div className="stat-box-lbl">Total Lead</div>
        <div className="stat-box-sub">Ditangani bulan ini</div>
      </div>
      <div className="stat-box sb-blue">
        <div className="stat-box-val">{sales.followup}</div>
        <div className="stat-box-lbl">Follow Up</div>
        <div className="stat-box-sub">Total aktivitas</div>
      </div>
      <div className="stat-box sb-green">
        <div className="stat-box-val">{sales.closing}</div>
        <div className="stat-box-lbl">Closing</div>
        <div className="stat-box-sub">Dari target {sales.target}</div>
      </div>
      <div className="stat-box sb-red">
        <div className="stat-box-val" style={{ color: rateColor }}>{pct}%</div>
        <div className="stat-box-lbl">Pencapaian</div>
        <div className="stat-box-sub">{subText}</div>
      </div>
    </div>
  );
}

// ── PERFORMANCE CARD ──────────────────────────────────────────────────────────
function PerformanceCard({ sales }) {
  const pct = Math.round((sales.closing / sales.target) * 100);
  const rateColor = pct >= 100 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";

  const metrics = [
    {
      label: "Target Closing",
      val: `${sales.closing} / ${sales.target}`,
      pct: Math.min(pct, 100),
      color: rateColor,
    },
    {
      label: "Tingkat Respons Lead",
      val: `${Math.min(95, 60 + sales.closing * 5)}%`,
      pct: Math.min(95, 60 + sales.closing * 5),
      color: "#3b82f6",
    },
    {
      label: "Follow Up Tepat Waktu",
      val: `${Math.min(98, 75 + sales.closing * 4)}%`,
      pct: Math.min(98, 75 + sales.closing * 4),
      color: "#8b5cf6",
    },
    {
      label: "Avg. Waktu Closing",
      val: `${7 + (sales.id % 5)} hari`,
      pct: 70,
      color: "#f59e0b",
    },
    {
      label: "Kepuasan Pelanggan",
      val: `⭐ ${(4 + sales.closing * 0.1).toFixed(1)}/5`,
      pct: ((4 + sales.closing * 0.1) / 5) * 100,
      color: "#ec4899",
    },
  ];

  return (
    <div className="section-card">
      <div className="sc-head">
        <div className="sc-title">📊 Performa Detail</div>
        <div className="sc-badge">
          {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </div>
      </div>
      <div className="perf-list">
        {metrics.map((m, i) => (
          <div className="perf-item" key={i}>
            <div className="perf-top">
              <span className="perf-label">{m.label}</span>
              <span className="perf-val" style={{ color: i === 0 ? rateColor : undefined }}>
                {m.val}
              </span>
            </div>
            <div className="perf-bar-wrap">
              <div
                className="perf-bar-fill"
                style={{ width: `${m.pct}%`, background: m.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LEAD MINI LIST ────────────────────────────────────────────────────────────
function LeadMiniList({ leads = [] }) {
  return (
    <div className="section-card">
      <div className="sc-head">
        <div className="sc-title">📋 Lead Ditangani</div>
        <div className="sc-badge">{leads.length} lead</div>
      </div>
      <div className="lead-mini-list">
        {leads.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
            Belum ada lead
          </div>
        ) : (
          leads.map((l, i) => {
            const sm = STATUS_MAP[l.status] || STATUS_MAP.new;
            return (
              <div className="lml-item" key={i}>
                <div
                  className="lml-av"
                  style={{ background: LEAD_COLORS[i % LEAD_COLORS.length] }}
                >
                  {initials(l.name)}
                </div>
                <div className="lml-info">
                  <div className="lml-name">{l.name}</div>
                  <div className="lml-prop">🏠 {l.prop}</div>
                </div>
                <span className={`tag-sm ${sm.cls}`}>{sm.lbl}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── ACTIVITY LIST ─────────────────────────────────────────────────────────────
function ActivityList({ activity = [] }) {
  return (
    <div className="section-card">
      <div className="sc-head">
        <div className="sc-title">🕐 Aktivitas Terbaru</div>
      </div>
      <div className="activity-list">
        {activity.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            Belum ada aktivitas
          </div>
        ) : (
          activity.map((a, i) => (
            <div className="act-item" key={i}>
              <div className="act-dot" style={{ background: a.color }} />
              <div>
                <div className="act-txt">{a.txt}</div>
                <div className="act-time">{a.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
function DetailPanel({ sales, onEdit, onDelete }) {
  if (!sales) {
    return (
      <div className="right-panel">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
          </svg>
          <p>Pilih sales dari daftar<br />untuk melihat profil &amp; performa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="right-panel">
      <ProfileCard sales={sales} onEdit={onEdit} onDelete={onDelete} />
      <StatsRow sales={sales} />
      <div className="mid-row">
        <PerformanceCard sales={sales} />
        <LeadMiniList leads={sales.leads} />
      </div>
      <ActivityList activity={sales.activity} />
    </div>
  );
}

// ── SALES MODAL ───────────────────────────────────────────────────────────────
function SalesModal({ isOpen, editData, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", role: "Sales Agent",
    target: 3, join: new Date().toISOString().split("T")[0], color: COLORS[0],
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name:   editData.name  || "",
        phone:  editData.phone || "",
        email:  editData.email || "",
        role:   editData.role  || "Sales Agent",
        target: editData.target || 3,
        join:   editData.join  || new Date().toISOString().split("T")[0],
        color:  editData.color || COLORS[0],
      });
    } else {
      setForm({
        name: "", phone: "", email: "", role: "Sales Agent",
        target: 3, join: new Date().toISOString().split("T")[0], color: COLORS[0],
      });
    }
  }, [editData, isOpen]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Nama dan HP wajib diisi!");
      return;
    }
    onSave(form);
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">{editData ? "Edit Data Sales" : "Tambah Sales Baru"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Lengkap *</label>
              <input
                className="form-input"
                placeholder="Contoh: Budi Santoso"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor HP *</label>
              <input
                className="form-input"
                placeholder="0812-xxxx-xxxx"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                placeholder="email@domain.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Jabatan</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Target Closing / Bulan</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="Contoh: 5"
                value={form.target}
                onChange={(e) => handleChange("target", parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bergabung Sejak</label>
              <input
                className="form-input"
                type="date"
                value={form.join}
                onChange={(e) => handleChange("join", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row form-row-full">
            <div className="form-group">
              <label className="form-label">Warna Avatar</label>
              <div className="color-row">
                {COLORS.map((c) => (
                  <div
                    key={c}
                    className={`color-opt${form.color === c ? " sel" : ""}`}
                    style={{ background: c }}
                    onClick={() => handleChange("color", c)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>Batal</button>
          <button className="btn-save" onClick={handleSubmit}>💾 Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ManajemenSalesPage() {
  const [salesTeam, setSalesTeam] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── API CALLS ──────────────────────────────────────────────────────────────

  /**
   * GET /sales
   * Response: Array of sales objects
   * {
   *   id, name, phone, email, role, color, target, join, online,
   *   closing, followup, leads_total,
   *   leads: [{ name, prop, status }],
   *   activity: [{ txt, time, color }]
   * }
   */
  async function fetchSales() {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    // ambil user dari localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch(`${API}/api/users`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Role: currentUser.role || "Admin",
      },
    });

    console.log("STATUS:", res.status);

    const rawText = await res.text();
    console.log("RAW RESPONSE:", rawText);

    if (!res.ok) {
      throw new Error(rawText);
    }

    const data = JSON.parse(rawText);

    const salesOnly = (Array.isArray(data) ? data : []).filter(
      (u) => u.roleId === 3
    );

    const mapped = salesOnly.map((u, i) => ({
      id: u.id,
      name: u.name ?? "–",
      email: u.email ?? "–",
      phone: u.phone ?? "–",
      role: "Sales",
      color: COLORS[i % COLORS.length],
      target: 10,
      closing: 0,
      followup: 0,
      online: false,
      join: null,
      leads: [],
      activity: [],
    }));

    setSalesTeam(mapped);

    if (mapped.length > 0 && !selectedId) {
      setSelectedId(mapped[0].id);
    }

  } catch (err) {
    console.error("ERROR fetchSales:", err);

    alert(
      "Gagal mengambil data sales.\n\n" +
      "Cek console browser untuk detail error."
    );
  } finally {
    setLoading(false);
  }
}

  /**
   * POST /sales
   * Body: { name, phone, email, role, color, target, join }
   * Response: created sales object with id
   */
  async function createSales(formData) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();
      setSalesTeam((prev) => [...prev, created]);
      setSelectedId(created.id);
    } catch (err) {
      console.error("ERROR createSales:", err);
      alert("Gagal menambah data sales. Coba lagi.");
    }
  }

  /**
   * PUT /sales/:id
   * Body: { name, phone, email, role, color, target, join }
   * Response: updated sales object
   */
  async function updateSales(id, formData) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users/${id}`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setSalesTeam((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      );
    } catch (err) {
      console.error("ERROR updateSales:", err);
      alert("Gagal mengupdate data sales. Coba lagi.");
    }
  }

  /**
   * DELETE /sales/:id
   * Response: { success: true }
   */
  async function deleteSales(id) {
    if (!confirm("Hapus data sales ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/users/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSalesTeam((prev) => prev.filter((s) => s.id !== id));
      if (selectedId === id) {
        const remaining = salesTeam.filter((s) => s.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error("ERROR deleteSales:", err);
      alert("Gagal menghapus data sales. Coba lagi.");
    }
  }

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── HANDLERS ──────────────────────────────────────────────────────────────
  function handleOpenAdd() {
    setEditData(null);
    setModalOpen(true);
  }

  function handleOpenEdit(sales) {
    setEditData(sales);
    setModalOpen(true);
  }

  function handleSave(formData) {
    if (editData) {
      updateSales(editData.id, formData);
    } else {
      createSales(formData);
    }
    setModalOpen(false);
    setEditData(null);
  }

  // ── DERIVED ───────────────────────────────────────────────────────────────
  const sorted = [...salesTeam].sort((a, b) => b.closing - a.closing);
  const filtered = sorted.filter((s) =>
    s.name.toLowerCase().includes(searchQ.toLowerCase())
  );
  const selectedSales = salesTeam.find((s) => s.id === selectedId) || null;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="page-root">
      <Sidebar />

      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-title">Manajemen Sales</div>
          <div className="topbar-right">
            <div className="date-chip">
              📅{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric",
                month: "long", year: "numeric",
              })}
            </div>
            <div className="notif-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <div className="notif-dot" />
            </div>
          </div>
        </div>

        <div className="body-split">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="lp-header">
              <div className="lp-title">
                Tim Sales{" "}
                <span className="lp-count">({salesTeam.length} orang)</span>
              </div>
              <button className="add-btn" onClick={handleOpenAdd}>+ Tambah</button>
            </div>

            <div className="lp-search">
              <div className="search-wrap">
                <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  className="search-input"
                  placeholder="Cari nama sales..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
            </div>

            <div className="sales-list">
              {loading ? (
                <div className="loading-state">Memuat data...</div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <p>Tidak ada sales ditemukan</p>
                </div>
              ) : (
                filtered.map((s) => {
                  const rank = sorted.findIndex((x) => x.id === s.id);
                  return (
                    <SalesItem
                      key={s.id}
                      sales={s}
                      rank={rank}
                      selected={selectedId === s.id}
                      onClick={() => setSelectedId(s.id)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <DetailPanel
            sales={selectedSales}
            onEdit={handleOpenEdit}
            onDelete={deleteSales}
          />
        </div>
      </main>

      {/* MODAL */}
      <SalesModal
        isOpen={modalOpen}
        editData={editData}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
