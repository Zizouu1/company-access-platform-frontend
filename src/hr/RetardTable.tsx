import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Table.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function RetardTable() {
  const [retards, setRetards] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchNom, setSearchNom] = useState("");
  const [searchPrenom, setSearchPrenom] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSite, setSearchSite] = useState("");
  const [searchService, setSearchService] = useState("");
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

  interface Retard {
    id: string;
    nom: string;
    prenom: string;
    site: string;
    service: string;
    dateR: string;
    time: string;
  }

  useEffect(() => {
    const fetchRetards = async () => {
      try {
        const res = await axios.get("http://localhost:3000/delay-pec", {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "hr",
          },
        });
        setRetards(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching retards:", error);
      }
    };

    fetchRetards();
  }, [token]);

  useEffect(() => {
    let filteredList = [...retards];

    if (searchNom.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.nom.toLowerCase().includes(searchNom.toLowerCase())
      );
    }
    if (searchPrenom.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.prenom.toLowerCase().includes(searchPrenom.toLowerCase())
      );
    }
    if (searchId.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (searchSite.trim() !== "") {
      filteredList = filteredList.filter((r: Retard) =>
        r.site.toLowerCase().includes(searchSite.toLowerCase())
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

  const handleExport = () => {
    if (filtered.length === 0) return;

    const csvData = filtered.map((r: Retard) => ({
      "Date de retard": r.dateR,
      "Heure d'arrivée": r.time,
      "Numéro carte d'identité": r.id,
      Nom: r.nom,
      Prénom: r.prenom,
      Site: r.site,
      Service: r.service,
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
    link.setAttribute("download", "retards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles["hr-container"]}>
      <h2 className={styles["hr-title"]}>Liste des retards PEC</h2>
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
          placeholder="Numéro carte d'identité"
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
          type="date"
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
              <th>Numéro carte d'identité</th>
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
                <td>{r.id}</td>
                <td>{r.nom}</td>
                <td>{r.prenom}</td>
                <td>{r.site}</td>
                <td>{r.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
