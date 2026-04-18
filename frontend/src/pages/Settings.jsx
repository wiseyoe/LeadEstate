import { useState } from "react";
import "../styles/Settings.css";
import logo from "../assets/leadestate-logo.png";
import { useNavigate } from "react-router-dom";

// ─── DATA ───────────────────────────────────────────────────────────────────

const NOTIF_DATA = [
  { cat: "Follow Up Jatuh Tempo", sub: "Pengingat jadwal follow up",       app: true,  email: true,  wa: true  },
  { cat: "Lead Baru Masuk",       sub: "Saat ada lead baru ditambahkan",   app: true,  email: false, wa: false },
  { cat: "Status Lead Berubah",   sub: "Update status oleh tim sales",     app: true,  email: true,  wa: false },
  { cat: "Closing Berhasil",      sub: "Notifikasi deal selesai",          app: true,  email: true,  wa: true  },
  { cat: "Laporan Mingguan",      sub: "Ringkasan performa setiap Senin",  app: false, email: true,  wa: false },
  { cat: "Pengumuman Sistem",     sub: "Update fitur & maintenance",       app: true,  email: true,  wa: false },
];

const INTEGRATIONS = [
  { logo: "💬", name: "WhatsApp Business API", desc: "Kirim pesan WA otomatis ke lead",    connected: true  },
  { logo: "📊", name: "Google Sheets",         desc: "Sync data lead ke spreadsheet",      connected: true  },
];

const TEAM = [
  { name: "Admin Rafi",     role: "Administrator", email: "admin@leadestate.id", color: "#f59e0b", status: "online",  isMe: true  },
  { name: "Budi Wicaksono", role: "Senior Sales",  email: "budi@leadestate.id",  color: "#6366f1", status: "online",  isMe: false },
  { name: "Sari Rahayu",    role: "Senior Sales",  email: "sari@leadestate.id",  color: "#10b981", status: "offline", isMe: false },
  { name: "Dian Hartono",   role: "Sales Agent",   email: "dian@leadestate.id",  color: "#ef4444", status: "offline", isMe: false },
  { name: "Fajar Kusuma",   role: "Junior Sales",  email: "fajar@leadestate.id", color: "#8b5cf6", status: "offline", isMe: false },
];

const DANGER_ITEMS = [
  {
    key:   "reset",
    title: "Reset Semua Data Lead",
    desc:  "Hapus seluruh data lead, follow up, dan reminder. Data tidak dapat dipulihkan.",
    label: "Reset Data",
  },
  {
    key:   "export",
    title: "Export & Hapus Data",
    desc:  "Download semua data Anda lalu hapus dari sistem sepenuhnya.",
    label: "Export & Hapus",
  },
  {
    key:   "delete",
    title: "Hapus Akun Permanen",
    desc:  "Semua data, anggota tim, dan konfigurasi akan dihapus selamanya.",
    label: "Hapus Akun",
    solid: true,
  },
];

const NAV_ITEMS = [
  { id: "profil",     icon: "👤", label: "Profil Saya",     group: "Akun"    },
  { id: "keamanan",   icon: "🔒", label: "Keamanan",        group: "Akun"    },
  { id: "notifikasi", icon: "🔔", label: "Notifikasi",      group: "Sistem"  },
  { id: "integrasi",  icon: "🔗", label: "Integrasi",       group: "Sistem"  },
  { id: "tim",        icon: "👥", label: "Manajemen Tim",   group: "Tim"     },
  { id: "bahaya",     icon: "⚠️", label: "Zona Bahaya",     group: "Lainnya" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      className={`toggle ${on ? "on" : ""}`}
      onClick={onChange}
      aria-checked={on}
      role="switch"
    />
  );
}

function SecBtn({ children, danger, solid, onClick }) {
  return (
    <button
      type="button"
      className={`sec-btn${danger ? " danger" : ""}${solid ? " solid" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CardHead({ icon, iconBg, title, desc, action }) {
  return (
    <div className="set-card-head">
      <div className="sch-left">
        <div className="sch-icon" style={{ background: iconBg }}>{icon}</div>
        <div>
          <div className="sch-title">{title}</div>
          {desc && <div className="sch-desc">{desc}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

// 1. PROFIL SAYA
function SectionProfil({ onDirty, showToast }) {
  return (
    <>
      <div className="set-card">
        {/* Avatar */}
        <div className="avatar-section">
          <div className="big-av">
            AR
            <div className="av-edit">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
          </div>
          <div className="av-info">
            <div className="av-name">Admin Rafi</div>
            <div className="av-role">Administrator · admin@leadestate.id</div>
            <div className="av-actions">
              <button className="av-btn primary" onClick={() => showToast("Foto profil diperbarui")}>
                Ganti Foto
              </button>
              <button className="av-btn ghost" onClick={() => showToast("Foto dihapus")}>
                Hapus Foto
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="set-card-body">
          <div className="form-grid mb-16">
            <div className="fg">
              <label className="flbl">Nama Depan</label>
              <input className="finp" defaultValue="Admin" onChange={onDirty} />
            </div>
            <div className="fg">
              <label className="flbl">Nama Belakang</label>
              <input className="finp" defaultValue="Rafi" onChange={onDirty} />
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="fg">
              <label className="flbl">Email</label>
              <input className="finp" type="email" defaultValue="admin@leadestate.id" onChange={onDirty} />
            </div>
            <div className="fg">
              <label className="flbl">Nomor HP</label>
              <input className="finp" defaultValue="0812-3456-7890" onChange={onDirty} />
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="fg">
              <label className="flbl">Jabatan</label>
              <input className="finp" defaultValue="Administrator" onChange={onDirty} />
            </div>
            <div className="fg">
              <label className="flbl">Perusahaan</label>
              <input className="finp" defaultValue="LeadEstate Corp" onChange={onDirty} />
            </div>
          </div>

          <div className="form-grid full">
            <div className="fg">
              <label className="flbl">Bio Singkat</label>
              <textarea
                className="finp"
                rows={3}
                defaultValue="Pengelola sistem CRM properti untuk tim sales LeadEstate."
                onChange={onDirty}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 2. KEAMANAN
function SectionKeamanan({ onDirty }) {
  return (
    <div className="set-card">
      <CardHead
        icon="🔑"
        iconBg="#fef3cd"
        title="Password"
        desc="Terakhir diubah 30 hari lalu"
      />
      <div className="set-card-body">
        <div className="form-grid full gap-14">
          <div className="fg">
            <label className="flbl">Password Saat Ini</label>
            <input className="finp" type="password" placeholder="Masukkan password lama" onChange={onDirty} />
          </div>
          <div className="fg">
            <label className="flbl">Password Baru</label>
            <input className="finp" type="password" placeholder="Min. 8 karakter" onChange={onDirty} />
          </div>
          <div className="fg">
            <label className="flbl">Konfirmasi Password Baru</label>
            <input className="finp" type="password" placeholder="Ulangi password baru" onChange={onDirty} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. NOTIFIKASI
function SectionNotifikasi({ onDirty }) {
  const [states, setStates] = useState(
    NOTIF_DATA.map((n) => ({ app: n.app, email: n.email, wa: n.wa }))
  );

  const toggle = (i, key) => {
    setStates((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: !next[i][key] };
      return next;
    });
    onDirty();
  };

  return (
    <div className="set-card">
      <CardHead icon="🔔" iconBg="#fef3cd" title="Preferensi Notifikasi" desc="Atur kapan dan bagaimana kamu diberitahu" />
      <table className="notif-table">
        <thead>
          <tr>
            <th>Jenis Notifikasi</th>
            <th className="text-center">In-App</th>
            <th className="text-center">Email</th>
            <th className="text-center">WhatsApp</th>
          </tr>
        </thead>
        <tbody>
          {NOTIF_DATA.map((n, i) => (
            <tr key={n.cat}>
              <td>
                <div className="notif-category">{n.cat}</div>
                <div className="notif-sub">{n.sub}</div>
              </td>
              <td className="text-center">
                <Toggle on={states[i].app}   onChange={() => toggle(i, "app")}   />
              </td>
              <td className="text-center">
                <Toggle on={states[i].email} onChange={() => toggle(i, "email")} />
              </td>
              <td className="text-center">
                <Toggle on={states[i].wa}    onChange={() => toggle(i, "wa")}    />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 4. INTEGRASI
function SectionIntegrasi({ showToast }) {
  const [integs, setIntegs] = useState(INTEGRATIONS);

  const toggleConnect = (i) => {
    setIntegs((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], connected: !next[i].connected };
      return next;
    });
    const item = integs[i];
    showToast(`${item.connected ? "Memutus" : "Menghubungkan"} ${item.name}...`);
  };

  return (
    <div className="set-card">
      <CardHead icon="🔗" iconBg="#dbeafe" title="Integrasi Aplikasi" desc="Hubungkan LeadEstate dengan tools lain" />
      <div>
        {integs.map((item, i) => (
          <div key={item.name} className="integ-item">
            <div className="integ-logo" style={{ background: item.connected ? "#dcfce7" : "#f3f4f6" }}>
              {item.logo}
            </div>
            <div className="integ-info">
              <div className="integ-name">{item.name}</div>
              <div className="integ-desc">{item.desc}</div>
            </div>
            <span className={`integ-status ${item.connected ? "is-connected" : "is-disconnected"}`}>
              {item.connected ? "✓ Terhubung" : "Belum terhubung"}
            </span>
            <SecBtn danger={item.connected} onClick={() => toggleConnect(i)}>
              {item.connected ? "Putuskan" : "Hubungkan"}
            </SecBtn>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. MANAJEMEN TIM
function SectionTim({ showToast }) {
  return (
    <div className="set-card">
      <CardHead
        icon="👥"
        iconBg="#dbeafe"
        title="Anggota Tim"
        desc="5 anggota aktif"
        action={
          <SecBtn onClick={() => showToast("Form undang anggota baru dibuka")}>
            + Undang Anggota
          </SecBtn>
        }
      />
      <div>
        {TEAM.map((member) => (
          <div key={member.email} className="sec-row">
            <div className="team-avatar" style={{ background: member.color }}>
              {initials(member.name)}
              <div
                className="team-status-dot"
                style={{ background: member.status === "online" ? "#22c55e" : "#9ca3af" }}
              />
            </div>

            <div className="sec-info">
              <div className="sec-title">
                {member.name}
                {member.isMe && <span className="me-badge">Saya</span>}
              </div>
              <div className="sec-desc">
                {member.role} · {member.email}
              </div>
            </div>

            {member.isMe && <span className="sec-status ss-ok">Owner</span>}

            {!member.isMe && (
              <>
                <SecBtn onClick={() => showToast(`Edit akses ${member.name}`)}>
                  Edit Akses
                </SecBtn>
                <SecBtn danger onClick={() => showToast(`${member.name} dihapus dari tim`)}>
                  Hapus
                </SecBtn>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. ZONA BAHAYA
function SectionBahaya({ showToast }) {
  const confirm = (action) => {
    if (window.confirm(`Apakah Anda yakin ingin melakukan: "${action}"?\n\nTindakan ini tidak bisa dibatalkan.`)) {
      showToast(`⚠️ ${action} sedang diproses...`);
    }
  };

  return (
    <div className="set-card danger-card">
      <div className="set-card-head danger-head">
        <div className="sch-left">
          <div className="sch-icon danger-icon">⚠️</div>
          <div>
            <div className="sch-title danger-title">Zona Bahaya</div>
            <div className="sch-desc">Tindakan berikut bersifat permanen dan tidak bisa dibatalkan</div>
          </div>
        </div>
      </div>

      <div>
        {DANGER_ITEMS.map((item) => (
          <div key={item.key} className="danger-item">
            <div className="di-info">
              <div className="di-title">{item.title}</div>
              <div className="di-desc">{item.desc}</div>
            </div>
            <SecBtn danger solid={item.solid} onClick={() => confirm(item.title)}>
              {item.label}
            </SecBtn>
          </div>
        ))}

        {/* Logout */}
        <div className="danger-item">
          <div className="di-info">
            <div className="di-title">Logout dari Akun</div>
            <div className="di-desc">Keluar dari sesi saat ini dan kembali ke halaman login.</div>
          </div>
            <button
                type="button"
                className="logout-btn"
                onClick={() => {
                    localStorage.removeItem("isLogin"); // hapus status login
                    localStorage.removeItem("user");    // hapus data user
                    window.location.href = "/";         // redirect ke login
                }}
                >
                🚪 Logout
            </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Settings() {
  const [activeTab, setActiveTab]     = useState("profil");
  const [isDirty,   setIsDirty]       = useState(false);
  const [toast,     setToast]         = useState(null);
  const toastTimer                    = { current: null };
  const navigate = useNavigate();

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  const markDirty    = () => setIsDirty(true);
  const saveChanges  = () => { setIsDirty(false); showToast("✓ Semua perubahan disimpan!"); };
  const discardChanges = () => setIsDirty(false);

  // Group nav items for rendering section labels
  const groups = [...new Set(NAV_ITEMS.map((n) => n.group))];

  const renderSection = () => {
    switch (activeTab) {
      case "profil":     return <SectionProfil     onDirty={markDirty} showToast={showToast} />;
      case "keamanan":   return <SectionKeamanan   onDirty={markDirty} />;
      case "notifikasi": return <SectionNotifikasi onDirty={markDirty} />;
      case "integrasi":  return <SectionIntegrasi  showToast={showToast} />;
      case "tim":        return <SectionTim        showToast={showToast} />;
      case "bahaya":     return <SectionBahaya     showToast={showToast} />;
      default:           return null;
    }
  };

  return (
    <div className="settings-page">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <img src={logo} alt="LeadEstate Logo" className="brand-logo" />
          <div className="brand-name">Lead<span>Estate</span></div>
        </div>

        <nav className="nav">

          {/* ── Menu Utama ── */}
          <div className="nav-label">Menu Utama</div>

          <div
            className="nav-item"
            onClick={() => navigate("/dashboard")}
            >
            <span className="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
            </span>
            Dashboard
            </div>

          <div className="nav-item">
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
              </svg>
            </span>
            Reminder &amp; Follow-Up
            <span className="nav-badge">5</span>
          </div>

          <div className="nav-item">
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            Data Lead
          </div>

          <div className="nav-item">
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 21v-1a5 5 0 0 1 10 0v1" />
              </svg>
            </span>
            Manajemen Sales
          </div>

          {/* ── Laporan ── */}
          <div className="nav-label">Laporan</div>

          <div className="nav-item">
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4"  />
                <line x1="6"  y1="20" x2="6"  y2="14" />
              </svg>
            </span>
            Laporan &amp; Statistik
          </div>

          <div className="nav-item active">
            <span className="nav-icon">
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
        <div className="sidebar-footer">
          <div className="s-av">AR</div>
          <div className="user-info">
            <div className="name">Admin Rafi</div>
            <div className="role">Administrator</div>
          </div>
        </div>

      </aside>

      {/* ── MAIN ── */}
      <main className="main">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">Pengaturan</div>
          <div className="topbar-right">
            <div className="date-chip">📅 Jum&apos;at, 20 Maret 2026</div>
            <div className="notif-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <div className="notif-dot" />
            </div>
          </div>
        </div>

        {/* Body split */}
        <div className="body-split">

          {/* Settings nav */}
          <div className="settings-nav">
            {groups.map((group) => (
              <div key={group}>
                <div className="sn-section">{group}</div>
                {NAV_ITEMS.filter((n) => n.group === group).map((item) => (
                  <div
                    key={item.id}
                    className={`sn-item${activeTab === item.id ? " active" : ""}${item.id === "bahaya" ? " sn-danger" : ""}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="sn-icon">{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Settings content */}
          <div className="settings-content">
            <div className="section-wrap active">
              {renderSection()}
            </div>
          </div>

        </div>
      </main>

      {/* ── SAVE BAR ── */}
      {isDirty && (
        <div className="save-bar visible">
          <span className="save-bar-text">Ada perubahan yang belum disimpan</span>
          <button className="sb-discard" onClick={discardChanges}>Batal</button>
          <button className="sb-save"    onClick={saveChanges}>Simpan Perubahan</button>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast show">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}