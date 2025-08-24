import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      const data = res.data;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          role: data.role,
          token: data.access_token,
        })
      );

      navigate(`/${data.role}`);
    } catch {
      setMessage("Identifiant ou mot de passe incorrect. Veuillez réessayer.");
    }
  };

  return (
    <div className={styles["page-container"]}>
      <div className={styles["login-background"]}>
        <div className={styles["login-box"]}>
          <h2 className={styles["login-title"]}>Se connecter</h2>
          {message && <p className={styles["login-footer"]}>{message}</p>}

          <div className={styles["input-group"]}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles["login-input"]}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles["login-input"]}
              required
            />
          </div>

          <button onClick={handleLogin} className={styles["login-button"]}>
            Se connecter
          </button>
        </div>
      </div>
      <div className={styles["footer"]}>
        <img src="./src/assets/Pec.png" alt="Pec.img" />
        <p>© 2025 PEC - Tous droits reservés</p>
      </div>
    </div>
  );
}
