import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "/src/admin/change.module.css";
export default function Administrateur() {
  const location = useLocation();
  const token = location.state?.token;
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    id: "",
    nom: "",
    prenom: "",
    site: "",
  });

  const [message, setMessage] = useState("");

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/employees`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      });
      setMessage("Salarie ajouté avec succès!");
      setForm({
        id: "",
        nom: "",
        prenom: "",
        site: "",
      });
    } catch {
      setMessage("Erreur lors de l'ajout.");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleUpload = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Veuillez sélectionner un fichier CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(
        `http://localhost:3000/admin/upload-employees`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Fichier CSV téléchargé avec succès!");
    } catch {
      setMessage("Erreur lors du téléchargement du fichier CSV.");
    }
  };

  if (!token) {
    return <p>Token manquant. Veuillez vous reconnecter.</p>;
  }

  return (
    <div className={styles["form-container"]}>
      <Link
        to="/GestionSalaries"
        className={styles["back-link"]}
        state={{ token }}
      >
        Retour
      </Link>
      <div className={styles["form-box"]}>
        <h2 className={styles["form-title"]}>Ajouter un Salarie</h2>
        <div>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button className={styles["upload-button"]} onClick={handleUpload}>
            Télécharger un fichier CSV
          </button>
        </div>

        {message && <p className={styles["message"]}>{message}</p>}
        <form onSubmit={handleAdd}>
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
              <option value="" disabled>
                — Sélectionner un site —
              </option>
              <option value="Pec">Pec</option>
              <option value="Pec-ac">Pec-ac</option>
              <option value="Pec-plus">Pec-plus</option>
            </select>
          </div>

          <button className={styles["submit-button"]}>Submit</button>
        </form>
      </div>
    </div>
  );
}
