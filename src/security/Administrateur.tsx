import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./form.module.css";

export default function Administrateur() {
  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;

  const [form, setForm] = useState({
    dateR: "",
    time: "",
    employeeId: "",
    nom: "",
    prenom: "",
    site: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!form.employeeId) {
      setForm((prev) => ({ ...prev, nom: "", prenom: "", site: "" }));
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/employees/${form.employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const emp = res.data;
        setForm((prev) => ({
          ...prev,
          nom: emp.nom,
          prenom: emp.prenom,
          site: emp.site,
        }));
      } catch {
        setMessage("Employé introuvable");
        setForm((prev) => ({
          ...prev,
          nom: "",
          prenom: "",
          site: "",
        }));
      }
    };

    fetchEmployee();
  }, [form.employeeId, token]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const formatTimeForBackend = (time: string) => {
      if (time.length === 5) return `${time}:00`;
      if (time.length === 4) return `0${time}:00`;
      return time;
    };

    if (!form.employeeId || !form.dateR || !form.time) {
      setMessage(
        "Veuillez remplir les champs obligatoires (Matricule, Date, Heure)."
      );
      return;
    }

    try {
      const payload = {
        dateR: form.dateR,
        time: formatTimeForBackend(form.time),
        employeeId: form.employeeId,
      };
      await axios.post("http://localhost:3000/follow-administrator", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("ajouté avec succès!");
      setForm({
        dateR: "",
        time: "",
        employeeId: "",
        nom: "",
        prenom: "",
        site: "",
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
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Retard Administrateur</h2>

        {message && <p className={styles["message"]}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <label>Date de retard</label>
            <input
              type="date"
              value={form.dateR}
              onChange={(e) => setForm({ ...form, dateR: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>heure d'arrivé</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Matricule</label>
            <input
              type="text"
              placeholder="Matricule..."
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Nom</label>
            <input
              type="text"
              value={form.nom}
              readOnly
              className={styles["readonly-input"]}
            />
          </div>

          <div className={styles["input-group"]}>
            <label>Prénom</label>
            <input
              type="text"
              value={form.prenom}
              readOnly
              className={styles["readonly-input"]}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>Site</label>
            <input
              type="text"
              value={form.site}
              readOnly
              className={styles["readonly-input"]}
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
