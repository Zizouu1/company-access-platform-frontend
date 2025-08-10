import styles from "./change.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
export default function AddUser() {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  const [form, setForm] = useState({
    id: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auth/register", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      });
      setMessage("Utilisateur ajouté avec succès!");
      setForm({
        id: "",
        username: "",
        password: "",
      });
    } catch {
      setMessage(
        "Erreur lors de l'ajout de l'utilisateur. Veuillez réessayer."
      );
    }
  };
  return (
    <div className={styles["form-container"]}>
      <Link to="/GestionUtilisateurs" className={styles["back-link"]}>
        Retour
      </Link>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Ajouter un utilisateur</h2>
        {message && <p className={styles["message"]}>{message}</p>}
        <form onSubmit={handleAdd}>
          <div className={styles["input-group"]}>
            <label>Matricule</label>
            <input
              type="text"
              placeholder="Username"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={styles["sign-input"]}
              required
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Nom</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles["sign-input"]}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles["sign-input"]}
              required
            />
          </div>
          <button className={styles["submit-button"]}>Ajouter</button>
        </form>
      </div>
    </div>
  );
}
