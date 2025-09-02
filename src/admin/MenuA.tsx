import styles from "./MenuA.module.css";
import { NavLink } from "react-router-dom";

export default function MenuA() {
  return (
    <aside className={styles.sidebar}>
      <NavLink
        to="/admin"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Accueil
      </NavLink>
      <NavLink
        to="/GestionUtilisateurs"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Gestion Utilisateurs
      </NavLink>
      <NavLink
        to="/GestionSalaries"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Gestion Salariés
      </NavLink>
      <p>Update</p>
      <NavLink
        to="/modifierSupprimerRetard"
        className={({ isActive }) => (isActive ? styles.active : "")}
        id={styles.Retard}
      >
        Retard Salariés
      </NavLink>
      <NavLink
        to="/modifierSupprimerAdministrateur"
        className={({ isActive }) => (isActive ? styles.active : "")}
        id={styles.Retard}
      >
        Retard Administrateur
      </NavLink>
      <NavLink
        to="/modifierSupprimerVisiteur"
        className={({ isActive }) => (isActive ? styles.active : "")}
        id={styles.Retard}
      >
        Visiteur
      </NavLink>
    </aside>
  );
}
