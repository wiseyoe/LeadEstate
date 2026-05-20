import { useEffect, useState, useMemo } from "react";
import "../styles/dataLead.css";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const COLORS = ["#f59e0b","#6366f1","#10b981","#ef4444","#8b5cf6","#0ea5e9","#ec4899","#14b8a6"];

const STATUS_OPTIONS = [
  { val: "",  lbl: "Semua Status"  },
  { val: "1", lbl: "🆕 New Lead"   },
  { val: "2", lbl: "📞 Contacted"  },
  { val: "3", lbl: "🔄 Follow Up"  },
  { val: "4", lbl: "🤝 Negotiation"},
  { val: "5", lbl: "✅ Closed"     },
  { val: "6", lbl: "❌ Lost"       },
];

const SOURCE_OPTIONS = ["","Instagram","Facebook","Website","Referral","Walk-in","Whatsapp","TikTok"];

const STATUS_TAG = {
  "New Lead":    { cls:"tag-new",     lbl:"🆕 New Lead"    },
  "Contacted":   { cls:"tag-warm",    lbl:"📞 Contacted"   },
  "Follow Up":   { cls:"tag-warm",    lbl:"🔄 Follow Up"   },
  "Negotiation": { cls:"tag-hot",     lbl:"🤝 Negotiation" },
  "Closed":      { cls:"tag-done",    lbl:"✅ Closed"      },
  "Lost":        { cls:"tag-cold",    lbl:"❌ Lost"        },
};

const ROWS_PER_PAGE = 10;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function initials(name = "") {
  return name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();
}

function formatDate(str) {
  if (!str) return "–";
  return new Date(str).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" });
}

function formatRupiah(num) {
  if (!num) return "–";
  if (num >= 1_000_000_000_000) return `Rp ${(num/1_000_000_000_000).toFixed(1)}T`;
  if (num >= 1_000_000_000)     return `Rp ${(num/1_000_000_000).toFixed(1)}M`;
  if (num >= 1_000_000)         return `Rp ${(num/1_000_000).toFixed(0)}Jt`;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isAdmin =
    user?.role?.toLowerCase() === "admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">L</div>
        <div className="brand-name">Lead<span>Estate</span></div>
      </div>

      <nav className="nav">
        <div className="nav-label">Menu Utama</div>

        <div className="nav-item" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Dashboard
        </div>

        <div className="nav-item" onClick={() => navigate("/reminder")}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          Reminder &amp; Follow Up
          <span className="nav-badge">5</span>
        </div>

        <div className="nav-item active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          Data Lead
        </div>

        {/* KHUSUS ADMIN */}
        {isAdmin && (
          <>
            <div
              className="nav-item"
              onClick={() => navigate("/Manajemen_sales")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
              Manajemen Sales
            </div>

            <div className="nav-label">Laporan</div>

            <div
              className="nav-item"
              onClick={() => navigate("/laporan")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Laporan &amp; Statistik
            </div>
          </>
        )}

        <div
          className="nav-item"
          style={{ marginTop:8 }}
          onClick={() => navigate("/settings")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          Pengaturan
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">{initials(user.name || "AR")}</div>
        <div className="user-info">
          <div className="name">{user.name || "Admin"}</div>
          <div className="role">{user.role || "Administrator"}</div>
        </div>
      </div>
    </aside>
  );
}

// ── MODAL TAMBAH / EDIT LEAD ──────────────────────────────────────────────────
function LeadModal({ isOpen, editData, onClose, onSave }) {
  const empty = { name:"", phone:"", email:"", propertyId:"", salesId:"", statusId:"1", source:"" };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (editData) {
      setForm({
        name:       editData.name       ?? "",
        phone:      editData.phone      ?? "",
        email:      editData.email      ?? "",
        propertyId: editData.property?.id ?? "",
        salesId:    editData.sales?.id    ?? "",
        statusId:   editData.status?.id   ?? "1",
        source:     editData.source     ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{editData ? "Edit Lead" : "Tambah Lead Baru"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Lengkap *</label>
              <input className="form-input" placeholder="Contoh: Budi Santoso" value={form.name} onChange={set("name")} />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor HP *</label>
              <input className="form-input" placeholder="0812-xxxx-xxxx" value={form.phone} onChange={set("phone")} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="email@contoh.com" value={form.email} onChange={set("email")} />
            </div>
            <div className="form-group">
              <label className="form-label">Sumber Lead</label>
              <select className="form-select" value={form.source} onChange={set("source")}>
                {SOURCE_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.statusId} onChange={set("statusId")}>
                {STATUS_OPTIONS.filter(o => o.val).map(o => <option key={o.val} value={o.val}>{o.lbl}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">ID Properti</label>
              <input className="form-input" placeholder="ID properti" value={form.propertyId} onChange={set("propertyId")} />
            </div>
          </div>
          <div className="form-row full">
            <div className="form-group">
              <label className="form-label">ID Sales PIC</label>
              <input className="form-input" placeholder="ID sales" value={form.salesId} onChange={set("salesId")} />
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>Batal</button>
          <button className="btn-save" onClick={() => onSave(form)}>
            {editData ? "Simpan Perubahan" : "Tambah Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
function DetailModal({ lead, onClose }) {
  if (!lead) return null;
  const statusName = lead.status?.statusName ?? "–";
  const tag = STATUS_TAG[statusName] ?? { cls:"tag-cold", lbl: statusName };

  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Detail Lead</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
            <div className="lc-av" style={{ width:48, height:48, fontSize:16, background: COLORS[lead.id % COLORS.length] }}>
              {initials(lead.name)}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:16 }}>{lead.name}</div>
              <div style={{ fontSize:12, color:"var(--text-muted)" }}>{lead.phone}</div>
              <span className={`tag ${tag.cls}`} style={{ marginTop:4, display:"inline-flex" }}>{tag.lbl}</span>
            </div>
          </div>
          <div className="detail-section">
            <div className="ds-title">Informasi Lead</div>
            <div className="ds-grid">
              <div className="ds-item"><div className="ds-lbl">Email</div><div className="ds-val">{lead.email ?? "–"}</div></div>
              <div className="ds-item"><div className="ds-lbl">Sumber</div><div className="ds-val">{lead.source ?? "–"}</div></div>
              <div className="ds-item"><div className="ds-lbl">Properti</div><div className="ds-val">{lead.property?.name ?? "–"}</div></div>
              <div className="ds-item"><div className="ds-lbl">Harga</div><div className="ds-val">{formatRupiah(lead.property?.price)}</div></div>
              <div className="ds-item"><div className="ds-lbl">Sales PIC</div><div className="ds-val">{lead.sales?.name ?? "–"}</div></div>
              <div className="ds-item"><div className="ds-lbl">Tgl Masuk</div><div className="ds-val">{formatDate(lead.createdAt)}</div></div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function DataLead() {
  const [leads,       setLeads]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [searchQ,     setSearchQ]     = useState("");
  const [filterStatus,setFilterStatus]= useState("");
  const [filterSource,setFilterSource]= useState("");
  const [page,        setPage]        = useState(1);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editData,    setEditData]    = useState(null);
  const [detailLead,  setDetailLead]  = useState(null);
  const [selected,    setSelected]    = useState(new Set());
  const [view,        setView]        = useState("table"); // "table" | "card"

  // ── FETCH ──────────────────────────────────────────────────────────────────
  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const url = userId
        ? `${API}/api/leads?userId=${userId}`
        : `${API}/api/leads/raw`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setLeads(Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : []);
    } catch (err) {
      console.error("ERROR fetchLeads:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createLead(form) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/leads`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:       form.name,
          phone:      form.phone,
          email:      form.email,
          propertyId: Number(form.propertyId) || null,
          salesId:    Number(form.salesId)    || null,
          statusId:   Number(form.statusId)   || 1,
          source:     form.source,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchLeads();
      setModalOpen(false);
    } catch (err) {
      console.error("ERROR createLead:", err);
      alert("Gagal menambah lead.");
    }
  }

  async function updateLeadStatus(id, statusId) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/api/leads/${id}/status`, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusId }),
      });
      await fetchLeads();
    } catch (err) {
      console.error("ERROR updateStatus:", err);
    }
  }

  // ── FILTER & PAGINATION ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return leads.filter(l => {
      const q   = searchQ.toLowerCase();
      const matchQ = !q || l.name?.toLowerCase().includes(q)
                        || l.phone?.includes(q)
                        || l.property?.name?.toLowerCase().includes(q);
      const matchStatus = !filterStatus || String(l.status?.id) === filterStatus;
      const matchSource = !filterSource || l.source === filterSource;
      return matchQ && matchStatus && matchSource;
    });
  }, [leads, searchQ, filterStatus, filterSource]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page-1)*ROWS_PER_PAGE, page*ROWS_PER_PAGE);

  // ── STATS ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total   = leads.length;
    const newLead = leads.filter(l => l.status?.id === 1).length;
    const followUp= leads.filter(l => l.status?.id === 3).length;
    const closed  = leads.filter(l => l.status?.id === 5).length;
    const rate    = total > 0 ? Math.round((closed/total)*100) : 0;
    return { total, newLead, followUp, closed, rate };
  }, [leads]);

  // ── SELECTION ──────────────────────────────────────────────────────────────
  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleAll(e) {
    setSelected(e.target.checked ? new Set(paginated.map(l => l.id)) : new Set());
  }

  // ── EXPORT CSV ────────────────────────────────────────────────────────────
  function exportCSV() {
    const header = "ID,Nama,Phone,Email,Properti,Status,Sumber,Sales,Tgl Masuk";
    const rows = filtered.map(l =>
      [l.id, l.name, l.phone, l.email ?? "",
       l.property?.name ?? "", l.status?.statusName ?? "",
       l.source ?? "", l.sales?.name ?? "",
       formatDate(l.createdAt)].join(",")
    );
    const blob = new Blob([[header,...rows].join("\n")], { type:"text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data-lead.csv";
    a.click();
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-title">Data Lead</div>
          <div className="topbar-right">
            <div className="date-chip">📅 {new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
            <div className="notif-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
              <div className="notif-dot" />
            </div>
          </div>
        </div>

        <div className="content">
          {/* TOOLBAR */}
          <div className="toolbar">
            <div className="search-wrap">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <input className="search-input" placeholder="Cari nama, nomor, atau properti..."
                value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }} />
            </div>
            <select className="filter-select" value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              {STATUS_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.lbl}</option>)}
            </select>
            <select className="filter-select" value={filterSource}
              onChange={e => { setFilterSource(e.target.value); setPage(1); }}>
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s || "Semua Sumber"}</option>)}
            </select>
            <button className="export-btn" onClick={exportCSV}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
              Export
            </button>
            <button className="add-btn" onClick={() => { setEditData(null); setModalOpen(true); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Tambah Lead
            </button>
          </div>

          {/* STAT STRIP */}
          <div className="stat-strip">
            {[
              { icon:"📋", bg:"#fef3cd", val:stats.total,   lbl:"Total Lead"   },
              { icon:"🆕", bg:"#dbeafe", val:stats.newLead,  lbl:"New Lead"     },
              { icon:"🔄", bg:"#fef3cd", val:stats.followUp, lbl:"Follow Up"    },
              { icon:"✅", bg:"#dcfce7", val:stats.closed,   lbl:"Closing"      },
              { icon:"📈", bg:"#dbeafe", val:`${stats.rate}%`, lbl:"Closing Rate"},
            ].map((s,i) => (
              <div key={i} className="sstrip">
                <div className="sstrip-icon" style={{ background:s.bg }}>{s.icon}</div>
                <div>
                  <div className="sstrip-val">{s.val}</div>
                  <div className="sstrip-lbl">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* TABLE CARD */}
          <div className="table-card">
            {/* BULK BAR */}
            {selected.size > 0 && (
              <div className="bulk-bar show">
                <span>{selected.size} lead dipilih</span>
                <button className="bulk-btn gold" onClick={() => alert("Assign sales...")}>Assign Sales</button>
                <button className="bulk-btn danger" onClick={() => { setSelected(new Set()); }}>Batal Pilih</button>
                <span className="bulk-close" onClick={() => setSelected(new Set())}>✕ Batal</span>
              </div>
            )}

            <div className="table-header">
              <div className="th-title">
                Daftar Semua Lead{" "}
                <span style={{ fontSize:12, color:"var(--text-muted)", fontWeight:400 }}>
                  ({filtered.length} lead)
                </span>
              </div>
              <div className="th-right">
                <div className="view-toggle">
                  <button className={`vt-btn${view==="table"?" active":""}`} onClick={() => setView("table")}>☰ Tabel</button>
                  <button className={`vt-btn${view==="card"?" active":""}`}  onClick={() => setView("card")}>⊞ Kartu</button>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding:40, textAlign:"center", color:"var(--text-muted)" }}>Memuat data...</div>
            ) : view === "table" ? (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th className="td-check">
                          <input type="checkbox" onChange={toggleAll}
                            checked={selected.size === paginated.length && paginated.length > 0} />
                        </th>
                        <th>Nama Lead</th>
                        <th>Properti</th>
                        <th>Status</th>
                        <th>Sumber</th>
                        <th>Sales PIC</th>
                        <th>Harga Properti</th>
                        <th>Tgl Masuk</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length === 0 ? (
                        <tr><td colSpan={9} style={{ textAlign:"center", padding:32, color:"var(--text-muted)" }}>Tidak ada lead ditemukan</td></tr>
                      ) : paginated.map((l, idx) => {
                        const statusName = l.status?.statusName ?? "–";
                        const tag = STATUS_TAG[statusName] ?? { cls:"tag-cold", lbl: statusName };
                        const color = COLORS[l.id % COLORS.length];
                        return (
                          <tr key={l.id}>
                            <td className="td-check">
                              <input type="checkbox" checked={selected.has(l.id)}
                                onChange={() => toggleSelect(l.id)} />
                            </td>
                            <td>
                              <div className="lead-cell">
                                <div className="lc-av" style={{ background:color }}>{initials(l.name)}</div>
                                <div>
                                  <div className="lc-nm">{l.name}</div>
                                  <div className="lc-ph">{l.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td>{l.property?.name ?? "–"}</td>
                            <td><span className={`tag ${tag.cls}`}>{tag.lbl}</span></td>
                            <td>{l.source ?? "–"}</td>
                            <td>{l.sales?.name ?? "–"}</td>
                            <td>{formatRupiah(l.property?.price)}</td>
                            <td>{formatDate(l.createdAt)}</td>
                            <td>
                              <div className="action-cell">
                                <button className="ic-btn view" title="Detail" onClick={() => setDetailLead(l)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </button>
                                <button className="ic-btn edit" title="Edit Status" onClick={() => {
                                  const newStatusId = prompt("Masukkan ID status baru (1-6):", l.status?.id);
                                  if (newStatusId) updateLeadStatus(l.id, parseInt(newStatusId));
                                }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="pagination">
                  <div className="pg-info">
                    Menampilkan {Math.min((page-1)*ROWS_PER_PAGE+1, filtered.length)}–{Math.min(page*ROWS_PER_PAGE, filtered.length)} dari {filtered.length} lead
                  </div>
                  <div className="pg-btns">
                    <button className="pg-btn" disabled={page===1} onClick={() => setPage(p => p-1)}>‹</button>
                    {Array.from({ length: totalPages }, (_,i) => i+1)
                      .filter(p => p===1 || p===totalPages || Math.abs(p-page)<=1)
                      .map((p,i,arr) => (
                        <>
                          {i>0 && arr[i-1]!==p-1 && <span key={`e${p}`} style={{ padding:"0 4px", color:"var(--text-muted)" }}>…</span>}
                          <button key={p} className={`pg-btn${page===p?" active":""}`} onClick={() => setPage(p)}>{p}</button>
                        </>
                      ))}
                    <button className="pg-btn" disabled={page===totalPages} onClick={() => setPage(p => p+1)}>›</button>
                  </div>
                </div>
              </>
            ) : (
              /* CARD VIEW */
              <div style={{ padding:16, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
                {paginated.map(l => {
                  const statusName = l.status?.statusName ?? "–";
                  const tag = STATUS_TAG[statusName] ?? { cls:"tag-cold", lbl: statusName };
                  const color = COLORS[l.id % COLORS.length];
                  return (
                    <div key={l.id} className="lead-kard" onClick={() => setDetailLead(l)}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                        <div className="lc-av" style={{ background:color, width:36, height:36, fontSize:13 }}>{initials(l.name)}</div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13 }}>{l.name}</div>
                          <div style={{ fontSize:11, color:"var(--text-muted)" }}>{l.phone}</div>
                        </div>
                        <span className={`tag ${tag.cls}`} style={{ marginLeft:"auto" }}>{tag.lbl}</span>
                      </div>
                      <div style={{ fontSize:12, color:"var(--text-secondary)" }}>🏠 {l.property?.name ?? "–"}</div>
                      <div style={{ fontSize:12, color:"var(--text-secondary)", marginTop:4 }}>📣 {l.source ?? "–"}</div>
                      <div style={{ fontSize:12, color:"var(--text-secondary)", marginTop:4 }}>👤 {l.sales?.name ?? "–"}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODALS */}
      <LeadModal
        isOpen={modalOpen}
        editData={editData}
        onClose={() => setModalOpen(false)}
        onSave={createLead}
      />
      <DetailModal lead={detailLead} onClose={() => setDetailLead(null)} />
    </div>
  );
}
