import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "/src/admin/Ajouter.module.css";

interface Employee {
  id: string;
  nom: string;
  prenom: string;
  site: string;
}

interface Retard {
  id: string;
  dateR: string;
  time: string;
  service: string;
  employee: Employee;
}

export default function UpdateDelay() {
  const { id } = useParams();
  const location = useLocation();
  const token = location.state?.token;

  const [form, setForm] = useState({
    dateR: "",
    time: "",
    employeeId: "",
    nom: "",
    prenom: "",
    site: "",
    service: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get<Retard>(
          `http://localhost:3000/delay-pec/${id}`,
          {
            headers: { Authorization: `Bearer ${token}`, role: "admin" },
          }
        );
        const retard = res.data;
        setForm({
          dateR: retard.dateR,
          time: retard.time,
          service: retard.service,
          employeeId: retard.employee.id,
          nom: retard.employee.nom,
          prenom: retard.employee.prenom,
          site: retard.employee.site,
        });
        setMessage("");
      } catch {
        setMessage("Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, [id, token]);

  useEffect(() => {
    if (!form.employeeId) {
      setForm((prev) => ({ ...prev, nom: "", prenom: "", site: "" }));
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await axios.get<Employee>(
          `http://localhost:3000/employees/${form.employeeId}`,
          { headers: { Authorization: `Bearer ${token}`, role: "admin" } }
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
  }, [form.employeeId, token]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!form.dateR || !form.time || !form.employeeId) {
      setMessage(
        "Veuillez remplir les champs obligatoires (Matricule, Date, Heure)."
      );
      return;
    }

    try {
      const payload = {
        dateR: form.dateR,
        time: form.time,
        employeeId: form.employeeId,
        service: form.service,
      };
      await axios.patch(`http://localhost:3000/delay-pec/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}`, role: "admin" },
      });

      setMessage("Modifié avec succès !");
    } catch {
      setMessage("Erreur, veuillez réessayer");
    }
  };

  if (!token) {
    return <p>Token manquant. Veuillez vous reconnecter.</p>;
  }

  return (
    <div className={styles["form-container"]}>
      <div className={styles["Line"]}>
        <Link
          to="/modifierSupprimerRetard"
          className={styles["back-link"]}
          state={{ token }}
        >
          Retour
        </Link>
      </div>
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
