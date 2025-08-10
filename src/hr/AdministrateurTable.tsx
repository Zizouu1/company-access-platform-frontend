import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Table.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function AdministrateurTable() {
  const [admins, setAdmins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchNom, setSearchNom] = useState("");
  const [searchPrenom, setSearchPrenom] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSite, setSearchSite] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
              role: "hr",
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

  const handleExport = () => {
    if (filtered.length === 0) return;

    const csvData = filtered.map((a: Admin) => ({
      "Date de retard": a.dateR,
      "Heure d'arrivée": a.time,
      Matricule: a.id,
      Nom: a.nom,
      Prénom: a.prenom,
      Site: a.site,
    }));

    const csvContent =
      "\uFEFF" +
      [
        Object.keys(csvData[0]).join(","),
        ...csvData.map((row) => Object.values(row).join(",")),
      ].join("\n");

    const encodedUri =
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "administrateurs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles["hr-container"]}>
      <h2 className={styles["hr-title"]}>Liste des retards administrateurs</h2>
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

      <button className={styles["export-button"]} onClick={handleExport}>
        Exporter en CSV
      </button>

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
