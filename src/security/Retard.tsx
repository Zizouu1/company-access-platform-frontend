import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import styles from "./form.module.css";

export default function Retard() {
  const location = useLocation();
  const token = location.state?.token;

  const [form, setForm] = useState({
    dateR: "",
    time: "",
    id: "",
    nom: "",
    prenom: "",
    site: "",
    service: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!form.id) {
      setForm((prev) => ({ ...prev, nom: "", prenom: "", site: "" }));
      setMessage("");
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/employees/${form.id}`,
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
        setMessage("");
      } catch {
        setMessage("Employé introuvable");
        setForm((prev) => ({ ...prev, nom: "", prenom: "", site: "" }));
      }
    };

    fetchEmployee();
  }, [form.id, token]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!form.id || !form.dateR || !form.time) {
      setMessage(
        "Veuillez remplir les champs obligatoires (Matricule, Date, Heure)."
      );
      return;
    }

    try {
      const payload = {
        id: form.id,
        dateR: form.dateR,
        time: form.time,
        site: form.site,
        service: form.service,
      };

      await axios.post("http://localhost:3000/delay-pec", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "security",
        },
      });

      setMessage("Ajouté avec succès!");
      setForm({
        dateR: "",
        time: "",
        id: "",
        nom: "",
        prenom: "",
        site: "",
        service: "",
      });
    } catch (err) {
      const erreur = err as AxiosError;
      setMessage(
        (erreur.response?.data as { error?: string })?.error ||
          "Erreur, veuillez réessayer"
      );
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
        <h2 className={styles["form-title"]}>Ajouter un retard</h2>

        {message && <p className={styles["message"]}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <label>Matricule</label>
            <input
              type="text"
              placeholder="Matricule..."
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value.trim() })}
              required
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

          <div className={styles["input-group"]}>
            <label>Date de retard</label>
            <input
              type="date"
              value={form.dateR}
              onChange={(e) => setForm({ ...form, dateR: e.target.value })}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label>Heure d'arrivée</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label>Service</label>
            <input
              type="text"
              placeholder="Service..."
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            />
          </div>

          <button className={styles["submit-button"]} type="submit">
            Soumettre
          </button>
        </form>
      </div>
    </div>
  );
}
