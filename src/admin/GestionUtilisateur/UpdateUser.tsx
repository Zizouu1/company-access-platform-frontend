import styles from "/src/admin/change.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
export default function UpadteUser() {
  const { id: userid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;

  interface UserPayload {
    id: string;
    username: string;
    role: string;
    password?: string;
  }

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
  useEffect(() => {
    const getV = async () => {
      if (!userid) return;
      try {
        const res = await axios.get(`http://localhost:3000/users/${userid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "admin",
          },
        });
        const foundUser = res.data;
        setForm({
          id: foundUser.id,
          username: foundUser.username,
          password: "",
          role: foundUser.role,
        });
      } catch {
        setMessage(
          "Erreur lors de la récupération de l'utilisateur. Veuillez réessayer."
        );
      }
    };
    getV();
  }, [userid, token]);
  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const payload: UserPayload = {
      id: form.id,
      username: form.username,
      role: form.role,
    };

    if (form.password.trim() !== "") {
      payload.password = form.password;
    }
    try {
      await axios.patch(`http://localhost:3000/users/${userid}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      });
      setMessage("Utilisateur modifié avec succès!");
    } catch {
      setMessage(
        "Erreur lors de la modification de l'utilisateur. Veuillez réessayer."
      );
    }
  };
  return (
    <div className={styles["form-container"]}>
      <Link
        to="/GestionUtilisateurs"
        className={styles["back-link"]}
        state={{ token }}
      >
        Retour
      </Link>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Modifier un utilisateur</h2>
        {message && <p className={styles["message"]}>{message}</p>}
        <form onSubmit={handleUpdate}>
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
              <option value="security">Security</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className={styles["submit-button"]}>Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}
