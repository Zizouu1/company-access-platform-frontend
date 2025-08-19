import { useEffect, useState } from "react";
import axios from "axios";
import styles from "/src/admin/change.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

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

export default function DelayAdmin() {
  const [retards, setRetards] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchNom, setSearchNom] = useState("");
  const [searchPrenom, setSearchPrenom] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSite, setSearchSite] = useState("");
  const [searchService, setSearchService] = useState("");
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

  useEffect(() => {
    const fetchRetards = async () => {
      try {
        const res = await axios.get("http://localhost:3000/delay-pec", {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "admin",
          },
        });
        setRetards(res.data);
        setFiltered(res.data);
      } catch {
        setMessage("Erreur lors de la récupération des retards.");
      }
    };

    fetchRetards();
  }, [token]);

  useEffect(() => {
    let filteredList = [...retards];

    if (searchNom.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.employee?.nom.toLowerCase().includes(searchNom.toLowerCase())
      );
    }
    if (searchPrenom.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.employee?.prenom.toLowerCase().includes(searchPrenom.toLowerCase())
      );
    }
    if (searchId.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.employee?.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (searchSite.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.employee?.site.toLowerCase().includes(searchSite.toLowerCase())
      );
    }
    if (searchService.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.service.toLowerCase().includes(searchService.toLowerCase())
      );
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredList = filteredList.filter((r: Retard) => {
        const dateTime = new Date(`${r.dateR}T${r.time}`);
        return dateTime >= start && dateTime <= end;
      });
    }

    setFiltered(filteredList);
  }, [
    searchNom,
    searchPrenom,
    searchId,
    searchSite,
    searchService,
    startDate,
    endDate,
    retards,
  ]);

  const handleEdit = (RId: string) => {
    navigate(`/UpdateDelay/${RId}`, { state: { token } });
  };
  const handleDelete = (RId: string) => {
    axios
      .delete(`http://localhost:3000/delay-pec/${RId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      })
      .then(() => {
        setRetards((prevReards) =>
          prevReards.filter((retard: Retard) => retard.employee?.id !== RId)
        );
        setFiltered((prevFiltered) =>
          prevFiltered.filter((retard: Retard) => retard.employee?.id !== RId)
        );
      })
      .catch(() => {
        setMessage(
          "Erreur lors de la suppression de l'employee. Veuillez réessayer."
        );
      });
  };

  return (
    <div className={styles["admin-container"]}>
      <h2 className={styles["admin-title"]}>Liste des retards PEC</h2>
      <Link
        to="/ModifierSupprimer"
        className={styles["back-link"]}
        state={{ token }}
      >
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
          type="text"
          placeholder="Service"
          value={searchService}
          onChange={(e) => setSearchService(e.target.value)}
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
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
              <th>Service</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: Retard, index) => (
              <tr key={index}>
                <td>{r.dateR}</td>
                <td>{r.time}</td>
                <td>{r.employee?.id}</td>
                <td>{r.employee?.nom}</td>
                <td>{r.employee?.prenom}</td>
                <td>{r.employee?.site}</td>
                <td>{r.service}</td>
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
