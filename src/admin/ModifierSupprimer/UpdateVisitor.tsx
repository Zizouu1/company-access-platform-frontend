import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import styles from "./form.module.css";

export default function UpdateVisitor() {
  const location = useLocation();
  const token = location.state?.token;
  const { id } = useParams();

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
  useEffect(() => {
    if (!token || !id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/visitor-manager/${id}`,
          {
            headers: { Authorization: `Bearer ${token}`, role: "admin" },
          }
        );
        setForm({
          dateA: res.data.dateA || "",
          time: res.data.time || "",
          id: res.data.id || "",
          fullname: res.data.fullname || "",
          matriculeV: res.data.matriculeV || "",
          typeV: res.data.typeV || "",
          aQui: res.data.aQui || "",
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
    try {
      await axios.patch("http://localhost:3000/visitor-manager", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      });

      setMessage("Visiteur modifié avec succès!");
      setForm({
        dateA: "",
        time: "",
        id: "",
        fullname: "",
        matriculeV: "",
        typeV: "",
        aQui: "",
      });
    } catch (err) {
      const erreur = err as AxiosError;
      setMessage(
        (erreur.response?.data as { error: string })?.error ||
          "Erreur , veuillez réessayer"
      );
    }
  };

  if (!token) {
    return <p>Token manquant. Veuillez vous reconnecter.</p>;
  }

  return (
    <div className={styles["form-container"]}>
      <Link to="/modifierVisiteur" className={styles["back-link"]}>
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
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}
