import styles from "/src/admin/Ajouter.module.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
export default function AddUser() {
  const navigate = useNavigate();
  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  const [form, setForm] = useState({
    id: "",
    username: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/auth/register",
        {
          id: form.id,
          username: form.username,
          password: form.password,
          role: form.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Utilisateur ajouté avec succès!");
      setForm({
        id: "",
        username: "",
        password: "",
        role: "",
      });
    } catch {
      setMessage(
        "Erreur lors de l'ajout de l'utilisateur. Veuillez réessayer."
      );
    }
  };
  return (
    <div className={styles["form-container"]}>
      <div className={styles["Line"]}>
        <Link
          to="/GestionUtilisateurs"
          className={styles["back-link"]}
          state={{ token }}
        >
          Retour
        </Link>
      </div>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Creation User</h2>
        {message && <p className={styles["message"]}>{message}</p>}
        <form onSubmit={handleAdd}>
          <div className={styles["input-group"]}>
            <label>Matricule</label>
            <input
              type="text"
              placeholder="Matricule"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className={styles["sign-input"]}
              required
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Nom</label>
            <input
              type="text"
              placeholder="Nom"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={styles["sign-input"]}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={styles["sign-input"]}
              required
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={styles["sign-input"]}
              required
            >
              <option value="" disabled>
                — Sélectionner un rôle —
              </option>
              <option value="security">Security</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className={styles["submit-button"]}>Ajouter</button>
        </form>
      </div>
    </div>
  );
}
