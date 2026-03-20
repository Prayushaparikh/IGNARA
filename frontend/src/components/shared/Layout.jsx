import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import styles from "./Layout.module.css";
import ignaraIcon from "../../assets/ignara-icon.svg";

const studentNav = [
  { to: "/dashboard",  icon: "◈", label: "Dashboard"  },
  { to: "/quiz",       icon: "◆", label: "Career Quiz" },
  { to: "/careers",    icon: "✦", label: "Careers"     },
  { to: "/lessons",    icon: "📘", label: "Lessons"     },
  { to: "/challenges", icon: "⚡", label: "Challenges"  },
  { to: "/roadmap",    icon: "🗺️", label: "My Roadmap" },
  { to: "/compiler",   icon: "⌥", label: "Compiler"    },
];

const teacherNav = [
  { to: "/teacher", icon: "◈", label: "Dashboard" },
  { to: "/careers", icon: "✦", label: "Careers"   },
];

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  const links = user?.role === "teacher" ? teacherNav : studentNav;
  const handleLogout = () => { logout(); nav("/login"); };
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src={ignaraIcon} alt="Ignara" height="36" />
        </div>
        <nav className={styles.nav}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}>
              <span className={styles.linkIcon}>{l.icon}</span>
              <span className={styles.linkLabel}>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.userBlock}>
          <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || "?"}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || "Student"}</span>
            <span className={styles.userRole}>{user?.role || "student"}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">⏻</button>
        </div>
      </aside>
      <main className={styles.main}>{children ?? <Outlet />}</main>
    </div>
  );
}
