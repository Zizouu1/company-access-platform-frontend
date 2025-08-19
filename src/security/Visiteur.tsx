import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./form.module.css";

export default function Visiteur() {
  const location = useLocation();
  const token = location.state?.token;

  const [form, setForm] = useState({
    dateA: "",
    time: "",
    id: "",
    fullname: "",
    matriculeV: "",
    typeV: "",
    aQui: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/visitor-manager", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "security",
        },
      });

      setMessage("Visiteur ajouté!");
      setForm({
        dateA: "",
        time: "",
        id: "",
        fullname: "",
        matriculeV: "",
        typeV: "",
        aQui: "",
      });
    } catch {
      setMessage("Erreur , veuillez réessayer");
    }
  };

  if (!token) {
    return <p>Token manquant. Veuillez vous reconnecter.</p>;
  }

  return (
    <div className={styles["form-container"]}>
      <Link to="/security" className={styles["back-link"]}>
        Retour
      </Link>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Ajouter un visiteur</h2>

        {message && <p className={styles["message"]}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <label>Date d'arrivé</label>
            <input
              type="date"
              value={form.dateA}
              onChange={(e) => setForm({ ...form, dateA: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Heure d'arrivé</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>

          <div className={styles["input-group"]}>
            <label>Numèro carte d'identité</label>
            <input
              type="text"
              placeholder="Numèro carte d'identité..."
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Nom et prénom</label>
            <input
              type="text"
              placeholder="Nom et prénom..."
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Matricule voiture</label>
            <input
              type="text"
              placeholder="Matricule voiture..."
              value={form.matriculeV}
              onChange={(e) => setForm({ ...form, matriculeV: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Type de visite</label>
            <input
              type="text"
              placeholder="Type de visite..."
              value={form.typeV}
              onChange={(e) => setForm({ ...form, typeV: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>A qui le visite</label>
            <input
              type="text"
              placeholder="A qui le visite..."
              value={form.aQui}
              onChange={(e) => setForm({ ...form, aQui: e.target.value })}
            />
          </div>

          <button className={styles["submit-button"]} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
