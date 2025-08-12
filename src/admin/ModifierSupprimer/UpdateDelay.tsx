import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import styles from "./form.module.css";

export default function UpdateDelay() {
  const { id } = useParams();
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
    if (!token || !id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/delay-pec/${id}`, {
          headers: { Authorization: `Bearer ${token}`, role: "admin" },
        });
        setForm({
          dateR: res.data.dateR || "",
          time: res.data.time || "",
          id: res.data.id || "",
          nom: res.data.nom || "",
          prenom: res.data.prenom || "",
          site: res.data.site || "",
          service: res.data.service || "",
        });
        setMessage("");
      } catch {
        setMessage("Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, [id, token]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!form.dateR || !form.time) {
      setMessage("Veuillez remplir les champs obligatoires (Date, Heure).");
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/delay-pec/${id}`, form, {
        headers: { Authorization: `Bearer ${token}`, role: "admin" },
      });

      setMessage("Modifié avec succès !");
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
        <h2 className={styles["form-title"]}>Modifier un retard</h2>

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
            <label>Heure d'arrivée</label>
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
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
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
            <label>Service</label>
            <input
              type="text"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            />
          </div>

          <button className={styles["submit-button"]} type="submit">
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}
