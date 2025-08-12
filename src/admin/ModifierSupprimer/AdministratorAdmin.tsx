import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Gestion.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function AdministrateurAdmin() {
  const [admins, setAdmins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchNom, setSearchNom] = useState("");
  const [searchPrenom, setSearchPrenom] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSite, setSearchSite] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const token = location.state?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  interface Admin {
    id: string;
    nom: string;
    prenom: string;
    site: string;
    dateR: string;
    time: string;
  }

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/follow-administrator",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              role: "admin",
            },
          }
        );
        setAdmins(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, [token]);

  useEffect(() => {
    let filteredList = [...admins];

    if (searchNom.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.nom.toLowerCase().includes(searchNom.toLowerCase())
      );
    }
    if (searchPrenom.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.prenom.toLowerCase().includes(searchPrenom.toLowerCase())
      );
    }
    if (searchId.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (searchSite.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.site.toLowerCase().includes(searchSite.toLowerCase())
      );
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredList = filteredList.filter((a: Admin) => {
        const dateTime = new Date(`${a.dateR}T${a.time}`);
        return dateTime >= start && dateTime <= end;
      });
    }

    setFiltered(filteredList);
  }, [
    searchNom,
    searchPrenom,
    searchId,
    searchSite,
    startDate,
    endDate,
    admins,
  ]);

  const handleEdit = (id: string) => {
    navigate(`/UpdateAdministrateur/${id}`, { state: { token } });
  };
  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/follow-administrator/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      })
      .then(() => {
        setAdmins((prevAdmin) =>
          prevAdmin.filter((admin: Admin) => admin.id !== id)
        );
        setFiltered((prevFiltered) =>
          prevFiltered.filter((admin: Admin) => admin.id !== id)
        );
      })
      .catch(() => {
        setMessage(
          "Erreur lors de la suppression de l'administrateur. Veuillez réessayer."
        );
      });
  };

  return (
    <div className={styles["Gestion-container"]}>
      <h2 className={styles["Gestion-title"]}>
        Liste des retards administrateurs
      </h2>
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
          placeholder="Prénom"
          value={searchPrenom}
          onChange={(e) => setSearchPrenom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Matricule"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Site"
          value={searchSite}
          onChange={(e) => setSearchSite(e.target.value)}
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className={styles["table-container"]}>
        <table className={styles["visitor-table"]}>
          <thead>
            <tr>
              <th>Date de retard</th>
              <th>Heure d'arrivée</th>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a: Admin, index) => (
              <tr key={index}>
                <td>{a.dateR}</td>
                <td>{a.time}</td>
                <td>{a.id}</td>
                <td>{a.nom}</td>
                <td>{a.prenom}</td>
                <td>{a.site}</td>
                <td>
                  <button
                    className={styles["delete-button"]}
                    onClick={() => handleDelete(a.id)}
                  >
                    Supprimer
                  </button>
                </td>
                <td>
                  <button
                    className={styles["edit-button"]}
                    onClick={() => handleEdit(a.id)}
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
