import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import styles from "/src/admin/Ajouter.module.css";
export default function Administrateur() {
  const location = useLocation();
  const token = location.state?.token;
  const { id: employeeId } = useParams();

  const [form, setForm] = useState({
    id: "",
    nom: "",
    prenom: "",
    site: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const getV = async () => {
      if (!employeeId) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/employees/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              role: "admin",
            },
          }
        );
        const foundemployee = res.data;
        setForm({
          id: foundemployee.id,
          nom: foundemployee.nom,
          prenom: foundemployee.prenom,
          site: foundemployee.site,
        });
      } catch {
        setMessage(
          "Erreur lors de la récupération de le salarie. Veuillez réessayer."
        );
      }
    };
    getV();
  }, [employeeId, token]);
  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/employees/${employeeId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      });
      setMessage("Salarie modifié avec succès!");
    } catch {
      setMessage("Employé introuvable");
    }
  };

  if (!token) {
    return <p>Token manquant. Veuillez vous reconnecter.</p>;
  }

  return (
    <div className={styles["form-container"]}>
      <div className={styles["Line"]}>
        <Link
          to="/GestionSalaries"
          className={styles["back-link"]}
          state={{ token }}
        >
          Retour
        </Link>
      </div>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Modifier un Salarie</h2>

        {message && <p className={styles["message"]}>{message}</p>}
        <form onSubmit={handleUpdate}>
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
            <label>nom</label>
            <input
              type="text"
              placeholder="nom..."
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>prenom</label>
            <input
              type="text"
              placeholder="prenom..."
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />
          </div>
          <div className={styles["input-group"]}>
            <label>site</label>
            <select
              value={form.site}
              onChange={(e) => setForm({ ...form, site: e.target.value })}
            >
              <option value="Pec">Pec</option>
              <option value="Pec-ac">Pec-ac</option>
              <option value="Pec-plus">Pec-plus</option>
            </select>
          </div>

          <button className={styles["submit-button"]}>Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}
