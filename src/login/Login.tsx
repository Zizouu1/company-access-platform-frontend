import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";
import type { KeyboardEvent } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = useCallback(async () => {
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
          username: username,
        })
      );

      navigate(`/${data.role}`);
    } catch {
      setMessage("Identifiant ou mot de passe incorrect. Veuillez réessayer.");
    }
  }, [username, password, navigate]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );

  return (
    <div className={styles["page-container"]}>
      <div className={styles["login-background"]}>
        <div className={styles["login-box"]}>
          <img src="./src/assets/Pec.png" alt="Pec.img" />
          <h2 className={styles["login-title"]}>Connexion</h2>
          {message && <p className={styles["login-footer"]}>{message}</p>}

          <div className={styles["input-group"]}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles["login-input"]}
              required
              title="entrer votre nom d'utilisateur"
              onKeyDown={handleKeyPress}
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
              title="entrer votre mot de passe"
              onKeyDown={handleKeyPress}
            />
          </div>

          <button onClick={handleLogin} className={styles["login-button"]}>
            Se connecter
          </button>
          <p>© 2025 PEC - Tous droits reservés</p>
        </div>
      </div>
    </div>
  );
}
