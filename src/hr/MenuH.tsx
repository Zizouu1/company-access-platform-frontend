import styles from "./MenuH.module.css";
import { NavLink } from "react-router-dom";

export default function MenuH() {
  return (
    <aside className={styles.sidebar}>
      <NavLink
        to="/hr"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Accueil
      </NavLink>
      <NavLink
        to="/retardTable"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Retard Salarié
      </NavLink>
      <NavLink
        to="/administrateurTable"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Retard Administrateur
      </NavLink>
      <NavLink
        to="/visiteurTable"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Visiteur
      </NavLink>
    </aside>
  );
}
