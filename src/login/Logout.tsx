import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import styles from "./Logout.module.css";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("auth");
  };

  return (
    <nav>
      <Link to="/" className={styles.logout} onClick={handleLogout}>
        <LogOut className={styles.icon} />
        Se déconnecter
      </Link>
    </nav>
  );
}
