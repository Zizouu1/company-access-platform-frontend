import styles from "./change.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
export default function UpadteUser() {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userid = useParams();
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
          password: foundUser.password,
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
    try {
      await axios.patch(`http://localhost:3000/users/userid`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      });
      setMessage("Utilisateur modifié avec succès!");
      setForm({
        id: "",
        username: "",
        password: "",
      });
    } catch {
      setMessage(
        "Erreur lors de la modification de l'utilisateur. Veuillez réessayer."
      );
    }
  };
  return (
    <div className={styles["form-container"]}>
      <Link to="/GestionUtilisateurs" className={styles["back-link"]}>
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
          <button className={styles["submit-button"]}>Modifier</button>
        </form>
      </div>
    </div>
  );
}
