import { useNavigate } from "react-router-dom";
import Logout from "../login/Logout";
import styles from "./SecurityDashboard.module.css";

export default function SecurityDashboard() {
  const navigate = useNavigate();

  const Visiteur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/visiteur", { state: { token: parsedAuth.token } });
    }
  };

  const Administrateur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/administrateur", { state: { token: parsedAuth.token } });
    }
  };

  const Retard = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/retard", { state: { token: parsedAuth.token } });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tableau de bord de sécurité</h1>
      </div>

      <div className={styles.logoutContainer}>
        <Logout />
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
