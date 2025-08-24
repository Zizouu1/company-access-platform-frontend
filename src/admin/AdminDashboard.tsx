import Logout from "../login/Logout";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const UserM = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/GestionUtilisateurs", { state: { token: parsedAuth.token } });
    }
  };

  const EmployeeM = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/GestionSalaries", { state: { token: parsedAuth.token } });
    }
  };

  const UpdateDelete = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/ModifierSupprimer", { state: { token: parsedAuth.token } });
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tableau de bord Administrateur</h1>
      </div>

      <div className={styles.logoutContainer}>
        <Logout />
      </div>

      <div className={styles.dashboard}>
        <div className={styles.buttonRow}>
          <button className={styles.button} onClick={UserM}>
            <span className={styles.icon}>👥</span>
            Gestion des utilisateurs
          </button>
          <button className={styles.button} onClick={EmployeeM}>
            <span className={styles.icon}>👨‍💼</span>
            Gestion des salaries
          </button>
        </div>

        <div className={styles.buttonCenter}>
          <button className={styles.button} onClick={UpdateDelete}>
            <span className={styles.icon}>✏️</span>
            Modifier ou supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
