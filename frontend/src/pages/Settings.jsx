import { useEffect, useState } from "react";
import "../styles/Settings.css";
import logo from "../assets/leadestate-logo.png";
import { useNavigate } from "react-router-dom";
import { updateProfile, getAllUsers, deleteUser, updateUserRole } from "../api/api";
import { getNotifSettings, saveNotifSettings } from "../api/api";

// ─── DATA ───────────────────────────────────────────────────────────────────

const NOTIF_DATA = [
  {
    cat: "Follow Up Jatuh Tempo",
    sub: "Pengingat jadwal follow up",
    app: true,
    wa: true
  },
  {
    cat: "Lead Baru Masuk",
    sub: "Saat ada lead baru ditambahkan",
    app: true,
    wa: false
  },
  {
    cat: "Status Lead Berubah",
    sub: "Update status oleh tim sales",
    app: true,
    wa: false
  },
  {
    cat: "Closing Berhasil",
    sub: "Notifikasi deal selesai",
    app: true,
    wa: true
  },
  {
    cat: "Pengumuman Sistem",
    sub: "Update fitur & maintenance",
    app: true,
    wa: false
  }
];

const INTEGRATIONS = [
  {
    logo: "💬",
    name: "WhatsApp Business API",
    desc: "Kirim pesan follow up otomatis ke lead",
    connected: true
  }
];

// ── USER HELPER (module level agar bisa diakses semua komponen) ──────────────
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
}

function isAdminUser() {
  const role = getCurrentUser()?.role;

  return (
    role === 1 ||
    role === "1" ||
    role?.toString().toLowerCase() === "admin"
  );
}

function getUserInitials() {
  const name = getCurrentUser().name || "U";
  return name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
}

function getUserRole() {
  const role = getCurrentUser()?.role;

  if (
    role === 1 ||
    role === "1" ||
    role?.toString().toLowerCase() === "admin"
  ) {
    return "Administrator";
  }

  return "Sales";
}

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

// Menambahkan properti 'disabled' opsional agar tombol simpan/batal di main view sinkron
function SecBtn({ children, danger, solid, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`sec-btn${danger ? " danger" : ""}${solid ? " solid" : ""}`}
      onClick={onClick}
      disabled={disabled}
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

// 1. PROFIL SAYA (Sudah Diperbarui Berdasarkan Instruksi)
function SectionProfil({ onDirty, form, setForm }) {
  const user = getCurrentUser();

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
    onDirty();
  };

  const formatPhone = (value) => {
    // hapus semua selain angka
    let digits = value.replace(/\D/g, "");

    // batasi max 12 digit
    digits = digits.substring(0, 12);

    // format xxxx-xxxx-xxxx
    const parts = digits.match(/.{1,4}/g);
    return parts ? parts.join("-") : "";
  };

  return (
    <>
      <div className="set-card">

        {/* Avatar */}
        <div className="avatar-section">
          <div className="big-av">
            {getUserInitials()}
          </div>
          <div className="av-info">
            <div className="av-name">{user.name || "User"}</div>
            <div className="av-role">{getUserRole()} · {user.email || ""}</div>
          </div>
        </div>

        {/* Form */}
        <div className="set-card-body">

          <div className="form-grid mb-16">
            <div className="fg">
              <label className="flbl">Nama Depan</label>
              <input
                className="finp"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div className="fg">
              <label className="flbl">Nama Belakang</label>
              <input
                className="finp"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="fg">
              <label className="flbl">Email</label>
              <input
                className="finp"
                type="email"
                value={form.email}
                disabled
              />
            </div>

            <div className="fg">
              <label className="flbl">Nomor HP</label>
              <input
                className="finp"
                value={form.phone}
                disabled
              />
            </div>
          </div>

          <div className="form-grid mb-16">
            <div className="fg">
              <label className="flbl">Jabatan</label>
              <input
                className="finp"
                value={getUserRole()}
                disabled
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// 2. NOTIFIKASI
function SectionNotifikasi({ onDirty }) {
  const user = getCurrentUser();
  const [states, setStates] = useState({
    followupApp: true,
    followupWa: true,

    leadApp: true,
    leadWa: false,

    statusApp: true,
    statusWa: false,

    closingApp: true,
    closingWa: true,

    systemApp: true,
    systemWa: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data =
        await getNotifSettings(
          user.id
        );

      if (data) {
        setStates({
          followupApp:
            data.followupApp ?? true,
          followupWa:
            data.followupWa ?? true,
          leadApp:
            data.leadApp ?? true,
          leadWa:
            data.leadWa ?? false,
          statusApp:
            data.statusApp ?? true,
          statusWa:
            data.statusWa ?? false,
          closingApp:
            data.closingApp ?? true,
          closingWa:
            data.closingWa ?? true,
          systemApp:
            data.systemApp ?? true,
          systemWa:
            data.systemWa ?? false
        });
      }
    } catch (err) {
      console.error(
        "Notif load error",
        err
      );
    }
  };

  const toggle = async (key) => {
    const updated = {
      ...states,
      [key]:
        !states[key]
    };

    setStates(updated);
    onDirty();

    try {
      await saveNotifSettings(
        user.id,
        updated
      );
    } catch (err) {
      console.error(
        "Notif save error",
        err
      );
    }
  };

  return (
    <div className="set-card">
      <CardHead
        icon="🔔"
        iconBg="#fef3cd"
        title="Preferensi Notifikasi"
        desc="Atur kapan dan bagaimana kamu diberitahu"
      />
      <table className="notif-table">
        <thead>
          <tr>
            <th>Jenis Notifikasi</th>
            <th className="text-center">
              In-App
            </th>
            <th className="text-center">
              WhatsApp
            </th>
          </tr>
        </thead>
        <tbody>

          {/* FOLLOWUP */}
          <tr>
            <td>
              <div className="notif-category">
                Follow Up Jatuh Tempo
              </div>

              <div className="notif-sub">
                Pengingat jadwal follow up
              </div>
            </td>

            <td className="text-center">
              <Toggle
                on={states.followupApp}
                onChange={() =>
                  toggle(
                    "followupApp"
                  )
                }
              />
            </td>

            <td className="text-center">
              <Toggle
                on={states.followupWa}
                onChange={() =>
                  toggle(
                    "followupWa"
                  )
                }
              />
            </td>
          </tr>

          {/* LEAD */}
          <tr>
            <td>
              <div className="notif-category">
                Lead Baru Masuk
              </div>

              <div className="notif-sub">
                Saat ada lead baru ditambahkan
              </div>
            </td>

            <td className="text-center">
              <Toggle
                on={states.leadApp}
                onChange={() =>
                  toggle(
                    "leadApp"
                  )
                }
              />
            </td>

            <td className="text-center">
              <Toggle
                on={states.leadWa}
                onChange={() =>
                  toggle(
                    "leadWa"
                  )
                }
              />
            </td>
          </tr>

          {/* STATUS */}
          <tr>
            <td>
              <div className="notif-category">
                Status Lead Berubah
              </div>

              <div className="notif-sub">
                Update status oleh tim sales
              </div>
            </td>

            <td className="text-center">
              <Toggle
                on={states.statusApp}
                onChange={() =>
                  toggle(
                    "statusApp"
                  )
                }
              />
            </td>

            <td className="text-center">
              <Toggle
                on={states.statusWa}
                onChange={() =>
                  toggle(
                    "statusWa"
                  )
                }
              />
            </td>
          </tr>

          {/* CLOSING */}
          <tr>
            <td>
              <div className="notif-category">
                Closing Berhasil
              </div>

              <div className="notif-sub">
                Notifikasi deal selesai
              </div>
            </td>

            <td className="text-center">
              <Toggle
                on={states.closingApp}
                onChange={() =>
                  toggle(
                    "closingApp"
                  )
                }
              />
            </td>

            <td className="text-center">
              <Toggle
                on={states.closingWa}
                onChange={() =>
                  toggle(
                    "closingWa"
                  )
                }
              />
            </td>
          </tr>

          {/* SYSTEM */}
          <tr>
            <td>
              <div className="notif-category">
                Pengumuman Sistem
              </div>

              <div className="notif-sub">
                Update fitur & maintenance
              </div>
            </td>

            <td className="text-center">
              <Toggle
                on={states.systemApp}
                onChange={() =>
                  toggle(
                    "systemApp"
                  )
                }
              />
            </td>

            <td className="text-center">
              <Toggle
                on={states.systemWa}
                onChange={() =>
                  toggle(
                    "systemWa"
                  )
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// 3. INTEGRASI
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

// 4. MANAJEMEN TIM
function SectionTim({ showToast }) {
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();

      const mapped = data.map((u, i) => {
      
        console.log("USER DATA:", u);
      
        const normalizedRole =
          u.roleId === 1 || u.admin === true
            ? "Admin"
            : "Sales";

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: normalizedRole, // 🔥 FIX DISINI
          color: ["#6366f1", "#10b981", "#ef4444", "#8b5cf6"][i % 4],
          status: "offline",
          isMe: u.id === getCurrentUser().id,
        };
      });

      setTeam(mapped);
    } catch (err) {
      console.error(err);
      showToast("❌ Gagal ambil data tim");
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Hapus ${member.name}?`)) return;

    try {
      await deleteUser(member.id);
      showToast(`✅ ${member.name} dihapus`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("❌ Gagal hapus user");
    }
  };

  const updateRole = async (id, newRole) => {
    try {

      const roleId =
        newRole === "Admin"
          ? 1
          : 3;

      await updateUserRole(
        id,
        roleId
      );

      showToast(
        "✅ Role berhasil diupdate"
      );

      fetchUsers();

    } catch (err) {

      console.error(err);

      showToast(
        "❌ Gagal update role"
      );
    }
  };

  // 🔍 FILTER + SEARCH
  const filteredTeam = team.filter((m) => {

    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    let matchRole = true;

    if (roleFilter === "admin") {
      matchRole = m.role === "Admin";
    } else if (roleFilter === "sales") {
      matchRole = m.role === "Sales";
    }

    return matchSearch && matchRole;
  });

  return (
    <div className="set-card">

      <CardHead
        icon="👥"
        iconBg="#dbeafe"
        title="Anggota Tim"
        desc={`${filteredTeam.length} anggota`}
        action={
          <div style={{ display: "flex", gap: "8px" }}>

            {/* 🔍 SEARCH */}
            <input
              type="text"
              placeholder="Cari nama / email..."
              className="finp"
              style={{ width: "200px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* 🎯 FILTER ROLE */}
            <select
              className="finp"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="admin">Admin</option>
              <option value="sales">Sales</option>
            </select>

          </div>
        }
      />

      <div>
        {filteredTeam.map((member) => (
          <div key={member.id} className="sec-row">

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
                <span
                  className={`role-badge ${
                    member.role.toLowerCase() === "admin" ? "admin" : "sales"
                  }`}
                >
                  {member.role}
                </span>
                {" · "}
                {member.email}
              </div>
            </div>

            {member.isMe && <span className="sec-status ss-ok">Owner</span>}

            {!member.isMe && (
              <>
                {/* DROPDOWN ROLE */}
                <select
                  className="finp"
                  value={member.role}
                  onChange={(e) => updateRole(member.id, e.target.value)}
                  style={{ width: "120px" }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Sales">Sales</option>
                </select>

                <SecBtn danger onClick={() => handleDelete(member)}>
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

// 5. ZONA BAHAYA
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

  // Inisialisasi state form profil di level parent (Settings) agar datanya persistent saat ganti tab & bisa di-reset/simpan
  const user = getCurrentUser();
  const [form, setForm] = useState({
    firstName: user.name?.split(" ")[0] || "",
    lastName: user.name?.split(" ").slice(1).join(" ") || "",
    email: user.email || "",
    phone: user.phone || ""
  });

  const isAdmin = isAdminUser();
  const userInitials = getUserInitials();
  const userRole     = getUserRole();

  const NAV_ITEMS = [
    { id: "profil",     icon: "👤", label: "Profil Saya",     group: "Akun"    },
    { id: "notifikasi", icon: "🔔", label: "Notifikasi",      group: "Sistem"  },
    { id: "integrasi",  icon: "🔗", label: "Integrasi",       group: "Sistem"  },

    ...(isAdminUser()
      ? [{ id: "tim", icon: "👥", label: "Manajemen Tim", group: "Tim" }]
      : []),

    { id: "bahaya",     icon: "⚠️", label: "Zona Bahaya",     group: "Lainnya" },
  ];

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  const markDirty    = () => setIsDirty(true);
  
  // Fungsi Simpan Perubahan
  const saveChanges = async () => { 
    try {
      // data yang dikirim ke backend
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone
      };

      // CALL API 🔥
      const updatedUser = await updateProfile(user.id, payload);

      // update localStorage dari response backend (lebih aman)
      const oldUser = getCurrentUser();

      const mergedUser = {
        ...oldUser,
        ...updatedUser
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));

      setIsDirty(false);
      showToast("✓ Profil berhasil diperbarui!");

    } catch (err) {
      console.error(err);
      showToast("❌ Gagal update profil");
    }
  };

  // Fungsi Batal Perubahan (Reset Form ke data semula)
  const discardChanges = () => { 
    setIsDirty(false); 
    const freshUser = getCurrentUser();
    setForm({
      firstName: freshUser.name?.split(" ")[0] || "",
      lastName: freshUser.name?.split(" ").slice(1).join(" ") || "",
      email: freshUser.email || "",
      phone: freshUser.phone || ""
    });
  };

  // Group nav items for rendering section labels
  const groups = [...new Set(NAV_ITEMS.map((n) => n.group))];

  const renderSection = () => {
    switch (activeTab) {
      case "profil":     return <SectionProfil onDirty={markDirty} form={form} setForm={setForm} />;
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

          <div className="nav-item" onClick={() => navigate("/reminder")}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
              </svg>
            </span>
            Reminder &amp; Follow-Up
            <span className="nav-badge">5</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/dataLeads")}>
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

          {/* ADMIN ONLY */}
          {isAdmin && (
            <>
              <div className="nav-item" onClick={() => navigate("/Manajemen_sales")}>
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

              <div className="nav-item" onClick={() => navigate("/laporan")}>
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4"  />
                    <line x1="6"  y1="20" x2="6"  y2="14" />
                  </svg>
                </span>
                Laporan &amp; Statistik
              </div>
            </>
          )}

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
          <div className="s-av">{userInitials}</div>
          <div className="user-info">
            <div className="name">{form.firstName ? `${form.firstName} ${form.lastName}` : (user.name || "User")}</div>
            <div className="role">{userRole}</div>
          </div>
        </div>

      </aside>

      {/* ── MAIN ── */}
      <main className="main">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">Pengaturan</div>
          <div className="topbar-right">
            <div className="date-chip">📅 {new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
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