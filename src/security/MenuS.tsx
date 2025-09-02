import styles from "./Menu.module.css";
import { NavLink } from "react-router-dom";

export default function MenuS() {
  return (
    <aside className={styles.sidebar}>
      <NavLink
        to="/security"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Accueil
      </NavLink>
      <NavLink
        to="/retard"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Retard Salarié
      </NavLink>
      <NavLink
        to="/administrateur"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Retard Administrateur
      </NavLink>
      <NavLink
        to="/visiteur"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Visiteur
      </NavLink>
    </aside>
  );
}
