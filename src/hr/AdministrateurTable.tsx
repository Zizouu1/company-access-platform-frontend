import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Table.module.css";
import { useNavigate } from "react-router-dom";

export default function AdministrateurTable() {
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

  interface Admin {
    dateR: string;
    time: string;
    employee: {
      id: string;
      nom: string;
      prenom: string;
      site: string;
    };
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

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleExport = () => {
    if (filtered.length === 0) return;

    const csvData = filtered.map((a: Admin) => ({
      "Date de retard": `'${formatDate(a.dateR)}`,
      "Heure d'arrivée": `${a.time}`,
      Matricule: `${a.employee?.id}`,
      Nom: `${a.employee?.nom}`,
      Prénom: `${a.employee?.prenom}`,
      Site: `${a.employee?.site}`,
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
      <h2 className={styles["hr-title"]}>Retard Administrateurs</h2>

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

      <button className={styles["export-button"]} onClick={handleExport}>
        Exporter
      </button>
      {message && <p className={styles["message"]}>{message}</p>}

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
                <td>{a.employee?.id}</td>
                <td>{a.employee?.nom}</td>
                <td>{a.employee?.prenom}</td>
                <td>{a.employee?.site}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
