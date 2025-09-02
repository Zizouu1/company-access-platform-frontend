import { useEffect, useState } from "react";
import axios from "axios";
import styles from "/src/admin/Gestion.module.css";
import { useNavigate } from "react-router-dom";

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

  const authData = localStorage.getItem("auth");
  const token = authData ? JSON.parse(authData).token : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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
      } catch {
        setMessage("Erreur lors de la récupération des administrateurs.");
      }
    };

    fetchAdmins();
  }, [token]);

  useEffect(() => {
    let filteredList = [...admins];

    if (searchNom.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.employee?.nom.toLowerCase().includes(searchNom.toLowerCase())
      );
    }
    if (searchPrenom.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.employee?.prenom.toLowerCase().includes(searchPrenom.toLowerCase())
      );
    }
    if (searchId.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.employee?.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (searchSite.trim() !== "") {
      filteredList = filteredList.filter((a: Admin) =>
        a.employee?.site.toLowerCase().includes(searchSite.toLowerCase())
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

  const handleEdit = (adminId: string) => {
    navigate(`/UpdateAdministrateur/${adminId}`, { state: { token } });
  };
  const handleDelete = (adminId: string) => {
    axios
      .delete(`http://localhost:3000/follow-administrator/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      })
      .then(() => {
        setAdmins((prevAdmin) =>
          prevAdmin.filter((admin: Admin) => admin.id !== adminId)
        );
        setFiltered((prevFiltered) =>
          prevFiltered.filter((admin: Admin) => admin.id !== adminId)
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
      <h2 className={styles["Gestion-title"]}>Retard Administrateurs</h2>

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
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className={styles["table-container"]}>
        <table className={styles["Gestion-table"]}>
          <thead>
            <tr>
              <th>Date de retard</th>
              <th>Heure d'arrivée</th>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Site</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a: Admin, index) => (
              <tr key={index}>
                <td>{a.dateR}</td>
                <td>{a.time}</td>
                <td>{a.employee?.id}</td>
                <td>{a.employee?.nom}</td>
                <td>{a.employee?.prenom}</td>
                <td>{a.employee?.site}</td>
                <td className={styles["actions"]}>
                  <div className={styles["action-buttons"]}>
                    <img
                      className={styles["delete-button"]}
                      onClick={() => handleDelete(a.id)}
                      src="src/assets/delete.png"
                      alt="delete.img"
                    />
                    <img
                      className={styles["edit-button"]}
                      onClick={() => handleEdit(a.id)}
                      src="src/assets/edit.png"
                      alt="edit.img"
                    />
                  </div>
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
