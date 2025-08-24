import { useNavigate, Link } from "react-router-dom";
import styles from "./ModifierSupprimer.module.css";
export default function ModifierSupprimer() {
  const navigate = useNavigate();

  const Visiteur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/modifierSupprimerVisiteur", {
        state: { token: parsedAuth.token },
      });
    }
  };

  const Administrateur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/modifierSupprimerAdministrateur", {
        state: { token: parsedAuth.token },
      });
    }
  };

  const Retard = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/modifierSupprimerRetard", {
        state: { token: parsedAuth.token },
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Modifier et Supprimer</h1>
      </div>
      <div className={styles["Line"]}>
        <Link to="/admin" className={styles["back-link"]}>
          Retour
        </Link>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={Visiteur}>
            <span className={styles.icon}>👤</span>
            Visiteur
          </button>
          <button className={styles.button} onClick={Administrateur}>
            <span className={styles.icon}>🔐</span>
            Suivi Administrateur
          </button>
        </div>

        <div className={styles.buttonCenter}>
          <button className={styles.button} onClick={Retard}>
            <span className={styles.icon}>⏱️</span>
            Retard
          </button>
        </div>
      </div>
    </div>
  );
}
