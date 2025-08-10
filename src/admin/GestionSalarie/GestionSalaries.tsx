import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Gestion.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function GestionSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchNom, setSearchNom] = useState("");
  const [searchPrenom, setSearchPrenom] = useState("");
  const [searchSite, setSearchSite] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const token = location.state?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  interface Salarie {
    id: string;
    nom: string;
    prenom: string;
    site: string;
  }

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await axios.get("http://localhost:3000/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "admin",
          },
        });
        setSalaries(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchSalaries();
  }, [token]);

  useEffect(() => {
    let filteredList = [...salaries];

    if (searchNom.trim() !== "") {
      filteredList = filteredList.filter((a: Salarie) =>
        a.nom.toLowerCase().includes(searchNom.toLowerCase())
      );
    }
    if (searchPrenom.trim() !== "") {
      filteredList = filteredList.filter((a: Salarie) =>
        a.prenom.toLowerCase().includes(searchPrenom.toLowerCase())
      );
    }
    if (searchId.trim() !== "") {
      filteredList = filteredList.filter((a: Salarie) =>
        a.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (searchSite.trim() !== "") {
      filteredList = filteredList.filter((a: Salarie) =>
        a.site.toLowerCase().includes(searchSite.toLowerCase())
      );
    }

    setFiltered(filteredList);
  }, [searchNom, searchId, salaries, searchPrenom, searchSite]);
  const handleAddUser = () => {
    navigate("/AjouterSalaries", { state: { token } });
  };
  const handleEdit = (id: string) => {
    navigate(`/ModifierSalarie/${id}`, { state: { token } });
  };
  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      })
      .then(() => {
        setSalaries((prevSalaries) =>
          prevSalaries.filter((salarie: Salarie) => salarie.id !== id)
        );
        setFiltered((prevFiltered) =>
          prevFiltered.filter((salarie: Salarie) => salarie.id !== id)
        );
      })
      .catch(() => {
        setMessage(
          "Erreur lors de la suppression de le salarie. Veuillez réessayer."
        );
      });
  };

  return (
    <div className={styles["Gestion-container"]}>
      <h2 className={styles["Gestion-title"]}>Gestion des utilisateurs</h2>
      <Link to="/hr" className={styles["back-link"]}>
        Retour
      </Link>

      <div className={styles["filters"]}>
        <input
          type="text"
          placeholder="Nom"
          value={searchNom}
          onChange={(e) => setSearchNom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Matricule"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prénom"
          value={searchPrenom}
          onChange={(e) => setSearchPrenom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Site"
          value={searchSite}
          onChange={(e) => setSearchSite(e.target.value)}
        />
      </div>

      <button className={styles["add-button"]} onClick={handleAddUser}>
        Ajouter un utilisateur
      </button>

      <div className={styles["table-container"]}>
        <table className={styles["Gestion-table"]}>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: Salarie, index) => (
              <tr key={index}>
                <td>{r.id}</td>
                <td>{r.nom}</td>
                <td>{r.prenom}</td>
                <td>{r.site}</td>
                <td>
                  <button
                    className={styles["delete-button"]}
                    onClick={() => handleDelete(r.id)}
                  >
                    Supprimer
                  </button>
                </td>
                <td>
                  <button
                    className={styles["edit-button"]}
                    onClick={() => handleEdit(r.id)}
                  >
                    Modifier
                  </button>
                </td>
                <td>
                  {message && <p className={styles["message"]}>{message}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
