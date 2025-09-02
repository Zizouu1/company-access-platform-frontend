import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "/src/admin/Ajouter.module.css";

interface Employee {
  id: string;
  nom: string;
  prenom: string;
  site: string;
}

interface Admin {
  id: string;
  dateR: string;
  time: string;
  employee: Employee;
}

export default function UpdateAdministrateur() {
  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;
  const { id } = useParams();

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
    if (!id) return;
    const fetchRecord = async () => {
      try {
        const res = await axios.get<Admin>(
          `http://localhost:3000/follow-administrator/${id}`,
          { headers: { Authorization: `Bearer ${token}`, role: "admin" } }
        );
        const admin = res.data;
        setForm({
          dateR: admin.dateR,
          time: admin.time,
          employeeId: admin.employee.id,
          nom: admin.employee.nom,
          prenom: admin.employee.prenom,
          site: admin.employee.site,
        });
      } catch {
        setMessage("Enregistrement introuvable");
      }
    };
    fetchRecord();
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

    if (!form.employeeId || !form.dateR || !form.time) {
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
      };
      await axios.patch(
        `http://localhost:3000/follow-administrator/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, role: "admin" } }
      );

      setMessage("Modifié avec succès !");
    } catch {
      setMessage("Erreur, veuillez réessayer");
    }
  };

  if (!token) return <p>Token manquant. Veuillez vous reconnecter.</p>;

  return (
    <div className={styles["form-container"]}>
      <div className={styles["Line"]}>
        <Link
          to="/modifierSupprimerAdministrateur"
          className={styles["back-link"]}
          state={{ token }}
        >
          Retour
        </Link>
      </div>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Corriger Retard</h2>

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

          <button className={styles["submit-button"]}>Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}
