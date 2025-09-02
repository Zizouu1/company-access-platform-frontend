import { useState } from "react";
import { useAuth } from "../hooks/User";
import Logout from "../login/Logout";
import styles from "./Header.module.css";

export default function Header() {
  const user: { username: string; role: string; token: string } = useAuth()!;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img
          src="src/assets/Pec.png"
          alt="Company Logo"
          className={styles.logo}
        />
        <img src="src/assets/LogoT.png" alt="logo" className={styles.title} />
      </div>

      <div className={styles.userMenu}>
        <button onClick={toggleDropdown} className={styles.userButton}>
          <div className={styles.avatar}>{initials}</div>
          <span className={styles.username}>{user?.username}</span>
          <svg
            className={`${styles.dropdownIcon} ${
              isDropdownOpen ? styles.rotated : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className={`${styles.dropdown} ${styles.dropdownOpen}`}>
            <Logout />
          </div>
        )}
      </div>
    </header>
  );
}
