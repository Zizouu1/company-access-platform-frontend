import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios, { AxiosError } from "axios";

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
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        setMessage(
          (error.response.data as { message: string }).message || "Login failed"
        );
      } else {
        setMessage("Network error");
      }
    }
  };

  return (
    <div className={styles["login-background"]}>
      <div className={styles["login-box"]}>
        <h2 className={styles["login-title"]}>Login</h2>
        {message && <p className={styles["login-footer"]}>{message}</p>}

        <div className={styles["input-group"]}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles["login-input"]}
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
            className={styles["login-input"]}
            required
          />
        </div>

        <button onClick={handleLogin} className={styles["login-button"]}>
          Login
        </button>
      </div>
    </div>
  );
}
