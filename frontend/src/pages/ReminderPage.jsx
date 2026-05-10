import { useState, useEffect } from "react";
import "../styles/ReminderPage.css";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const TEMPLATES = {
  "📅 Reminder Jadwal": (l) =>
    `Halo ${l.name.split(" ")[0]}, saya ${l.sales} dari LeadEstate. Ingin mengingatkan bahwa hari ini kita ada jadwal diskusi mengenai ${l.prop}. Apakah Bapak/Ibu masih bisa? 🙏`,
  "🏠 Info Properti": (l) =>
    `Halo ${l.name.split(" ")[0]}, ada informasi terbaru mengenai ${l.prop} yang mungkin menarik bagi Bapak/Ibu. Boleh saya share detailnya? 😊`,
  "💰 Penawaran Harga": (l) =>
    `Halo ${l.name.split(" ")[0]}, kami memiliki penawaran spesial untuk ${l.prop} dengan budget sekitar ${l.budget}. Tertarik untuk kita diskusikan? 🎉`,
};

const FILTER_TABS = [
  { key: "semua", label: "Semua" },
  { key: "hari-ini", label: "Hari Ini" },
  { key: "tertunda", label: "Tertunda" },
  { key: "selesai", label: "Selesai" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getTagClass(tag) {
  if (tag === "today") return "h-today";
  if (tag === "soon") return "h-soon";
  if (tag === "late") return "h-late";
  return "h-done";
}

function getStatusPill(s) {
  if (s === "belum") return "sp-belum";
  if (s === "proses") return "sp-proses";
  return "sp-selesai";
}

function getStatusLabel(s) {
  if (s === "belum") return "Belum Direspons";
  if (s === "proses") return "Sedang Diproses";
  return "Selesai";
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

        <div className="nav-item active">
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

        <div className="nav-item" onClick={() => navigate("/Manajemen_sales")}>
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

        <div
          className="nav-item"
          style={{ marginTop: 8 }}
          onClick={() => navigate("/settings")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          Pengaturan
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">{userInitials}</div>
        <div className="user-info">
          <div className="name">{currentUser.name || "User"}</div>
          <div className="role">{userRole}</div>
        </div>
      </div>
    </aside>
  );
}

// ── LEAD CARD ─────────────────────────────────────────────────────────────────
function LeadCard({ lead, selected, onClick }) {
  return (
    <div
      className={`lead-card${selected ? " selected" : ""}`}
      onClick={onClick}
    >
      <div className="lc-avatar" style={{ background: lead.color }}>
        {lead.initials}
      </div>
      <div className="lc-info">
        <div className="lc-name">{lead.name}</div>
        <div className="lc-phone">{lead.phone}</div>
        <div className="lc-prop">🏠 {lead.prop}</div>
      </div>
      <div className="lc-right">
        <div className="lc-time">{lead.time}</div>
        <div className={`lc-h ${getTagClass(lead.tag)}`}>{lead.hday}</div>
      </div>
    </div>
  );
}

// ── CONTACT CARD ──────────────────────────────────────────────────────────────
function ContactCard({ lead }) {
  return (
    <div className="contact-card">
      <div className="contact-header">
        <div className="contact-avatar" style={{ background: lead.color }}>
          {lead.initials}
        </div>
        <div>
          <div className="contact-name">{lead.name}</div>
          <div className="contact-phone">📞 {lead.phone}</div>
          <div className="contact-actions" style={{ marginTop: 8 }}>
            <button
              className="ca-btn wa"
              onClick={() => alert(`Buka WhatsApp untuk ${lead.name}`)}
            >
              💬 WhatsApp
            </button>
            <button
              className="ca-btn call"
              onClick={() => alert(`Telepon ${lead.phone}`)}
            >
              📞 Telepon
            </button>
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div className={`status-pill ${getStatusPill(lead.status)}`}>
            {getStatusLabel(lead.status)}
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}
          >
            Sales: {lead.sales}
          </div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <div className="info-label">Properti Diminati</div>
          <div className="info-val">🏠 {lead.prop}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Sumber Lead</div>
          <div className="info-val">{lead.source}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Budget</div>
          <div className="info-val">{lead.budget}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Jadwal Reminder</div>
          <div className="info-val">
            {lead.hday} · Hari ini {lead.time}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HISTORY TIMELINE ──────────────────────────────────────────────────────────
function HistoryTimeline({ history = [] }) {
  return (
    <div className="reminder-card">
      <div className="rc-title">🕐 Riwayat Follow Up</div>
      <div className="timeline">
        {history.map((h, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-line">
              <div
                className="tl-dot"
                style={{
                  background: h.done ? "var(--success)" : "var(--brand-gold)",
                }}
              />
              {i < history.length - 1 && (
                <div className={`tl-seg ${h.done ? "done" : "current"}`} />
              )}
            </div>
            <div className="tl-content">
              <div className="tl-date">{h.date}</div>
              <div className="tl-note">{h.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ACTION CARD ───────────────────────────────────────────────────────────────
function ActionCard({ lead, onTandaiSelesai, onCatatAktivitas }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [notes, setNotes] = useState("");

  const preview = selectedTemplate
    ? TEMPLATES[selectedTemplate](lead)
    : "Pilih template pesan di atas...";

  function handleSendWA() {
    if (!selectedTemplate) {
      alert("Pilih template terlebih dahulu");
      return;
    }
    alert(
      `✅ Pesan WhatsApp dikirim ke ${lead.name}\n\n"${preview.substring(0, 80)}..."`,
    );
  }

  function handleCatat() {
    if (!notes.trim()) {
      alert("Tulis catatan terlebih dahulu");
      return;
    }
    onCatatAktivitas(notes.trim());
    setNotes("");
  }

  return (
    <div className="action-card">
      <div className="action-title">⚡ Aksi Follow Up</div>

      <div className="wa-box">
        <div className="wa-label">💬 Kirim via WhatsApp</div>
        <div className="wa-template">
          {Object.keys(TEMPLATES).map((key) => (
            <div
              key={key}
              className={`wa-chip${selectedTemplate === key ? " sel" : ""}`}
              onClick={() => setSelectedTemplate(key)}
            >
              {key}
            </div>
          ))}
        </div>
        <div className="wa-preview">{preview}</div>
        <button
          className="send-btn"
          style={{ marginTop: 10 }}
          onClick={handleSendWA}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
          Kirim WhatsApp
        </button>
      </div>

      <div className="divider-or">atau catat aktivitas</div>

      <textarea
        className="notes-area"
        placeholder="Tulis catatan hasil follow up... (misal: Lead sudah dihubungi, respon positif, minta brosur)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="action-buttons">
        <button className="act-btn primary" onClick={onTandaiSelesai}>
          ✅ Tandai Selesai
        </button>
        <button className="act-btn secondary" onClick={handleCatat}>
          📝 Catat Aktivitas
        </button>
      </div>
    </div>
  );
}

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
function DetailPanel({ lead, onTandaiSelesai, onCatatAktivitas }) {
  if (!lead) {
    return (
      <div className="detail-wrap">
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          <p>
            Pilih lead dari daftar
            <br />
            untuk melihat detail follow-up
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-wrap">
      <ContactCard lead={lead} />
      <HistoryTimeline history={lead.history} />
      <ActionCard
        lead={lead}
        onTandaiSelesai={onTandaiSelesai}
        onCatatAktivitas={onCatatAktivitas}
      />
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ReminderPage() {
  const [leads, setLeads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      console.log("API URL:", API);

      // Ambil userId dari localStorage (disimpan saat login)
      const userId = localStorage.getItem("userId");
      const token  = localStorage.getItem("token");

      // Pakai /raw jika tidak ada userId, atau pakai ?userId= jika ada
      const url = userId
        ? `${API}/api/leads?userId=${userId}`
        : `${API}/api/leads/raw`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("STATUS:", res.status);

      const data = await res.json();

      console.log("DATA DARI API:", data);

      const mapped = data.map((item, index) => {
        const statusName =
          item.status?.statusName || item.status?.status_name || "";

        let tag = "soon";

        if (statusName.toLowerCase().includes("closed")) {
          tag = "done";
        } else if (statusName.toLowerCase().includes("follow")) {
          tag = "today";
        }

        return {
          id: item.id,
          name: item.name,
          phone: item.phone || "-",

          prop: item.property?.name || "Properti",

          sales: item.sales?.name || "Sales",

          source: item.source || "-",

          budget: "Rp -",

          initials: item.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),

          color: ["#f59e0b", "#6366f1", "#10b981", "#ef4444", "#8b5cf6"][
            index % 5
          ],

          tag,

          hday:
            tag === "today"
              ? "Hari ini"
              : tag === "done"
                ? "Selesai"
                : "Segera",

          time: "10:00",

          status: tag === "done" ? "selesai" : "proses",

          history: [
            {
              date: "Hari ini",
              note: "Lead berhasil dimuat dari database",
              done: true,
            },
          ],
        };
      });

      console.log("HASIL MAPPING:", mapped);

      setLeads(mapped);

      if (mapped.length > 0) {
        setSelectedId(mapped[0].id);
      }
    } catch (err) {
      console.error("ERROR FETCH:", err);
    }
  }

  const filtered = leads.filter((l) => {
    const matchFilter =
      activeFilter === "semua" ||
      (activeFilter === "hari-ini" && l.tag === "today") ||
      (activeFilter === "tertunda" && l.tag === "late") ||
      (activeFilter === "selesai" && l.tag === "done");
    const q = searchQ.toLowerCase();
    const matchSearch =
      l.name.toLowerCase().includes(q) ||
      (l.prop ?? "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const selectedLead = leads.find((l) => l.id === selectedId) || null;

  async function handleTandaiSelesai() {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/api/leads/${selectedId}/status`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ statusId: 5 })
      });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCatatAktivitas(notes) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/followups`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ leadId: selectedId, notes }),
      });
      fetchLeads();
      alert("✅ Aktivitas berhasil dicatat!");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page-root">
      <Sidebar />

      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-title">Reminder &amp; Follow Up</div>
          <div className="topbar-right">
            <div className="date-chip">
              📅{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
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
            <div className="filter-tabs">
              {FILTER_TABS.map((tab) => (
                <div
                  key={tab.key}
                  className={`ftab${activeFilter === tab.key ? " active" : ""}`}
                  onClick={() => setActiveFilter(tab.key)}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            <div className="search-bar">
              <div className="search-wrap">
                <svg
                  className="search-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  className="search-input"
                  placeholder="Cari nama atau properti..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>
            </div>

            <div className="list-header">
              <div className="list-title">Daftar Reminder</div>
              <div className="list-count">{filtered.length} lead</div>
            </div>

            <div className="lead-list">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <p>Tidak ada lead ditemukan</p>
                </div>
              ) : (
                filtered.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    selected={selectedId === lead.id}
                    onClick={() => setSelectedId(lead.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <DetailPanel
              lead={selectedLead}
              onTandaiSelesai={handleTandaiSelesai}
              onCatatAktivitas={handleCatatAktivitas}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
