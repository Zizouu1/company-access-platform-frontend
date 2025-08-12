import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import styles from "./form.module.css";

export default function UpdateAdministrateur() {
  const location = useLocation();
  const token = location.state?.token;
  const { id } = useParams();

  const [form, setForm] = useState({
    dateR: "",
    time: "",
    id: "",
    nom: "",
    prenom: "",
    site: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchRecord = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/follow-administrator/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const record = res.data;
        setForm({
          dateR: record.dateR,
          time: record.time,
          id: record.id,
          nom: record.nom,
          prenom: record.prenom,
          site: record.site,
        });
      } catch {
        setMessage("Enregistrement introuvable");
      }
    };
    fetchRecord();
  }, [id, token]);

  useEffect(() => {
    if (!form.id) {
      setForm((prev) => ({ ...prev, nom: "", prenom: "", site: "" }));
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/employees/${form.id}`,
          {
            headers: { Authorization: `Bearer ${token}`, role: "admin" },
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
      };
      await axios.patch(
        `http://localhost:3000/follow-administrator/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}`, role: "admin" },
        }
      );

      setMessage("Mise à jour réussie !");
    } catch (err) {
      const erreur = err as AxiosError;
      setMessage(
        (erreur.response?.data as { error: string })?.error ||
          "Erreur , veuillez réessayer"
      );
    }
  };

  if (!token) {
    return <p>Token manquant. Veuillez vous reconnecter.</p>;
  }

  return (
    <div className={styles["form-container"]}>
      <Link to="/modifierAdministrateur" className={styles["back-link"]}>
        Retour
      </Link>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>
          Mettre à jour un retard d'administrateur
        </h2>

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

          <button className={styles["submit-button"]}>Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}
